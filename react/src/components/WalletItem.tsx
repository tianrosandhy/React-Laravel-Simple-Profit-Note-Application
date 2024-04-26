import {
    Flex,
    Box,
    Link,
    Button,
    IconButton,
    Badge,
    useColorModeValue,
} from '@chakra-ui/react';
import {Link as RLink} from "react-router-dom";
import {Icon} from '@iconify/react';
import util from '@/utils';
import {Wallet} from "@/types/model";
  
function WalletItem({...prop}:Wallet) {
    return (
      <>
        <Box
          bg={useColorModeValue('white', 'gray.800')}
          w="full"
          borderWidth="1px"
          rounded="lg"
          shadow="lg"
          position="relative">
  
          <Box p="6">
            <Box className="flex" alignItems="baseline">
              {prop.is_default == 1 && (
                <Badge rounded="full" px="2" fontSize="0.7em" colorScheme="blue" position="absolute" top={2} right={2}>
                  Default
                </Badge>
              )}
            </Box>
            <Flex mt="1" justifyContent="space-between" alignContent="center">
              <Box
                w="full"
                fontSize="xl"
                fontWeight="semibold"
                as="h4"
                lineHeight="tight"
                isTruncated>
                <Flex justify="space-between" className="w-full">
                    <RLink to={`/transaction/records/${prop.id}`}>
                      <Flex>
                        <Icon width={30} icon="emojione-v1:eye" />
                        <span className="mx-2">{prop.title}</span>
                      </Flex>
                    </RLink>
                    <div>
                        <IconButton as={RLink} to={`/wallet/detail/${prop.id}`} aria-label="Edit" rounded={'full'} size="sm" colorScheme="blue" title="Edit" icon={<Icon icon="line-md:edit" />} />
                    </div>
                </Flex>
              </Box>
            </Flex>
  
            <Flex justifyContent="space-between" alignContent="center">
              <Box fontSize="sm" color={useColorModeValue('gray.800', 'white')}>
                {util.rupiah(prop.balance)}
              </Box>
            </Flex>

            <Flex mt={5}>
                <Link as={RLink} to="/">
                    <Button size="sm" as={RLink} to={`/transaction/${prop.id}`}>+ Add Transaction</Button>
                </Link>
            </Flex>
          </Box>
        </Box>
      </>
    );
}

export default WalletItem;