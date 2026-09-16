'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getStoreShowcase, transferProductsBetweenStores } from '@/services/ventas/showcase.service';

export function useShowcase() {
    const { profile } = useAuth();

    const [showcase, setShowcase] = useState(null);
    const [loading, setLoading] = useState(true);
    const [transferring, setTransferring] = useState(false);
    const [error, setError] = useState(null);

    const loadShowcase = useCallback(async () => {
        if (!profile?.id) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const data = await getStoreShowcase(
                profile.id
            );

            setShowcase(data);
        } catch (err) {
            console.error('useShowcase:', err);

            setError(
                err?.message ||
                    'No se pudo cargar la vitrina.'
            );
        } finally {
            setLoading(false);
        }
    }, [profile?.id]);

    useEffect(() => {
        loadShowcase();
    }, [loadShowcase]);

    async function transfer({
        destinationStoreId,
        items,
        notes,
    }) {
        if (!profile?.company_id) {
            throw new Error(
                'No se encontró la empresa.'
            );
        }

        if (!profile?.store_id) {
            throw new Error(
                'No tienes una tienda asignada.'
            );
        }

        try {
            setTransferring(true);

            const result =
                await transferProductsBetweenStores({
                    companyId: profile.company_id,
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

    return {
        showcase,
        store: showcase?.store || null,
        products: showcase?.products || [],
        categories: showcase?.categories || [],
        stores: showcase?.stores || [],
        loading,
        transferring,
        error,
        reload: loadShowcase,
        transfer,
    };
}