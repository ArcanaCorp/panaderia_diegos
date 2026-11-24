'use client';

import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
} from 'react';

const ModalContext = createContext(null);

export function ModalProvider({ children }) {
    const [modal, setModal] = useState(null);
    const [data, setData] = useState(null);
    const [options, setOptions] = useState({});

    const openModal = useCallback((name, modalData = null, modalOptions = {}) => {
        setModal(name);
        setData(modalData);
        setOptions(modalOptions);
    }, []);

    const closeModal = useCallback(() => {
        setModal(null);
        setData(null);
        setOptions({});
    }, []);

    const value = useMemo(() => ({
        modal,
        data,
        options,
        openModal,
        closeModal,
    }), [modal, data, options, openModal, closeModal]);

    return (
        <ModalContext.Provider value={value}>
            {children}
        </ModalContext.Provider>
    );
}

export function useModal() {
    const context = useContext(ModalContext);

    if (!context) {
        throw new Error('useModal debe utilizarse dentro de ModalProvider');
    }

    return context;
}
