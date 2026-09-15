'use client';

import { SIDEBAR } from "@/config/sidebar";
import { useAuth } from "@/context/AuthContext"

export default function Page () {

    const { role } = useAuth();
    
    const tabs = SIDEBAR[role] || [];

    const currentTab = tabs.find(tab => tab.path === '/dashboard');
    
    
    return (
        <>
            {currentTab?.view}
        </>
    )
}