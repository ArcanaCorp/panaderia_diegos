'use client';

import { useMemo, useState } from 'react';
import {
    IconPackage,
    IconAlertTriangle,
    IconX,
    IconRefresh,
} from '@tabler/icons-react';

import { useAdminInventory } from '@/hooks/useAdminInventory';

export default function InventoryAdmin() {

    const {
        purchases,
        purchaseItems,
        lots,
        movements,
        loading,
        error,
        refresh,
    } = useAdminInventory();

    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('all');

    /*
     * ============================================================
     * INVENTARIO ACTUAL
     * ============================================================
     *
     * Los lotes son la fuente del stock.
     *
     * Agrupamos por product_id porque un ingrediente
     * puede tener varios lotes.
     */

    const inventory = useMemo(() => {

        const map = new Map();

        lots.forEach((lot) => {

            if (!lot.product_id) return;

            if (!map.has(lot.product_id)) {

                map.set(lot.product_id, {
                    product_id: lot.product_id,
                    name: lot.name || 'Ingrediente sin nombre',
                    sku: lot.sku || '-',
                    unit_type: lot.unit_type || 'unidad',
                    category: lot.category || 'Sin categoría',
                    stock: 0,
                    lot_count: 0,
                    expiration_dates: [],
                });

            }

            const item = map.get(lot.product_id);

            item.stock += Number(
                lot.quantity_remaining || 0
            );

            item.lot_count += 1;

            if (lot.expiration_date) {
                item.expiration_dates.push(
                    lot.expiration_date
                );
            }

        });

        return Array.from(map.values());

    }, [lots]);

    /*
     * ============================================================
     * FILTROS
     * ============================================================
     */

    const categories = useMemo(() => {

        return [
            ...new Set(
                inventory
                    .map(item => item.category)
                    .filter(Boolean)
            ),
        ].sort();

    }, [inventory]);

    const filteredInventory = useMemo(() => {

        const query = search.trim().toLowerCase();

        return inventory.filter((item) => {

            const matchesSearch =
                !query ||
                item.name.toLowerCase().includes(query) ||
                item.sku.toLowerCase().includes(query);

            const matchesCategory =
                category === 'all' ||
                item.category === category;

            return matchesSearch && matchesCategory;

        });

    }, [
        inventory,
        search,
        category,
    ]);

    /*
     * ============================================================
     * ESTADÍSTICAS
     * ============================================================
     */

    const stats = useMemo(() => {

        const total = inventory.length;

        const lowStock = inventory.filter(
            item => item.stock > 0 && item.stock <= 5
        ).length;

        const noStock = inventory.filter(
            item => item.stock <= 0
        ).length;

        const totalPurchases = purchases.reduce(
            (sum, purchase) =>
                sum + Number(purchase.total || 0),
            0
        );

        return {
            total,
            lowStock,
            noStock,
            totalPurchases,
        };

    }, [
        inventory,
        purchases,
    ]);

    /*
     * ============================================================
     * HELPERS
     * ============================================================
     */

    const formatCurrency = (value) => {

        return new Intl.NumberFormat('es-PE', {
            style: 'currency',
            currency: 'PEN',
        }).format(Number(value || 0));

    };

    const getStockClass = (stock) => {

        if (stock <= 0) {
            return 'inventory__stock inventory__stock--danger';
        }

        if (stock <= 5) {
            return 'inventory__stock inventory__stock--warning';
        }

        return 'inventory__stock';

    };

    if (loading) {

        return (
            <main className="inventory">

                <div className="inventory__header">

                    <div>
                        <p className="inventory__eyebrow">
                            Almacén
                        </p>

                        <h1 className="inventory__title">
                            Inventario
                        </h1>

                        <p className="inventory__description">
                            Cargando ingredientes...
                        </p>
                    </div>

                </div>

            </main>
        );

    }

    return (
        <main className="inventory">

            {/* ==================================================
                HEADER
            ================================================== */}

            <header className="inventory__header">

                <div>

                    <p className="inventory__eyebrow">
                        Almacén
                    </p>

                    <h1 className="inventory__title">
                        Inventario
                    </h1>

                    <p className="inventory__description">
                        Control de materias primas e ingredientes.
                    </p>

                </div>

                <div className="inventory__actions">

                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={refresh}
                        disabled={loading}
                    >
                        <IconRefresh size={16} />

                        Actualizar
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
                STATS
            ================================================== */}

            <section className="inventory__stats">

                <div className="card inventory__stat">

                    <div className="inventory__stat-icon">
                        <IconPackage size={18} />
                    </div>

                    <div>

                        <p className="inventory__stat-label">
                            Ingredientes
                        </p>

                        <strong className="inventory__stat-value">
                            {stats.total}
                        </strong>

                    </div>

                </div>


                <div className="card inventory__stat">

                    <div className="inventory__stat-icon inventory__stat-icon--warning">
                        <IconAlertTriangle size={18} />
                    </div>

                    <div>

                        <p className="inventory__stat-label">
                            Stock bajo
                        </p>

                        <strong className="inventory__stat-value">
                            {stats.lowStock}
                        </strong>

                    </div>

                </div>


                <div className="card inventory__stat">

                    <div className="inventory__stat-icon inventory__stat-icon--danger">
                        <IconX size={18} />
                    </div>

                    <div>

                        <p className="inventory__stat-label">
                            Sin stock
                        </p>

                        <strong className="inventory__stat-value">
                            {stats.noStock}
                        </strong>

                    </div>

                </div>


                <div className="card inventory__stat">

                    <div className="inventory__stat-icon">
                        <IconPackage size={18} />
                    </div>

                    <div>

                        <p className="inventory__stat-label">
                            Compras registradas
                        </p>

                        <strong className="inventory__stat-value">
                            {formatCurrency(stats.totalPurchases)}
                        </strong>

                    </div>

                </div>

            </section>


            {/* ==================================================
                CONTENT
            ================================================== */}

            <section className="card inventory__content">

                {/* TOOLBAR */}

                <div className="inventory__toolbar">

                    <input
                        type="search"
                        className="input inventory__search"
                        placeholder="Buscar ingrediente o SKU..."
                        value={search}
                        onChange={(event) =>
                            setSearch(event.target.value)
                        }
                    />

                    <div className="inventory__filters">

                        <button
                            type="button"
                            className={
                                category === 'all'
                                    ? 'btn btn-primary'
                                    : 'btn btn-secondary'
                            }
                            onClick={() => setCategory('all')}
                        >
                            Todos
                        </button>

                        {categories.map((item) => (

                            <button
                                key={item}
                                type="button"
                                className={
                                    category === item
                                        ? 'btn btn-primary'
                                        : 'btn btn-secondary'
                                }
                                onClick={() =>
                                    setCategory(item)
                                }
                            >
                                {item}
                            </button>

                        ))}

                    </div>

                </div>


                {/* TABLE */}

                <div className="inventory__table-wrapper">

                    <table className="inventory__table">

                        <thead>

                            <tr>

                                <th>
                                    Ingrediente
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
                                    Lotes
                                </th>

                                <th>
                                    Estado
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {filteredInventory.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="6"
                                        style={{
                                            textAlign: 'center',
                                            padding: '40px',
                                        }}
                                    >
                                        No se encontraron ingredientes.
                                    </td>

                                </tr>

                            ) : (

                                filteredInventory.map((item) => {

                                    const stock =
                                        Number(item.stock || 0);

                                    return (

                                        <tr key={item.product_id}>

                                            {/* INGREDIENTE */}

                                            <td>

                                                <div className="inventory__product">

                                                    <div className="inventory__product-icon">
                                                        <IconPackage size={16} />
                                                    </div>

                                                    <div>

                                                        <p className="inventory__product-name">
                                                            {item.name}
                                                        </p>

                                                        <span className="inventory__product-unit">
                                                            {item.unit_type}
                                                        </span>

                                                    </div>

                                                </div>

                                            </td>


                                            {/* SKU */}

                                            <td>

                                                <span className="inventory__sku">
                                                    {item.sku}
                                                </span>

                                            </td>


                                            {/* CATEGORÍA */}

                                            <td>

                                                <span className="inventory__category">
                                                    {item.category}
                                                </span>

                                            </td>


                                            {/* STOCK */}

                                            <td>

                                                <strong
                                                    className={
                                                        getStockClass(
                                                            stock
                                                        )
                                                    }
                                                >
                                                    {stock}
                                                </strong>

                                                <span className="inventory__minimum">
                                                    {' '}{item.unit_type}
                                                </span>

                                            </td>


                                            {/* LOTES */}

                                            <td>

                                                <span className="inventory__stock">
                                                    {item.lot_count}
                                                </span>

                                            </td>


                                            {/* ESTADO */}

                                            <td>

                                                {stock <= 0 ? (

                                                    <span className="badge badge--danger">
                                                        Sin stock
                                                    </span>

                                                ) : stock <= 5 ? (

                                                    <span className="badge badge--warning">
                                                        Stock bajo
                                                    </span>

                                                ) : (

                                                    <span className="badge badge--success">
                                                        Disponible
                                                    </span>

                                                )}

                                            </td>

                                        </tr>

                                    );

                                })

                            )}

                        </tbody>

                    </table>

                </div>


                {/* FOOTER */}

                <footer className="inventory__footer">

                    <span>
                        Mostrando {filteredInventory.length} de {inventory.length} ingredientes
                    </span>

                    <span>
                        {movements.length} movimientos registrados
                    </span>

                </footer>

            </section>

        </main>
    );
}