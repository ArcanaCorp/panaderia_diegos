'use client';

import { useCallback, useEffect, useState } from 'react';

import { useAuth } from '@/context/AuthContext';
import { getSalesPOS } from '@/services/ventas/pos.service';

export function useSalesPOS() {
    const { profile } = useAuth();

    const [pos, setPos] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadPOS = useCallback(async () => {
        if (!profile?.id) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const data = await getSalesPOS(profile.id);

            setPos(data);
        } catch (err) {
            console.error('useSalesPOS:', err);

            setError(
                err?.message ||
                'No se pudo cargar el punto de venta.'
            );
        } finally {
            setLoading(false);
        }
    }, [profile?.id]);

    useEffect(() => {
        loadPOS();
    }, [loadPOS]);

    return {
        pos,
        products: pos?.products || [],
        categories: pos?.categories || [],
        paymentMethods: pos?.payment_methods || [],
        storeId: pos?.store_id || profile?.store_id || null,
        loading,
        error,
        reload: loadPOS,
    };
}