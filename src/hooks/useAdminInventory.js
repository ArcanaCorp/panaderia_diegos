'use client';

import { db } from '@/libs/supabase';
import { useCallback, useEffect, useState } from 'react';

const INITIAL_DATA = {
    purchases: [],
    purchase_items: [],
    lots: [],
    movements: [],
    movement_lots: [],
};

export function useAdminInventory() {

    const [data, setData] = useState(INITIAL_DATA);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchInventory = useCallback(async () => {

        try {

            setLoading(true);
            setError(null);

            const {
                data: result,
                error: rpcError,
            } = await db.rpc('get_admin_inventory');

            if (rpcError) {
                throw rpcError;
            }

            console.log('Inventory:', result);

            setData({
                purchases: Array.isArray(result?.purchases)
                    ? result.purchases
                    : [],

                purchase_items: Array.isArray(result?.purchase_items)
                    ? result.purchase_items
                    : [],

                lots: Array.isArray(result?.lots)
                    ? result.lots
                    : [],

                movements: Array.isArray(result?.movements)
                    ? result.movements
                    : [],

                movement_lots: Array.isArray(result?.movement_lots)
                    ? result.movement_lots
                    : [],
            });

        } catch (err) {

            console.error(
                'Error cargando inventario:',
                err
            );

            setError(
                err?.message ||
                'No se pudo cargar el inventario'
            );

            setData(INITIAL_DATA);

        } finally {

            setLoading(false);

        }

    }, []);

    useEffect(() => {
        fetchInventory();
    }, [fetchInventory]);

    return {
        purchases: data.purchases,
        purchaseItems: data.purchase_items,
        lots: data.lots,
        movements: data.movements,
        movementLots: data.movement_lots,

        loading,
        error,

        refresh: fetchInventory,
    };
}