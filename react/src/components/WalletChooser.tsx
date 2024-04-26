import { Box, Flex, Button, Text, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, useDisclosure } from "@chakra-ui/react";
import {Icon} from "@iconify/react";
import {Wallet} from "@/types/model";
import {useState, useEffect} from "react";
import WalletAction from "@/actions/wallet";
import { useAuthHelper } from "@/utils/auth";
import { BackendPaginationDataResponse } from "@/types/rest";

interface WalletChooserProp {
    wallet: Partial<Wallet>,
    setWallet: React.Dispatch<React.SetStateAction<Partial<Wallet>>>,
}

export default function WalletChooser({...prop}: WalletChooserProp) {
    const {storedToken} = useAuthHelper()
    const [walletID, setWalletID] = useState(prop.wallet.id || 0)
    const [wallets, setWallets] = useState<Wallet[]>([])
    const { isOpen, onOpen, onClose } = useDisclosure()

    useEffect(() => {
        const loadWallets = async () => {
            WalletAction.get(storedToken).then(resp => {
                if (resp?.data) {
                    const paginationData:BackendPaginationDataResponse = resp.data;
                    setWallets(paginationData.data as Wallet[])
                }
            })
        };
        loadWallets();
        setWalletID(prop.wallet.id || 0);
    }, [storedToken, prop.wallet]);

    return (
    <>
    <Box cursor="pointer" rounded={"full"} bgColor={walletID > 0 ? "#1e97d4" : "transparent"} borderWidth={2} borderColor="#1e97d4" p={4} color={walletID > 0 ? "#ffffff" : "#1e97d4"} _hover={{"opacity": "0.75"}} onClick={onOpen}>
        <Flex justifyContent="start" w="full">
            <Icon width={40} icon="ph:wallet-bold"></Icon>
            <div className="mx-3">
                <Text color={walletID > 0 ? "#ffffff" : "#1e97d4"} className="text-xs">Selected Wallet</Text>
                <Text color={walletID > 0 ? "#ffffff" : "#1e97d4"} className="font-bold">{walletID > 0 ? (prop.wallet.title) : `Please Choose Wallet`}</Text>
            </div>
        </Flex>
    </Box>

    <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
            <ModalHeader>Choose Wallet</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                {wallets.map((wallet, index) => (
                    <Button key={index} onClick={() => {
                        prop.setWallet(wallet)
                        setWalletID(wallet.id)
                        onClose()
                    }} className="w-full" bgColor={walletID === wallet.id ? "#1e97d4" : "transparent"} color={walletID === wallet.id ? "white" : "#1e97d4"} _hover={{"bgColor": "#F7F7F7"}}>
                        <Icon width={25} icon="ph:wallet-bold"></Icon>
                        <span className="mx-2">{wallet.title}</span>
                    </Button>
                ))}
            </ModalBody>
        </ModalContent>
    </Modal>
    </>
    )
}