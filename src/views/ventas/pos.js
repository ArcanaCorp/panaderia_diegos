'use client';

import { useEffect, useMemo, useState } from 'react';

import {
    IconSearch,
    IconScan,
    IconPlus,
    IconMinus,
    IconTrash,
    IconCash,
    IconCreditCard,
    IconDeviceMobile,
    IconX,
    IconUser,
    IconAlertTriangle,
    IconRefresh,
    IconPackage,
} from '@tabler/icons-react';

import { useAuth } from '@/context/AuthContext';
import { useSalesPOS } from '@/hooks/useSalesPOS';

export default function POSVentas() {
    const { profile } = useAuth();

    const {
        products,
        categories: dbCategories,
        paymentMethods,
        loading,
        error,
        reload,
    } = useSalesPOS();

    const [category, setCategory] = useState('Todos');
    const [search, setSearch] = useState('');
    const [paymentMethod, setPaymentMethod] = useState(null);
    const [cart, setCart] = useState([]);

    /*
     * Seleccionar automáticamente el primer método de pago
     */
    useEffect(() => {
        if (!paymentMethod && paymentMethods.length > 0) {
            setPaymentMethod(paymentMethods[0].id);
        }
    }, [paymentMethods, paymentMethod]);

    /*
     * Categorías
     */
    const categories = useMemo(() => {
        return [
            'Todos',
            ...dbCategories.map((item) => item.name),
        ];
    }, [dbCategories]);

    /*
     * Productos filtrados
     */
    const filteredProducts = useMemo(() => {
        const searchValue = search.trim().toLowerCase();

        return products.filter((product) => {
            const matchesCategory =
                category === 'Todos' ||
                product.category === category;

            const matchesSearch =
                !searchValue ||
                product.name
                    ?.toLowerCase()
                    .includes(searchValue) ||
                product.sku
                    ?.toLowerCase()
                    .includes(searchValue);

            return matchesCategory && matchesSearch;
        });
    }, [products, category, search]);

    /*
     * Agregar producto
     */
    function addToCart(product) {
        const stock = Number(product.stock || 0);

        if (stock <= 0) return;

        setCart((current) => {
            const existing = current.find(
                (item) => item.id === product.id
            );

            if (existing) {
                return current.map((item) =>
                    item.id === product.id
                        ? {
                              ...item,
                              quantity: Math.min(
                                  item.quantity + 1,
                                  stock
                              ),
                          }
                        : item
                );
            }

            return [
                ...current,
                {
                    id: product.id,
                    name: product.name,
                    sku: product.sku,
                    price: Number(product.price || 0),
                    quantity: 1,
                    unit: product.unit || 'unidad',
                    stock,
                },
            ];
        });
    }

    /*
     * Modificar cantidad
     */
    function updateQuantity(id, amount) {
        setCart((current) =>
            current.map((item) => {
                if (item.id !== id) return item;

                const quantity = Math.min(
                    Math.max(item.quantity + amount, 1),
                    item.stock
                );

                return {
                    ...item,
                    quantity,
                };
            })
        );
    }

    /*
     * Eliminar producto
     */
    function removeFromCart(id) {
        setCart((current) =>
            current.filter((item) => item.id !== id)
        );
    }

    /*
     * Vaciar carrito
     */
    function clearCart() {
        setCart([]);
    }

    /*
     * Totales
     */
    const subtotal = cart.reduce(
        (total, item) =>
            total + item.price * item.quantity,
        0
    );

    const discount = 0;

    const total = Math.max(
        subtotal - discount,
        0
    );

    const itemCount = cart.reduce(
        (total, item) =>
            total + item.quantity,
        0
    );

    /*
     * Loading
     */
    if (loading) {
        return (
            <div className="pos">
                <div className="pos__state">
                    <IconRefresh
                        size={24}
                        className="pos__state-icon"
                    />

                    <strong>
                        Cargando punto de venta...
                    </strong>

                    <span>
                        Estamos preparando los productos de tu tienda.
                    </span>
                </div>
            </div>
        );
    }

    /*
     * Error
     */
    if (error) {
        return (
            <div className="pos">
                <div className="pos__state pos__state--error">
                    <IconAlertTriangle size={24} />

                    <strong>
                        No se pudo cargar el punto de venta
                    </strong>

                    <span>
                        {error}
                    </span>

                    <button
                        className="btn btn--outline"
                        onClick={reload}
                    >
                        <IconRefresh size={16} />
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="pos">

            {/* HEADER */}
            <header className="pos__header">

                <div>
                    <p className="pos__eyebrow">
                        {profile?.store?.name || 'Mi tienda'}
                    </p>

                    <h1 className="pos__title">
                        Punto de venta
                    </h1>
                </div>

                <div className="pos__header-actions">

                    <button className="btn btn--outline">
                        <IconScan size={16} />
                        Escanear
                    </button>

                    <button
                        className="btn btn--ghost btn--icon"
                        onClick={clearCart}
                        title="Nueva venta"
                        disabled={cart.length === 0}
                    >
                        <IconX size={17} />
                    </button>

                </div>

            </header>


            {/* LAYOUT */}
            <div className="pos__layout">

                {/* PRODUCTS */}
                <section className="pos__products">

                    {/* SEARCH */}
                    <div className="input-group">

                        <span className="input-group__icon--left">
                            <IconSearch size={16} />
                        </span>

                        <input
                            className="input"
                            type="search"
                            placeholder="Buscar producto..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                        />

                    </div>


                    {/* CATEGORIES */}
                    {categories.length > 1 && (
                        <div className="pos__categories">

                            {categories.map((item) => (
                                <button
                                    key={item}
                                    className={`pos__category ${
                                        category === item
                                            ? 'pos__category--active'
                                            : ''
                                    }`}
                                    onClick={() =>
                                        setCategory(item)
                                    }
                                >
                                    {item}
                                </button>
                            ))}

                        </div>
                    )}


                    {/* PRODUCTS */}
                    {filteredProducts.length === 0 ? (

                        <div className="pos__empty">

                            <IconPackage size={32} />

                            <strong>
                                No encontramos productos
                            </strong>

                            <span>
                                {search
                                    ? 'Prueba con otro término de búsqueda.'
                                    : 'No hay productos disponibles en esta tienda.'}
                            </span>

                        </div>

                    ) : (

                        <div className="pos__product-grid">

                            {filteredProducts.map((product) => {

                                const stock = Number(
                                    product.stock || 0
                                );

                                const price = Number(
                                    product.price || 0
                                );

                                const outOfStock =
                                    stock <= 0;

                                return (
                                    <button
                                        key={product.id}
                                        className={`pos__product ${
                                            outOfStock
                                                ? 'pos__product--disabled'
                                                : ''
                                        }`}
                                        onClick={() =>
                                            addToCart(product)
                                        }
                                        disabled={outOfStock}
                                    >

                                        <div className="pos__product-image">
                                            {product.name
                                                ?.charAt(0)
                                                ?.toUpperCase()}
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
                                                S/ {price.toFixed(2)}
                                            </strong>

                                            <span>
                                                {outOfStock
                                                    ? 'Sin stock'
                                                    : `Stock: ${stock}`}
                                            </span>

                                        </div>

                                    </button>
                                );
                            })}

                        </div>

                    )}

                </section>


                {/* CART */}
                <aside className="pos__cart">

                    {/* CART HEADER */}
                    <div className="pos__cart-header">

                        <div>
                            <h2 className="pos__cart-title">
                                Venta actual
                            </h2>

                            <p className="pos__cart-count">
                                {itemCount}{' '}
                                {itemCount === 1
                                    ? 'producto'
                                    : 'productos'}
                            </p>
                        </div>

                        {cart.length > 0 && (
                            <button
                                className="btn btn--ghost btn--icon btn--sm"
                                onClick={clearCart}
                                title="Vaciar venta"
                            >
                                <IconTrash size={16} />
                            </button>
                        )}

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

                        <IconUser size={16} />

                    </button>


                    {/* CART ITEMS */}
                    <div className="pos__cart-items">

                        {cart.length === 0 ? (

                            <div className="card__body">

                                <p className="text-sm text-gray">
                                    No hay productos agregados.
                                </p>

                            </div>

                        ) : (

                            cart.map((item) => (

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
                                            {' · '}
                                            {item.unit}
                                        </span>


                                        <div className="pos__quantity">

                                            <button
                                                type="button"
                                                className="btn btn--ghost btn--icon btn--xs"
                                                onClick={() =>
                                                    updateQuantity(
                                                        item.id,
                                                        -1
                                                    )
                                                }
                                                disabled={
                                                    item.quantity <= 1
                                                }
                                            >
                                                <IconMinus size={14} />
                                            </button>

                                            <span>
                                                {item.quantity}
                                            </span>

                                            <button
                                                type="button"
                                                className="btn btn--ghost btn--icon btn--xs"
                                                onClick={() =>
                                                    updateQuantity(
                                                        item.id,
                                                        1
                                                    )
                                                }
                                                disabled={
                                                    item.quantity >=
                                                    item.stock
                                                }
                                            >
                                                <IconPlus size={14} />
                                            </button>

                                        </div>

                                    </div>


                                    <button
                                        type="button"
                                        className="btn btn--ghost btn--icon btn--xs"
                                        onClick={() =>
                                            removeFromCart(
                                                item.id
                                            )
                                        }
                                    >
                                        <IconTrash size={14} />
                                    </button>


                                    <span className="pos__cart-item-total">
                                        S/ {(item.price *
                                            item.quantity).toFixed(2)}
                                    </span>

                                </div>

                            ))

                        )}

                    </div>


                    {/* SUMMARY */}
                    <div className="pos__summary">

                        <div>
                            <span>
                                Subtotal
                            </span>

                            <strong>
                                S/ {subtotal.toFixed(2)}
                            </strong>
                        </div>


                        <div>
                            <span>
                                Descuento
                            </span>

                            <strong>
                                S/ {discount.toFixed(2)}
                            </strong>
                        </div>


                        <div className="pos__summary-total">

                            <span>
                                Total
                            </span>

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


                        {paymentMethods.length === 0 ? (

                            <div className="pos__payment-empty">
                                <IconAlertTriangle size={16} />

                                <span>
                                    No hay métodos de pago configurados.
                                </span>
                            </div>

                        ) : (

                            <div className="pos__payment-methods">

                                {paymentMethods.map((method) => (

                                    <button
                                        key={method.id}
                                        type="button"
                                        className={`pos__payment-method ${
                                            paymentMethod === method.id
                                                ? 'pos__payment-method--active'
                                                : ''
                                        }`}
                                        onClick={() =>
                                            setPaymentMethod(
                                                method.id
                                            )
                                        }
                                    >

                                        {method.type === 'cash' && (
                                            <IconCash size={18} />
                                        )}

                                        {method.type === 'card' && (
                                            <IconCreditCard size={18} />
                                        )}

                                        {method.type === 'digital_wallet' && (
                                            <IconDeviceMobile size={18} />
                                        )}

                                        {method.type !== 'cash' &&
                                            method.type !== 'card' &&
                                            method.type !== 'digital_wallet' && (
                                                <IconDeviceMobile size={18} />
                                            )}

                                        {method.name}

                                    </button>

                                ))}

                            </div>

                        )}

                    </div>


                    {/* COMPLETE */}
                    <button
                        type="button"
                        className="btn btn--primary pos__complete"
                        disabled={
                            cart.length === 0 ||
                            !paymentMethod ||
                            paymentMethods.length === 0
                        }
                    >
                        Cobrar S/ {total.toFixed(2)}
                    </button>

                </aside>

            </div>

        </div>
    );
}