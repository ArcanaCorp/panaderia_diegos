'use client'

import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { getWarehouseDashboard } from '@/services/warehouse/warehouse.service'

export function useWarehouseDashboard() {

    const { profile } = useAuth()
    const [dashboard, setDashboard] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)


    const loadDashboard = useCallback(
        async () => {

            if (!profile?.id) {

                setLoading(false)

                return
            }

            try {

                setLoading(true)
                setError(null)

                const data =
                    await getWarehouseDashboard(
                        profile.id
                    )

                setDashboard(data)

            } catch (err) {

                console.error(
                    'useWarehouseDashboard:',
                    err
                )

                setError(
                    err?.message ||
                    'No se pudo cargar el dashboard.'
                )

            } finally {

                setLoading(false)

            }

        },
        [profile?.id]
    )


    useEffect(() => {

        loadDashboard()

    }, [loadDashboard])


    return {

        dashboard,

        stats:
            dashboard?.stats || {
                products_in_stock: 0,
                entries_today: 0,
                exits_today: 0,
                low_stock: 0,
            },

        movements:
            dashboard?.movements || [],

        lowStockProducts:
            dashboard?.low_stock_products || [],

        loading,

        error,

        reload:
            loadDashboard,

    }
}