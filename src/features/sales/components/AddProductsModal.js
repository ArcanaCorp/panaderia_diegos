'use client';

import { IconX, IconSearch, IconPlus, IconMinus, IconPackage, IconTrash, IconCheck, IconSearchOff } from '@tabler/icons-react';

import { useMemo, useState } from 'react';
import { toast } from 'sonner';

import '@/styles/components/modal-showcases.css';

export default function AddProductsModal({ products = [], store, adding, close, addProducts }) {

    const [search, setSearch] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState([]);

    const selectedIds = useMemo(
        () => new Set(selectedProducts.map(item => item.product_id)),
        [selectedProducts]
    );

    // AUTOCOMPLETE
    const suggestions = useMemo(() => {
        const value = search.trim().toLowerCase();

        if (!value) return [];

        return products
            .filter(product => {
                const matchesName = product.name
                    ?.toLowerCase()
                    .includes(value);

                const matchesSku = product.sku
                    ?.toLowerCase()
                    .includes(value);

                return (
                    (matchesName || matchesSku) &&
                    !selectedIds.has(product.id) &&
                    product.is_active !== false
                );
            })
            .slice(0, 6);
    }, [products, search, selectedIds]);

    // AGREGAR PRODUCTO
    function addProduct(product) {
        if (selectedIds.has(product.id)) return;

        setSelectedProducts(current => [
            ...current,
            {
                product_id: product.id,
                name: product.name,
                sku: product.sku,
                unit: product.unit || product.unit_type || 'unidad',
                price: Number(product.price || product.price_unit || 0),
                quantity_to_add: 1,
                minimum_stock: 0,
            }
        ]);

        setSearch('');
        setShowSuggestions(false);
    }

    // ACTUALIZAR CANTIDADES
    function updateProduct(productId, field, value) {
        const parsedValue = Math.max(
            field === 'quantity_to_add' ? 1 : 0,
            Number.parseInt(value, 10) || 0
        );

        setSelectedProducts(current =>
            current.map(item =>
                item.product_id === productId
                    ? { ...item, [field]: parsedValue }
                    : item
            )
        );
    }

    // ELIMINAR PRODUCTO
    function removeProduct(productId) {
        setSelectedProducts(current =>
            current.filter(item => item.product_id !== productId)
        );
    }

    // CONFIRMAR
    async function handleSubmit() {
        if (!selectedProducts.length) {
            toast.warning('Agrega al menos un producto.');
            return;
        }

        const items = selectedProducts.map(item => ({
            product_id: item.product_id,
            quantity_to_add: item.quantity_to_add,
            minimum_stock: item.minimum_stock,
        }));

        try {
            const result = await addProducts(items);

            if (!result) return;

            toast.success('Inventario actualizado correctamente.');
            setSelectedProducts([]);
            close();

        } catch (error) {
            console.error(error);
            toast.error(
                error?.message || 'No se pudo actualizar el inventario.'
            );
        }
    }

    return (
        <div
            className="modal-overlay add-products-overlay"
            onMouseDown={e => {
                if (e.target === e.currentTarget && !adding) {
                    close();
                }
            }}
        >
            <div className="modal modal--add-products">

                {/* HEADER */}
                <div className="modal__header add-products__header">
                    <div>
                        <div className="add-products__eyebrow">
                            <IconPackage size={14} />
                            GESTIÓN DE INVENTARIO
                        </div>

                        <h2>Agregar productos</h2>

                        <p>
                            Incorpora productos a la vitrina de{' '}
                            <strong>{store?.name || 'tu tienda'}</strong>.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="btn btn--ghost btn--icon"
                        onClick={close}
                        disabled={adding}
                        aria-label="Cerrar modal"
                    >
                        <IconX size={19} />
                    </button>
                </div>

                {/* BODY */}
                <div className="modal__body add-products__body">

                    {/* BUSCADOR */}
                    <section className="add-products__search-section">
                        <div className="add-products__section-heading">
                            <div>
                                <h3>Buscar en el catálogo</h3>
                                <p>Busca por nombre o código SKU.</p>
                            </div>

                            <span className="add-products__catalog-count">
                                {products.length} productos
                            </span>
                        </div>

                        <div className="add-products__autocomplete">

                            <div className={`add-products__search ${showSuggestions && search.trim() ? 'is-active' : ''}`}>
                                <IconSearch size={19} />

                                <input
                                    type="search"
                                    placeholder="Ej. Pan francés o PROD-001..."
                                    value={search}
                                    onFocus={() => setShowSuggestions(true)}
                                    onChange={e => {
                                        setSearch(e.target.value);
                                        setShowSuggestions(true);
                                    }}
                                    onKeyDown={e => {
                                        if (e.key === 'Escape') {
                                            setShowSuggestions(false);
                                        }

                                        if (e.key === 'Enter' && suggestions.length > 0) {
                                            e.preventDefault();
                                            addProduct(suggestions[0]);
                                        }
                                    }}
                                />

                                {search && (
                                    <button
                                        type="button"
                                        className="add-products__clear-search"
                                        onClick={() => {
                                            setSearch('');
                                            setShowSuggestions(false);
                                        }}
                                        aria-label="Limpiar búsqueda"
                                    >
                                        <IconX size={15} />
                                    </button>
                                )}
                            </div>

                            {/* RESULTADOS DEL AUTOCOMPLETE */}
                            {showSuggestions && search.trim() && (
                                <div className="add-products__suggestions">

                                    {suggestions.length > 0 ? (
                                        <>
                                            <div className="add-products__suggestions-label">
                                                RESULTADOS DE BÚSQUEDA
                                            </div>

                                            {suggestions.map(product => (
                                                <button
                                                    type="button"
                                                    key={product.id}
                                                    className="add-products__suggestion"
                                                    onClick={() => addProduct(product)}
                                                >
                                                    <div className="add-products__product-icon">
                                                        <IconPackage size={19} />
                                                    </div>

                                                    <div className="add-products__suggestion-info">
                                                        <strong>{product.name}</strong>

                                                        <span>
                                                            SKU: {product.sku || 'Sin código'}
                                                            {' · '}
                                                            {product.unit || product.unit_type || 'unidad'}
                                                        </span>
                                                    </div>

                                                    <div className="add-products__suggestion-price">
                                                        S/ {Number(
                                                            product.price || product.price_unit || 0
                                                        ).toFixed(2)}
                                                    </div>

                                                    <span className="add-products__suggestion-add">
                                                        <IconPlus size={17} />
                                                    </span>
                                                </button>
                                            ))}
                                        </>
                                    ) : (
                                        <div className="add-products__no-results">
                                            <IconSearchOff size={23} />

                                            <strong>No encontramos productos</strong>

                                            <span>
                                                Prueba con otro nombre o código SKU.
                                            </span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {!search.trim() && (
                            <div className="add-products__search-hint">
                                <IconSearch size={14} />
                                Escribe para buscar productos disponibles en el catálogo.
                            </div>
                        )}
                    </section>

                    {/* PRODUCTOS SELECCIONADOS */}
                    <section className="add-products__selected">

                        <div className="add-products__selected-header">
                            <div>
                                <h3>Productos seleccionados</h3>
                                <p>Indica cuántas unidades deseas incorporar al inventario actual.</p>
                            </div>

                            <span className="add-products__selected-count">
                                {selectedProducts.length}
                            </span>
                        </div>

                        {selectedProducts.length > 0 ? (
                            <div className="add-products__selected-list">

                                {selectedProducts.map(item => {
                                    console.log(item);
                                    
                                    return (
                                        <article
                                            key={item.product_id}
                                            className="add-products__selected-item"
                                        >
                                            <div className="add-products__selected-product">
                                                <div className="add-products__product-icon">
                                                    <IconPackage size={19} />
                                                </div>

                                                <div className="add-products__selected-info">
                                                    <strong>{item.name}</strong>

                                                    <span>
                                                        {item.sku || 'Sin SKU'}
                                                        {' · '}
                                                        {item.unit}
                                                    </span>

                                                    <small>
                                                        S/ {item.price.toFixed(2)}
                                                    </small>
                                                </div>
                                            </div>

                                            <div className="add-products__fields">

                                                <div className="add-products__quantity">
                                                    <label>Cantidad a agregar</label>

                                                    <div className="add-products__quantity-control">
                                                        <button
                                                            type="button"
                                                            disabled={item.quantity_to_add <= 1}
                                                            onClick={() =>
                                                                updateProduct(
                                                                    item.product_id,
                                                                    'quantity_to_add',
                                                                    item.quantity_to_add - 1
                                                                )
                                                            }
                                                        >
                                                            <IconMinus size={14} />
                                                        </button>

                                                        <input
                                                            type="number"
                                                            min="1"
                                                            step="1"
                                                            value={item.quantity_to_add ?? 1}
                                                            onChange={e =>
                                                                updateProduct(
                                                                    item.product_id,
                                                                    'quantity_to_add',
                                                                    e.target.value
                                                                )
                                                            }
                                                        />

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                updateProduct(
                                                                    item.product_id,
                                                                    'quantity_to_add',
                                                                    item.quantity_to_add + 1
                                                                )
                                                            }
                                                        >
                                                            <IconPlus size={14} />
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="add-products__quantity">
                                                    <label>Stock mínimo</label>

                                                    <input
                                                        className="add-products__minimum-input"
                                                        type="number"
                                                        min="0"
                                                        value={item.minimum_stock}
                                                        onChange={e => updateProduct(
                                                            item.product_id,
                                                            'minimum_stock',
                                                            e.target.value
                                                        )}
                                                    />
                                                </div>

                                                <button
                                                    type="button"
                                                    className="add-products__remove"
                                                    onClick={() => removeProduct(item.product_id)}
                                                    title="Quitar producto"
                                                    aria-label={`Quitar ${item.name}`}
                                                >
                                                    <IconTrash size={17} />
                                                </button>
                                            </div>
                                        </article>
                                    )
                                })}

                            </div>
                        ) : (
                            <div className="add-products__empty">
                                <div className="add-products__empty-icon">
                                    <IconPackage size={25} />
                                </div>

                                <strong>Aún no has seleccionado productos</strong>

                                <span>
                                    Busca un producto arriba y presiona el botón + para agregarlo.
                                </span>
                            </div>
                        )}
                    </section>

                </div>

                {/* FOOTER */}
                <div className="modal__footer add-products__footer">
                    <div className="add-products__footer-info">
                        <strong>{selectedProducts.length}</strong>
                        <span>
                            {selectedProducts.length === 1
                                ? 'producto seleccionado'
                                : 'productos seleccionados'}
                        </span>
                    </div>

                    <div className="add-products__footer-actions">
                        <button
                            type="button"
                            className="btn btn--ghost"
                            onClick={close}
                            disabled={adding}
                        >
                            Cancelar
                        </button>

                        <button
                            type="button"
                            className="btn btn--primary"
                            onClick={handleSubmit}
                            disabled={adding || selectedProducts.length === 0}
                        >
                            <IconCheck size={17} />

                            {adding
                                ? 'Agregando...'
                                : `Agregar ${selectedProducts.length} productos`}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}