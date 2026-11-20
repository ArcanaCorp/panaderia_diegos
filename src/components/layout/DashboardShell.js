'use client';

import { useApp } from '@/context/AppContext';
import SideBar from './SideBar';

export default function DashboardShell({ children }) {
    const { isSidebarCollapsed } = useApp();

    return (
        <div className={`page-app ${isSidebarCollapsed ? ' page-app--collapse' : ''}`}>
            <SideBar />
            <main className="page-app__main">{children}</main>
        </div>
    );
}
