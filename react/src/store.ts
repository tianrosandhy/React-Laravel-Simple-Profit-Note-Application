import {configureStore, combineReducers} from '@reduxjs/toolkit';
import { persistStore, persistReducer} from 'redux-persist'
import AuthTokenReducer from '@/features/authtoken';
import LoadingReducer from '@/features/loading';
import storage from 'redux-persist/lib/storage'

const persistentConfig = {
    key: "root",
    version: 1,
    storage,    
}

const rootReducer = combineReducers({
    auth: persistReducer(persistentConfig, AuthTokenReducer),
    loading: LoadingReducer,
})

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false,
    }),
});

const persistStoreInstance = persistStore(store);

export type RootState = ReturnType<typeof store.getState>

export default {store, persistStoreInstance}
