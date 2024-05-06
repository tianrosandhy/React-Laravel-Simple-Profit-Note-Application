import {createSlice} from '@reduxjs/toolkit';

interface LoadingInitialState {
    isLoading: boolean;
}

const initialState: LoadingInitialState = {
    isLoading: true,
}

export const loading = createSlice({
    name: 'loading',
    initialState,
    reducers: {
        showLoading: state => {
            console.log('showLoading');
            state.isLoading = true;
        },
        hideLoading: state => {
            console.log('hideLoading');
            state.isLoading = false;
        },
    }
});

export const {showLoading, hideLoading} = loading.actions;

export type {LoadingInitialState};

export default loading.reducer;
