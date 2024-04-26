import {useSelector, useDispatch} from 'react-redux';
import type { RootState } from '@/store';
import {AuthInitialState, logout} from '@/features/authtoken';
import * as Backend from '@/utils/backend';
import {Profile} from "@/types/profile"

const doLogin = async (token: string) => {
    const profileResp = await Backend.get({endpoint: "/auth/profile", useBearer: true, bearerToken: token});
    if (profileResp?.type == "success") {
        const profileData:Profile = profileResp.data;
        const loginData:AuthInitialState = {
            token,
            profile: profileData,
        } 
        return loginData;
    }
    return null;
}

const useAuthHelper = () => {
    const dispatch = useDispatch();
    const storedToken = useSelector((state: RootState) => state.auth.token)
    const profile = useSelector((state: RootState) => state.auth.profile)
    const isLoggedIn = storedToken.length > 0 && profile && profile?.id > 0;

    const doLogout = () => {
        dispatch(logout());
    }

    return {isLoggedIn, storedToken, profile, doLogout};
}

export {doLogin, useAuthHelper};