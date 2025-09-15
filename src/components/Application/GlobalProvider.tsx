"use client"
import { Provider } from 'react-redux'
import { store, persistor } from '@/store/store'
import { PersistGate } from 'redux-persist/integration/react'
import { Loading } from './Loading'

const LoadingComponent = () => {
    return <Loading />
};

export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <Provider store={store}>
            <PersistGate loading={<LoadingComponent />} persistor={persistor}>
            {children}
            </PersistGate>
        </Provider>
    );
};
