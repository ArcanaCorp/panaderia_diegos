'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { getAdminSales } from '@/features/sales/services/admin-sales.service';

export function useAdminSales() {
    const [data, setData] = useState({ day: null, sales: [], stores: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [selectedDay, setSelectedDay] = useState('today');
    const [search, setSearch] = useState('');
    const [storeId, setStoreId] = useState('all');
    const [status, setStatus] = useState('all');

    const loadSales = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const result = await getAdminSales({ day: selectedDay });
            setData(result);
        } catch (err) {
            console.error('useAdminSales:', err);
            setError(err?.message || 'No se pudieron cargar las ventas.');
        } finally {
            setLoading(false);
        }
    }, [selectedDay]);

    useEffect(() => {
        let active = true;

        queueMicrotask(() => {
            if (active) loadSales();
        });

        return () => {
            active = false;
        };
    }, [loadSales]);

    const filteredSales = useMemo(() => {
        const term = search.trim().toLowerCase();

        return data.sales.filter((sale) => {
            const matchesSearch = !term || [
                sale.code,
                sale.sale_number,
                sale.id,
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

    const stats = useMemo(() => {
        const total = filteredSales.reduce((sum, sale) => (
            sum + Number(sale.total ?? sale.total_amount ?? sale.grand_total ?? 0)
        ), 0);

        return {
            count: filteredSales.length,
            total,
            average: filteredSales.length ? total / filteredSales.length : 0,
        };
    }, [filteredSales]);

    const statuses = useMemo(() => (
        [...new Set(data.sales.map((sale) => (
            String(sale.status || sale.payment_status || 'Registrada')
        )))]
    ), [data.sales]);

    return {
        day: data.day,
        selectedDay,
        setSelectedDay,
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