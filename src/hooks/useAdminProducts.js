import { db } from '@/libs/supabase';
import { useCallback, useEffect, useState } from 'react';

const INITIAL_DATA = [];

export function useAdminProducts() {

    const [data, setData] = useState(INITIAL_DATA);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProducts = useCallback(async () => {

        try {

            setLoading(true);
            setError(null);

            const {
                data: result,
                error: rpcError
            } = await db.rpc('get_admin_products');

            if (rpcError) {
                throw rpcError;
            }

            setData(
                Array.isArray(result)
                    ? result
                    : result?.products || []
            );

        } catch (err) {

            console.error(
                'Error cargando productos:',
                err
            );

            setError(
                err?.message ||
                'No se pudieron cargar los productos'
            );

            setData([]);

        } finally {

            setLoading(false);

        }

    }, []);

    useEffect(() => {

        fetchProducts();

    }, [fetchProducts]);

    const addProduct = useCallback((product) => {

        setData(prev => [
            product,
            ...prev
        ]);

    }, []);

    const updateProductInState = useCallback(
        (updatedProduct) => {

            setData(prev =>
                prev.map(product =>
                    product.id === updatedProduct.id
                        ? {
                            ...product,
                            ...updatedProduct,
                        }
                        : product
                )
            );

        },
        []
    );

    const removeProduct = useCallback((productId) => {

        setData(prev =>
            prev.filter(
                product => product.id !== productId
            )
        );

    }, []);

    return {
        products: Array.isArray(data)
            ? data
            : [],
        loading,
        error,
        refresh: fetchProducts,
        addProduct,
        updateProductInState,
        removeProduct,
    };
}