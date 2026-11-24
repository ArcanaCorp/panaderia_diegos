'use client'
import { createContext, useCallback, useContext, useMemo, useState } from "react";

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {

    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);

    const toggleSidebar = useCallback(() => {
        setIsSidebarCollapsed(collapsed => !collapsed);
    }, []);

    const contextValue = useMemo(() => ({
        isSidebarCollapsed,
        toggleSidebar,
    }), [isSidebarCollapsed, toggleSidebar]);

    return (
        <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
    )

}

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp debe utilizarse dentro de AppProvider');
    }
    return context;
};
