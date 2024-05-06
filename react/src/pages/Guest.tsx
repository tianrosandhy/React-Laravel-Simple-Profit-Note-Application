import Hero from '@/components/Hero';
import { hideLoading, showLoading } from '@/features/loading';
import { useAuthHelper } from '@/utils/auth';
import {useEffect} from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function Guest() {
    const auth = useAuthHelper();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(showLoading());
    }, [dispatch])

    useEffect(() => {
        if(auth.isLoggedIn) {
            navigate("/dashboard");
        }
    }, [auth]);

    useEffect(() => {
        setTimeout(() => {
          dispatch(hideLoading())
        }, 200);
    }, [dispatch, location.pathname])
    
    return <Hero />
}