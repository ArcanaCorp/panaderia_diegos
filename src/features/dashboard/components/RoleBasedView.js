"use client";

import { useAuth } from "@/context/AuthContext";
import { DASHBOARD_VIEWS } from "../config/dashboard-views";
import FeatureSkeleton from "@/features/dashboard/components/FeatureSkeleton";

const SKELETON_BY_PATH = {
    "/dashboard": "dashboard",
    "/dashboard/alerts": "alerts",
    "/dashboard/inventary": "inventory",
    "/dashboard/pos": "pos",
    "/dashboard/produccion": "production",
    "/dashboard/products": "table",
    "/dashboard/settings": "settings",
    "/dashboard/store": "stores",
    "/dashboard/suppliers": "suppliers",
    "/dashboard/showcases": "showcase",
};

export default function RoleBasedView({ path }) {
    const { role, loading } = useAuth();

    if (loading) {
        return <FeatureSkeleton variant={SKELETON_BY_PATH[path] || "dashboard"} />;
    }

    const View = DASHBOARD_VIEWS[role]?.[path];

    if (!View) {
        return null;
    }

    return <View />;
}
