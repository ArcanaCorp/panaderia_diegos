'use client';

import { useMemo, useState } from 'react';

import {
    IconPackage,
    IconSearch,
    IconFilter,
    IconEye,
    IconTransfer,
    IconX,
    IconPlus,
    IconMinus,
    IconAlertTriangle,
    IconRefresh,
} from '@tabler/icons-react';

import { useShowcase } from '@/hooks/useShowcase';
import { toast } from 'sonner';

export default function ShowcasesView() {

    const {
        store,
        products,
        categories: dbCategories,
        stores,
        loading,
        transferring,
        error,
        reload,
        transfer,
    } = useShowcase();

    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('Todas');
    const [showTransferModal, setShowTransferModal] = useState(false);
    const [destinationStore, setDestinationStore] = useState('');
    const [transferItems, setTransferItems] = useState([]);
    const [notes, setNotes] = useState('');

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

    const availableProducts =
        products.filter(
            (product) =>
                Number(product.stock || 0) > 0
        ).length;

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
        setDestinationStore('');
        setTransferItems([]);
        setNotes('');
        setShowTransferModal(true);
    }

    function closeTransferModal() {
        if (transferring) return;

        setShowTransferModal(false);
    }

    function addTransferProduct(product) {

        const existing =
            transferItems.find(
                (item) =>
                    item.product_id === product.id
            );

        if (existing) {
            setTransferItems(
                transferItems.map((item) =>
                    item.product_id === product.id
                        ? {
                              ...item,
                              quantity: Math.min(
                                  item.quantity + 1,
                                  Number(product.stock)
                              ),
                          }
                        : item
                )
            );

            return;
        }

        setTransferItems([
            ...transferItems,
            {
                product_id: product.id,
                name: product.name,
                sku: product.sku,
                stock: Number(product.stock || 0),
                quantity: 1,
                unit: product.unit,
            },
        ]);
    }

    function updateTransferQuantity(
        productId,
        amount
    ) {
        setTransferItems(
            transferItems
                .map((item) => {

                    if (
                        item.product_id !==
                        productId
                    ) {
                        return item;
                    }

                    const quantity = Math.min(
                        Math.max(
                            item.quantity +
                                amount,
                            0
                        ),
                        item.stock
                    );

                    return {
                        ...item,
                        quantity,
                    };
                })
                .filter(
                    (item) =>
                        item.quantity > 0
                )
        );
    }

    function removeTransferProduct(
        productId
    ) {
        setTransferItems(
            transferItems.filter(
                (item) =>
                    item.product_id !==
                    productId
            )
        );
    }

    async function handleTransfer() {

        if (!destinationStore) {
            toast.warning('Selecciona una tienda de destino.');
            return;
        }

        if (transferItems.length === 0) {
            toast.warning('Agrega al menos un producto.');
            return;
        }

        const items = transferItems.map(
            (item) => ({
                product_id:
                    item.product_id,
                quantity:
                    item.quantity,
            })
        );

        try {

            await transfer({
                destinationStoreId:
                    destinationStore,
                items,
                notes,
            });

            setShowTransferModal(false);
            setDestinationStore('');
            setTransferItems([]);
            setNotes('');

            toast.success('Productos transferidos correctamente.');

        } catch (err) {
            console.log(err?.message || 'No se pudo realizar la transferencia.');
            toast.error('No se pudo realizar la transferencia.')
        }
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

                    <IconAlertTriangle
                        size={24}
                    />

                    <strong>
                        No se pudo cargar la vitrina
                    </strong>

                    <span>
                        {error}
                    </span>

                    <button
                        className="btn btn--outline"
                        onClick={reload}
                    >
                        <IconRefresh
                            size={16}
                        />
                        Reintentar
                    </button>

                </div>
            </div>
        );
    }

    return (
        <div className="products">

            {/* HEADER */}

            <header className="products__header">

                <div className="products__title-row">

                    <div className="products__title-icon">
                        <IconPackage
                            size={18}
                        />
                    </div>

                    <div>

                        <h1 className="products__title">
                            Vitrina
                        </h1>

                        <p className="products__description">
                            Productos disponibles en{' '}
                            {store?.name ||
                                'mi tienda'}
                        </p>

                    </div>

                </div>

                <button
                    className="btn btn--primary"
                    onClick={
                        openTransferModal
                    }
                    disabled={
                        stores.length === 0 ||
                        products.length === 0
                    }
                >
                    <IconTransfer
                        size={16}
                    />

                    Transferir productos
                </button>

            </header>

            {/* STATS */}

            <section className="products__stats">

                <div className="card products__stat">

                    <div className="products__stat-icon">
                        <IconPackage
                            size={17}
                        />
                    </div>

                    <div>
                        <span>
                            Total productos
                        </span>

                        <strong>
                            {totalProducts}
                        </strong>
                    </div>

                </div>

                <div className="card products__stat">

                    <div className="products__stat-icon products__stat-icon--success">
                        <IconPackage
                            size={17}
                        />
                    </div>

                    <div>
                        <span>
                            Disponibles
                        </span>

                        <strong>
                            {availableProducts}
                        </strong>
                    </div>

                </div>

                <div className="card products__stat">

                    <div className="products__stat-icon products__stat-icon--warning">
                        <IconPackage
                            size={17}
                        />
                    </div>

                    <div>
                        <span>
                            Stock bajo
                        </span>

                        <strong>
                            {lowStockProducts}
                        </strong>
                    </div>

                </div>

                <div className="card products__stat">

                    <div className="products__stat-icon products__stat-icon--danger">
                        <IconPackage
                            size={17}
                        />
                    </div>

                    <div>
                        <span>
                            Sin stock
                        </span>

                        <strong>
                            {outOfStockProducts}
                        </strong>
                    </div>

                </div>

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

                        {categories.map(
                            (item) => (
                                <button
                                    key={item}
                                    className={`btn btn--sm ${
                                        category ===
                                        item
                                            ? 'btn--primary'
                                            : 'btn--ghost'
                                    }`}
                                    onClick={() =>
                                        setCategory(
                                            item
                                        )
                                    }
                                >
                                    {item}
                                </button>
                            )
                        )}

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

            {showTransferModal && (
                <div className="modal-overlay">

                    <div className="modal">

                        <div className="modal__header">

                            <div>
                                <h2>
                                    Transferir productos
                                </h2>

                                <p>
                                    Desde{' '}
                                    <strong>
                                        {store?.name}
                                    </strong>
                                </p>
                            </div>

                            <button
                                className="btn btn--ghost btn--icon"
                                onClick={
                                    closeTransferModal
                                }
                                disabled={
                                    transferring
                                }
                            >
                                <IconX
                                    size={18}
                                />
                            </button>

                        </div>

                        <div className="modal__body">

                            <div className="form-group">

                                <label>
                                    Tienda de destino
                                </label>

                                <select
                                    className="input"
                                    value={
                                        destinationStore
                                    }
                                    onChange={(
                                        e
                                    ) =>
                                        setDestinationStore(
                                            e.target.value
                                        )
                                    }
                                >
                                    <option value="">
                                        Seleccionar tienda...
                                    </option>

                                    {stores.map(
                                        (item) => (
                                            <option
                                                key={
                                                    item.id
                                                }
                                                value={
                                                    item.id
                                                }
                                            >
                                                {
                                                    item.name
                                                }
                                            </option>
                                        )
                                    )}

                                </select>

                            </div>

                            <div className="form-group">

                                <label>
                                    Agregar productos
                                </label>

                                <select
                                    className="input"
                                    defaultValue=""
                                    onChange={(
                                        e
                                    ) => {

                                        const product =
                                            products.find(
                                                (
                                                    item
                                                ) =>
                                                    item.id ===
                                                    e.target.value
                                            );

                                        if (
                                            product
                                        ) {
                                            addTransferProduct(
                                                product
                                            );
                                        }

                                        e.target.value =
                                            '';
                                    }}
                                >

                                    <option value="">
                                        Seleccionar producto...
                                    </option>

                                    {products
                                        .filter(
                                            (
                                                item
                                            ) =>
                                                Number(
                                                    item.stock ||
                                                        0
                                                ) >
                                                0
                                        )
                                        .map(
                                            (
                                                item
                                            ) => (
                                                <option
                                                    key={
                                                        item.id
                                                    }
                                                    value={
                                                        item.id
                                                    }
                                                >
                                                    {
                                                        item.name
                                                    }{' '}
                                                    — Stock:{' '}
                                                    {
                                                        item.stock
                                                    }
                                                </option>
                                            )
                                        )}

                                </select>

                            </div>

                            {transferItems.length >
                                0 && (
                                <div className="transfer-list">

                                    {transferItems.map(
                                        (
                                            item
                                        ) => (
                                            <div
                                                key={
                                                    item.product_id
                                                }
                                                className="transfer-item"
                                            >

                                                <div>

                                                    <strong>
                                                        {
                                                            item.name
                                                        }
                                                    </strong>

                                                    <span>
                                                        {
                                                            item.sku
                                                        }{' '}
                                                        · Stock:{' '}
                                                        {
                                                            item.stock
                                                        }
                                                    </span>

                                                </div>

                                                <div className="transfer-item__controls">

                                                    <button
                                                        type="button"
                                                        className="btn btn--ghost btn--icon btn--xs"
                                                        onClick={() =>
                                                            updateTransferQuantity(
                                                                item.product_id,
                                                                -1
                                                            )
                                                        }
                                                    >
                                                        <IconMinus
                                                            size={
                                                                14
                                                            }
                                                        />
                                                    </button>

                                                    <strong>
                                                        {
                                                            item.quantity
                                                        }
                                                    </strong>

                                                    <button
                                                        type="button"
                                                        className="btn btn--ghost btn--icon btn--xs"
                                                        disabled={
                                                            item.quantity >=
                                                            item.stock
                                                        }
                                                        onClick={() =>
                                                            updateTransferQuantity(
                                                                item.product_id,
                                                                1
                                                            )
                                                        }
                                                    >
                                                        <IconPlus
                                                            size={
                                                                14
                                                            }
                                                        />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="btn btn--ghost btn--icon btn--xs"
                                                        onClick={() =>
                                                            removeTransferProduct(
                                                                item.product_id
                                                            )
                                                        }
                                                    >
                                                        <IconX
                                                            size={
                                                                14
                                                            }
                                                        />
                                                    </button>

                                                </div>

                                            </div>
                                        )
                                    )}

                                </div>
                            )}

                            <div className="form-group">

                                <label>
                                    Observaciones
                                </label>

                                <textarea
                                    className="input"
                                    rows="3"
                                    placeholder="Observaciones de la transferencia..."
                                    value={notes}
                                    onChange={(
                                        e
                                    ) =>
                                        setNotes(
                                            e.target.value
                                        )
                                    }
                                />

                            </div>

                        </div>

                        <div className="modal__footer">

                            <button
                                className="btn btn--ghost"
                                onClick={
                                    closeTransferModal
                                }
                                disabled={
                                    transferring
                                }
                            >
                                Cancelar
                            </button>

                            <button
                                className="btn btn--primary"
                                onClick={
                                    handleTransfer
                                }
                                disabled={
                                    transferring ||
                                    !destinationStore ||
                                    transferItems.length ===
                                        0
                                }
                            >
                                <IconTransfer
                                    size={16}
                                />

                                {transferring
                                    ? 'Transfiriendo...'
                                    : 'Confirmar transferencia'}
                            </button>

                        </div>

                    </div>

                </div>
            )}

        </div>
    );
}