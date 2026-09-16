'use client';

import { useMemo, useState } from 'react';

import { IconSearch, IconShoppingCart, IconScan, IconChevronDown, IconX, IconBuildingStore, IconLoader2 } from '@tabler/icons-react';
import { usePOS } from '@/hooks/usePos';
import POSCard from '@/components/Cards/POSCard';

export default function PosAdmin() {

    const { stores, selectedStore, setSelectedStore, products, paymentMethods, loadingStores, loadingProducts, error } = usePOS();

    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('Todas');
    const [cart, setCart] = useState([]);

    // --------------------------------
    // Categorías
    // --------------------------------

    const categories = useMemo(() => {

        const uniqueCategories = [
            ...new Set(
                products
                    .map(product => product.category)
                    .filter(Boolean)
            )
        ];

        return ['Todas', ...uniqueCategories];

    }, [products]);

    // --------------------------------
    // Productos filtrados
    // --------------------------------

    const filteredProducts = useMemo(() => {

        const query = search.trim().toLowerCase();

        return products.filter(product => {

            const matchesSearch =
                !query ||
                product.name?.toLowerCase().includes(query) ||
                product.sku?.toLowerCase().includes(query);

            const matchesCategory =
                category === 'Todas' ||
                product.category === category;

            return matchesSearch && matchesCategory;

        });

    }, [products, search, category]);

    // --------------------------------
    // Agregar producto
    // --------------------------------

    function addToCart(product) {

        setCart(currentCart => {

            const existing = currentCart.find(
                item => item.id === product.id
            );

            if (existing) {

                if (existing.quantity >= product.stock) {
                    return currentCart;
                }

                return currentCart.map(item =>
                    item.id === product.id
                        ? {
                            ...item,
                            quantity: item.quantity + 1
                        }
                        : item
                );
            }

            return [
                ...currentCart,
                {
                    id: product.id,
                    name: product.name,
                    price: Number(product.price || 0),
                    stock: Number(product.stock || 0),
                    quantity: 1
                }
            ];

        });

    }

    // --------------------------------
    // Vaciar carrito
    // --------------------------------

    const clearCart = () => setCart([]);

    return (
        <main className="pos">

            <header className="pos__header">
                <div>
                    <p className="pos__eyebrow">Punto de venta</p>
                    <h1 className="pos__title">Nueva venta</h1>
                </div>
                <div className="pos__header-actions">
                    <button className="btn btn--outline" disabled={!selectedStore}><IconScan size={16} /> Escanear</button>
                    <button className="btn btn--ghost btn--icon"><IconX size={18} /></button>
                </div>
            </header>

            <section className="pos__store">

                <div className="pos__store-label">
                    <IconBuildingStore size={18} />
                    <div>
                        <span>Tienda</span>
                        <strong>{loadingStores ? 'Cargando...' : selectedStore?.name || 'Selecciona una tienda'}</strong>
                    </div>
                </div>


                {stores.length > 1 && (

                    <div className="pos__store-selector">

                        <select
                            value={selectedStore?.id || ''}
                            onChange={(event) => {

                                const store =
                                    stores.find(
                                        item =>
                                            item.id === event.target.value
                                    );

                                setSelectedStore(store || null);

                                // Al cambiar tienda,
                                // limpiamos el carrito.
                                setCart([]);

                            }}
                        >

                            <option value="">
                                Seleccionar tienda
                            </option>

                            {stores.map(store => (

                                <option
                                    key={store.id}
                                    value={store.id}
                                >
                                    {store.name}
                                    {store.is_main ? ' — Principal' : ''}
                                </option>

                            ))}

                        </select>

                        <IconChevronDown size={16} />

                    </div>

                )}

            </section>


            {/* ERROR */}

            {error && (

                <div className="alert alert--danger">
                    {error}
                </div>

            )}


            {/* POS */}

            <section className="pos__layout">

                {/* PRODUCTS */}

                <div className="pos__products">

                    {/* SEARCH */}

                    <div className="input-group input-group--left">

                        <span className="input-group__icon--left">
                            <IconSearch size={17} />
                        </span>

                        <input
                            className="input"
                            placeholder="Buscar producto o SKU..."
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                            disabled={
                                !selectedStore ||
                                loadingProducts
                            }
                        />

                    </div>


                    {/* CATEGORIES */}

                    <div className="pos__categories">

                        {categories.map(item => (

                            <button
                                key={item}
                                className={
                                    `pos__category ${
                                        category === item
                                            ? 'pos__category--active'
                                            : ''
                                    }`
                                }
                                onClick={() =>
                                    setCategory(item)
                                }
                            >
                                {item}
                            </button>

                        ))}

                    </div>


                    {/* LOADING */}

                    {loadingProducts && (

                        <div className="pos__empty">

                            <IconLoader2
                                size={24}
                                className="spin"
                            />

                            <p>
                                Cargando productos...
                            </p>

                        </div>

                    )}


                    {/* NO STORE */}

                    {!loadingProducts &&
                        !selectedStore && (

                        <div className="pos__empty">

                            <IconBuildingStore size={28} />

                            <p>
                                Selecciona una tienda para comenzar
                            </p>

                        </div>

                    )}


                    {/* NO PRODUCTS */}

                    {!loadingProducts &&
                        selectedStore &&
                        filteredProducts.length === 0 && (

                        <div className="pos__empty">

                            <IconShoppingCart size={28} />

                            <p>
                                No hay productos disponibles
                            </p>

                        </div>

                    )}


                    {/* PRODUCT GRID */}

                    {!loadingProducts &&
                        filteredProducts.length > 0 && (

                        <div className="pos__product-grid">

                            {filteredProducts.map(product => (

                                <button
                                    key={product.id}
                                    className="pos__product"
                                    onClick={() =>
                                        addToCart(product)
                                    }
                                    disabled={
                                        Number(product.stock) <= 0
                                    }
                                >

                                    <div className="pos__product-image">

                                        {product.image_url ? (

                                            <img
                                                src={product.image_url}
                                                alt={product.name}
                                            />

                                        ) : (

                                            product.name
                                                ?.charAt(0)
                                                ?.toUpperCase()

                                        )}

                                    </div>


                                    <div className="pos__product-info">

                                        <span className="pos__product-name">
                                            {product.name}
                                        </span>

                                        <span className="pos__product-category">
                                            {product.category}
                                        </span>

                                    </div>


                                    <div className="pos__product-bottom">

                                        <strong>
                                            S/ {Number(
                                                product.price || 0
                                            ).toFixed(2)}
                                        </strong>

                                        <span>
                                            {product.stock} disponibles
                                        </span>

                                    </div>

                                </button>

                            ))}

                        </div>

                    )}

                </div>


                {/* CART */}

                <POSCard cart={cart} clearCart={clearCart} paymentMethods={paymentMethods} selectedStore={selectedStore} />

            </section>

        </main>
    );
}