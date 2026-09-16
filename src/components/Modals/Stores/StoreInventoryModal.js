'use client';

import {
    IconBox,
    IconPackage,
    IconSearch,
    IconRefresh,
    IconX,
} from '@tabler/icons-react';
import { useEffect, useMemo, useState } from 'react';

import { getStores, getStoreInventory } from '@/services/stores.service';
import { useAuth } from '@/context/AuthContext';

const formatNumber = (value) => {
    return new Intl.NumberFormat('es-PE', {
        maximumFractionDigits: 3,
    }).format(Number(value || 0));
};

export default function StoreInventoryModal({ onClose }) {
    const { profile } = useAuth();

    const [stores, setStores] = useState([]);
    const [selectedStoreId, setSelectedStoreId] = useState('');

    const [inventory, setInventory] = useState([]);

    const [loading, setLoading] = useState(true);
    const [loadingInventory, setLoadingInventory] = useState(false);

    const [search, setSearch] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        loadStores();
    }, [profile?.company_id]);

    useEffect(() => {
        if (selectedStoreId) {
            loadInventory(selectedStoreId);
        } else {
            setInventory([]);
        }
    }, [selectedStoreId]);

    async function loadStores() {
        if (!profile?.company_id) return;

        try {
            setLoading(true);
            setError('');

            const data = await getStores(profile.company_id);

            setStores(data);

            if (data.length > 0) {
                setSelectedStoreId(data[0].id);
            }
        } catch (err) {
            console.error(err);
            setError(
                err?.message || 'No se pudieron cargar las tiendas.'
            );
        } finally {
            setLoading(false);
        }
    }

    async function loadInventory(storeId) {
        try {
            setLoadingInventory(true);
            setError('');

            const data = await getStoreInventory(storeId);

            setInventory(data);
        } catch (err) {
            console.error(err);
            setError(
                err?.message ||
                'No se pudo cargar el inventario de la tienda.'
            );
        } finally {
            setLoadingInventory(false);
        }
    }

    function handleRefresh() {
        if (selectedStoreId) {
            loadInventory(selectedStoreId);
        }
    }

    const filteredInventory = useMemo(() => {
        const term = search.trim().toLowerCase();

        if (!term) return inventory;

        return inventory.filter((item) => {
            const product = item.products;

            return (
                product?.name?.toLowerCase().includes(term) ||
                product?.sku?.toLowerCase().includes(term)
            );
        });
    }, [inventory, search]);

    const selectedStore = stores.find(
        (store) => store.id === selectedStoreId
    );

    const totalProducts = inventory.length;

    const totalUnits = inventory.reduce(
        (total, item) => total + Number(item.stock || 0),
        0
    );

    const lowStockProducts = inventory.filter(
        (item) =>
            Number(item.stock || 0) <=
            Number(item.minimum_stock || 0)
    ).length;

    return (
        <div className="modal-overlay">
            <div className="modal modal--lg">

                {/* HEADER */}
                <div className="modal__header">
                    <div className="modal__title-group">
                        <div className="modal__icon">
                            <IconBox size={20} />
                        </div>

                        <div>
                            <h2 className="modal__title">
                                Inventario de tienda
                            </h2>

                            <p className="modal__subtitle">
                                Consulta los productos disponibles en cada tienda.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="modal__close"
                        onClick={onClose}
                    >
                        <IconX size={20} />
                    </button>
                </div>

                {/* BODY */}
                <div className="modal__body">

                    {error && (
                        <div className="modal__error">
                            {error}
                        </div>
                    )}

                    {/* TIENDA */}
                    <div className="modal__field">
                        <label>
                            Tienda
                        </label>

                        <select
                            value={selectedStoreId}
                            onChange={(event) =>
                                setSelectedStoreId(event.target.value)
                            }
                            disabled={loading}
                        >
                            <option value="">
                                Selecciona una tienda
                            </option>

                            {stores.map((store) => (
                                <option
                                    key={store.id}
                                    value={store.id}
                                >
                                    {store.name}
                                    {store.code
                                        ? ` · ${store.code}`
                                        : ''}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* RESUMEN */}
                    {selectedStore && (
                        <div className="store-inventory__summary">

                            <div className="store-inventory__stat">
                                <span>Productos</span>
                                <strong>
                                    {totalProducts}
                                </strong>
                            </div>

                            <div className="store-inventory__stat">
                                <span>Unidades</span>
                                <strong>
                                    {formatNumber(totalUnits)}
                                </strong>
                            </div>

                            <div className="store-inventory__stat">
                                <span>Stock bajo</span>
                                <strong>
                                    {lowStockProducts}
                                </strong>
                            </div>

                        </div>
                    )}

                    {/* BUSCADOR */}
                    <div className="store-inventory__toolbar">

                        <div className="store-inventory__search">
                            <IconSearch size={18} />

                            <input
                                type="text"
                                placeholder="Buscar producto o SKU..."
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                            />
                        </div>

                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={handleRefresh}
                            disabled={
                                !selectedStoreId ||
                                loadingInventory
                            }
                        >
                            <IconRefresh
                                size={17}
                                className={
                                    loadingInventory
                                        ? 'store-inventory__spin'
                                        : ''
                                }
                            />

                            Actualizar
                        </button>

                    </div>

                    {/* INVENTARIO */}
                    <div className="store-inventory__list">

                        {loadingInventory ? (
                            <div className="store-inventory__empty">
                                <IconPackage size={28} />
                                <p>
                                    Cargando inventario...
                                </p>
                            </div>
                        ) : filteredInventory.length === 0 ? (
                            <div className="store-inventory__empty">
                                <IconPackage size={32} />

                                <strong>
                                    {search
                                        ? 'No se encontraron productos'
                                        : 'Sin productos en inventario'}
                                </strong>

                                <p>
                                    {search
                                        ? 'Prueba con otro nombre o SKU.'
                                        : 'Esta tienda todavía no tiene productos asignados.'}
                                </p>
                            </div>
                        ) : (
                            <div className="store-inventory__table-wrapper">
                                <table className="store-inventory__table">
                                    <thead>
                                        <tr>
                                            <th>Producto</th>
                                            <th>SKU</th>
                                            <th>Unidad</th>
                                            <th>Stock</th>
                                            <th>Mínimo</th>
                                            <th>Estado</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {filteredInventory.map((item) => {
                                            const product = item.products;

                                            const stock =
                                                Number(item.stock || 0);

                                            const minimum =
                                                Number(
                                                    item.minimum_stock || 0
                                                );

                                            const isLow =
                                                stock <= minimum;

                                            return (
                                                <tr key={item.id}>

                                                    <td>
                                                        <div className="store-inventory__product">
                                                            {product?.image_url ? (
                                                                <img
                                                                    src={product.image_url}
                                                                    alt=""
                                                                />
                                                            ) : (
                                                                <div className="store-inventory__product-icon">
                                                                    <IconPackage
                                                                        size={18}
                                                                    />
                                                                </div>
                                                            )}

                                                            <div>
                                                                <strong>
                                                                    {product?.name ||
                                                                        'Producto'}
                                                                </strong>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    <td>
                                                        {product?.sku || '—'}
                                                    </td>

                                                    <td>
                                                        {product?.unit_type ||
                                                            'unidad'}
                                                    </td>

                                                    <td>
                                                        <strong>
                                                            {formatNumber(stock)}
                                                        </strong>
                                                    </td>

                                                    <td>
                                                        {formatNumber(minimum)}
                                                    </td>

                                                    <td>
                                                        <span
                                                            className={
                                                                isLow
                                                                    ? 'store-inventory__status store-inventory__status--low'
                                                                    : 'store-inventory__status store-inventory__status--ok'
                                                            }
                                                        >
                                                            {isLow
                                                                ? 'Stock bajo'
                                                                : 'Disponible'}
                                                        </span>
                                                    </td>

                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}

                    </div>

                </div>

                {/* FOOTER */}
                <div className="modal__footer">
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={onClose}
                    >
                        Cerrar
                    </button>
                </div>

            </div>
        </div>
    );
}