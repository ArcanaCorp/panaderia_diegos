'use client'

import { useProducts } from "@/hooks/useProducts";
import { createContext, useContext } from "react"

const DBContext = createContext();

export const DBProvider = ({ children }) => {

    const products = useProducts();

    const contextValue = {
        products: products.products,
        productLoading: products.loading,
        fetchProducts: products.fetchProducts
    }

    return (
        <DBContext.Provider value={contextValue}>{children}</DBContext.Provider>
    )

}

export const useDB = () => useContext(DBContext);