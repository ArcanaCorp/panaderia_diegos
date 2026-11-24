'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { getAdminSales } from '@/features/sales/services/admin-sales.service';

export function useAdminSales() {
    const [data, setData] = useState({ day: null, sales: [], stores: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [search, setSearch] = useState('');
    const [storeId, setStoreId] = useState('all');
    const [status, setStatus] = useState('all');

    const loadSales = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const result = await getAdminSales();
            setData(result);
        } catch (err) {
            console.error('useAdminSales:', err);
            setError(err?.message || 'No se pudieron cargar las ventas de hoy.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        let active = true;
        Promise.resolve().then(() => {
            if (active) loadSales();
        });
        return () => { active = false; };
    }, [loadSales]);

    const filteredSales = useMemo(() => {
        const term = search.trim().toLowerCase();

        return data.sales.filter((sale) => {
            const matchesSearch = !term || [
                sale.code,
                sale.sale_number,
                sale.customer_name,
                sale.customer_dni,
                sale.customer_whatsapp,
            ].some((value) => String(value || '').toLowerCase().includes(term));

            const matchesStore = storeId === 'all' || String(sale.store_id) === storeId;
            const saleStatus = String(sale.status || sale.payment_status || 'Registrada');
            const matchesStatus = status === 'all' || saleStatus === status;

            return matchesSearch && matchesStore && matchesStatus;
        });
    }, [data.sales, search, storeId, status]);

    const stats = useMemo(() => ({
        count: filteredSales.length,
        total: filteredSales.reduce((sum, sale) => (
            sum + Number(sale.total ?? sale.total_amount ?? sale.grand_total ?? 0)
        ), 0),
        average: filteredSales.length
            ? filteredSales.reduce((sum, sale) => (
                sum + Number(sale.total ?? sale.total_amount ?? sale.grand_total ?? 0)
            ), 0) / filteredSales.length
            : 0,
    }), [filteredSales]);

    const statuses = useMemo(() => (
        [...new Set(data.sales.map((sale) => (
            String(sale.status || sale.payment_status || 'Registrada')
        )))]
    ), [data.sales]);

    return {
        day: data.day,
        sales: filteredSales,
        stores: data.stores,
        statuses,
        stats,
        loading,
        error,
        search,
        setSearch,
        storeId,
        setStoreId,
        status,
        setStatus,
        refresh: loadSales,
    };
}
