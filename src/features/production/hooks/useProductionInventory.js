'use client'

import {
    useCallback,
    useEffect,
    useState,
} from 'react'

import { useAuth } from '@/context/AuthContext'

import {
    getProductionInventory,
    registerInventoryExit,
} from '@/features/production/services/inventory.service'


export function useProductionInventory() {

    const { profile } = useAuth()
    const profileId = profile?.id
    const companyId = profile?.company_id

    const [inventory, setInventory] = useState(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState(null)


    const loadInventory = useCallback(async () => {

        if (!profileId) {
            setLoading(false)
            return
        }

        try {

            setLoading(true)
            setError(null)

            const data =
                await getProductionInventory(
                    profileId
                )

            setInventory(data)

        } catch (err) {

            console.error(
                'useProductionInventory:',
                err
            )

            setError(
                err?.message ||
                'No se pudo cargar el inventario.'
            )

        } finally {

            setLoading(false)

        }

    }, [profileId])


    const registerExit = useCallback(
        async ({
            productId,
            quantity,
            reason,
            notes,
        }) => {

            if (!profileId) {
                throw new Error(
                    'No se encontró el usuario.'
                )
            }

            if (!companyId) {
                throw new Error(
                    'No se encontró la empresa.'
                )
            }

            try {

                setSaving(true)
                setError(null)

                const result =
                    await registerInventoryExit({
                        companyId:
                            companyId,

                        productId,

                        quantity,

                        userId:
                            profileId,

                        reason,

                        notes,
                    })

                await loadInventory()

                return result

            } catch (err) {

                console.error(
                    'registerExit:',
                    err
                )

                setError(
                    err?.message ||
                    'No se pudo registrar la salida.'
                )

                throw err

            } finally {

                setSaving(false)

            }

        },
        [
            profileId,
            companyId,
            loadInventory,
        ]
    )


    useEffect(() => {
        let active = true;
        Promise.resolve().then(() => {
            if (active) loadInventory();
        });
        return () => { active = false; };
    }, [loadInventory]);


    return {

        inventory,

        stats: inventory?.stats || {
            total: 0,
            available: 0,
            low: 0,
            insufficient: 0,
        },

        supplies:
            inventory?.supplies || [],

        loading,

        saving,

        error,

        reload:
            loadInventory,

        registerExit,
    }
}