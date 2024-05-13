import {Box, Flex, Text, Input, InputGroup, InputLeftElement, Button} from "@chakra-ui/react"
import {useState, useEffect} from "react"
import {Wallet, Label, Transaction} from "@/types/model"
import WalletChooser from "@/components/WalletChooser"
import utils from "@/utils"
import LabelChooser from "@/components/LabelChooser"
import { useAuthHelper } from "@/utils/auth"
import TransactionAction from "@/actions/transaction"
import WalletAction from "@/actions/wallet"
import useToastHelper from "@/utils/toast"
import { Link, useNavigate, useParams } from "react-router-dom"
import { useDispatch } from "react-redux"
import { hideLoading, showLoading } from "@/features/loading"

export default function TransactionPage() {
    const {storedToken} = useAuthHelper();
    const toast = useToastHelper();
    const dispatch = useDispatch();
    const [wallet, setWallet] = useState<Partial<Wallet>>({})
    const [label, setLabel] = useState<Partial<Label>>({})
    const [transactionType, setTransactionType] = useState<string>("income")
    const [amount, setAmount] = useState<string>("")
    const [note, setNote] = useState<string>("")
    const [editTrxID, setEditTrxID] = useState<number>(0)
    const [transactionDate, setTransactionDate] = useState<string>(utils.dateToString(new Date()))
    const navigate = useNavigate();

    const param = useParams();

    useEffect(() => {
        if (param.id) {
            WalletAction.getSingle(storedToken, Number(param.id)).then(resp => {
                if (resp?.data) {
                    setWallet(resp.data);
                }
            })
        } else if (param.transaction_id) {
            TransactionAction.getSingle(storedToken, Number(param.transaction_id)).then(resp => {
                if (resp?.data) {
                    setEditTrxID(resp.data.id);
                    setLabel(resp.data.label);
                    setWallet(resp.data.wallet);
                    setTransactionType(resp.data.expense > 0 ? "expense" : "income");
                    setAmount(resp.data.expense > 0 ? resp.data.expense.toString() : resp.data.income.toString());
                    setNote(resp.data.notes);
                    setTransactionDate(resp.data.transaction_date);
                }
            })
        }
    }, [param.id, storedToken])


    const submitTransaction = (e:React.FormEvent) => {
        e.preventDefault();
        dispatch(showLoading())
        const newTransaction:Transaction = {
            wallet_id: wallet.id || 0,
            label_id: label.id,
            expense: transactionType == "expense" ? Number(amount) : 0,
            income: transactionType == "income" ? Number(amount) : 0,
            notes: note,
            transaction_date: transactionDate,
        }

        TransactionAction.patch(storedToken, editTrxID, newTransaction).then(resp => {
            dispatch(hideLoading())
            toast.backendToast(resp);
            if (resp?.type == "success") {
                navigate("/");
            }
        }).catch(() => {
            dispatch(hideLoading())
            toast.errorToast("Failed to submit transaction");        
        });

    }

    return (
        <Flex className="p-4" justifyContent="center">
            <Box className="max-w-md w-full">
                <h1 className="text-2xl mb-3">{ editTrxID > 0 ? 'Edit Transaction Data' : 'New Transaction Data' }</h1>

                <form onSubmit={submitTransaction}>
                    <WalletChooser wallet={wallet} setWallet={setWallet} />

                    {wallet.id && (
                        <>
                        <Box className="text-center my-3 p-2 bg-slate-100">
                            <Text className="text-xs">Current Balance:</Text>
                            <Text className="font-bold">{utils.rupiah(wallet.balance)}</Text>
                        </Box>
                        
                        <div className="form-group my-3">
                            <label>Transaction Type</label>

                            <Box className="overflow-hidden rounded-lg">
                                <Flex justifyContent="stretch">
                                    <Box onClick={() => {setTransactionType("income")}} className={transactionType == "income" ? "w-1/2 text-center p-2 bg-blue-500 text-white cursor-pointer" : "w-1/2 text-center p-2 bg-slate-100 cursor-pointer"}>
                                        <strong>Income</strong>
                                    </Box>
                                    <Box onClick={() => {setTransactionType("expense")}} className={transactionType == "expense" ? "w-1/2 text-center p-2 bg-red-500 text-white cursor-pointer" : "w-1/2 text-center p-2 bg-slate-100 cursor-pointer"}><strong>Expense</strong></Box>
                                </Flex>
                            </Box>
                        </div>

                        <div className="form-group my-3">
                            <label>Amount</label>
                            <InputGroup>
                                <InputLeftElement pointerEvents='none' color='gray.300' px={3}>IDR</InputLeftElement>
                                <Input value={Number(amount).toLocaleString()} onChange={(e) => {
                                    const val = e.target.value.replace(/,/g, '');
                                    if (parseInt(val) < 0) return;
                                    if (val == '') {
                                        setAmount('0')
                                    } else {
                                        setAmount(parseInt(val).toString())
                                    }
                                }} />
                            </InputGroup>
                        </div>

                        <div className="form-group my-3">
                            <label>Additional Note</label>
                            <Input value={note} maxLength={150} onChange={(e) => setNote(e.target.value)} />
                        </div>

                        <div className="form-group my-3">
                            <label>Choose Label</label>
                            <div>
                                <LabelChooser label={label} setLabel={setLabel} />
                            </div>
                        </div>

                        <div className="form-group my-3">
                            <label>Transaction Date</label>
                            <Input type="date" value={transactionDate} onChange={(e) => setTransactionDate(e.target.value)} />
                        </div>

                        <div className="py-3">
                            <Button type="submit" colorScheme="green" w="full">
                                Save Transaction Record
                            </Button>

                            <Button as={Link} to="/" w="full" mt={3}>
                                Back to Home
                            </Button>
                        </div>

                        </>
                    )}
                </form>
            </Box>
        </Flex>
    )
}