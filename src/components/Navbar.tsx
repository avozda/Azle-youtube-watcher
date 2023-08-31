import { useContext, useEffect, useState } from 'react';
import {
  Box,
  Flex,
  Avatar,
  HStack,
  Text,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  Spinner,
  Tag,
  Tooltip
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon, CheckIcon } from '@chakra-ui/icons';
import UserContext from '../context/user/userContext';
import { Link as RouterLink } from 'react-router-dom';
import { CopyIcon, StarIcon } from '@chakra-ui/icons';
import SendTokensModal from './SendTokensModal';
interface Props {
  children: React.ReactNode;
}

const Links = ['Proposals'];

const NavLink = (props: Props) => {
  const { children } = props;
  return (

    <Box
      as="a"
      px={2}
      py={1}
      rounded={'md'}
      _hover={{
        textDecoration: 'none',
        bg: useColorModeValue('gray.200', 'gray.700'),
      }}
      href={'#'}
    >
      {children}
    </Box>
  );
};

export default function Navbar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const userContext = useContext(UserContext);
  const { login, logout, principal, isAuthenticated, user, loading, balance, loadBalance } = userContext;
  const [isCopied, setCopied] = useState(false);

  return (
    <>
      <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <IconButton
            size={'md'}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={'Open Menu'}
            display={{ md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={'center'}>
            <RouterLink to={"/"}><Box>Azle Youtube Watcher DAO</Box></RouterLink>
            <HStack
              as={'nav'}
              spacing={4}
              display={{ base: 'none', md: 'flex' }}
            >
              {Links.map((link) => (
                <RouterLink key={link} to={"/" + link.toLocaleLowerCase()}><NavLink >{link}</NavLink></RouterLink>
              ))}
            </HStack>
          </HStack>

          {loading ? <Spinner /> :

            <Flex alignItems={'center'}>
              {!isAuthenticated &&
                <Button
                  variant={'solid'}
                  colorScheme={'teal'}
                  size={'sm'}
                  mr={4}
                  onClick={login}
                >
                  Login
                </Button>
              }
              {!loading && user && <Menu>
                <SendTokensModal />

                <Box p='1' mr={2}>
                  <Tooltip closeOnClick={false} label={'Click to refresh balance'}>
                    <Button onMouseLeave={() => setCopied(false)} onClick={() => { loadBalance() }}>
                      <StarIcon mr={1} />
                      ABCT: {balance}
                    </Button>
                  </Tooltip>
                </Box>

                {
                  principal && (
                    <Box p='1' mr={2}>
                      <Tooltip closeOnClick={false} label={isCopied ? <><CheckIcon mr={1} /> Copied</> : principal}>
                        <Button onMouseLeave={() => setCopied(false)} onClick={() => { navigator.clipboard.writeText(principal); setCopied(true) }}>
                          <CopyIcon mr={1} />
                          Principal ID
                        </Button>
                      </Tooltip>
                    </Box>
                  )
                }
                <MenuButton
                  as={Button}
                  rounded={'full'}
                  variant={'link'}
                  cursor={'pointer'}
                  minW={0}
                >
                  <Avatar
                    size={'sm'}
                    src={
                      user.nftURL
                    }
                  />
                </MenuButton>
                <MenuList>
                  <RouterLink to={"profile"}><MenuItem>Profile</MenuItem></RouterLink>
                  <MenuDivider />
                  <MenuItem onClick={logout}>Logout</MenuItem>
                </MenuList>
              </Menu>
              }
            </Flex>
          }

        </Flex>
        {isOpen ? (
          <Box pb={4} display={{ md: 'none' }}>
            <Stack as={'nav'} spacing={4}>
              {Links.map((link) => (
                <NavLink key={link}>{link}</NavLink>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  );
}
