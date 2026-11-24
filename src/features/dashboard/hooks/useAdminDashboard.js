import { db } from "@/libs/supabase";
import { useCallback, useEffect, useState } from "react";

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
    const [error, setError] = useState(null);

    const fetchDashboard = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)

            const { data: result, error: rpcError } = await db.rpc('get_admin_dashboard')
            
            if (rpcError) throw rpcError;

            setData({
                ...INITIAL_DATA,
                ...result,
                kpis: {
                    ...INITIAL_DATA.kpis,
                    ...(result?.kpis || {}),
                },
            });

        } catch (err) {
            console.error('Error cargando dashboard:', err);
            setError(err?.message || 'No se pudo cargar el dashboard');    
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchDashboard();
    }, [fetchDashboard]);

    return {
        data,
        loading,
        error,
        refresh: fetchDashboard,
    };

}