import { FC } from 'react';

import {
  Box,
  Button,
  Heading,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from '@chakra-ui/react';

import { Doctor } from '@/generated/core.graphql';

const DoctorSelector: FC<{
  doctors: Doctor[];
  value?: Doctor;
  onChange: (doc: Doctor | undefined) => void;
}> = ({ doctors, value, onChange }) => {
  return (
    <Box mt={5} ml={2}>
      <Box mb={5}>
        <Heading size='md'>
          {value ? <>Selected: {value.name} </> : <>Select a doctor</>}
        </Heading>
      </Box>
      <Menu>
        <MenuButton as={Button} backgroundColor='#00a699' color='#fff'>
          Doctors
        </MenuButton>
        <MenuList>
          {!doctors || doctors.length === 0 ? (
            <MenuItem>No doctors</MenuItem>
          ) : (
            doctors.map((doc) => (
              <MenuItem key={doc.id} onClick={() => onChange(doc)}>
                {doc.name}
              </MenuItem>
            ))
          )}
        </MenuList>
      </Menu>
    </Box>
  );
};

export default DoctorSelector;
