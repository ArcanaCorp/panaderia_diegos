'use client';

import { useMemo, useState } from 'react';

import { IconPackage, IconSearch, IconFilter, IconEye, IconTransfer, IconX, IconPlus, IconMinus, IconAlertTriangle, IconRefresh } from '@tabler/icons-react';

import { useShowcase } from '@/hooks/useShowcase';
import { toast } from 'sonner';
import TransferProducts from '@/components/Modal/TransferProducts';
import AddProductsModal from '@/components/Modal/AddProductsModal';

export default function ShowcasesView() {

    const {
        store,
        catalog,
        products,
        categories: dbCategories,
        stores,
        loading,
        transferring,
        addingProducts,
        error,
        reload,
        transfer,
        addProducts
    } = useShowcase();

    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('Todas');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showTransferModal, setShowTransferModal] = useState(false);

    const categories = useMemo(() => {
        return [
            'Todas',
            ...dbCategories.map(
                (item) => item.name
            ),
        ];
    }, [dbCategories]);

    const filteredProducts = useMemo(() => {

        const value = search
            .trim()
            .toLowerCase();

        return products.filter((product) => {

            const matchesSearch =
                !value ||
                product.name
                    ?.toLowerCase()
                    .includes(value) ||
                product.sku
                    ?.toLowerCase()
                    .includes(value);

            const matchesCategory =
                category === 'Todas' ||
                product.category === category;

            return (
                matchesSearch &&
                matchesCategory
            );
        });

    }, [products, search, category]);

    const totalProducts = products.length;

    const availableProducts = products.filter((product) => Number(product.stock || 0) > 0).length;

    const lowStockProducts =
        products.filter(
            (product) =>
                Number(product.stock || 0) > 0 &&
                Number(product.stock || 0) <=
                    Number(product.minimum_stock || 0)
        ).length;

    const outOfStockProducts =
        products.filter(
            (product) =>
                Number(product.stock || 0) <= 0
        ).length;

    function openTransferModal() {
        setShowTransferModal(true);
    }

    function closeTransferModal() {
        if (transferring) return;
        setShowTransferModal(false);
    }

    if (loading) {
        return (
            <div className="products">
                <div className="products__state">
                    <IconRefresh size={24} />

                    <strong>
                        Cargando productos...
                    </strong>

                    <span>
                        Estamos cargando la vitrina de tu tienda.
                    </span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="products">
                <div className="products__state products__state--error">
                    <IconAlertTriangle size={24}/>
                    <strong>No se pudo cargar la vitrina</strong>
                    <span>{error}</span>
                    <button className="btn btn--outline" onClick={reload}><IconRefresh size={16}/> Reintentar</button>
                </div>
            </div>
        );
    }

    const stats = [
        {
            icon: <IconPackage size={17}/>,
            label: 'Total productos',
            value: totalProducts,
            status: ''
        },
        {
            icon: <IconPackage size={17}/>,
            label: 'Disponibles',
            value: availableProducts,
            status: 'success'
        },
        {
            icon: <IconPackage size={17}/>,
            label: 'Stock bajo',
            value: lowStockProducts,
            status: 'warning'
        },
        {
            icon: <IconPackage size={17}/>,
            label: 'Sin stock',
            value: outOfStockProducts,
            status: 'danger'
        },
    ]

    return (
        <div className="products">

            {/* HEADER */}

            <header className="products__header">

                <div className="products__title-row">
                    <div className="products__title-icon">
                        <IconPackage size={18}/>
                    </div>
                    <div>
                        <h1 className="products__title">Vitrina</h1>
                        <p className="products__description">Productos disponibles en{' '}{store?.name || 'mi tienda'}</p>
                    </div>
                </div>

                <div>
                    <button className="btn btn--primary" onClick={() => setShowAddModal(true)} disabled={!store}>
                        <IconPlus size={16}/>
                        Agregar productos
                    </button>
                    <button className="btn btn--primary" onClick={openTransferModal} disabled={!store || stores.length <= 1 || products.length === 0}>
                        <IconTransfer size={16}/>
                        Transferir productos
                    </button>
                </div>

            </header>

            {/* STATS */}

            <section className="products__stats">

                {stats.map((stat, i) => (
                    <div key={i} className="card products__stat">
                        <div className={`products__stat-icon products__stat-icon--${stat.status}`}>{stat.icon}</div>
                        <div>
                            <span>{stat.label}</span>
                            <strong>{stat.value}</strong>
                        </div>
                    </div>
                ))}

            </section>

            {/* PRODUCTS */}

            <section className="card products__panel">

                <div className="products__toolbar">

                    <div className="products__search">

                        <IconSearch
                            size={16}
                        />

                        <input
                            type="search"
                            placeholder="Buscar producto o SKU..."
                            value={search}
                            onChange={(e) =>
                                setSearch(
                                    e.target.value
                                )
                            }
                        />

                    </div>

                    <div className="products__filters">

                        <IconFilter
                            size={15}
                            className="text-gray"
                        />

                    </div>

                </div>

                <div className="products__table-wrapper">

                    <table className="products__table">

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
                                    Precio
                                </th>

                                <th>
                                    Stock
                                </th>

                                <th>
                                    Estado
                                </th>

                                <th />
                            </tr>

                        </thead>

                        <tbody>

                            {filteredProducts.map(
                                (product) => {

                                    const stock =
                                        Number(
                                            product.stock ||
                                                0
                                        );

                                    const minimum =
                                        Number(
                                            product.minimum_stock ||
                                                0
                                        );

                                    let status =
                                        'Disponible';

                                    let badge =
                                        'success';

                                    if (
                                        stock <=
                                        0
                                    ) {
                                        status =
                                            'Sin stock';

                                        badge =
                                            'danger';
                                    } else if (
                                        minimum >
                                            0 &&
                                        stock <=
                                            minimum
                                    ) {
                                        status =
                                            'Stock bajo';

                                        badge =
                                            'warning';
                                    }

                                    return (
                                        <tr
                                            key={
                                                product.id
                                            }
                                        >

                                            <td>

                                                <div className="products__product">

                                                    <div className="products__product-icon">
                                                        <IconPackage
                                                            size={
                                                                15
                                                            }
                                                        />
                                                    </div>

                                                    <div>

                                                        <strong>
                                                            {
                                                                product.name
                                                            }
                                                        </strong>

                                                        <span>
                                                            {
                                                                product.unit
                                                            }
                                                        </span>

                                                    </div>

                                                </div>

                                            </td>

                                            <td>
                                                <span className="products__sku">
                                                    {
                                                        product.sku
                                                    }
                                                </span>
                                            </td>

                                            <td>
                                                {
                                                    product.category ||
                                                    'Sin categoría'
                                                }
                                            </td>

                                            <td>
                                                <strong>
                                                    S/{' '}
                                                    {Number(
                                                        product.price ||
                                                            0
                                                    ).toFixed(
                                                        2
                                                    )}
                                                </strong>
                                            </td>

                                            <td>

                                                <div className="products__stock">

                                                    <strong>
                                                        {
                                                            stock
                                                        }
                                                    </strong>

                                                    <span>
                                                        {String(
                                                            product.unit ||
                                                                'unidad'
                                                        ).toLowerCase()}
                                                    </span>

                                                </div>

                                            </td>

                                            <td>

                                                <span
                                                    className={`badge badge--${badge}`}
                                                >
                                                    {
                                                        status
                                                    }
                                                </span>

                                            </td>

                                            <td>

                                                <div className="products__actions">

                                                    <button
                                                        className="btn btn--ghost btn--icon btn--sm"
                                                        title="Ver producto"
                                                        onClick={() => setShowAddModal(true)}
                                                    >
                                                        <IconEye
                                                            size={
                                                                15
                                                            }
                                                        />
                                                    </button>

                                                </div>

                                            </td>

                                        </tr>
                                    );
                                }
                            )}

                            {filteredProducts.length ===
                                0 && (
                                <tr>
                                    <td
                                        colSpan="7"
                                        className="text-center"
                                    >
                                        No se encontraron
                                        productos.
                                    </td>
                                </tr>
                            )}

                        </tbody>

                    </table>

                </div>

                <div className="products__pagination">

                    <span>
                        Mostrando{' '}
                        {
                            filteredProducts.length
                        }{' '}
                        de {totalProducts}{' '}
                        productos
                    </span>

                </div>

            </section>

            {/* TRANSFER MODAL */}

            {showAddModal && (
                <AddProductsModal
                    products={catalog}
                    store={store}
                    adding={addingProducts}
                    close={() => setShowAddModal(false)}
                    addProducts={addProducts}
                />
            )}

            {showTransferModal && (
                <TransferProducts products={products} store={store} stores={stores} transferring={transferring} close={closeTransferModal} />
            )}

        </div>
    );
}