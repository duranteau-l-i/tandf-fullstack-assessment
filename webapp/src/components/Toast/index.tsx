import { useToast } from '@chakra-ui/react';

const Toast = () => {
  const toast = useToast();
  return toast({
    title: 'Account created.',
    description: "We've created your account for you.",
    status: 'success',
    duration: 9000,
    isClosable: true,
  });
};

export default Toast;
