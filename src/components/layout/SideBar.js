'use client'

import { SIDEBAR } from "@/config/sidebar";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function SideBar() {

    const { role, profile, signOut } = useAuth();

    const tabs = SIDEBAR[role] || [];

    return (
        <aside className="sidebar">

            {/* HEADER */}
            <div className="sidebar__header">
                <div className="sidebar__brand">
                    <span>Diego's</span>
                </div>
            </div>


            {/* NAVIGATION */}
            <nav className="sidebar__nav">

                <div className="sidebar__section">

                    <p className="sidebar__section-title">
                        Menú
                    </p>

                    {tabs.map((tab, idx) => (
                        <Link
                            key={idx}
                            href={tab.path}
                            className="sidebar__item"
                        >
                            <span className="sidebar__icon">
                                {tab.icon}
                            </span>

                            <span>
                                {tab.label}
                            </span>
                        </Link>
                    ))}

                </div>

            </nav>


            {/* FOOTER */}
            <div className="sidebar__footer">

                <div className="sidebar__user">

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
                    <button className="btn btn-danger-soft btn-block" onClick={signOut}>Cerrar sesión</button>
                </div>

            </div>

        </aside>
    );
}