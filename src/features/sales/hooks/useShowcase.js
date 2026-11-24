
'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';

import {
    getCatalogProducts,
    getStoreShowcase,
    transferProductsBetweenStores,
    addProductsToStore
} from '@/features/sales/services/showcase.service';

export function useShowcase() {
    const { profile } = useAuth();
    const profileId = profile?.id;
    const companyId = profile?.company_id;

    const [showcase, setShowcase] = useState(null);
    const [catalog, setCatalog] = useState([]);

    const [loading, setLoading] = useState(true);
    const [transferring, setTransferring] = useState(false);
    const [addingProducts, setAddingProducts] = useState(false);

    const [error, setError] = useState(null);

    const loadShowcase = useCallback(async () => {
        if (!profileId) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const data = await getStoreShowcase(profile.id);
            const prod = await getCatalogProducts(companyId);

            setShowcase(data);
            setCatalog(prod || []);

        } catch (err) {
            console.error('useShowcase:', err);

            setError(
                err?.message ||
                'No se pudo cargar la vitrina.'
            );
        } finally {
            setLoading(false);
        }
    }, [profileId, companyId]);

    useEffect(() => {
        let active = true;
        Promise.resolve().then(() => {
            if (active) loadShowcase();
        });
        return () => { active = false; };
    }, [loadShowcase]);

    // TRANSFERIR PRODUCTOS
    async function transfer({ destinationStoreId, items, notes }) {
        if (!companyId) {
            throw new Error('No se encontró la empresa.');
        }

        if (!profile?.store_id) {
            throw new Error('No tienes una tienda asignada.');
        }

        try {
            setTransferring(true);

            const result = await transferProductsBetweenStores({
                companyId: companyId,
                sourceStoreId: profile.store_id,
                destinationStoreId,
                createdBy: profile.id,
                items,
                notes,
            });

            await loadShowcase();

            return result;

        } finally {
            setTransferring(false);
        }
    }

    // AGREGAR MÚLTIPLES PRODUCTOS A LA TIENDA
    async function addProducts(items) {
        if (!companyId) {
            throw new Error('No se encontró la empresa.');
        }

        if (!profile?.store_id) {
            throw new Error('No tienes una tienda asignada.');
        }

        if (!items?.length) {
            throw new Error('Selecciona al menos un producto.');
        }

        try {
            setAddingProducts(true);

            const result = await addProductsToStore({
                companyId: companyId,
                storeId: profile.store_id,
                items,
            });

            await loadShowcase();

            return result;

        } finally {
            setAddingProducts(false);
        }
    }

    return {
        showcase,
        catalog,

        store: showcase?.store || null,
        products: showcase?.products || [],
        categories: showcase?.categories || [],
        stores: showcase?.stores || [],

        loading,
        transferring,
        addingProducts,
        error,

        reload: loadShowcase,
        transfer,
        addProducts,
    };
}