import { Box, Button, Center, Heading, Stack, Text, useColorModeValue } from '@chakra-ui/react';
import {Link} from 'react-router-dom'; 
import utils from '@/utils';
import { useAuthHelper } from '@/utils/auth';

interface LeftSidebarProp {
    balance:number,
}

export default function LeftSidebar({...prop}:LeftSidebarProp) {
    const {profile} = useAuthHelper();

    return (
        <div className="max-w-96">
            <Center py={6}>
                <Box
                    maxW={'320px'}
                    w={'full'}
                    bg={useColorModeValue('white', 'gray.900')}
                    boxShadow={'2xl'}
                    rounded={'lg'}
                    p={6}
                    textAlign={'center'}
                >
                    <Text>Hello,</Text>
                    <Heading fontSize={'2xl'} fontFamily={'body'}>{profile?.full_name}</Heading>
                    <Text className="mt-4" textAlign={'center'} color={useColorModeValue('gray.700', 'gray.400')}px={3}>
                        <small>Current Total Balance:</small> 
                        <br />
                        <strong>{ utils.rupiah(prop.balance)}</strong>
                    </Text>


                    <Stack mt={8} direction={'row'} spacing={4}>
                    <Button
                        as={Link}
                        flex={1}
                        fontSize={'sm'}
                        rounded={'full'}
                        bg={'blue.400'}
                        color={'white'}
                        boxShadow={
                        '0px 1px 25px -5px rgb(66 153 225 / 48%), 0 10px 10px -5px rgb(66 153 225 / 43%)'
                        }
                        _hover={{
                        bg: 'blue.500',
                        }}
                        _focus={{
                        bg: 'blue.500',
                        }}
                        to="/transaction"
                    >
                        + New Transaction Record
                    </Button>
                    </Stack>
                </Box>
            </Center>
        </div>        
    )
}