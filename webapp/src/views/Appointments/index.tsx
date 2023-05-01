import { useEffect, useState } from 'react';

import { Box, Text } from '@chakra-ui/react';
import { addDays } from 'date-fns';

import BookAppointment from './hooks/BookAppointment';

import AppointmentForm from '@/components/AppointmentForm';
import DoctorSelector from '@/components/DoctorSelector';
import SlotSelector from '@/components/SlotSelector';
import { Doctor, Slot, useDoctorsQuery } from '@/generated/core.graphql';
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

  const [open, setOpen] = useState(false);
  const onClose = () => setOpen(false);

  const handleSelectSlot = (slot: SlotWithKey | undefined) => {
    setSelectedSlot(slot);
    if (slot) setOpen(true);
  };

  const { slotData, handleBookAppointment } = BookAppointment({
    startDate,
    selectedSlot,
    setSelectedSlot,
    open,
    onClose,
  });

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
    <Box mt={2} ml={3}>
      {error && (
        <Box>
          <Text>{error}</Text>
        </Box>
      )}
      <Box mt={2}>
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
          <Box mt={5} ml={2}>
            {selectedDoctor && <Text>No slots available</Text>}
          </Box>
        )}

        <AppointmentForm
          isOpen={open}
          onClose={onClose}
          handleBookAppointment={handleBookAppointment}
        />
      </Box>
    </Box>
  );
};

export default Appointments;
