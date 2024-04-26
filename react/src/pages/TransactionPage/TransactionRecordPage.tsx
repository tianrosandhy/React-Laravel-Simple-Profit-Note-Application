import {Box, SimpleGrid, Input, Select, Button, Text, Badge, TableContainer, Table, Thead, Tbody, Tr, Th, Td} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import {Wallet, Label, Transaction} from "@/types/model";
import { useAuthHelper } from "@/utils/auth";
import LabelAction from "@/actions/label";
import WalletAction from "@/actions/wallet";
import { BackendPaginationDataResponse } from "@/types/rest";
import TransactionAction from "@/actions/transaction";
import utils from "@/utils";

export default function TransactionRecordPage() {
    const param = useParams();
    const [labels, setLabels] = useState<Label[]>([]);
    const [wallets, setWallets] = useState<Wallet[]>([]);
    const {storedToken} = useAuthHelper();

    const [selectedWallet, setSelectedWallet] = useState<string>("");
    const [selectedLabel, setSelectedLabel] = useState<string>("");
    const [selectedDate, setSelectedDate] = useState<string>("");
    const [selectedEndDate, setSelectedEndDate] = useState<string>("");
    const [page, setPage] = useState<number>(1);
    const [maxPage, setMaxPage] = useState<number>(1);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loaded, setLoaded] = useState<boolean>(false);
    const [mode, setMode] = useState<string>("transaction");

    const filterFilled = () => {
        return (selectedWallet != "" || selectedLabel != "" || selectedDate != "" || selectedEndDate != "") && page == 1;
    }

    useEffect(() => {
        const fetchLabels = async () => {
            const labelResponse = await LabelAction.get(storedToken);
            if (labelResponse?.type == "success") {
                const paginationResp:BackendPaginationDataResponse = labelResponse.data
                const labelDatas: Label[] = paginationResp.data;
                setLabels(labelDatas);
            }
        };

        const fetchWallets = async () => {
            const walletResponse = await WalletAction.get(storedToken);
            if (walletResponse?.type == "success") {
                const paginationResp:BackendPaginationDataResponse = walletResponse.data
                const walletDatas: Wallet[] = paginationResp.data;
                setWallets(walletDatas);
            }
        };

        fetchLabels();
        fetchWallets();

        if (param.id) {
            setSelectedWallet(param.id);
        }
    }, [storedToken, param.id])

    const loadTransaction = async (reset?:boolean) => {
        var requestedPage = page;
        if (reset) {
            requestedPage = 1;
            setPage(1);
        }

        const transactionParam:Record<string,string> = {
            page: requestedPage.toString(),
            wallet_id: selectedWallet,
            label_id: selectedLabel,
            start_transaction_date: selectedDate,
            end_transaction_date: selectedEndDate,
        }

        if (selectedWallet != "") {
            setMode("wallet");
        } else {
            setMode("transaction");
        }

        TransactionAction.get(storedToken, transactionParam).then((res) => {
            if (res?.type == "success") {
                const paginationResp:BackendPaginationDataResponse = res.data
                const transactionDatas: Transaction[] = paginationResp.data;
                setMaxPage(paginationResp.last_page);
                setPage(paginationResp.current_page);
                setTransactions(transactionDatas);
                setLoaded(true);
            }
        });
    };

    // const printWalletBadge = (wallet:Wallet) => {
        // return <Badge mr={1}><span className="text-[10px] sm:text-md">
        //     <Icon className="mr-2" icon="ph:wallet-bold"></Icon>
        //     <span>{wallet.title}</span>
        // </span></Badge>;
    // }

    const printLabelBadge = (label:Label) => {
        return <Badge mr={1} bg={label.color} color={"#FFFFFF"}>
            <span className="text-[10px] sm:text-md">{label.title}</span>
        </Badge>;
    }
    

    return (
        <div className="p-4">
            <Box p={4} boxShadow="2xl">
                <h1 className="text-2xl font-bold">Transaction Record Page</h1>

                <form onSubmit={(e) => {
                    e.preventDefault();
                    loadTransaction(true);
                }}>
                    <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} py={4} gap={3}>
                        <Box>
                            <label>Filter Wallet</label>
                            <Select value={selectedWallet} onChange={e => {setSelectedWallet(e.target.value)}}>
                                <option value="">- All Wallet -</option>
                                {wallets.map((wallet) => (
                                    <option key={wallet.id} value={wallet.id}>{wallet.title}</option>
                                ))}
                            </Select>
                        </Box>
                        <Box>
                            <label>Filter Label</label>
                            <Select value={selectedLabel} onChange={e => setSelectedLabel(e.target.value)}>
                                <option value="">- All Labels -</option>
                                {labels.map((label) => (
                                    <option key={label.id} value={label.id}>{label.title}</option>
                                ))}
                            </Select>
                        </Box>

                        <Box>
                            <label>Start Date</label>
                            <Input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
                        </Box>

                        <Box>
                            <label>End Date</label>
                            <Input type="date" value={selectedEndDate} onChange={(e) => setSelectedEndDate(e.target.value)} />
                        </Box>
                    </SimpleGrid>
                    <Button type="submit" w="full">Get Transaction Datas</Button>
                </form>
            </Box>

            {!loaded && (
                <div className="p-5 text-center">
                    Adjust your filter, and click <strong>Get Transaction Datas</strong> to get your transaction datas.
                </div>
            )}

            {loaded && (
                <Box p={4} boxShadow="2xl" mt={3}>
                    {transactions.length > 0 ? (
                        <>
                        <TableContainer>
                            <Table size="sm">
                                <Thead>
                                    <Tr>
                                        <Th className="hidden sm:block">Trx Date</Th>
                                        <Th>Note</Th>
                                        <Th>Amount</Th>
                                        <Th>{mode == "transaction" ? "Total Balance": "Wallet Balance"}</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {transactions.map((transaction) => (
                                        <Tr key={transaction.id}>
                                            <Td className="hidden sm:block">{utils.humanReadableDate(transaction.transaction_date || '')}</Td>
                                            <Td>
                                                <div className="sm:hidden">
                                                    <small>{utils.humanReadableDate(transaction.transaction_date || '')}</small>
                                                </div>
                                                <div className="block sm:inline">
                                                    {transaction.label_id && labels.length > 0 && (
                                                        labels.find((label) => label.id == transaction.label_id) && 
                                                        printLabelBadge(labels.find((label) => label.id == transaction.label_id)!)
                                                    )}
                                                </div>

                                                {transaction.notes}
                                            </Td>
                                            <Td align="right">
                                                {(transaction.income && transaction.income > 0) ? <Text align="right" color="green" className="font-bold">{"+ " + utils.rupiah(transaction.income || 0)}</Text> : ""}
                                                {(transaction.expense && transaction.expense > 0) ? <Text align="right" color="red" className="font-bold">{"- " + utils.rupiah(transaction.expense || 0)}</Text> : ""}
                                            </Td>
                                            <Td align="right">
                                                {mode == "wallet" ? utils.rupiah(transaction.wallet_balance) : utils.rupiah(transaction.total_balance || 0)}
                                            </Td>
                                        </Tr>
                                    ))}
                                </Tbody>
                            </Table>
                        </TableContainer>

                        <div className="my-2">
                            {page < maxPage && (
                                <Button w="full" onClick={() => {
                                    setPage(page + 1);
                                    loadTransaction();
                                }}>Load More...</Button>
                            )}
                        </div>
                        </>
                    ) : (
                        filterFilled() ? (
                            <>
                                <Text>No transaction found with such filters.</Text>
                                <Button onClick={() => {
                                    if (param.id) {
                                        setSelectedWallet(param.id);
                                    } else {
                                        setSelectedWallet("");
                                    }
                                    setSelectedLabel("");
                                    setSelectedDate("");
                                    setSelectedEndDate("");
                                    setLoaded(false);
                                }}>Reset Filter</Button>
                            </>
                        ) : (
                            <span>No transaction data right now. How about create new transaction record?</span>
                        )
                    )}
                </Box>
            )}
            </div>
    );
}