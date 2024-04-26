import {
    Box,
    Flex,
    IconButton,
    Button,
    Stack,
    Collapse,
    Image,
    useColorModeValue,
    useDisclosure,
} from '@chakra-ui/react';
import {Link} from 'react-router-dom';
import {Icon} from "@iconify/react"; 
import DesktopNav from './DesktopNav';
import MobileNav from './MobileNav';
import AuthModal from './AuthModal';
import {useAuthHelper} from '@/utils/auth';
import useToastHelper from '@/utils/toast';



interface NavItem {
  label: string;
  subLabel?: string;
  children?: Array<NavItem>;
  href?: string;
}

const NAV_ITEMS: Array<NavItem> = [
  {
    label: 'Dashboard',
    href: '/',
  },
  {
    label: 'Transactions',
    children: [
      {
        label: 'Records',
        subLabel: 'All transaction mutation',
        href: '/transaction/records',
      },
      {
        label: 'New Transaction',
        subLabel: 'Create new transaction',
        href: '/transaction',
      }
    ]
  },
  {
    label: 'Manage Master Data',
    children: [
      {
        label: 'Your Wallets',
        subLabel: 'Setup your money-place wallets',
        href: 'wallet',
      },
      {
        label: 'Manage Labels',
        subLabel: 'For custom labeling per transaction',
        href: 'label',
      },
    ],
  },
];

export default function WithSubnavigation() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen:isAuthModalOpen, onOpen:onAuthModalOpen, onClose:onAuthModalClose } = useDisclosure()
  const {isLoggedIn, doLogout} = useAuthHelper();
  const toast = useToastHelper();

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
        className="shadow"
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Flex
          ml={{ base: -2 }}
          display={{ base: 'flex', md: 'none' }}>
          {isLoggedIn && (
          <IconButton
            onClick={isOpen ? onClose : onOpen}
            icon={
              isOpen ? <Icon icon="vaadin:close-small" /> : <Icon icon="typcn:th-menu" />
            }
            variant={'ghost'}
            aria-label={'Toggle Navigation'}
          />
          )}
        </Flex>
        <Flex as={Link} to="/" flex={{ base: 1 }} justify="start">
          <Image src="./logo.png" className="w-8 h-8 mx-3" />
          <h1 className="font-bold text-xl mx-3 hidden md:block">Profit Note</h1>

          {isLoggedIn && (
            <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
              <DesktopNav navItems={NAV_ITEMS} />
            </Flex>
          )}
        </Flex>

        <Stack
          flex={{ base: 1, md: 0 }}
          justify={'flex-end'}
          direction={'row'}
          spacing={6}>
          {isLoggedIn ? (
            <Button
              fontSize={'sm'}
              fontWeight={600}
              color={'red.400'}
              bg={'transparent'}
              _hover={{
                color: 'red.300',
              }}
              onClick={() => {
                doLogout();
                toast.successToast("You have been logged out");
              }}
              >
              <span className="inline">Sign Out</span>
            </Button>
          ) : (
            <>
            <Button
              fontSize={'sm'}
              fontWeight={600}
              color={'white'}
              bg={'blue.400'}
              size="sm"
              onClick={onAuthModalOpen}
              _hover={{
                bg: 'blue.300',
              }}>
              <span className="inline">Sign In</span>
            </Button>
            <AuthModal  isOpen={isAuthModalOpen} onClose={onAuthModalClose} />
            </>
            )}
          </Stack>

      </Flex>
      {isLoggedIn && (
      <Collapse in={isOpen} animateOpacity>
        <MobileNav navItems={NAV_ITEMS} onClose={onClose} />
      </Collapse>
      )}
    </Box>
  );
}
  