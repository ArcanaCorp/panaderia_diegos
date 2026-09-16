'use client';

import { IconBuildingStore, IconPackage, IconSearch, IconTrash, IconX, IconTruckDelivery } from '@tabler/icons-react';
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getStores, getStoreTransferProducts, sendProductsToStore } from '@/services/stores.service';

const INITIAL_FORM = {
    storeId: '',
    notes: '',
    items: [],
};

export default function StoreTransferModal({ onClose, onSuccess }) {
    const { profile } = useAuth();

    const [stores, setStores] = useState([]);
    const [products, setProducts] = useState([]);

    const [form, setForm] = useState(INITIAL_FORM);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [productSearch, setProductSearch] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [productQuantity, setProductQuantity] = useState('1');

    const [error, setError] = useState('');

    useEffect(() => {
        loadData();
    }, [profile?.company_id]);

    async function loadData() {
        if (!profile?.company_id) return;

        try {
            setLoading(true);
            setError('');

            const [storesData, productsData] = await Promise.all([
                getStores(profile.company_id),
                getStoreTransferProducts(profile.company_id),
            ]);

            setStores(storesData);
            setProducts(productsData);
        } catch (err) {
            console.error(err);
            setError(
                err?.message ||
                'No se pudieron cargar los datos.'
            );
        } finally {
            setLoading(false);
        }
    }

    const availableProducts = useMemo(() => {
        const search = productSearch.trim().toLowerCase();

        return products
            .filter(
                (product) =>
                    !form.items.some(
                        (item) => item.product_id === product.id
                    )
            )
            .filter((product) => {
                if (!search) return true;

                return (
                    product.name.toLowerCase().includes(search) ||
                    product.sku?.toLowerCase().includes(search)
                );
            })
            .slice(0, 8);
    }, [products, productSearch, form.items]);

    function handleStoreChange(event) {
        setForm((prev) => ({
            ...prev,
            storeId: event.target.value,
        }));
    }

    function handleSelectProduct(product) {
        setSelectedProduct(product);
        setProductSearch(product.name);
    }

    function addItem() {
        if (!selectedProduct) {
            setError('Selecciona un producto.');
            return;
        }

        const quantity = Number(productQuantity);

        if (!Number.isFinite(quantity) || quantity <= 0) {
            setError('La cantidad debe ser mayor a cero.');
            return;
        }

        setForm((prev) => ({
            ...prev,
            items: [
                ...prev.items,
                {
                    product_id: selectedProduct.id,
                    product: selectedProduct,
                    quantity,
                },
            ],
        }));

        setSelectedProduct(null);
        setProductSearch('');
        setProductQuantity('1');
        setError('');
    }

    function updateQuantity(index, value) {
        setForm((prev) => ({
            ...prev,
            items: prev.items.map((item, itemIndex) =>
                itemIndex === index
                    ? {
                          ...item,
                          quantity: value,
                      }
                    : item
            ),
        }));
    }

    function removeItem(index) {
        setForm((prev) => ({
            ...prev,
            items: prev.items.filter(
                (_, itemIndex) => itemIndex !== index
            ),
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setError('');

        if (!profile?.company_id) {
            setError('No se encontró la empresa del usuario.');
            return;
        }

        if (!form.storeId) {
            setError('Selecciona una tienda.');
            return;
        }

        if (form.items.length === 0) {
            setError('Agrega al menos un producto.');
            return;
        }

        for (const item of form.items) {
            const quantity = Number(item.quantity);

            if (!Number.isFinite(quantity) || quantity <= 0) {
                setError(
                    `La cantidad de ${item.product.name} debe ser mayor a cero.`
                );
                return;
            }
        }

        try {
            setSaving(true);

            const items = form.items.map((item) => ({
                productId: item.product_id,
                quantity: Number(item.quantity),
            }));

            const transferId = await sendProductsToStore({
                companyId: profile.company_id,
                storeId: form.storeId,
                createdBy: profile.id,
                items,
                notes: form.notes || null,
            });

            onSuccess?.(transferId);
            
        } catch (err) {
            console.error(err);

            setError(
                err?.message ||
                    'No se pudo completar el envío de productos.'
            );
        } finally {
            setSaving(false);
        }
    }

    const selectedStore = stores.find(
        (store) => store.id === form.storeId
    );

    return (
        <div className="modal-overlay">
            <div className="modal modal--lg">
                <div className="modal__header">
                    <div className="modal__title">
                        <div className="modal__icon">
                            <IconTruckDelivery size={22} />
                        </div>

                        <div>
                            <h2>
                                Enviar productos
                            </h2>

                            <p>
                                Envía productos del almacén central a una
                                tienda.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="modal__close"
                        onClick={onClose}
                        disabled={saving}
                    >
                        <IconX size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="modal__body">
                        {error && (
                            <div className="modal__error">
                                {error}
                            </div>
                        )}

                        <div className="modal__form">
                            <div className="modal__field modal__field--full">
                                <label>
                                    Tienda destino
                                </label>

                                <div className="modal__search">
                                    <IconBuildingStore size={18} />

                                    <select
                                        value={form.storeId}
                                        onChange={handleStoreChange}
                                        disabled={loading || saving}
                                    >
                                        <option value="">
                                            Seleccionar tienda...
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
                            </div>

                            <div className="modal__field modal__field--full">
                                <label>
                                    Productos
                                </label>

                                <div className="modal__add">
                                    <div className="modal__search">
                                        <IconSearch size={18} />

                                        <input
                                            type="text"
                                            placeholder="Buscar por nombre o SKU..."
                                            value={productSearch}
                                            onChange={(event) => {
                                                setProductSearch(
                                                    event.target.value
                                                );
                                                setSelectedProduct(null);
                                            }}
                                            disabled={loading || saving}
                                        />
                                    </div>

                                    <div className="modal__quantity">
                                        <input
                                            type="number"
                                            min="0.001"
                                            step="0.001"
                                            value={productQuantity}
                                            onChange={(event) =>
                                                setProductQuantity(
                                                    event.target.value
                                                )
                                            }
                                            disabled={loading || saving}
                                        />
                                    </div>

                                    <button
                                        type="button"
                                        className="modal__add-button btn btn-secondary"
                                        onClick={addItem}
                                        disabled={
                                            loading ||
                                            saving ||
                                            !selectedProduct
                                        }
                                    >
                                        Agregar
                                    </button>
                                </div>

                                {productSearch &&
                                    !selectedProduct &&
                                    availableProducts.length > 0 && (
                                        <div className="modal__search-results">
                                            {availableProducts.map(
                                                (product) => (
                                                    <button
                                                        type="button"
                                                        key={product.id}
                                                        className="modal__search-item"
                                                        onClick={() =>
                                                            handleSelectProduct(
                                                                product
                                                            )
                                                        }
                                                    >
                                                        <div className="modal__search-icon">
                                                            <IconPackage
                                                                size={18}
                                                            />
                                                        </div>

                                                        <div className="modal__search-info">
                                                            <strong>
                                                                {
                                                                    product.name
                                                                }
                                                            </strong>

                                                            <span>
                                                                SKU:{' '}
                                                                {
                                                                    product.sku
                                                                }
                                                                {' · '}
                                                                {
                                                                    product.unit_type
                                                                }
                                                            </span>
                                                        </div>
                                                    </button>
                                                )
                                            )}
                                        </div>
                                    )}
                            </div>

                            {selectedProduct && (
                                <div className="modal__item">
                                    <div className="modal__item-info">
                                        <strong>
                                            {selectedProduct.name}
                                        </strong>

                                        <span>
                                            {selectedProduct.sku}
                                        </span>
                                    </div>

                                    <span className="modal__item-quantity">
                                        Cantidad:{' '}
                                        {productQuantity || 0}
                                    </span>
                                </div>
                            )}

                            <div className="modal__field modal__field--full">
                                <label>
                                    Productos a enviar
                                </label>

                                {form.items.length === 0 ? (
                                    <div className="modal__empty">
                                        <IconPackage size={22} />

                                        <span>
                                            Todavía no has agregado
                                            productos.
                                        </span>
                                    </div>
                                ) : (
                                    <div className="modal__items-list">
                                        {form.items.map(
                                            (item, index) => (
                                                <div
                                                    className="modal__item"
                                                    key={item.product_id}
                                                >
                                                    <div className="modal__item-info">
                                                        <strong>
                                                            {
                                                                item.product
                                                                    .name
                                                            }
                                                        </strong>

                                                        <span>
                                                            {
                                                                item.product
                                                                    .sku
                                                            }
                                                        </span>
                                                    </div>

                                                    <div className="modal__item-quantity">
                                                        <input
                                                            type="number"
                                                            min="0.001"
                                                            step="0.001"
                                                            value={
                                                                item.quantity
                                                            }
                                                            onChange={(
                                                                event
                                                            ) =>
                                                                updateQuantity(
                                                                    index,
                                                                    event
                                                                        .target
                                                                        .value
                                                                )
                                                            }
                                                            disabled={
                                                                saving
                                                            }
                                                        />
                                                    </div>

                                                    <span className="modal__item-notes">
                                                        {
                                                            item.product
                                                                .unit_type
                                                        }
                                                    </span>

                                                    <button
                                                        type="button"
                                                        className="modal__close btn btn-icon"
                                                        onClick={() =>
                                                            removeItem(
                                                                index
                                                            )
                                                        }
                                                        disabled={
                                                            saving
                                                        }
                                                        title="Eliminar"
                                                    >
                                                        <IconTrash
                                                            size={17}
                                                        />
                                                    </button>
                                                </div>
                                            )
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="modal__field modal__field--full">
                                <label>
                                    Observaciones
                                </label>

                                <textarea
                                    rows={3}
                                    placeholder="Notas del envío..."
                                    value={form.notes}
                                    onChange={(event) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            notes: event.target.value,
                                        }))
                                    }
                                    disabled={saving}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="modal__footer">
                        <div className="modal__item-info">
                            <strong>
                                {form.items.length}
                            </strong>{' '}
                            producto
                            {form.items.length !== 1 ? 's' : ''}

                            {selectedStore && (
                                <>
                                    {' · '}
                                    <span>
                                        {selectedStore.name}
                                    </span>
                                </>
                            )}
                        </div>

                        <div>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={onClose}
                                disabled={saving}
                            >
                                Cancelar
                            </button>

                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={
                                    saving ||
                                    loading ||
                                    !form.storeId ||
                                    form.items.length === 0
                                }
                            >
                                {saving
                                    ? 'Enviando...'
                                    : 'Enviar productos'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}