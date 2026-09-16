'use client'

import {
    IconPackages,
    IconAlertTriangle,
    IconCircleCheck,
    IconAlertCircle,
    IconSearch,
    IconFilter,
    IconArrowDown,
    IconArrowUp,
    IconArrowsExchange,
    IconChevronLeft,
    IconChevronRight,
} from '@tabler/icons-react'

import { useAuth } from '@/context/AuthContext'

import {
    useWarehouseInventory,
} from '@/hooks/useWarehouseInventory'


export default function InventaryAlmacen() {

    const { profile } = useAuth()


    const {
        products,
        categories,
        stats,
        pagination,
        page,
        search,
        categoryId,
        status,
        loading,
        error,
        setSearch,
        setCategoryId,
        setStatus,
        nextPage,
        previousPage,
    } = useWarehouseInventory()


    const storeName =
        profile?.store?.name ||
        'Almacén Central'


    /*
     * =========================================================
     * STATS
     * =========================================================
     */

    const statsData = [

        {
            label: 'Total productos',
            value: stats.total_products,
            icon: IconPackages,
            modifier: '',
        },

        {
            label: 'Disponibles',
            value: stats.available,
            icon: IconCircleCheck,
            modifier: '',
        },

        {
            label: 'Stock bajo',
            value: stats.low_stock,
            icon: IconAlertTriangle,
            modifier: 'warning',
        },

        {
            label: 'Sin stock',
            value: stats.out_of_stock,
            icon: IconAlertCircle,
            modifier: 'danger',
        },

    ]


    /*
     * =========================================================
     * PAGINACIÓN
     * =========================================================
     */

    const totalPages =
        pagination.total_pages || 0

    const total =
        pagination.total || 0

    const pageSize =
        pagination.page_size || 10


    const firstItem =
        total === 0
            ? 0
            : ((page - 1) * pageSize) + 1


    const lastItem =
        Math.min(
            page * pageSize,
            total
        )


    /*
     * =========================================================
     * LOADING
     * =========================================================
     */

    if (loading && !products.length) {

        return (
            <main className="inventory">

                <header className="inventory__header">

                    <div>

                        <p className="inventory__eyebrow">
                            Almacén · {storeName}
                        </p>

                        <h1 className="inventory__title">
                            Inventario
                        </h1>

                        <p className="inventory__description">
                            Cargando inventario...
                        </p>

                    </div>

                </header>


                <section className="inventory__stats">

                    {[1, 2, 3, 4].map((item) => (

                        <article
                            className="card inventory__stat"
                            key={item}
                        >

                            <div className="inventory__stat-icon">

                                <IconPackages size={17} />

                            </div>

                            <div>

                                <p className="inventory__stat-label">
                                    Cargando
                                </p>

                                <strong className="inventory__stat-value">
                                    —
                                </strong>

                            </div>

                        </article>

                    ))}

                </section>

            </main>
        )
    }


    /*
     * =========================================================
     * ERROR
     * =========================================================
     */

    if (error) {

        return (
            <main className="inventory">

                <header className="inventory__header">

                    <div>

                        <p className="inventory__eyebrow">
                            Almacén · {storeName}
                        </p>

                        <h1 className="inventory__title">
                            Inventario
                        </h1>

                        <p className="inventory__description">
                            No se pudo cargar el inventario.
                        </p>

                    </div>

                    <button
                        className="btn btn--primary"
                        onClick={() => window.location.reload()}
                    >
                        Reintentar
                    </button>

                </header>


                <section className="card">

                    <div className="card__header">

                        <div>

                            <h2 className="card__title">
                                Error
                            </h2>

                            <p className="card__description">
                                {error}
                            </p>

                        </div>

                    </div>

                </section>

            </main>
        )
    }


    return (
        <main className="inventory">

            {/* =================================================
                HEADER
            ================================================= */}

            <header className="inventory__header">

                <div>

                    <p className="inventory__eyebrow">
                        Almacén · {storeName}
                    </p>

                    <h1 className="inventory__title">
                        Inventario
                    </h1>

                    <p className="inventory__description">
                        Controla las existencias y movimientos de tu almacén.
                    </p>

                </div>


                <div className="inventory__actions">

                    <button className="btn btn--outline">

                        <IconArrowUp size={16} />

                        Registrar salida

                    </button>


                    <button className="btn btn--primary">

                        <IconArrowDown size={16} />

                        Registrar ingreso

                    </button>

                </div>

            </header>


            {/* =================================================
                STATS
            ================================================= */}

            <section className="inventory__stats">

                {statsData.map((stat) => {

                    const Icon = stat.icon

                    return (

                        <article
                            className="card inventory__stat"
                            key={stat.label}
                        >

                            <div
                                className={`inventory__stat-icon ${
                                    stat.modifier
                                        ? `inventory__stat-icon--${stat.modifier}`
                                        : ''
                                }`}
                            >

                                <Icon size={17} />

                            </div>


                            <div>

                                <p className="inventory__stat-label">
                                    {stat.label}
                                </p>

                                <strong className="inventory__stat-value">
                                    {stat.value}
                                </strong>

                            </div>

                        </article>

                    )

                })}

            </section>


            {/* =================================================
                INVENTORY
            ================================================= */}

            <section className="card inventory__content">


                {/* =================================================
                    TOOLBAR
                ================================================= */}

                <div className="inventory__toolbar">


                    <div className="inventory__search">

                        <div className="input-group">

                            <IconSearch
                                size={16}
                                className="input-group__icon--left"
                            />


                            <input
                                type="text"
                                className="input"
                                placeholder="Buscar producto, SKU..."
                                value={search}
                                onChange={(event) =>
                                    setSearch(
                                        event.target.value
                                    )
                                }
                            />

                        </div>

                    </div>


                    <div className="inventory__filters">


                        {/* CATEGORÍA */}

                        <select
                            className="btn btn--outline btn--sm"
                            value={categoryId || ''}
                            onChange={(event) =>
                                setCategoryId(
                                    event.target.value
                                )
                            }
                        >

                            <option value="">
                                Todas las categorías
                            </option>

                            {categories.map((category) => (

                                <option
                                    key={category.id}
                                    value={category.id}
                                >
                                    {category.name}
                                </option>

                            ))}

                        </select>


                        {/* ESTADO */}

                        <select
                            className="btn btn--ghost btn--sm"
                            value={status || ''}
                            onChange={(event) =>
                                setStatus(
                                    event.target.value
                                )
                            }
                        >

                            <option value="">
                                Estado
                            </option>

                            <option value="disponible">
                                Disponible
                            </option>

                            <option value="bajo">
                                Bajo
                            </option>

                            <option value="sin_stock">
                                Sin stock
                            </option>

                        </select>


                        <button className="btn btn--ghost btn--sm">

                            <IconFilter size={15} />

                            Filtros

                        </button>

                    </div>

                </div>


                {/* =================================================
                    TABLE
                ================================================= */}

                <div className="inventory__table-wrapper">

                    <table className="inventory__table">

                        <thead>

                            <tr>

                                <th>
                                    Producto
                                </th>

                                <th>
                                    SKU
                                </th>

                                <th>
                                    Categoría
                                </th>

                                <th>
                                    Stock
                                </th>

                                <th>
                                    Mínimo
                                </th>

                                <th>
                                    Estado
                                </th>

                                <th>
                                    Acciones
                                </th>

                            </tr>

                        </thead>


                        <tbody>


                            {products.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="7"
                                        style={{
                                            textAlign: 'center',
                                            padding: '40px 20px',
                                        }}
                                    >

                                        <IconPackages
                                            size={28}
                                        />

                                        <p>
                                            No se encontraron productos.
                                        </p>

                                    </td>

                                </tr>

                            ) : (

                                products.map((product) => (

                                    <tr
                                        key={product.id}
                                    >


                                        {/* PRODUCTO */}

                                        <td>

                                            <div className="inventory__product">

                                                <div className="inventory__product-icon">

                                                    <IconPackages
                                                        size={16}
                                                    />

                                                </div>


                                                <div>

                                                    <p className="inventory__product-name">
                                                        {product.name}
                                                    </p>

                                                    <span className="inventory__product-unit">
                                                        {product.unit}
                                                    </span>

                                                </div>

                                            </div>

                                        </td>


                                        {/* SKU */}

                                        <td>

                                            <span className="inventory__sku">
                                                {product.sku}
                                            </span>

                                        </td>


                                        {/* CATEGORY */}

                                        <td>

                                            <span className="inventory__category">
                                                {product.category}
                                            </span>

                                        </td>


                                        {/* STOCK */}

                                        <td>

                                            <strong className="inventory__stock">

                                                {product.stock}

                                                {' '}

                                                {product.unit}

                                            </strong>

                                        </td>


                                        {/* MINIMUM */}

                                        <td>

                                            <span className="inventory__minimum">

                                                {product.minimum}

                                                {' '}

                                                {product.unit}

                                            </span>

                                        </td>


                                        {/* STATUS */}

                                        <td>

                                            <span
                                                className={`badge ${
                                                    product.status === 'Disponible'
                                                        ? 'badge--success'
                                                        : product.status === 'Bajo'
                                                            ? 'badge--warning'
                                                            : 'badge--danger'
                                                }`}
                                            >
                                                {product.status}
                                            </span>

                                        </td>


                                        {/* ACTIONS */}

                                        <td>

                                            <div className="inventory__actions">


                                                <button
                                                    className="btn btn--icon btn--ghost btn--sm"
                                                    title="Registrar ingreso"
                                                >

                                                    <IconArrowDown
                                                        size={15}
                                                    />

                                                </button>


                                                <button
                                                    className="btn btn--icon btn--ghost btn--sm"
                                                    title="Registrar salida"
                                                >

                                                    <IconArrowUp
                                                        size={15}
                                                    />

                                                </button>


                                                <button
                                                    className="btn btn--icon btn--ghost btn--sm"
                                                    title="Transferir"
                                                >

                                                    <IconArrowsExchange
                                                        size={15}
                                                    />

                                                </button>


                                            </div>

                                        </td>

                                    </tr>

                                ))

                            )}

                        </tbody>

                    </table>

                </div>


                {/* =================================================
                    FOOTER
                ================================================= */}

                <footer className="inventory__footer">

                    <span>

                        Mostrando{' '}

                        {firstItem}

                        {' '}–{' '}

                        {lastItem}

                        {' '}de{' '}

                        {total}

                        {' '}productos

                    </span>


                    <div className="inventory__pagination">


                        {/* PREVIOUS */}

                        <button
                            className="btn btn--icon btn--ghost btn--sm"
                            onClick={previousPage}
                            disabled={
                                page <= 1 ||
                                loading
                            }
                        >

                            <IconChevronLeft
                                size={16}
                            />

                        </button>


                        {/* PAGE */}

                        {totalPages > 0 && (

                            <button
                                className="btn btn--primary btn--sm"
                            >
                                {page}
                            </button>

                        )}


                        {/* NEXT */}

                        <button
                            className="btn btn--icon btn--ghost btn--sm"
                            onClick={nextPage}
                            disabled={
                                page >= totalPages ||
                                loading
                            }
                        >

                            <IconChevronRight
                                size={16}
                            />

                        </button>

                    </div>

                </footer>

            </section>

        </main>
    )
}