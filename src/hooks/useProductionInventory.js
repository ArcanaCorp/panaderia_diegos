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
} from '@/services/production/inventory.service'


export function useProductionInventory() {

    const { profile } = useAuth()

    const [inventory, setInventory] = useState(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState(null)


    const loadInventory = useCallback(async () => {

        if (!profile?.id) {
            setLoading(false)
            return
        }

        try {

            setLoading(true)
            setError(null)

            const data =
                await getProductionInventory(
                    profile.id
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

    }, [profile?.id])


    const registerExit = useCallback(
        async ({
            productId,
            quantity,
            reason,
            notes,
        }) => {

            if (!profile?.id) {
                throw new Error(
                    'No se encontró el usuario.'
                )
            }

            if (!profile?.company_id) {
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
                            profile.company_id,

                        productId,

                        quantity,

                        userId:
                            profile.id,

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
            profile?.id,
            profile?.company_id,
            loadInventory,
        ]
    )


    useEffect(() => {
        loadInventory()
    }, [loadInventory])


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