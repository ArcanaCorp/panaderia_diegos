'use client'

import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { getWarehouseInventory } from '@/services/warehouse/warehouse.service'


export function useWarehouseInventory() {

    const { profile } = useAuth()


    const [inventory, setInventory] =
        useState(null)

    const [loading, setLoading] =
        useState(true)

    const [error, setError] =
        useState(null)


    const [page, setPage] =
        useState(1)

    const pageSize = 10


    const [search, setSearch] =
        useState('')

    const [categoryId, setCategoryId] =
        useState(null)

    const [status, setStatus] =
        useState(null)


    const loadInventory = useCallback(
        async () => {

            if (!profile?.id) {

                setLoading(false)

                return
            }


            try {

                setLoading(true)
                setError(null)


                const data =
                    await getWarehouseInventory({

                        userId:
                            profile.id,

                        page,

                        pageSize,

                        search,

                        categoryId,

                        status,

                    })


                setInventory(data)

            } catch (err) {

                console.error(
                    'useWarehouseInventory:',
                    err
                )

                setError(
                    err?.message ||
                    'No se pudo cargar el inventario.'
                )

            } finally {

                setLoading(false)

            }

        },
        [
            profile?.id,
            page,
            search,
            categoryId,
            status,
        ]
    )


    useEffect(() => {

        loadInventory()

    }, [loadInventory])


    /*
     * =========================================================
     * BÚSQUEDA
     * =========================================================
     */

    const changeSearch = useCallback(
        (value) => {

            setSearch(value)

            setPage(1)

        },
        []
    )


    /*
     * =========================================================
     * CATEGORÍA
     * =========================================================
     */

    const changeCategory = useCallback(
        (value) => {

            setCategoryId(
                value || null
            )

            setPage(1)

        },
        []
    )


    /*
     * =========================================================
     * ESTADO
     * =========================================================
     */

    const changeStatus = useCallback(
        (value) => {

            setStatus(
                value || null
            )

            setPage(1)

        },
        []
    )


    /*
     * =========================================================
     * PAGINACIÓN
     * =========================================================
     */

    const nextPage = useCallback(() => {

        const totalPages =
            inventory?.pagination?.total_pages || 0

        setPage((current) => {

            if (current >= totalPages) {
                return current
            }

            return current + 1

        })

    }, [inventory])


    const previousPage = useCallback(() => {

        setPage((current) => {

            if (current <= 1) {
                return 1
            }

            return current - 1

        })

    }, [])


    return {

        inventory,

        products:
            inventory?.products || [],

        categories:
            inventory?.categories || [],

        stats:
            inventory?.stats || {
                total_products: 0,
                available: 0,
                low_stock: 0,
                out_of_stock: 0,
            },

        pagination:
            inventory?.pagination || {
                page: 1,
                page_size: pageSize,
                total: 0,
                total_pages: 0,
            },

        page,

        search,

        categoryId,

        status,

        loading,

        error,

        setSearch:
            changeSearch,

        setCategoryId:
            changeCategory,

        setStatus:
            changeStatus,

        nextPage,

        previousPage,

        reload:
            loadInventory,

    }
}