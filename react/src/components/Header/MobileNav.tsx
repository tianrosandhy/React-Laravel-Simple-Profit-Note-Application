import {
    Stack,
    Text,
    Link,
    Icon,
    Collapse,
    Flex,
    useColorModeValue,
    useDisclosure,
} from '@chakra-ui/react';
import {Link as RLink} from 'react-router-dom';
import { ChevronDownIcon } from '@chakra-ui/icons';
  
interface NavItem {
    label: string;
    children?: Array<NavItem>;
    href?: string;
}

type MobileNavProps = {
    navItems: NavItem[];
    onClose: () => void;
}

  const MobileNav:React.FC<MobileNavProps> = ({navItems, onClose}) => {
    return (
      <Stack
        bg={useColorModeValue('white', 'gray.800')}
        p={4}
        display={{ md: 'none' }}>
        {navItems.map((navItem) => (
          <MobileNavItem key={navItem.label} label={navItem.label} children={navItem.children} href={navItem.href} onClose={onClose} />
        ))}
      </Stack>
    );
  };

  type MobileNavItemProps = {
    label: string;
    children?: Array<NavItem>;
    href?: string;
    onClose: () => void;
  }
  
  const MobileNavItem = ({ label, children, href, onClose }: MobileNavItemProps) => {
    const { isOpen, onToggle } = useDisclosure();
  
    return (
      <Stack spacing={4} onClick={children && onToggle}>
        <Flex
          py={2}
          as={RLink}
          to={href ?? '#'}
          justify={'space-between'}
          align={'center'}
          onClick={
            () => {typeof href != "undefined" && onClose()}
          }
          _hover={{
            textDecoration: 'none',
          }}>
          <Text
            fontWeight={600}
            color={useColorModeValue('gray.600', 'gray.200')}>
            {label}
          </Text>
          {children && (
            <Icon
              as={ChevronDownIcon}
              transition={'all .25s ease-in-out'}
              transform={isOpen ? 'rotate(180deg)' : ''}
              w={6}
              h={6}
            />
          )}
        </Flex>
  
        <Collapse in={isOpen} animateOpacity style={{ marginTop: '0!important' }}>
          <Stack
            mt={2}
            pl={4}
            borderLeft={1}
            borderStyle={'solid'}
            borderColor={useColorModeValue('gray.200', 'gray.700')}
            align={'start'}>
            {children &&
              children.map((child) => (
                <Link as={RLink} key={child.label} py={2} to={child.href} onClick={() => {onClose()}}>
                  {child.label}
                </Link>
              ))}
          </Stack>
        </Collapse>
      </Stack>
    );
  };
  

  export default MobileNav;