'use client';

import { useMemo, useState } from 'react';

import {
    IconSearch,
    IconPlus,
    IconMinus,
    IconTrash,
    IconShoppingCart,
    IconCash,
    IconCreditCard,
    IconDeviceMobile,
    IconScan,
    IconChevronDown,
    IconX,
    IconBuildingStore,
    IconLoader2
} from '@tabler/icons-react';
import { usePOS } from '@/hooks/usePos';


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
    // Aumentar cantidad
    // --------------------------------

    function increaseQuantity(productId) {

        setCart(currentCart => currentCart.map(item => {

            if (item.id !== productId) {
                return item;
            }

            if (item.quantity >= item.stock) {
                return item;
            }

            return {
                ...item,
                quantity: item.quantity + 1
            };

        }));

    }

    // --------------------------------
    // Disminuir cantidad
    // --------------------------------

    function decreaseQuantity(productId) {

        setCart(currentCart => {

            return currentCart
                .map(item => {

                    if (item.id !== productId) {
                        return item;
                    }

                    return {
                        ...item,
                        quantity: item.quantity - 1
                    };

                })
                .filter(item => item.quantity > 0);

        });

    }

    // --------------------------------
    // Eliminar producto
    // --------------------------------

    function removeFromCart(productId) {

        setCart(currentCart =>
            currentCart.filter(
                item => item.id !== productId
            )
        );

    }

    // --------------------------------
    // Vaciar carrito
    // --------------------------------

    function clearCart() {
        setCart([]);
    }

    // --------------------------------
    // Totales
    // --------------------------------

    const subtotal = cart.reduce(
        (total, item) =>
            total + item.price * item.quantity,
        0
    );

    const discount = 0;

    const total = subtotal - discount;

    const totalItems = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

    // --------------------------------
    // Render
    // --------------------------------

    return (
        <main className="pos">

            {/* HEADER */}

            <header className="pos__header">

                <div>

                    <p className="pos__eyebrow">
                        Punto de venta
                    </p>

                    <h1 className="pos__title">
                        Nueva venta
                    </h1>

                </div>

                <div className="pos__header-actions">

                    <button
                        className="btn btn--outline"
                        disabled={!selectedStore}
                    >
                        <IconScan size={16} />
                        Escanear
                    </button>

                    <button className="btn btn--ghost btn--icon">
                        <IconX size={18} />
                    </button>

                </div>

            </header>


            {/* STORE */}

            <section className="pos__store">

                <div className="pos__store-label">

                    <IconBuildingStore size={18} />

                    <div>

                        <span>
                            Tienda
                        </span>

                        <strong>
                            {loadingStores
                                ? 'Cargando...'
                                : selectedStore?.name || 'Selecciona una tienda'
                            }
                        </strong>

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

                <aside className="pos__cart">

                    <div className="pos__cart-header">

                        <div>

                            <h2 className="pos__cart-title">
                                Venta actual
                            </h2>

                            <p className="pos__cart-count">
                                {totalItems} productos
                            </p>

                        </div>

                        <button
                            className="btn btn--ghost btn--icon"
                            onClick={clearCart}
                            disabled={cart.length === 0}
                        >
                            <IconTrash size={17} />
                        </button>

                    </div>


                    {/* CUSTOMER */}

                    <button className="pos__customer">

                        <div>

                            <span className="pos__customer-label">
                                Cliente
                            </span>

                            <span className="pos__customer-name">
                                Público general
                            </span>

                        </div>

                        <IconChevronDown size={16} />

                    </button>


                    {/* CART ITEMS */}

                    <div className="pos__cart-items">

                        {cart.length === 0 ? (

                            <div className="pos__cart-empty">

                                <IconShoppingCart size={24} />

                                <p>
                                    Agrega productos a la venta
                                </p>

                            </div>

                        ) : (

                            cart.map(item => (

                                <div
                                    key={item.id}
                                    className="pos__cart-item"
                                >

                                    <div className="pos__cart-item-info">

                                        <p>
                                            {item.name}
                                        </p>

                                        <span>
                                            S/ {item.price.toFixed(2)}
                                        </span>

                                    </div>


                                    <div className="pos__quantity">

                                        <button
                                            className="btn btn--ghost btn--icon btn--xs"
                                            onClick={() =>
                                                decreaseQuantity(item.id)
                                            }
                                        >
                                            <IconMinus size={14} />
                                        </button>

                                        <span>
                                            {item.quantity}
                                        </span>

                                        <button
                                            className="btn btn--ghost btn--icon btn--xs"
                                            onClick={() =>
                                                increaseQuantity(item.id)
                                            }
                                        >
                                            <IconPlus size={14} />
                                        </button>

                                    </div>


                                    <strong className="pos__cart-item-total">
                                        S/ {(
                                            item.price *
                                            item.quantity
                                        ).toFixed(2)}
                                    </strong>

                                </div>

                            ))

                        )}

                    </div>


                    {/* SUMMARY */}

                    <div className="pos__summary">

                        <div>
                            <span>Subtotal</span>
                            <strong>
                                S/ {subtotal.toFixed(2)}
                            </strong>
                        </div>

                        <div>
                            <span>Descuento</span>
                            <strong>
                                S/ {discount.toFixed(2)}
                            </strong>
                        </div>

                        <div className="pos__summary-total">

                            <span>Total</span>

                            <strong>
                                S/ {total.toFixed(2)}
                            </strong>

                        </div>

                    </div>


                    {/* PAYMENT */}

                    <div className="pos__payment">

                        <p className="pos__payment-label">
                            Método de pago
                        </p>

                        <div className="pos__payment-methods">

                            {paymentMethods.map(method => {

                                const type =
                                    method.type?.toLowerCase();

                                let Icon = IconCash;

                                if (
                                    type?.includes('tarjeta') ||
                                    type?.includes('card')
                                ) {
                                    Icon = IconCreditCard;
                                }

                                if (
                                    type?.includes('yape') ||
                                    type?.includes('plin') ||
                                    type?.includes('mobile')
                                ) {
                                    Icon = IconDeviceMobile;
                                }

                                return (

                                    <button
                                        key={method.id}
                                        className="pos__payment-method"
                                    >

                                        <Icon size={18} />

                                        <span>
                                            {method.name}
                                        </span>

                                    </button>

                                );

                            })}

                        </div>

                    </div>


                    {/* COMPLETE */}

                    <button
                        className="btn btn--primary pos__complete"
                        disabled={
                            cart.length === 0 ||
                            !selectedStore
                        }
                    >
                        <IconShoppingCart size={17} />

                        Cobrar S/ {total.toFixed(2)}

                    </button>

                </aside>

            </section>

        </main>
    );
}