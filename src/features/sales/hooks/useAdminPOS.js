'use client';

import { db } from '@/libs/supabase';
import { useCallback, useEffect, useRef, useState } from 'react';

const INITIAL_DATA = {
    products: [],
    payment_methods: [],
};

export function usePOS() {
    const [stores, setStores] = useState([]);
    const [selectedStore, setSelectedStore] = useState(null);
    const [data, setData] = useState(INITIAL_DATA);
    const [loadingStores, setLoadingStores] = useState(true);
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [error, setError] = useState(null);

    const storeRequestRef = useRef(0);

    const fetchStores = useCallback(async () => {
        try {
            setLoadingStores(true);
            setError(null);

            const {
                data: companyId,
                error: companyError,
            } = await db.rpc('get_my_company_id');

            if (companyError) throw companyError;
            if (!companyId) {
                throw new Error('No se encontró la empresa del usuario');
            }

            const {
                data: storesData,
                error: storesError,
            } = await db
                .from('stores')
                .select('id, name, code, address, phone, is_main')
                .eq('company_id', companyId)
                .eq('is_active', true)
                .order('is_main', { ascending: false })
                .order('name', { ascending: true });

            if (storesError) throw storesError;

            const availableStores = storesData || [];
            setStores(availableStores);

            if (availableStores.length > 0) {
                const mainStore =
                    availableStores.find((store) => store.is_main) ||
                    availableStores[0];

                setSelectedStore(mainStore);
            } else {
                setSelectedStore(null);
            }
        } catch (err) {
            console.error('Error cargando tiendas:', err);
            setError(err?.message || 'No se pudieron cargar las tiendas');
        } finally {
            setLoadingStores(false);
        }
    }, []);

    const fetchStoreData = useCallback(async (storeId) => {
        const requestId = storeRequestRef.current + 1;
        storeRequestRef.current = requestId;

        if (!storeId) {
            setData(INITIAL_DATA);
            setLoadingProducts(false);
            return;
        }

        setLoadingProducts(true);
        setError(null);

        try {
            const {
                data: result,
                error: rpcError,
            } = await db.rpc('get_pos_data', {
                p_store_id: storeId,
            });

            if (rpcError) throw rpcError;
            if (storeRequestRef.current !== requestId) return;

            setData({
                ...INITIAL_DATA,
                ...result,
                products: result?.products || [],
                payment_methods: result?.payment_methods || [],
            });
        } catch (err) {
            if (storeRequestRef.current !== requestId) return;

            console.error('Error cargando productos del POS:', err);
            // Conserva los últimos datos válidos si falla el cambio o refresco.
            setError(err?.message || 'No se pudieron cargar los productos');
        } finally {
            if (storeRequestRef.current === requestId) {
                setLoadingProducts(false);
            }
        }
    }, []);

    useEffect(() => {
        fetchStores();
    }, [fetchStores]);

    useEffect(() => {
        fetchStoreData(selectedStore?.id);
    }, [selectedStore?.id, fetchStoreData]);

    const refresh = useCallback(() => {
        if (selectedStore?.id) {
            return fetchStoreData(selectedStore.id);
        }
        return Promise.resolve();
    }, [fetchStoreData, selectedStore?.id]);

    return {
        stores,
        selectedStore,
        setSelectedStore,
        products: data.products,
        paymentMethods: data.payment_methods,
        loadingStores,
        loadingProducts,
        error,
        refresh,
    };
}
