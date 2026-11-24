"use client";

import { useAuth } from "@/context/AuthContext";
import { DASHBOARD_VIEWS } from "../config/dashboard-views";
import DashboardSkeleton from "@/features/dashboard/components/DashboardSkeleton";

export default function RoleBasedView({ path }) {
    const { role, loading } = useAuth();

    if (loading) {
        return <DashboardSkeleton />;
    }

    const View = DASHBOARD_VIEWS[role]?.[path];

    if (!View) {
        return null;
    }

    return <View />;
}
