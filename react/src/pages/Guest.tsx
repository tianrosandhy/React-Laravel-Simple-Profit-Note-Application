import Hero from '@/components/Hero';
import { useAuthHelper } from '@/utils/auth';
import {useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

export default function Guest() {
    const auth = useAuthHelper();
    const navigate = useNavigate();

    useEffect(() => {
        if(auth.isLoggedIn) {
            navigate("/dashboard");
        }
    }, [auth]);

    return <Hero />
}