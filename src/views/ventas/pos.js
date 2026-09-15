'use client';

import { useState } from 'react';
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
} from '@tabler/icons-react';

import { useAuth } from '@/context/AuthContext';

export default function POSVentas() {

    const { profile } = useAuth();

    const [category, setCategory] = useState('Todos');
    const [search, setSearch] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('Efectivo');

    const [cart, setCart] = useState([
        {
            id: 1,
            name: 'Pan francés',
            price: 0.30,
            quantity: 4,
            unit: 'Unidad',
        },
        {
            id: 2,
            name: 'Croissant',
            price: 3.50,
            quantity: 2,
            unit: 'Unidad',
        },
    ]);

    const products = [
        {
            id: 1,
            name: 'Pan francés',
            category: 'Panadería',
            price: 0.30,
            stock: 120,
            unit: 'Unidad',
        },
        {
            id: 2,
            name: 'Pan integral',
            category: 'Panadería',
            price: 0.50,
            stock: 80,
            unit: 'Unidad',
        },
        {
            id: 3,
            name: 'Croissant',
            category: 'Pastelería',
            price: 3.50,
            stock: 24,
            unit: 'Unidad',
        },
        {
            id: 4,
            name: 'Empanada de carne',
            category: 'Panadería',
            price: 4.00,
            stock: 18,
            unit: 'Unidad',
        },
        {
            id: 5,
            name: 'Torta personal',
            category: 'Pastelería',
            price: 8.00,
            stock: 12,
            unit: 'Unidad',
        },
        {
            id: 6,
            name: 'Café americano',
            category: 'Bebidas',
            price: 4.50,
            stock: 30,
            unit: 'Unidad',
        },
    ];

    const categories = [
        'Todos',
        'Panadería',
        'Pastelería',
        'Bebidas',
    ];

    const filteredProducts = products.filter((product) => {
        const matchesCategory =
            category === 'Todos' || product.category === category;

        const matchesSearch =
            product.name.toLowerCase().includes(search.toLowerCase());

        return matchesCategory && matchesSearch;
    });

    function addToCart(product) {
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
                                product.stock
                            ),
                        }
                        : item
                );
            }

            return [
                ...current,
                {
                    ...product,
                    quantity: 1,
                },
            ];
        });
    }

    function updateQuantity(id, amount) {
        setCart((current) =>
            current
                .map((item) => {
                    if (item.id !== id) return item;

                    const product = products.find(
                        (product) => product.id === id
                    );

                    const quantity = Math.min(
                        Math.max(item.quantity + amount, 1),
                        product.stock
                    );

                    return {
                        ...item,
                        quantity,
                    };
                })
        );
    }

    function removeFromCart(id) {
        setCart((current) =>
            current.filter((item) => item.id !== id)
        );
    }

    function clearCart() {
        setCart([]);
    }

    const subtotal = cart.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    const discount = 0;
    const total = subtotal - discount;

    const itemCount = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

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
                    >
                        <IconX size={17} />
                    </button>

                </div>

            </header>

            {/* LAYOUT */}
            <div className="pos__layout">

                {/* PRODUCTS */}
                <section className="pos__products">

                    <div className="input-group">
                        <span className="input-group__icon--left">
                            <IconSearch size={16} />
                        </span>

                        <input
                            className="input"
                            type="search"
                            placeholder="Buscar producto..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="pos__categories">

                        {categories.map((item) => (
                            <button
                                key={item}
                                className={`pos__category ${
                                    category === item
                                        ? 'pos__category--active'
                                        : ''
                                }`}
                                onClick={() => setCategory(item)}
                            >
                                {item}
                            </button>
                        ))}

                    </div>

                    <div className="pos__product-grid">

                        {filteredProducts.map((product) => (
                            <button
                                key={product.id}
                                className="pos__product"
                                onClick={() => addToCart(product)}
                                disabled={product.stock === 0}
                            >

                                <div className="pos__product-image">
                                    {product.name.charAt(0)}
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
                                        S/ {product.price.toFixed(2)}
                                    </strong>

                                    <span>
                                        Stock: {product.stock}
                                    </span>

                                </div>

                            </button>
                        ))}

                    </div>

                </section>

                {/* CART */}
                <aside className="pos__cart">

                    <div className="pos__cart-header">

                        <div>
                            <h2 className="pos__cart-title">
                                Venta actual
                            </h2>

                            <p className="pos__cart-count">
                                {itemCount} productos
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
                                            S/ {item.price.toFixed(2)} · {item.unit}
                                        </span>

                                        <div className="pos__quantity">

                                            <button
                                                className="btn btn--ghost btn--icon btn--xs"
                                                onClick={() =>
                                                    updateQuantity(item.id, -1)
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
                                                    updateQuantity(item.id, 1)
                                                }
                                            >
                                                <IconPlus size={14} />
                                            </button>

                                        </div>

                                    </div>

                                    <button
                                        className="btn btn--ghost btn--icon btn--xs"
                                        onClick={() =>
                                            removeFromCart(item.id)
                                        }
                                    >
                                        <IconTrash size={14} />
                                    </button>

                                    <span className="pos__cart-item-total">
                                        S/ {(item.price * item.quantity).toFixed(2)}
                                    </span>

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

                            <button
                                className={`pos__payment-method ${
                                    paymentMethod === 'Efectivo'
                                        ? 'pos__payment-method--active'
                                        : ''
                                }`}
                                onClick={() =>
                                    setPaymentMethod('Efectivo')
                                }
                            >
                                <IconCash size={18} />
                                Efectivo
                            </button>

                            <button
                                className={`pos__payment-method ${
                                    paymentMethod === 'Tarjeta'
                                        ? 'pos__payment-method--active'
                                        : ''
                                }`}
                                onClick={() =>
                                    setPaymentMethod('Tarjeta')
                                }
                            >
                                <IconCreditCard size={18} />
                                Tarjeta
                            </button>

                            <button
                                className={`pos__payment-method ${
                                    paymentMethod === 'Yape'
                                        ? 'pos__payment-method--active'
                                        : ''
                                }`}
                                onClick={() =>
                                    setPaymentMethod('Yape')
                                }
                            >
                                <IconDeviceMobile size={18} />
                                Yape
                            </button>

                        </div>

                    </div>

                    {/* COMPLETE */}
                    <button
                        className="btn btn--primary pos__complete"
                        disabled={cart.length === 0}
                    >
                        Cobrar S/ {total.toFixed(2)}
                    </button>

                </aside>

            </div>

        </div>
    );
}