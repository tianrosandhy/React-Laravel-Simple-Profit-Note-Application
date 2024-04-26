import { CChart } from '@coreui/react-chartjs';
import {Box} from "@chakra-ui/react";
import {useState, useEffect} from "react";
import { useAuthHelper } from '@/utils/auth';
import {TransactionReport} from "@/types/model";
import TransactionAction from '@/actions/transaction';

interface DatasetType {
    label: string,
    backgroundColor?: string,
    borderColor?: string,
    data: number[],
}

export default function MoneyChart() {
    const {storedToken} = useAuthHelper();
    const [report, setReport] = useState<TransactionReport>();
    const [dataset, setDataset] = useState<DatasetType[]>([]);

    useEffect(() => {
        TransactionAction.getReport(storedToken).then((res) => {
            if (res?.type == "success") {
                const report:TransactionReport = res.data;
                setReport(report);
                generateDataset(report);
            }
        });
    }, [storedToken]);

    const generateDataset = (report:TransactionReport) => {
        const dts:DatasetType[] = [];
        if (report?.summary) {
            dts.push({
                label: "Summary",
                backgroundColor: "#3182ce",
                borderColor: "rgba(49, 130, 206, .8)",
                data: report.summary,
            });
        }
        setDataset(dts);
    }

    return (
        <Box w={'full'} boxShadow={'2xl'} mb={5} rounded={'lg'} p={6}>
            <h3 className="text-2xl font-bold">My Wallet Report</h3>    
            <div className="w-100">
                <CChart
                    type="line" 
                    data={{
                        labels: report?.labels || [],
                        datasets: dataset,
                    }}
                    options={{
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        },
                        responsive: true,
                        maintainAspectRatio : false,
                    }}
                />
            </div>
        </Box>
        
    );
}