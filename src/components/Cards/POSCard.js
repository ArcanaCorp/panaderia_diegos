'use client';
import { useAuth } from "@/context/AuthContext";
import { createdSale } from "@/services/pos.service";
import { IconCash, IconChevronDown, IconCreditCard, IconDeviceMobile, IconLoader2, IconMinus, IconPlus, IconShoppingCart, IconTrash } from "@tabler/icons-react";
import { useState } from "react";
import { toast } from "sonner";

export default function POSCard ({ clearCart, cart, paymentMethods, selectedStore }) {

    const { profile } = useAuth();
    
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
    const [processingSale, setProcessingSale] = useState(false);

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
    
    function removeFromCart(productId) {

        setCart(currentCart =>
            currentCart.filter(
                item => item.id !== productId
            )
        );

    }

    async function handleCompleteSale() {

        if (!selectedStore) return toast.error('Selecciona una tienda');        

        if (cart.length === 0) return toast.error('Agrega productos a la venta');

        if (!selectedPaymentMethod) return toast.error('Selecciona un método de pago');

        try {

            setProcessingSale(true);

            // Obtener usuario actual
            const companyId = profile?.company_id;

            // Preparar productos
            const items = cart.map(item => ({
                product_id: item.id,
                quantity: item.quantity
            }));

            // Registrar venta
            const sale = await createdSale({companyId, profile, selectedStore, selectedPaymentMethod, total, items});

            toast.success('Venta registrada', { description: `Venta ${sale.sale_code} por S/ ${Number(sale.total).toFixed(2)}`});

            clearCart();
            setSelectedPaymentMethod(null);

        } catch (error) {
            console.error('Error registrando venta:', error);
            toast.error('No se pudo registrar la venta', { description: error?.message || 'Ocurrió un error inesperado.'});
        } finally {
            setProcessingSale(false);
        }
    }

    const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    const discount = 0;
    const total = subtotal - discount;
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    return (
        <aside className="pos__cart">

            <div className="pos__cart-header">
                <div>
                    <h2 className="pos__cart-title">Venta actual</h2>
                    <p className="pos__cart-count">{totalItems} productos</p>
                </div>
                <button className="btn btn--ghost btn--icon" onClick={clearCart} disabled={cart.length === 0}><IconTrash size={17} /></button>
            </div>

            <button className="pos__customer">
                <div>
                    <span className="pos__customer-label">Cliente</span>
                    <span className="pos__customer-name">Público general</span>
                </div>
                <IconChevronDown size={16} />
            </button>

            <div className="pos__cart-items">

                {cart.length === 0 ? (
                    <div className="pos__cart-empty">
                        <IconShoppingCart size={24} />
                        <p>Agrega productos a la venta</p>
                    </div>
                ) : (
                    cart.map(item => (

                        <div key={item.id} className="pos__cart-item">

                            <div className="pos__cart-item-info">
                                <p>{item.name}</p>
                                <span>S/ {item.price.toFixed(2)}</span>
                            </div>

                            <div className="pos__quantity">
                                <button className="btn btn-primary btn-xs" onClick={() => decreaseQuantity(item.id)}><IconMinus size={14} /></button>
                                <span>{item.quantity}</span>
                                <button className="btn btn-primary btn-xs" onClick={() => increaseQuantity(item.id)}><IconPlus size={14} /></button>
                            </div>

                            <strong className="pos__cart-item-total">S/ {(item.price * item.quantity).toFixed(2)}</strong>

                        </div>

                    ))
                )}

            </div>

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
                    <strong>S/ {total.toFixed(2)}</strong>
                </div>
            </div>

            <div className="pos__payment">
                <p className="pos__payment-label">Método de pago</p>
                <div className="pos__payment-methods">
                    {paymentMethods.map(method => {
                        const type = method.type?.toLowerCase();
                        let Icon = IconCash;

                        if (type?.includes('tarjeta') || type?.includes('card')) {
                            Icon = IconCreditCard;
                        }

                        if (type?.includes('yape') || type?.includes('plin') || type?.includes('mobile')) {
                            Icon = IconDeviceMobile;
                        }

                        return (
                            <button key={method.id} className={`pos__payment-method ${selectedPaymentMethod?.id === method.id ? 'pos__payment-method--active' : ''}`} onClick={() => setSelectedPaymentMethod(method)} disabled={processingSale}>
                                <Icon size={18} />
                                <span>{method.name}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            <button type="button" className="btn btn--primary pos__complete" disabled={cart.length === 0 || !selectedStore || !selectedPaymentMethod || processingSale} onClick={handleCompleteSale}>
                {processingSale ? (
                    <>
                        <IconLoader2 size={17} className="spin"/>
                        Procesando...
                    </>
                ) : (
                    <>
                        <IconShoppingCart size={17} />
                        Cobrar S/ {total.toFixed(2)}
                    </>
                )}
            </button>

        </aside>
    )
}