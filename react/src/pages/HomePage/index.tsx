import {
    Grid, 
    GridItem,
} from "@chakra-ui/react"
import {useEffect, useState} from "react"
import { useAuthHelper } from "@/utils/auth"
import Hero from "@/components/Hero"
import useToastHelper from "@/utils/toast"
import * as Backend from "@/utils/backend"
import LeftSidebar from "./LeftSidebar"
import Dashboard from "./Dashboard"

export default function HomePage() {
    const {isLoggedIn, profile, storedToken} = useAuthHelper()
    const toast = useToastHelper()
    const [balance, setBalance] = useState<number|undefined>(0);

    const fetchBalance = async () => {
        if (profile) {
            const response = await Backend.get({endpoint: "/auth/profile", bearerToken: storedToken, useBearer: true});
            if (response?.type == "success") {
                setBalance(response.data.balance);
            } else {
                toast.errorToast("Oops, failed to fetch balance");
            }
        }
    }

    useEffect(() => {
        fetchBalance();
    }, [profile]);

    return (
        isLoggedIn ? (<div>
            <Grid className="p-4" gap={4} templateColumns={
                {
                    "xl": "repeat(5, 1fr)",
                    "lg": "repeat(4, 1fr)",
                    "sm": "1fr"
                }
            }>
                <GridItem colSpan={1}>
                    <LeftSidebar balance={balance || 0} />
                </GridItem>
                <GridItem colSpan={
                    {
                        "xl": 4,
                        "lg": 3,
                        "sm": 1
                    }
                }>
                    <Dashboard />
                </GridItem>
            </Grid>
        </div>) : (
            <Hero />
        )
    )
}