'use client'

import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { getProductionDashboard, updateProductionOrderStatus } from '@/services/production/dashboard.service'


export function useProductionDashboard() {

    const { profile } = useAuth()

    const [dashboard, setDashboard] = useState(null)

    const [loading, setLoading] = useState(true)

    const [error, setError] = useState(null)

    const [updating, setUpdating] = useState(false)


    const loadDashboard = useCallback(async () => {

        if (!profile?.id) {
            setLoading(false)
            return
        }

        try {

            setLoading(true)
            setError(null)

            const data =
                await getProductionDashboard(
                    profile.id
                )

            setDashboard(data)

        } catch (err) {

            console.error(
                'useProductionDashboard:',
                err
            )

            setError(
                err?.message ||
                'No se pudo cargar producción.'
            )

        } finally {

            setLoading(false)

        }

    }, [profile?.id])


    const changeOrderStatus = useCallback( async (orderId, status) => {

        if (!profile?.id) throw new Error('No se encontró el usuario.')

        try {

            setUpdating(true)
            setError(null)
            await updateProductionOrderStatus(orderId, profile.id, status)
            await loadDashboard()

        } catch (err) {
            console.error('changeOrderStatus:',err)
            setError(err?.message ||'No se pudo actualizar la orden.')
            throw err

        } finally {
            setUpdating(false)
        }

    }, [profile?.id, loadDashboard])


    useEffect(() => {

        loadDashboard()

    }, [loadDashboard])


    return {

        dashboard,

        stats: dashboard?.stats || {
            pending: 0,
            in_production: 0,
            completed_today: 0,
            urgent: 0,
        },

        productionOrders:
            dashboard?.production_orders || [],

        loading,

        updating,

        error,

        reload: loadDashboard,

        changeOrderStatus,

    }
}