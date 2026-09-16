'use client';

import { useAdminProduction } from '@/hooks/useAdminProduccion';
import {
    IconPlus,
    IconSearch,
    IconFilter,
    IconDotsVertical,
    IconClock,
    IconChefHat,
    IconCheck,
    IconAlertTriangle,
    IconPackage,
} from '@tabler/icons-react';

import { useMemo, useState } from 'react';

export default function ProduccionAdmin() {

    const {
        orders,
        loading,
        error,
        refresh,
    } = useAdminProduction();

    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    /*
     * ============================================================
     * ESTADÍSTICAS
     * ============================================================
     */

    const stats = useMemo(() => {

        const today = new Date();

        const isToday = (date) => {

            if (!date) return false;

            const value = new Date(date);

            return (
                value.getDate() === today.getDate() &&
                value.getMonth() === today.getMonth() &&
                value.getFullYear() === today.getFullYear()
            );

        };

        return {

            pending: orders.filter(
                order => order.status === 'pendiente'
            ).length,

            processing: orders.filter(
                order => order.status === 'proceso'
            ).length,

            completedToday: orders.filter(
                order =>
                    (
                        order.status === 'terminado' ||
                        order.status === 'finalizado'
                    ) &&
                    isToday(
                        order.completed_at ||
                        order.updated_at
                    )
            ).length,

            urgent: orders.filter(
                order =>
                    order.priority === 'urgente' &&
                    order.status !== 'finalizado'
            ).length,

        };

    }, [orders]);


    /*
     * ============================================================
     * FILTRO
     * ============================================================
     */

    const filteredOrders = useMemo(() => {

        const query = search.trim().toLowerCase();

        return orders.filter((order) => {

            const matchesSearch =
                !query ||
                order.code?.toLowerCase().includes(query) ||
                order.items?.some(item =>
                    item.product?.toLowerCase().includes(query) ||
                    item.sku?.toLowerCase().includes(query)
                );

            const matchesStatus =
                statusFilter === 'all' ||
                order.status === statusFilter;

            return matchesSearch && matchesStatus;

        });

    }, [
        orders,
        search,
        statusFilter,
    ]);


    /*
     * ============================================================
     * HELPERS
     * ============================================================
     */

    const formatDate = (date) => {

        if (!date) return '-';

        return new Date(date).toLocaleString('es-PE', {
            day: '2-digit',
            month: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });

    };

    const getStatusLabel = (status) => {

        const labels = {
            pendiente: 'Pendiente',
            proceso: 'En producción',
            terminado: 'Terminado',
            diseño: 'Diseño',
            finalizado: 'Finalizado',
        };

        return labels[status] || status;

    };

    const getPriorityLabel = (priority) => {

        const labels = {
            baja: 'Baja',
            normal: 'Normal',
            alta: 'Alta',
            urgente: 'Urgente',
        };

        return labels[priority] || priority;

    };

    const getPriorityClass = (priority) => {

        if (priority === 'urgente') {
            return 'badge badge--danger';
        }

        if (priority === 'alta') {
            return 'badge badge--warning';
        }

        return 'badge badge--neutral';

    };

    const getStatusClass = (status) => {

        if (
            status === 'terminado' ||
            status === 'finalizado'
        ) {
            return 'badge badge--success';
        }

        if (status === 'proceso') {
            return 'badge badge--info';
        }

        if (status === 'diseño') {
            return 'badge badge--neutral';
        }

        return 'badge badge--warning';

    };


    /*
     * ============================================================
     * LOADING
     * ============================================================
     */

    if (loading) {

        return (
            <main className="production">

                <header className="production__header">

                    <div>

                        <p className="production__eyebrow">
                            Operaciones
                        </p>

                        <h1 className="production__title">
                            Producción
                        </h1>

                        <p className="production__description">
                            Cargando órdenes de producción...
                        </p>

                    </div>

                </header>

            </main>
        );

    }


    return (
        <main className="production">

            {/* ==================================================
                HEADER
            ================================================== */}

            <header className="production__header">

                <div>

                    <p className="production__eyebrow">
                        Operaciones
                    </p>

                    <h1 className="production__title">
                        Producción
                    </h1>

                    <p className="production__description">
                        Gestiona las órdenes y productos que deben fabricarse.
                    </p>

                </div>

                <div className="production__actions">

                    <button
                        className="btn btn--outline"
                        type="button"
                    >
                        <IconFilter size={16} />
                        Filtrar
                    </button>

                    <button
                        className="btn btn--primary"
                        type="button"
                    >
                        <IconPlus size={16} />
                        Nueva orden
                    </button>

                </div>

            </header>


            {/* ==================================================
                ERROR
            ================================================== */}

            {error && (

                <div className="alert alert--danger">
                    {error}
                </div>

            )}


            {/* ==================================================
                SUMMARY
            ================================================== */}

            <section className="production__stats">

                <div className="card production__stat">

                    <div className="production__stat-icon production__stat-icon--warning">
                        <IconClock size={17} />
                    </div>

                    <div>

                        <p className="production__stat-label">
                            Pendientes
                        </p>

                        <strong className="production__stat-value">
                            {stats.pending}
                        </strong>

                    </div>

                </div>


                <div className="card production__stat">

                    <div className="production__stat-icon">
                        <IconChefHat size={17} />
                    </div>

                    <div>

                        <p className="production__stat-label">
                            En producción
                        </p>

                        <strong className="production__stat-value">
                            {stats.processing}
                        </strong>

                    </div>

                </div>


                <div className="card production__stat">

                    <div className="production__stat-icon production__stat-icon--success">
                        <IconCheck size={17} />
                    </div>

                    <div>

                        <p className="production__stat-label">
                            Completadas hoy
                        </p>

                        <strong className="production__stat-value">
                            {stats.completedToday}
                        </strong>

                    </div>

                </div>


                <div className="card production__stat">

                    <div className="production__stat-icon production__stat-icon--danger">
                        <IconAlertTriangle size={17} />
                    </div>

                    <div>

                        <p className="production__stat-label">
                            Urgentes
                        </p>

                        <strong className="production__stat-value">
                            {stats.urgent}
                        </strong>

                    </div>

                </div>

            </section>


            {/* ==================================================
                ORDERS
            ================================================== */}

            <section className="card production__content">

                {/* TOOLBAR */}

                <div className="production__toolbar">

                    <div className="production__search">

                        <div className="input-group input-group--left">

                            <span className="input-group__icon--left">
                                <IconSearch size={17} />
                            </span>

                            <input
                                className="input"
                                placeholder="Buscar orden o producto..."
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                            />

                        </div>

                    </div>


                    <div className="production__filters">

                        <button
                            type="button"
                            className={`btn btn--outline btn--sm ${
                                statusFilter === 'all'
                                    ? 'btn--primary'
                                    : ''
                            }`}
                            onClick={() =>
                                setStatusFilter('all')
                            }
                        >
                            Todas
                        </button>

                        <button
                            type="button"
                            className={`btn btn--outline btn--sm ${
                                statusFilter === 'pendiente'
                                    ? 'btn--primary'
                                    : ''
                            }`}
                            onClick={() =>
                                setStatusFilter('pendiente')
                            }
                        >
                            Pendientes
                        </button>

                        <button
                            type="button"
                            className={`btn btn--outline btn--sm ${
                                statusFilter === 'proceso'
                                    ? 'btn--primary'
                                    : ''
                            }`}
                            onClick={() =>
                                setStatusFilter('proceso')
                            }
                        >
                            En producción
                        </button>

                        <button
                            type="button"
                            className={`btn btn--outline btn--sm ${
                                statusFilter === 'finalizado'
                                    ? 'btn--primary'
                                    : ''
                            }`}
                            onClick={() =>
                                setStatusFilter('finalizado')
                            }
                        >
                            Completadas
                        </button>

                    </div>

                </div>


                {/* TABLE */}

                <div className="production__table-wrapper">

                    <table className="production__table">

                        <thead>

                            <tr>

                                <th>Orden</th>
                                <th>Producto</th>
                                <th>Cantidad</th>
                                <th>Prioridad</th>
                                <th>Solicitado por</th>
                                <th>Fecha</th>
                                <th>Estado</th>
                                <th></th>

                            </tr>

                        </thead>


                        <tbody>

                            {filteredOrders.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="8"
                                        style={{
                                            textAlign: 'center',
                                            padding: '40px',
                                        }}
                                    >
                                        No hay órdenes de producción.
                                    </td>

                                </tr>

                            ) : (

                                filteredOrders.map((order) => {

                                    const firstItem =
                                        order.items?.[0];

                                    const totalItems =
                                        order.items?.length || 0;

                                    const quantity =
                                        order.items?.reduce(
                                            (
                                                total,
                                                item
                                            ) =>
                                                total +
                                                Number(
                                                    item.quantity || 0
                                                ),
                                            0
                                        ) || 0;

                                    return (

                                        <tr key={order.id}>

                                            {/* ORDEN */}

                                            <td>

                                                <span className="production__order-id">
                                                    {order.code || order.id}
                                                </span>

                                            </td>


                                            {/* PRODUCTO */}

                                            <td>

                                                <div className="production__product">

                                                    <div className="production__product-icon">
                                                        <IconPackage size={16} />
                                                    </div>

                                                    <div>

                                                        <p className="production__product-name">
                                                            {firstItem?.product ||
                                                                'Producto'}
                                                        </p>

                                                        {totalItems > 1 && (

                                                            <span className="production__unit">
                                                                + {totalItems - 1} productos
                                                            </span>

                                                        )}

                                                    </div>

                                                </div>

                                            </td>


                                            {/* CANTIDAD */}

                                            <td>

                                                <strong className="production__quantity">
                                                    {quantity}
                                                </strong>

                                                <span className="production__unit">
                                                    {firstItem?.unit_type ||
                                                        'unidades'}
                                                </span>

                                            </td>


                                            {/* PRIORIDAD */}

                                            <td>

                                                <span
                                                    className={getPriorityClass(
                                                        order.priority
                                                    )}
                                                >
                                                    {getPriorityLabel(
                                                        order.priority
                                                    )}
                                                </span>

                                            </td>


                                            {/* SOLICITADO */}

                                            <td>

                                                <span className="production__requested">
                                                    {order.user_id
                                                        ? 'Usuario'
                                                        : '-'}
                                                </span>

                                            </td>


                                            {/* FECHA */}

                                            <td>

                                                <span className="production__date">
                                                    {formatDate(
                                                        order.created_at
                                                    )}
                                                </span>

                                            </td>


                                            {/* ESTADO */}

                                            <td>

                                                <span
                                                    className={getStatusClass(
                                                        order.status
                                                    )}
                                                >
                                                    {getStatusLabel(
                                                        order.status
                                                    )}
                                                </span>

                                            </td>


                                            {/* ACTIONS */}

                                            <td>

                                                <button
                                                    type="button"
                                                    className="btn btn--ghost btn--icon"
                                                >
                                                    <IconDotsVertical
                                                        size={17}
                                                    />
                                                </button>

                                            </td>

                                        </tr>

                                    );

                                })

                            )}

                        </tbody>

                    </table>

                </div>


                {/* FOOTER */}

                <div className="production__footer">

                    <span>
                        Mostrando {filteredOrders.length} órdenes
                    </span>

                    <div className="production__pagination">

                        <button
                            type="button"
                            className="btn btn--outline btn--sm"
                            onClick={refresh}
                        >
                            Actualizar
                        </button>

                    </div>

                </div>

            </section>

        </main>
    );
}