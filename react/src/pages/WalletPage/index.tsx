import { Box, Button, Grid, Stack, Text, useColorModeValue } from '@chakra-ui/react';
import {Link} from "react-router-dom";
import { useState, useEffect } from 'react';
import WalletItem from '@/components/WalletItem';
import { Wallet } from '@/types/model';
import { useAuthHelper } from '@/utils/auth';
import WalletAction from '@/actions/wallet';
import { BackendPaginationDataResponse } from '@/types/rest';

export default function WalletPage() {
    const {storedToken} = useAuthHelper();
    const [wallets, setWallets] = useState<Wallet[]>([]);

    useEffect(() => {
        const fetchWallets = async () => {
            const walletResponse = await WalletAction.get(storedToken);
            if (walletResponse?.type == "success") {
                const paginationResp:BackendPaginationDataResponse = walletResponse.data
                const walletDatas: Wallet[] = paginationResp.data;
                setWallets(walletDatas);
            }
        };

        fetchWallets();
    }, [storedToken]);

    return (
        <Box w={'full'} bg={useColorModeValue('white', 'gray.900')} boxShadow={'2xl'} mb={5} rounded={'lg'} p={6}>
            <h3 className="text-2xl font-bold">My Wallets</h3>                
            <Button as={Link} to="/wallet/new" colorScheme="blue" size='xs' m={1}>
                <Text className="mx-3">+ Create New Wallet</Text>
            </Button>

            <Grid templateColumns={
                {
                    "xl": "repeat(4, 1fr)",
                    "lg": "repeat(3, 1fr)",
                    "md": "repeat(1, 1fr)"
                }
            } gap={6} my={5}>
                {wallets.length > 0 && (
                    wallets.map((wallet: Wallet) => (
                        <WalletItem key={wallet.id} {...wallet} />
                    ))
                )}

                {wallets.length == 0 && (
                    <Stack>
                        <Text>No Wallets Data. How about create new one?</Text>
                    </Stack>
                )}
            </Grid>
        </Box>
    );
}