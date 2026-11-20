'use client'

import { SIDEBAR } from "@/config/sidebar";
import { useApp } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { IconLayoutSidebarLeftCollapse, IconLayoutSidebarLeftExpand, IconLogout } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SideBar() {

    const { isSidebarCollapsed, toggleSidebar } = useApp();
    const { role, profile, signOut } = useAuth();

    const tabs = SIDEBAR[role] || [];

    const pathname = usePathname();

    return (
        <aside className={`sidebar${isSidebarCollapsed ? ' sidebar--collapse' : ''}`}>

            {/* HEADER */}
            <div className="sidebar__header">
                <div className="sidebar__brand">
                    <span>Diego&apos;s</span>
                </div>
                <button
                    type="button"
                    className="btn sidebar__toggle"
                    onClick={toggleSidebar}
                    aria-label={isSidebarCollapsed ? 'Expandir menú' : 'Contraer menú'}
                    title={isSidebarCollapsed ? 'Expandir menú' : 'Contraer menú'}
                    aria-expanded={!isSidebarCollapsed}
                    aria-controls="sidebar-navigation"
                >
                    {isSidebarCollapsed ? <IconLayoutSidebarLeftExpand aria-hidden="true"/> : <IconLayoutSidebarLeftCollapse aria-hidden="true"/>}
                </button>
            </div>


            {/* NAVIGATION */}
            <nav id="sidebar-navigation" className="sidebar__nav" aria-label="Menú principal">

                <div className="sidebar__section">

                    <p className="sidebar__section-title">Menú</p>

                    {tabs.map((tab) => (
                        <Link key={tab.path} href={tab.path} className={`sidebar__item ${pathname === tab.path ? 'sidebar__item--active' : ''}`} aria-label={tab.label} title={isSidebarCollapsed ? tab.label : undefined}>
                            <span className="sidebar__icon" aria-hidden="true">{tab.icon}</span>
                            <span className="sidebar__label">{tab.label}</span>
                        </Link>
                    ))}

                </div>

            </nav>


            {/* FOOTER */}
            <div className="sidebar__footer">

                <div className="sidebar__user" title={isSidebarCollapsed ? `${profile?.full_name || 'Usuario'} · ${role || 'Sin rol'}` : undefined}>

                    <div className="sidebar__user-avatar">
                        {profile?.full_name?.charAt(0)?.toUpperCase() || "U"}
                    </div>

                    <div className="sidebar__user-info">

                        <p className="sidebar__user-name">
                            {profile?.full_name || "Usuario"}
                        </p>

                        <p className="sidebar__user-role">
                            {role || "Sin rol"}
                        </p>

                    </div>

                </div>

                <div className="">
                    <button type="button" className="btn btn-danger-soft btn-block sidebar__logout" onClick={signOut} aria-label="Cerrar sesión" title={isSidebarCollapsed ? 'Cerrar sesión' : undefined}>
                        <IconLogout size={20} aria-hidden="true" />
                        <span className="sidebar__label">Cerrar sesión</span>
                    </button>
                </div>

            </div>

        </aside>
    );
}
