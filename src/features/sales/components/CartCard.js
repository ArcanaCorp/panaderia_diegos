'use client';
import { createdSale } from "@/features/sales/services/admin-pos.service";
import { salePrint } from "@/services/print.service";
import { IconAlertTriangle, IconCash, IconCheck, IconCreditCard, IconDeviceMobile, IconMinus, IconPlus, IconTrash, IconUser } from "@tabler/icons-react";
import { useState } from "react";
import { toast } from "sonner";

const roundMoney = (value) => Math.round((Number(value) + Number.EPSILON) * 100) / 100;

export default function CartCard ({ cart, setCart, paymentMethods, profile }) {

    const [paymentType, setPaymentType] = useState('full');
    const [payments, setPayments] = useState([]);
    const [loadingSale, setLoadingSale] = useState(false);

    const subtotal = roundMoney(cart.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0));
    const discount = 0;
    const total = Math.max(roundMoney(subtotal - discount), 0);
    const itemCount = cart.reduce((sum, item) => sum + Number(item.quantity), 0);

    const effectivePayments = payments.map((payment) => ({
        ...payment,
        amount: paymentType === 'full' ? total : Number(payment.amount || 0),
    }));

    const paymentTotal = roundMoney(effectivePayments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0));

    const paymentDifference = roundMoney(total - paymentTotal);

    // Validación completa de los pagos.
    const paymentIsValid = paymentType === 'full' ? payments.length === 1 && total > 0 : payments.length >= 2 && payments.every((payment) => Number(payment.amount) > 0 && Number.isFinite(Number(payment.amount))) && paymentDifference === 0;

    function updateQuantity(id, amount) {
        setCart((current) =>
            current.map((item) => {
                if (item.id !== id) return item;

                return {
                    ...item,
                    quantity: Math.min(
                        Math.max(item.quantity + amount, 1),
                        item.stock
                    ),
                };
            })
        );
    }

    // =====================================================
    // ELIMINAR PRODUCTO
    // =====================================================

    function removeFromCart(id) {
        setCart((current) => current.filter((item) => item.id !== id));
    }

    // =====================================================
    // LIMPIAR VENTA
    // =====================================================

    function clearCart() {
        setCart([]);
        setPaymentType('full')
        setPayments([]);
    }

    // =====================================================
    // CAMBIAR TIPO DE PAGO
    // =====================================================

    function changePaymentType(nextType) {
        if (!['full', 'partial'].includes(nextType)) return;

        setPaymentType(nextType);

        // Al cambiar de modalidad se reinicia la selección.
        setPayments([]);
    }

    // =====================================================
    // SELECCIONAR MÉTODOS DE PAGO
    // =====================================================

    function togglePaymentMethod(method) {
        setPayments((current) => {
            const exists = current.some((payment) => payment.payment_method_id === method.id);

            // Si ya está seleccionado, lo eliminamos.
            if (exists) {
                return current.filter((payment) => payment.payment_method_id !== method.id);
            }

            // FULL: solamente permite un método.
            if (paymentType === 'full') {
                return [
                    {
                        payment_method_id: method.id,
                        amount: total,
                    },
                ];
            }

            // PARTIAL: permite agregar varios métodos.
            return [
                ...current,
                {
                    payment_method_id: method.id,
                    amount: 0,
                },
            ];
        });
    }

    // =====================================================
    // MODIFICAR IMPORTE DE UN MÉTODO
    // =====================================================

    function updatePaymentAmount(methodId, value) {
        const amount = value === '' ? '' : Number(value);
        setPayments((current) => current.map((payment) => payment.payment_method_id === methodId ? { ...payment, amount } : payment));
    }

    // =====================================================
    // OBTENER NOMBRE DEL MÉTODO
    // =====================================================

    function getPaymentMethodName(methodId) {
        return (paymentMethods.find((method) => method.id === methodId)?.name || 'Método de pago');
    }

    // =====================================================
    // VALIDAR Y REGISTRAR VENTA
    // =====================================================

    async function handleCompleteSale() {

        if (cart.length === 0) return toast.error('Agrega productos a la venta.');

        if (!profile?.company_id || !profile?.id || !profile?.store_id) return toast.error('No se encontró la información de empresa, usuario o tienda.');

        // FULL: exactamente un método.
        if (paymentType === 'full' && payments.length !== 1) return toast.error('Para pago FULL selecciona exactamente un método.');

        // PARTIAL: mínimo dos métodos.
        if (paymentType === 'partial' && payments.length < 2) return toast.error('Para pago PARTIAL selecciona al menos dos métodos.');
            
        // Validar importes.
        if (payments.some((payment) => !Number.isFinite(Number(payment.amount)) || Number(payment.amount) <= 0)) return toast.error('Todos los métodos seleccionados deben tener un importe mayor que cero.');

        // El pago debe cubrir exactamente el total.
        if (paymentDifference !== 0) return toast.error(paymentDifference > 0 ? `Falta distribuir S/ ${paymentDifference.toFixed(2)}.` : `Hay un excedente de S/ ${Math.abs(paymentDifference).toFixed(2)}.`);

        try {
            setLoadingSale(true);

            // Preparar productos.
            const items = cart.map((item) => ({
                product_id: item.id,
                name: item.name,
                sku: item.sku,
                price: Number(item.price),
                quantity: Number(item.quantity),
                unit: item.unit,
            }));

            // Registrar venta mediante RPC.
            const sale = await createdSale({
                companyId: profile.company_id,
                profile,
                selectedStore: profile.store_id,
                paymentType,
                // FULL: un método con el total.
                // PARTIAL: varios métodos con sus importes.
                payments: effectivePayments,
                total,
                items,
                customerName: 'Público general',
            });

            toast.success('Venta registrada', {description: `Venta ${sale.sale_code} por S/ ${Number(sale.total).toFixed(2)}`});

            // =================================================
            // PREPARAR INFORMACIÓN DE PAGOS PARA EL TICKET
            // =================================================

            const paymentDescription = effectivePayments
                .map((payment) => {
                    return `${getPaymentMethodName(payment.payment_method_id)}: S/ ${Number(payment.amount).toFixed(2)}`;
                })
                .join(' | ');

            // =================================================
            // GENERAR TICKET
            // =================================================

            const newSale = {
                companyName: profile?.store?.name || 'Mi tienda',
                taxId: profile?.store?.ruc || '',
                companyAddress: profile?.store?.address || '',
                companyCity: 'Jauja, Junín',
                companyCountry: 'PERÚ',
                fiscalRegime: '',
                expeditionPlace: 'Jauja',
                saleNumber: sale.sale_code || '',
                date: new Date().toLocaleString('es-PE'),
                customerName: 'Público en General',
                cashier: profile?.full_name || profile?.name || 'Administrador',
                items,
                subtotal: sale.subtotal,
                discounts: discount,
                tax: 0,
                taxLabel: 'IGV',
                total: sale.total,
                totalInWords: '',
                currency: 'S/',
                currencyName: 'Sol peruano',
                paymentMethod: paymentDescription,
                paymentType: paymentType === 'full' ? 'Pago completo' : 'Pago dividido',
                exchangeRate: 1,
            };

            try {
                await salePrint(newSale);
            } catch (printError) {
                console.error('Venta registrada, pero falló la impresión:', printError);
                toast.warning('La venta se registró, pero no se pudo imprimir el ticket.');
            }

            // =================================================
            // REINICIAR POS
            // =================================================

            setCart([]);
            setPayments([]);
            setPaymentType('full');

        } catch (saleError) {
            console.error('Error registrando venta:', saleError);
            toast.error('No se pudo registrar la venta', {description: saleError?.message || 'Ocurrió un error inesperado.',});
        } finally {
            setLoadingSale(false);
        }
    }

    return (
        <aside className="pos__cart">

            <div className="pos__cart-header">
                <div>
                    <h2 className="pos__cart-title">Venta actual</h2>
                    <p className="pos__cart-count">{itemCount}{' '}{itemCount === 1 ? 'producto' : 'productos'}</p>
                </div>

                {cart.length > 0 && (
                    <button type="button" className="btn btn--ghost btn--icon btn--sm" onClick={clearCart} title="Vaciar venta">
                        <IconTrash size={16} />
                    </button>
                )}
            </div>

            <button type="button" className="pos__customer">
                <div>
                    <span className="pos__customer-label">Cliente</span>
                    <span className="pos__customer-name">Público general</span>
                </div>
                <IconUser size={16} />
            </button>

            {/* PRODUCTOS DEL CARRITO */}

            <div className="pos__cart-items">
                {cart.length === 0 ? (
                    <div className="card__body">
                        <p className="text-sm text-gray">No hay productos agregados.</p>
                    </div>
                ) : (
                    cart.map((item) => (
                        <div key={item.id} className="pos__cart-item">
                            <div className="pos__cart-item-info">
                                <p>{item.name}</p>
                                <span>S/ {item.price.toFixed(2)} {' · '} {item.unit}</span>
                                <div className="pos__quantity">
                                    {item.quantity === 1 ? (
                                        <button type="button" className="btn btn-secondary btn-sm" onClick={() => removeFromCart(item.id)}>
                                            <IconTrash size={14} />
                                        </button>
                                    ) : (
                                        <button type="button" className="btn btn-primary btn-sm" onClick={() => updateQuantity(item.id, -1)} disabled={item.quantity <= 1}>
                                            <IconMinus size={14} />
                                        </button>
                                    )}
                                    <span>{item.quantity}</span>
                                    <button type="button" className="btn btn-primary btn-sm" onClick={() => updateQuantity(item.id, 1)} disabled={item.quantity >= item.stock}>
                                        <IconPlus size={14} />
                                    </button>
                                    
                                </div>
                            </div>
                            <span className="pos__cart-item-total">S/ {(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                    ))
                )}
            </div>

            {/* RESUMEN */}

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

            {/* =====================================
                CONFIGURACIÓN DE PAGOS
            ===================================== */}

            <div className="pos__payment">

                <p className="pos__payment-label">Tipo de pago</p>

                <select className="input" value={paymentType} style={{ marginBottom: '10px' }} onChange={(event) => changePaymentType(event.target.value)} disabled={loadingSale}>
                    <option value="full">FULL — Un solo método</option>
                    <option value="partial">PARTIAL — Dividir entre métodos</option>
                </select>

                {/* MÉTODOS DISPONIBLES */}

                <p className="pos__payment-label">Métodos de pago</p>

                {paymentMethods.length === 0 ? (
                    <div className="pos__payment-empty">
                        <IconAlertTriangle size={16} />
                        <span>No hay métodos de pago configurados.</span>
                    </div>
                ) : (
                    <div className="pos__payment-methods">
                        {paymentMethods.map((method) => {
                            const selected = payments.some((payment) => payment.payment_method_id === method.id);

                            return (
                                <button key={method.id} type="button" className={`pos__payment-method ${selected ? 'pos__payment-method--active' : ''}`} onClick={() => togglePaymentMethod(method)} disabled={loadingSale}>
                                    {method.type === 'cash' && ( <IconCash size={18} />)}

                                    {method.type === 'card' && ( <IconCreditCard size={18} />)}

                                    {method.type === 'digital_wallet' && ( <IconDeviceMobile size={18} />)}

                                    {!['cash','card','digital_wallet',].includes(method.type) && ( <IconDeviceMobile size={18} />)}

                                    {method.name}

                                    {selected && ( <IconCheck size={16} />)}
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* DISTRIBUCIÓN DE PAGOS */}

                {payments.length > 0 && (
                    <div className="pos__payment-allocation">
                        <p className="pos__payment-label">{paymentType === 'full' ? 'Importe del método seleccionado' : 'Distribución de importes'}</p>
                        {payments.map((payment) => (
                            <div key={payment.payment_method_id} className="pos__payment-allocation-row">
                                <label>{getPaymentMethodName(payment.payment_method_id)}</label>
                                {paymentType === 'full' ? (
                                    <strong>S/ {total.toFixed(2)}</strong>
                                ) : (
                                    <input className="input" type="number" min="0.01" step="0.01" inputMode="decimal" placeholder="0.00" value={payment.amount} onChange={(event) => updatePaymentAmount(payment.payment_method_id, event.target.value)} disabled={loadingSale}/>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* RESUMEN DE DISTRIBUCIÓN */}

                {paymentDifference > 0 && (
                    <div className="pos__payment-summary" style={{display: 'block'}}>
                        <div>
                            <span>{paymentDifference > 0 ? 'Falta distribuir' : paymentDifference < 0 ? 'Excedente' : 'Diferencia'}</span>
                            <strong className={paymentDifference === 0 ? 'text-success' : 'text-danger'}>S/ {Math.abs(paymentDifference).toFixed(2)}</strong>
                        </div>
                    </div>
                )}

                {paymentType === 'partial' && payments.length === 1 && ( <small>Selecciona al menos otro método para dividir el pago.</small> )}

            </div>

            {/* =====================================
                BOTÓN COBRAR
            ===================================== */}

            <button type="button" onClick={handleCompleteSale} className="btn btn-primary pos__complete" disabled={cart.length === 0 || !paymentIsValid || paymentMethods.length === 0 || loadingSale}>
                {loadingSale ? 'Registrando venta...' : `Cobrar S/ ${total.toFixed(2)}`}
            </button>

        </aside>
    )
}