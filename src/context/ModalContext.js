'use client';

import { createContext, useContext, useState } from 'react';

const ModalContext = createContext(null);

export function ModalProvider({ children }) {
    const [modal, setModal] = useState(null);
    const [data, setData] = useState(null);
    const [options, setOptions] = useState({});

    const openModal = (
        name,
        modalData = null,
        modalOptions = {}
    ) => {
        setModal(name);
        setData(modalData);
        setOptions(modalOptions);
    };

    const closeModal = () => {
        setModal(null);
        setData(null);
        setOptions({});
    };

    return (
        <ModalContext.Provider
            value={{
                modal,
                data,
                options,
                openModal,
                closeModal,
            }}
        >
            {children}
        </ModalContext.Provider>
    );
}

export function useModal() {
    const context = useContext(ModalContext);

    if (!context) {
        throw new Error(
            'useModal debe utilizarse dentro de ModalProvider'
        );
    }

    return context;
}