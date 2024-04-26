import {createSlice} from '@reduxjs/toolkit';
import {Profile} from '@/types/profile';

interface AuthInitialState {
    token: string;
    profile: Profile|null;
}

const initialState: AuthInitialState = {
    token: "",
    profile: null,
}

export const authtoken = createSlice({
    name: 'authtoken',
    initialState,
    reducers: {
        logout: state => {
            state.token = "";
            state.profile = null;
        },
        login: (state, action) => {
            const payload: AuthInitialState = action.payload;
            state.profile = payload.profile;
            state.token = payload.token;
        },
    }
});

export const {logout, login} = authtoken.actions;

export type {AuthInitialState};

export default authtoken.reducer;
