'use client';

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
    IconX
} from '@tabler/icons-react';

export default function PosAdmin() {

    const products = [
        {
            id: 1,
            name: 'Pan francés',
            category: 'Panadería',
            price: 0.30,
            stock: 120
        },
        {
            id: 2,
            name: 'Pan integral',
            category: 'Panadería',
            price: 0.50,
            stock: 80
        },
        {
            id: 3,
            name: 'Croissant',
            category: 'Pastelería',
            price: 3.50,
            stock: 24
        },
        {
            id: 4,
            name: 'Empanada de carne',
            category: 'Pastelería',
            price: 4.00,
            stock: 18
        },
        {
            id: 5,
            name: 'Torta personal',
            category: 'Pastelería',
            price: 8.00,
            stock: 12
        },
        {
            id: 6,
            name: 'Café americano',
            category: 'Bebidas',
            price: 4.50,
            stock: 30
        }
    ];

    const cart = [
        {
            id: 1,
            name: 'Pan francés',
            price: 0.30,
            quantity: 4
        },
        {
            id: 3,
            name: 'Croissant',
            price: 3.50,
            quantity: 2
        }
    ];

    const subtotal = 8.20;
    const discount = 0;
    const total = subtotal - discount;

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

                    <button className="btn btn--outline">
                        <IconScan size={16} />
                        Escanear
                    </button>

                    <button className="btn btn--ghost btn--icon">
                        <IconX size={18} />
                    </button>

                </div>

            </header>


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
                            placeholder="Buscar producto..."
                        />

                    </div>


                    {/* CATEGORIES */}

                    <div className="pos__categories">

                        <button className="pos__category pos__category--active">
                            Todos
                        </button>

                        <button className="pos__category">
                            Panadería
                        </button>

                        <button className="pos__category">
                            Pastelería
                        </button>

                        <button className="pos__category">
                            Bebidas
                        </button>

                    </div>


                    {/* PRODUCT GRID */}

                    <div className="pos__product-grid">

                        {products.map((product) => (

                            <button
                                key={product.id}
                                className="pos__product"
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
                                        {product.stock} disponibles
                                    </span>

                                </div>

                            </button>

                        ))}

                    </div>

                </div>


                {/* CART */}

                <aside className="pos__cart">

                    <div className="pos__cart-header">

                        <div>
                            <h2 className="pos__cart-title">
                                Venta actual
                            </h2>

                            <p className="pos__cart-count">
                                {cart.length} productos
                            </p>
                        </div>

                        <button className="btn btn--ghost btn--icon">
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

                        {cart.map((item) => (

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

                                    <button className="btn btn--ghost btn--icon btn--xs">
                                        <IconMinus size={14} />
                                    </button>

                                    <span>
                                        {item.quantity}
                                    </span>

                                    <button className="btn btn--ghost btn--icon btn--xs">
                                        <IconPlus size={14} />
                                    </button>

                                </div>


                                <strong className="pos__cart-item-total">
                                    S/ {(item.price * item.quantity).toFixed(2)}
                                </strong>

                            </div>

                        ))}

                    </div>


                    {/* SUMMARY */}

                    <div className="pos__summary">

                        <div>
                            <span>Subtotal</span>
                            <strong>S/ {subtotal.toFixed(2)}</strong>
                        </div>

                        <div>
                            <span>Descuento</span>
                            <strong>S/ {discount.toFixed(2)}</strong>
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

                            <button className="pos__payment-method pos__payment-method--active">
                                <IconCash size={18} />
                                <span>Efectivo</span>
                            </button>

                            <button className="pos__payment-method">
                                <IconCreditCard size={18} />
                                <span>Tarjeta</span>
                            </button>

                            <button className="pos__payment-method">
                                <IconDeviceMobile size={18} />
                                <span>Yape</span>
                            </button>

                        </div>

                    </div>


                    {/* COMPLETE */}

                    <button className="btn btn--primary pos__complete">
                        <IconShoppingCart size={17} />
                        Cobrar S/ {total.toFixed(2)}
                    </button>

                </aside>

            </section>

        </main>
    );
}