"use client";

import { NAVIGATION } from "@/config/navigation";
import { useApp } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import {
    IconLayoutSidebarLeftCollapse,
    IconLayoutSidebarLeftExpand,
    IconLogout,
} from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

function SidebarSkeleton({ collapsed }) {
    return (
        <>
            <div className="sidebar__section" aria-hidden="true">
                <div className="sidebar__section-title">
                    <span className="sidebar-skeleton sidebar-skeleton--section" />
                </div>

                <div className="sidebar__skeleton-list">
                    {Array.from({ length: 7 }).map((_, index) => (
                        <div className="sidebar__item sidebar__skeleton-item" key={index}>
                            <span className="sidebar-skeleton sidebar-skeleton--icon" />
                            {!collapsed && (
                                <span
                                    className="sidebar-skeleton sidebar-skeleton--label"
                                    style={{ width: `${index % 3 === 0 ? 68 : index % 3 === 1 ? 92 : 78}%` }}
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="sidebar__skeleton-footer" aria-hidden="true">
                <div className="sidebar__user">
                    <span className="sidebar-skeleton sidebar-skeleton--avatar" />
                    {!collapsed && (
                        <div className="sidebar__user-info">
                            <span className="sidebar-skeleton sidebar-skeleton--user-name" />
                            <span className="sidebar-skeleton sidebar-skeleton--user-role" />
                        </div>
                    )}
                </div>
                <div className="sidebar__skeleton-logout">
                    <span className="sidebar-skeleton sidebar-skeleton--icon" />
                    {!collapsed && (
                        <span className="sidebar-skeleton sidebar-skeleton--label sidebar-skeleton--logout-label" />
                    )}
                </div>
            </div>
        </>
    );
}

export default function SideBar() {
    const { isSidebarCollapsed, toggleSidebar } = useApp();
    const { role, profile, signOut, loading } = useAuth();

    const tabs = NAVIGATION[role] || [];
    const pathname = usePathname();

    return (
        <aside className={`sidebar${isSidebarCollapsed ? " sidebar--collapse" : ""}`}>
            <div className="sidebar__header">
                <div className="sidebar__brand">
                    <span>Diego&apos;s</span>
                </div>

                <button
                    type="button"
                    className="btn sidebar__toggle"
                    onClick={toggleSidebar}
                    aria-label={isSidebarCollapsed ? "Expandir menú" : "Contraer menú"}
                    title={isSidebarCollapsed ? "Expandir menú" : "Contraer menú"}
                    aria-expanded={!isSidebarCollapsed}
                    aria-controls="sidebar-navigation"
                >
                    {isSidebarCollapsed ? (
                        <IconLayoutSidebarLeftExpand aria-hidden="true" />
                    ) : (
                        <IconLayoutSidebarLeftCollapse aria-hidden="true" />
                    )}
                </button>
            </div>

            <nav
                id="sidebar-navigation"
                className="sidebar__nav"
                aria-label="Menú principal"
                aria-busy={loading}
            >
                {loading ? (
                    <SidebarSkeleton collapsed={isSidebarCollapsed} />
                ) : (
                    <div className="sidebar__section">
                        <p className="sidebar__section-title">Menú</p>

                        {tabs.map((tab) => {
                            const Icon = tab.icon;

                            return (
                                <Link
                                    key={tab.path}
                                    href={tab.path}
                                    className={`sidebar__item ${
                                        pathname === tab.path ? "sidebar__item--active" : ""
                                    }`}
                                    aria-label={tab.label}
                                    title={isSidebarCollapsed ? tab.label : undefined}
                                >
                                    <span className="sidebar__icon" aria-hidden="true">
                                        <Icon />
                                    </span>
                                    <span className="sidebar__label">{tab.label}</span>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </nav>

            {!loading && (
                <div className="sidebar__footer">
                    <div
                        className="sidebar__user"
                        title={
                            isSidebarCollapsed
                                ? `${profile?.full_name || "Usuario"} · ${role || "Sin rol"}`
                                : undefined
                        }
                    >
                        <div className="sidebar__user-avatar">
                            {profile?.full_name?.charAt(0)?.toUpperCase() || "U"}
                        </div>

                        <div className="sidebar__user-info">
                            <p className="sidebar__user-name">
                                {profile?.full_name || "Usuario"}
                            </p>
                            <p className="sidebar__user-role">{role || "Sin rol"}</p>
                        </div>
                    </div>

                    <div>
                        <button
                            type="button"
                            className="btn btn-danger-soft btn-block sidebar__logout"
                            onClick={signOut}
                            aria-label="Cerrar sesión"
                            title={isSidebarCollapsed ? "Cerrar sesión" : undefined}
                        >
                            <IconLogout size={20} aria-hidden="true" />
                            <span className="sidebar__label">Cerrar sesión</span>
                        </button>
                    </div>
                </div>
            )}
        </aside>
    );
}
