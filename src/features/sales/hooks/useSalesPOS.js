'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { useAuth } from '@/context/AuthContext';
import { getSalesPOS } from '@/features/sales/services/sales-pos.service';

export function useSalesPOS() {
    const { profile } = useAuth();

    const [pos, setPos] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);

    const requestRef = useRef(0);

    const loadPOS = useCallback(async () => {
        const userId = profile?.id;
        const requestId = requestRef.current + 1;
        requestRef.current = requestId;

        if (!userId) {
            setPos(null);
            setLoading(false);
            setRefreshing(false);
            setError(null);
            return;
        }

        const isInitialLoad = pos === null;

        if (isInitialLoad) {
            setLoading(true);
        } else {
            setRefreshing(true);
        }

        setError(null);

        try {
            const data = await getSalesPOS(userId);

            if (requestRef.current !== requestId) return;
            setPos(data);
        } catch (err) {
            if (requestRef.current !== requestId) return;

            console.error('useSalesPOS:', err);
            setError(
                err?.message || 'No se pudo cargar el punto de venta.'
            );
        } finally {
            if (requestRef.current === requestId) {
                setLoading(false);
                setRefreshing(false);
            }
        }
    }, [profile?.id, pos]);

    useEffect(() => {
        loadPOS();

        return () => {
            requestRef.current += 1;
        };
    }, [loadPOS]);

    return {
        pos,
        products: pos?.products || [],
        categories: pos?.categories || [],
        paymentMethods: pos?.payment_methods || [],
        storeId: pos?.store_id || profile?.store_id || null,
        loading,
        refreshing,
        error,
        reload: loadPOS,
    };
}
