import { FC } from 'react';

import {
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
} from '@chakra-ui/react';
import { useForm, SubmitHandler } from 'react-hook-form';

type Inputs = {
  patientName: string;
  desciption: string;
};

const AppointmentForm: FC<{
  isOpen: boolean;
  onClose: () => void;
  handleBookAppointment: (props: Inputs) => void;
}> = ({ isOpen, onClose, handleBookAppointment }: any) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    handleBookAppointment(data);
    reset();
  };

  const handleClose = () => {
    onClose();
    reset();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size='xl' isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Booking</ModalHeader>
        <ModalCloseButton />

        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody>
            <FormControl>
              <FormLabel>Patient name</FormLabel>
              <Input
                type='text'
                {...register('patientName', {
                  required: {
                    value: true,
                    message: 'This field is required',
                  },
                  minLength: {
                    value: 3,
                    message: 'The name must be at least 3 characters long',
                  },
                })}
              />
              {errors.patientName && <span>{errors.patientName.message}</span>}
            </FormControl>
            <FormControl mt={6}>
              <FormLabel>Description</FormLabel>
              <Textarea
                {...register('desciption', {
                  required: {
                    value: true,
                    message: 'This field is required',
                  },
                  minLength: {
                    value: 10,
                    message:
                      'The description must be at least 10 characters long',
                  },
                })}
              />
              {errors.desciption && <span>{errors.desciption.message}</span>}
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Input type='submit' mt={6} bg='#00a699' />
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default AppointmentForm;
