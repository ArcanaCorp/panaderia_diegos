import { db } from '@/libs/supabase';
import { useCallback, useEffect, useState } from 'react';

const INITIAL_DATA = {
    products: [],
};

export function useAdminProducts() {

    const [data, setData] = useState(INITIAL_DATA);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    const fetchProducts = useCallback(async () => {

        try {

            setLoading(true);
            setError(null);

            const { data: result, error: rpcError } = await db.rpc('get_admin_products');

            if (rpcError) {
                throw rpcError;
            }

            setData({
                ...INITIAL_DATA,
                ...result,
                products: result?.products || [],
            });

        } catch (err) {

            console.error(
                'Error cargando productos:',
                err
            );

            setError(
                err?.message ||
                'No se pudieron cargar los productos'
            );

        } finally {

            setLoading(false);

        }

    }, []);


    useEffect(() => {

        fetchProducts();

    }, [fetchProducts]);


    return {
        products: data.products,
        loading,
        error,
        refresh: fetchProducts,
    };
}