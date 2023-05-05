import { Dispatch, SetStateAction } from 'react';

import { useToast } from '@chakra-ui/react';
import { addDays } from 'date-fns';

import {
  Slot,
  useBookAppointmentMutation,
  useSlotsQuery,
} from '@/generated/core.graphql';
import { SlotWithKey } from '@/types/domain';

type Props = {
  startDate: Date;
  selectedSlot: Slot | undefined;
  setSelectedSlot: Dispatch<SetStateAction<SlotWithKey | undefined>>;
  open: boolean;
  onClose: () => void;
};

const BookAppointment = ({
  startDate,
  selectedSlot,
  setSelectedSlot,
  open,
  onClose,
}: Props) => {
  const toast = useToast();

  const { data: slotData, refetch } = useSlotsQuery({
    variables: {
      from: startDate,
      to: addDays(startDate, 30),
    },
  });
  const [bookAppointment, { loading: bookLoading }] =
    useBookAppointmentMutation();

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

      setSelectedSlot(undefined);
      await refetch();
      if (open) onClose();
    }
  };

  return { slotData, handleBookAppointment };
};

export default BookAppointment;
