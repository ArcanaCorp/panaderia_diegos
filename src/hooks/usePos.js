'use client';

import { db } from '@/libs/supabase';
import { useCallback, useEffect, useState } from 'react';

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

    // --------------------------------
    // Cargar tiendas
    // --------------------------------

    const fetchStores = useCallback(async () => {

        try {

            setLoadingStores(true);
            setError(null);

            const {
                data: companyId,
                error: companyError
            } = await db.rpc('get_my_company_id');

            if (companyError) {
                throw companyError;
            }

            if (!companyId) {
                throw new Error('No se encontró la empresa del usuario');
            }

            const {
                data: storesData,
                error: storesError
            } = await db
                .from('stores')
                .select(`
                    id,
                    name,
                    code,
                    address,
                    phone,
                    is_main
                `)
                .eq('company_id', companyId)
                .eq('is_active', true)
                .order('is_main', {
                    ascending: false
                })
                .order('name', {
                    ascending: true
                });

            if (storesError) {
                throw storesError;
            }

            setStores(storesData || []);

            // Seleccionar automáticamente la principal
            if (storesData?.length > 0) {

                const mainStore =
                    storesData.find(store => store.is_main) ||
                    storesData[0];

                setSelectedStore(mainStore);
            }

        } catch (err) {

            console.error('Error cargando tiendas:', err);

            setError(
                err?.message ||
                'No se pudieron cargar las tiendas'
            );

        } finally {

            setLoadingStores(false);

        }

    }, []);

    // --------------------------------
    // Cargar productos de la tienda
    // --------------------------------

    const fetchStoreData = useCallback(async (storeId) => {

        if (!storeId) {
            setData(INITIAL_DATA);
            return;
        }

        try {

            setLoadingProducts(true);
            setError(null);

            const {
                data: result,
                error: rpcError
            } = await db.rpc(
                'get_pos_data',
                {
                    p_store_id: storeId
                }
            );

            if (rpcError) {
                throw rpcError;
            }

            setData({
                ...INITIAL_DATA,
                ...result,
                products: result?.products || [],
                payment_methods: result?.payment_methods || [],
            });

        } catch (err) {

            console.error(
                'Error cargando productos del POS:',
                err
            );

            setData(INITIAL_DATA);

            setError(
                err?.message ||
                'No se pudieron cargar los productos'
            );

        } finally {

            setLoadingProducts(false);

        }

    }, []);

    // --------------------------------
    // Inicializar
    // --------------------------------

    useEffect(() => {
        fetchStores();
    }, [fetchStores]);

    // --------------------------------
    // Cambiar tienda
    // --------------------------------

    useEffect(() => {

        if (!selectedStore?.id) {
            setData(INITIAL_DATA);
            return;
        }

        fetchStoreData(selectedStore.id);

    }, [selectedStore, fetchStoreData]);

    return {

        stores,

        selectedStore,

        setSelectedStore,

        products: data.products,

        paymentMethods: data.payment_methods,

        loadingStores,

        loadingProducts,

        error,

        refresh: () => {
            if (selectedStore?.id) {
                fetchStoreData(selectedStore.id);
            }
        },

    };
}