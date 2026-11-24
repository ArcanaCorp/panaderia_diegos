'use client'

import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { getWarehouseDashboard } from '@/features/dashboard/services/warehouse-dashboard.service'

export function useWarehouseDashboard() {

    const { profile } = useAuth()
    const profileId = profile?.id
    const companyId = profile?.company_id
    const [dashboard, setDashboard] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)


    const loadDashboard = useCallback(
        async () => {

            if (!profileId) {

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
        [profileId]
    )


    useEffect(() => {
        let active = true;
        Promise.resolve().then(() => {
            if (active) loadDashboard();
        });
        return () => { active = false; };
    }, [loadDashboard]);


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