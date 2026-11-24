"use client";

import { useAuth } from "@/context/AuthContext";
import { DASHBOARD_VIEWS } from "../config/dashboard-views";

export default function RoleBasedView({ path }) {
    const { role } = useAuth();

    const View = DASHBOARD_VIEWS[role]?.[path];

    if (!View) {
        return null;
    }

    return <View />;
}
