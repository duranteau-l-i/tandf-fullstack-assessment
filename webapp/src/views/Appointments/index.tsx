import { useEffect, useState } from 'react';

import { gql, useQuery } from '@apollo/client';
import { Heading, Box, Text, useToast } from '@chakra-ui/react';
import { addMinutes, addDays } from 'date-fns';

import AppointmentForm from '@/components/AppointmentForm';
import DoctorSelector from '@/components/DoctorSelector';
import SlotSelector from '@/components/SlotSelector';
import Toast from '@/components/Toast';
import {
  Doctor,
  Slot,
  useBookAppointmentMutation,
  useDoctorsQuery,
  useSlotsQuery,
} from '@/generated/core.graphql';
import { SlotWithKey } from '@/types/domain';

const startDate = new Date();
const generateSlots = (slots: Slot[], doctor: Doctor): SlotWithKey[] => {
  return slots
    .map((slot) => ({
      ...slot,
      key: `${slot.start.toString()}-${slot.doctorId}`,
      start: new Date(slot.start),
      end: new Date(slot.end),
    }))
    .filter((el) => el.doctorId === doctor.id);
};

const Appointments = () => {
  const { data, loading } = useDoctorsQuery();
  const [error, setError] = useState<string>();
  const [slots, setSlots] = useState<SlotWithKey[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor>();
  const [isLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<SlotWithKey>();
  const minimumStartDate = slots?.[0]?.start;
  const maximumStartDate = minimumStartDate && addDays(minimumStartDate, 30);

  const toast = useToast();
  const [open, setOpen] = useState(false);
  const onClose = () => setOpen(false);

  const { data: slotData, refetch } = useSlotsQuery({
    variables: {
      from: startDate,
      to: addDays(startDate, 30),
    },
  });
  const [bookAppointment, { loading: bookLoading }] =
    useBookAppointmentMutation();

  const handleSelectSlot = (slot: SlotWithKey | undefined) => {
    setSelectedSlot(slot);
    if (slot) setOpen(true);
  };

  const handleBookAppointment = async (props: {
    patientName: string;
    desciption: string;
  }) => {
    if (selectedSlot) {
      const slot = {
        start: selectedSlot.start,
        end: selectedSlot.end,
        doctorId: selectedSlot.doctorId,
      };

      toast({
        title: 'Booking created.',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });

      await bookAppointment({
        variables: {
          bookAppointment: {
            patientName: props.patientName,
            description: props.desciption,
            slot,
          },
        },
      });

      await refetch();
      if (open) onClose();
    }
  };

  useEffect(() => {
    if (selectedDoctor) {
      if (slotData) {
        const slots = generateSlots(slotData.slots, selectedDoctor);
        setSlots(slots);
      }
    } else {
      setSlots([]);
    }
  }, [selectedDoctor, slotData]);

  return (
    <Box>
      <Heading>Appointments</Heading>
      {error && (
        <Box>
          <Text>{error}</Text>
        </Box>
      )}
      <DoctorSelector
        doctors={data?.doctors as Doctor[]}
        value={selectedDoctor}
        onChange={setSelectedDoctor}
      />
      {slots?.length > 0 ? (
        <SlotSelector
          minimumStartDate={minimumStartDate}
          maximumStartDate={maximumStartDate}
          availableSlots={slots}
          value={selectedSlot}
          onChange={handleSelectSlot}
          loadingSlots={isLoading}
        />
      ) : (
        <>{selectedDoctor && <Text>No slots available</Text>}</>
      )}

      <AppointmentForm
        isOpen={open}
        onClose={onClose}
        handleBookAppointment={handleBookAppointment}
      />
    </Box>
  );
};

export default Appointments;
