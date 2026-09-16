'use client';

import { useAdminProduction } from '@/hooks/useAdminProduccion';
import { IconPlus, IconSearch, IconClock, IconChefHat, IconCheck, IconAlertTriangle, IconRefresh, IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { useMemo, useState } from 'react';
import { useModal } from '@/context/ModalContext';
import { toast } from 'sonner';
import RowsProduction from '@/components/Table/RowsProduction';

const PAGE_SIZE = 10;

export default function ProduccionAdmin() {

    const { orders, loading, error, refresh } = useAdminProduction();

    const { openModal } = useModal();

    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [refreshing, setRefreshing] = useState(false);


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
     * PAGINACIÓN
     * ============================================================
     */

    const totalPages = Math.max(
        1,
        Math.ceil(filteredOrders.length / PAGE_SIZE)
    );

    const paginatedOrders = useMemo(() => {

        const start = (currentPage - 1) * PAGE_SIZE;

        return filteredOrders.slice(
            start,
            start + PAGE_SIZE
        );

    }, [
        filteredOrders,
        currentPage,
    ]);


    /*
     * ============================================================
     * AJUSTAR PÁGINA
     * ============================================================
     */

    if (
        currentPage > totalPages &&
        totalPages > 0
    ) {
        setCurrentPage(totalPages);
    }


    /*
     * ============================================================
     * HANDLERS
     * ============================================================
     */

    function handleNewOrder() {

        openModal(
            'production-create',
            null,
            {
                onSuccess: () => {
                    refresh();
                    toast.success(
                        'Orden de producción creada'
                    );
                },
            }
        );

    }


    function handleDetail(order) {

        openModal(
            'production-detail',
            order
        );

    }


    async function handleRefresh() {

        try {

            setRefreshing(true);

            await refresh();

            toast.success(
                'Producción actualizada'
            );

        } catch (error) {

            toast.error(
                'No se pudo actualizar la producción'
            );

        } finally {

            setRefreshing(false);

        }

    }


    function handleSearchChange(event) {

        setSearch(event.target.value);
        setCurrentPage(1);

    }


    function handleStatusChange(status) {

        setStatusFilter(status);
        setCurrentPage(1);

    }


    function goToPage(page) {

        if (
            page < 1 ||
            page > totalPages
        ) {
            return;
        }

        setCurrentPage(page);

    }


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

                    {/* ACTUALIZAR */}

                    <button
                        className="btn btn--outline"
                        type="button"
                        onClick={handleRefresh}
                        disabled={refreshing}
                    >

                        <IconRefresh
                            size={16}
                            className={
                                refreshing
                                    ? 'spin'
                                    : ''
                            }
                        />

                        {refreshing
                            ? 'Actualizando...'
                            : 'Actualizar'
                        }

                    </button>


                    {/* NUEVA ORDEN */}

                    <button
                        className="btn btn--primary"
                        type="button"
                        onClick={handleNewOrder}
                    >

                        <IconPlus size={16} />

                        Nueva orden

                    </button>

                </div>

            </header>


            {/* ERROR */}

            {error && (

                <div className="alert alert--danger">
                    {error}
                </div>

            )}


            {/* SUMMARY */}

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


            {/* ORDERS */}

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
                                onChange={handleSearchChange}
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
                                handleStatusChange('all')
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
                                handleStatusChange('pendiente')
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
                                handleStatusChange('proceso')
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
                                handleStatusChange('finalizado')
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

                            {paginatedOrders.length === 0 ? (

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

                                paginatedOrders.map((order) => (
                                    <RowsProduction key={order.id} order={order} handleDetail={handleDetail} />
                                ))

                            )}

                        </tbody>

                    </table>

                </div>


                {/* FOOTER + PAGINATION */}

                <div className="production__footer">

                    <span>

                        {filteredOrders.length === 0
                            ? 'Sin registros'
                            : `Mostrando ${
                                ((currentPage - 1) * PAGE_SIZE) + 1
                            }–${
                                Math.min(
                                    currentPage * PAGE_SIZE,
                                    filteredOrders.length
                                )
                            } de ${
                                filteredOrders.length
                            } órdenes`
                        }

                    </span>


                    <div className="production__pagination">

                        <button
                            type="button"
                            className="btn btn--outline btn--sm"
                            disabled={currentPage === 1}
                            onClick={() =>
                                goToPage(currentPage - 1)
                            }
                        >

                            <IconChevronLeft size={16} />

                            Anterior

                        </button>


                        <span className="production__page-info">

                            Página {currentPage} de {totalPages}

                        </span>


                        <button
                            type="button"
                            className="btn btn--outline btn--sm"
                            disabled={
                                currentPage === totalPages
                            }
                            onClick={() =>
                                goToPage(currentPage + 1)
                            }
                        >

                            Siguiente

                            <IconChevronRight size={16} />

                        </button>

                    </div>

                </div>

            </section>

        </main>
    );
}