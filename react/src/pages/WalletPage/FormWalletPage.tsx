import {useState, useEffect} from "react";
import {Wallet} from "@/types/model";
import {Box, Input, Button, Text, Flex, useDisclosure} from "@chakra-ui/react";
import {Link, useNavigate} from "react-router-dom";
import {useParams} from "react-router-dom";
import WalletAction from "@/actions/wallet";
import useToastHelper from "@/utils/toast";
import { useAuthHelper } from "@/utils/auth";
import utils from "@/utils";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";

export default function FormWalletPage() {
    const toast = useToastHelper();
    const { id } = useParams();
    const [wallet, setWallet] = useState<Partial<Wallet>>({});
    const [title, setTitle] = useState("");
    const {storedToken} = useAuthHelper();
    const navigate = useNavigate();
    const { isOpen, onOpen, onClose } = useDisclosure();

    useEffect(() => {
        if (typeof id != "undefined") {
            WalletAction.getSingle(storedToken, parseInt(id)).then((response) => {
                if (response?.type == "success") {
                    const walletResp:Wallet = response.data;
                    setWallet(walletResp);
                    setTitle(walletResp.title || "")
                } else {
                    toast.errorToast("Oops, failed to fetch wallet data");
                    navigate("/wallet");
                }
            });
        }
    }, [id]);

    const submitForm = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (typeof wallet.title == "undefined") {
            toast.errorToast("Please fill the wallet title first");
            return;
        }

        if (typeof wallet.id == "undefined") {
            WalletAction.post(storedToken, wallet).then((response) => {
                toast.backendToast(response);
                if (response?.type == "success") {
                    navigate("/wallet");
                }
            });
        } else {
            WalletAction.patch(storedToken, wallet).then((response) => {
                toast.backendToast(response);
                if (response?.type == "success") {
                    navigate("/wallet");
                }
            });
        }
    }

    const deleteWallet = () => {
        WalletAction.delete(storedToken, wallet.id || 0).then((response) => {
            toast.backendToast(response);
            if (response?.type == "success") {
                navigate("/wallet");
            }
        });
    }

    return (
        <Flex className="p-4" justifyContent="center">
            <Box className="max-w-md w-full">

                <form className="p-4" onSubmit={submitForm}>
                    <Flex justifyContent={"space-between"} w="full" mb={3}>
                        <h1 className="text-2xl mb-3">{typeof id != "undefined" ? "Edit Wallet Data" : "Create New Wallet Data"}</h1>
                        {wallet.id && (wallet.balance == 0) && (
                            <div>
                                <Button colorScheme="red" onClick={onOpen}>Delete this wallet</Button>
                                <DeleteConfirmationModal isOpen={isOpen} onClose={onClose} onConfirm={deleteWallet} />
                            </div>
                        )}
                    </Flex>


                    <Box p={4} boxShadow={'2xl'}>
                        <div className="form-group">
                            <label>Wallet Title</label>
                            <Input type="text" placeholder="Wallet Title" maxLength={50} value={title} onChange={(e) => {
                                setWallet({...wallet, title: e.target.value});
                                setTitle(e.target.value);
                            }} />
                        </div>
                    </Box>

                    {typeof wallet.balance != "undefined" && (
                        <Text my={3}>Current wallet balance: <strong>{utils.rupiah(wallet.balance)}</strong></Text>
                    )}

                    <div className="my-3">
                        <Button colorScheme="blue" type="submit" className="mx-2">Save Wallet Data</Button>
                        <Button as={Link} to="/wallet" className="mx-2">Cancel</Button>
                    </div>

                    
                </form>
            </Box>
        </Flex>
    )
}