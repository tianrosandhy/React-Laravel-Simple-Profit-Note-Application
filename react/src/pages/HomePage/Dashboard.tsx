import WalletPage from "@/pages/WalletPage";
import LabelPage from '@/pages/LabelPage';
import MoneyChart from "@/components/MoneyChart";

export default function Dashboard() {
    return (
        <div className="py-6">
            <MoneyChart />
            <WalletPage />
            <LabelPage />
        </div>
    );
}