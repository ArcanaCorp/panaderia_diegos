import { db } from "@/libs/supabase";
import { useCallback, useEffect, useRef, useState } from "react";

const INITIAL_DATA = {
    kpis: {
        today_sales: 0,
        today_sales_change: 0,
        today_orders: 0,
        today_orders_change: 0,
        month_sales: 0,
        month_sales_change: 0,
        low_stock_count: 0,
    },
    sales_chart: [],
    recent_activity: [],
    low_stock_products: [],
};

export const useAdminDashboard = () => {
    const [data, setData] = useState(INITIAL_DATA);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [hasLoaded, setHasLoaded] = useState(false);
    const [error, setError] = useState(null);

    const hasLoadedRef = useRef(false);
    const requestRef = useRef(null);

    const fetchDashboard = useCallback(async () => {
        if (requestRef.current) {
            return requestRef.current;
        }

        const isInitialLoad = !hasLoadedRef.current;

        if (isInitialLoad) {
            setLoading(true);
        } else {
            setRefreshing(true);
        }

        setError(null);

        const request = (async () => {
            try {
                const { data: result, error: rpcError } = await db.rpc(
                    "get_admin_dashboard"
                );

                if (rpcError) throw rpcError;

                setData({
                    ...INITIAL_DATA,
                    ...result,
                    kpis: {
                        ...INITIAL_DATA.kpis,
                        ...(result?.kpis || {}),
                    },
                });

                hasLoadedRef.current = true;
                setHasLoaded(true);
            } catch (err) {
                console.error("Error cargando dashboard:", err);
                setError(err?.message || "No se pudo cargar el dashboard");
            } finally {
                setLoading(false);
                setRefreshing(false);
                requestRef.current = null;
            }
        })();

        requestRef.current = request;
        return request;
    }, []);

    useEffect(() => {
        fetchDashboard();
    }, [fetchDashboard]);

    return {
        data,
        loading,
        refreshing,
        hasLoaded,
        error,
        refresh: fetchDashboard,
    };
};
