'use client'

import {
    useCallback,
    useEffect,
    useState,
} from 'react'

import { useAuth } from '@/context/AuthContext'

import {
    getWarehouseSuppliers,
    createSupplier,
    updateSupplier,
    toggleSupplierStatus,
} from '@/services/warehouse/suppliers.service'


export function useWarehouseSuppliers() {

    const { profile } = useAuth()

    const [suppliers, setSuppliers] =
        useState([])

    const [stats, setStats] =
        useState({
            total: 0,
            active: 0,
            inactive: 0,
        })

    const [pagination, setPagination] =
        useState({
            page: 1,
            page_size: 10,
            total: 0,
            total_pages: 0,
        })

    const [page, setPage] =
        useState(1)

    const [search, setSearch] =
        useState('')

    const [status, setStatus] =
        useState(null)

    const [loading, setLoading] =
        useState(true)

    const [saving, setSaving] =
        useState(false)

    const [error, setError] =
        useState(null)

    const pageSize = 10


    /*
     * =======================================================
     * CARGAR
     * =======================================================
     */

    const loadSuppliers = useCallback(
        async () => {

            if (!profile?.id) {
                setLoading(false)
                return
            }

            try {

                setLoading(true)
                setError(null)

                const data =
                    await getWarehouseSuppliers({
                        userId: profile.id,
                        page,
                        pageSize,
                        search,
                        status,
                    })

                setSuppliers(
                    data?.suppliers || []
                )

                setStats(
                    data?.stats || {
                        total: 0,
                        active: 0,
                        inactive: 0,
                    }
                )

                setPagination(
                    data?.pagination || {
                        page,
                        page_size: pageSize,
                        total: 0,
                        total_pages: 0,
                    }
                )

            } catch (err) {

                console.error(
                    'useWarehouseSuppliers:',
                    err
                )

                setError(
                    err?.message ||
                    'No se pudieron cargar los proveedores.'
                )

            } finally {

                setLoading(false)

            }

        },
        [
            profile?.id,
            page,
            search,
            status,
        ]
    )


    /*
     * =======================================================
     * EFFECT
     * =======================================================
     */

    useEffect(() => {
        loadSuppliers()
    }, [loadSuppliers])


    /*
     * =======================================================
     * BUSCAR
     * =======================================================
     */

    const changeSearch = useCallback(
        (value) => {

            setSearch(value)
            setPage(1)

        },
        []
    )


    /*
     * =======================================================
     * FILTRO ESTADO
     * =======================================================
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
     * =======================================================
     * CREAR
     * =======================================================
     */

    const addSupplier = useCallback(
        async (form) => {

            if (!profile?.id) {
                throw new Error(
                    'No se encontró el usuario.'
                )
            }

            try {

                setSaving(true)
                setError(null)

                const result =
                    await createSupplier({
                        userId: profile.id,
                        ...form,
                    })

                await loadSuppliers()

                return result

            } catch (err) {

                console.error(
                    'addSupplier:',
                    err
                )

                setError(
                    err?.message ||
                    'No se pudo crear el proveedor.'
                )

                throw err

            } finally {

                setSaving(false)

            }

        },
        [
            profile?.id,
            loadSuppliers,
        ]
    )


    /*
     * =======================================================
     * EDITAR
     * =======================================================
     */

    const editSupplier = useCallback(
        async (supplierId, form) => {

            if (!profile?.id) {
                throw new Error(
                    'No se encontró el usuario.'
                )
            }

            try {

                setSaving(true)
                setError(null)

                const result =
                    await updateSupplier({
                        userId: profile.id,
                        supplierId,
                        ...form,
                    })

                await loadSuppliers()

                return result

            } catch (err) {

                console.error(
                    'editSupplier:',
                    err
                )

                setError(
                    err?.message ||
                    'No se pudo actualizar el proveedor.'
                )

                throw err

            } finally {

                setSaving(false)

            }

        },
        [
            profile?.id,
            loadSuppliers,
        ]
    )


    /*
     * =======================================================
     * ACTIVAR / DESACTIVAR
     * =======================================================
     */

    const changeSupplierStatus =
        useCallback(
            async (
                supplierId,
                isActive
            ) => {

                if (!profile?.id) {
                    throw new Error(
                        'No se encontró el usuario.'
                    )
                }

                try {

                    setSaving(true)
                    setError(null)

                    const result =
                        await toggleSupplierStatus({
                            userId:
                                profile.id,
                            supplierId,
                            isActive,
                        })

                    await loadSuppliers()

                    return result

                } catch (err) {

                    console.error(
                        'changeSupplierStatus:',
                        err
                    )

                    setError(
                        err?.message ||
                        'No se pudo actualizar el estado.'
                    )

                    throw err

                } finally {

                    setSaving(false)

                }

            },
            [
                profile?.id,
                loadSuppliers,
            ]
        )


    /*
     * =======================================================
     * PAGINACIÓN
     * =======================================================
     */

    const nextPage = useCallback(
        () => {

            setPage(current => {

                if (
                    current >=
                    (pagination.total_pages || 0)
                ) {
                    return current
                }

                return current + 1

            })

        },
        [
            pagination.total_pages,
        ]
    )


    const previousPage = useCallback(
        () => {

            setPage(current => {

                if (current <= 1) {
                    return 1
                }

                return current - 1

            })

        },
        []
    )


    return {

        suppliers,

        stats,

        pagination,

        page,

        search,

        status,

        loading,

        saving,

        error,

        setSearch:
            changeSearch,

        setStatus:
            changeStatus,

        addSupplier,

        editSupplier,

        changeSupplierStatus,

        nextPage,

        previousPage,

        reload:
            loadSuppliers,
    }
}