import {
  Box,
  Flex,
  Text,
  Stack,
  Link,
  useColorModeValue,
  useBreakpointValue,
  Heading,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';

interface NavItem {
  label: string;
  href: string;
}

type Props = {
  heading: string;
  items: NavItem[];
};

const Navigation = (props: Props) => {
  return (
    <Box>
      <Flex
        bg={useColorModeValue('white', 'gray.800')}
        color={useColorModeValue('gray.600', 'white')}
        minH={'60px'}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={'solid'}
        borderColor={useColorModeValue('gray.200', 'gray.900')}
        align={'center'}
      >
        <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>
          <Heading size='lg'>
            <Text
              textAlign={useBreakpointValue({ base: 'center', md: 'left' })}
              fontFamily={'heading'}
              color={useColorModeValue('gray.800', 'white')}
              _hover={{
                textDecoration: 'none',
              }}
            >
              <NextLink href='/'>{props.heading}</NextLink>
            </Text>
          </Heading>
        </Flex>
        <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>
          <DesktopNav items={props.items} />
        </Flex>
      </Flex>
    </Box>
  );
};

type DesktopNavProps = {
  items: NavItem[];
};

const DesktopNav = (props: DesktopNavProps) => {
  const linkColor = useColorModeValue('gray.600', 'gray.200');
  const linkHoverColor = useColorModeValue('gray.800', 'white');

  const router = useRouter();

  const isActive = (navItem: NavItem) =>
    router.pathname === `/${navItem.label.toLowerCase()}`;

  return (
    <Stack direction={'row'} spacing={4}>
      {props.items.map((navItem) => (
        <Box key={navItem.label}>
          <Text
            p={2}
            fontSize={'sm'}
            fontWeight={500}
            color={isActive(navItem) ? '#fff' : linkColor}
            _hover={{
              textDecoration: 'none',
              color: '#fff',
              bg: '#00a699',
            }}
            rounded={'md'}
            bg={isActive(navItem) ? '#00a699' : ''}
          >
            <NextLink href={navItem.href}>{navItem.label}</NextLink>
          </Text>
        </Box>
      ))}
    </Stack>
  );
};

export default Navigation;
