
'use client';

import { useMemo, useState } from 'react';

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
    IconCheck,
} from '@tabler/icons-react';

import { useAuth } from '@/context/AuthContext';
import { useSalesPOS } from '@/hooks/useSalesPOS';
import { toast } from 'sonner';
import { createdSale } from '@/services/pos.service';
import { salePrint } from '@/services/print.service';

const roundMoney = (value) =>
    Math.round((Number(value) + Number.EPSILON) * 100) / 100;

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

    // FULL: un solo método.
    // PARTIAL: varios métodos para dividir el importe.
    const [paymentType, setPaymentType] = useState('full');

    const [payments, setPayments] = useState([]);
    const [cart, setCart] = useState([]);
    const [loadingSale, setLoadingSale] = useState(false);

    // =====================================================
    // CATEGORÍAS
    // =====================================================

    const categories = useMemo(
        () => ['Todos', ...dbCategories.map((item) => item.name)],
        [dbCategories]
    );

    // =====================================================
    // FILTRAR PRODUCTOS
    // =====================================================

    const filteredProducts = useMemo(() => {
        const searchValue = search.trim().toLowerCase();

        return products.filter((product) => {
            const matchesCategory =
                category === 'Todos' || product.category === category;

            const matchesSearch =
                !searchValue ||
                product.name?.toLowerCase().includes(searchValue) ||
                product.sku?.toLowerCase().includes(searchValue);

            return matchesCategory && matchesSearch;
        });
    }, [products, category, search]);

    // =====================================================
    // TOTALES
    // =====================================================

    const subtotal = roundMoney(
        cart.reduce(
            (sum, item) =>
                sum + Number(item.price) * Number(item.quantity),
            0
        )
    );

    const discount = 0;

    const total = Math.max(
        roundMoney(subtotal - discount),
        0
    );

    const itemCount = cart.reduce(
        (sum, item) => sum + Number(item.quantity),
        0
    );

    // =====================================================
    // PAGOS
    // =====================================================

    // FULL siempre utiliza el total actual de la venta.
    // Si se agregan o eliminan productos, el importe se actualiza.
    const effectivePayments = payments.map((payment) => ({
        ...payment,
        amount:
            paymentType === 'full'
                ? total
                : Number(payment.amount || 0),
    }));

    const paymentTotal = roundMoney(
        effectivePayments.reduce(
            (sum, payment) => sum + Number(payment.amount || 0),
            0
        )
    );

    const paymentDifference = roundMoney(
        total - paymentTotal
    );

    // Validación completa de los pagos.
    const paymentIsValid =
        paymentType === 'full'
            ? payments.length === 1 && total > 0
            : payments.length >= 2 &&
              payments.every(
                  (payment) =>
                      Number(payment.amount) > 0 &&
                      Number.isFinite(Number(payment.amount))
              ) &&
              paymentDifference === 0;

    // =====================================================
    // AGREGAR PRODUCTO
    // =====================================================

    function addToCart(product) {
        const stock = Number(product.stock || 0);

        if (stock <= 0) {
            toast.error('Producto sin stock disponible.');
            return;
        }

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

    // =====================================================
    // MODIFICAR CANTIDAD
    // =====================================================

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
        setCart((current) =>
            current.filter((item) => item.id !== id)
        );
    }

    // =====================================================
    // LIMPIAR VENTA
    // =====================================================

    function clearCart() {
        setCart([]);
        setPayments((current) =>
            current.map((payment) => ({
                ...payment,
                amount: 0,
            }))
        );
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
            const exists = current.some(
                (payment) =>
                    payment.payment_method_id === method.id
            );

            // Si ya está seleccionado, lo eliminamos.
            if (exists) {
                return current.filter(
                    (payment) =>
                        payment.payment_method_id !== method.id
                );
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

        setPayments((current) =>
            current.map((payment) =>
                payment.payment_method_id === methodId
                    ? {
                          ...payment,
                          amount,
                      }
                    : payment
            )
        );
    }

    // =====================================================
    // OBTENER NOMBRE DEL MÉTODO
    // =====================================================

    function getPaymentMethodName(methodId) {
        return (
            paymentMethods.find(
                (method) => method.id === methodId
            )?.name || 'Método de pago'
        );
    }

    // =====================================================
    // VALIDAR Y REGISTRAR VENTA
    // =====================================================

    async function handleCompleteSale() {
        if (cart.length === 0) {
            toast.error('Agrega productos a la venta.');
            return;
        }

        if (
            !profile?.company_id ||
            !profile?.id ||
            !profile?.store_id
        ) {
            toast.error(
                'No se encontró la información de empresa, usuario o tienda.'
            );
            return;
        }

        // FULL: exactamente un método.
        if (
            paymentType === 'full' &&
            payments.length !== 1
        ) {
            toast.error(
                'Para pago FULL selecciona exactamente un método.'
            );
            return;
        }

        // PARTIAL: mínimo dos métodos.
        if (
            paymentType === 'partial' &&
            payments.length < 2
        ) {
            toast.error(
                'Para pago PARTIAL selecciona al menos dos métodos.'
            );
            return;
        }

        // Validar importes.
        if (
            payments.some(
                (payment) =>
                    !Number.isFinite(Number(payment.amount)) ||
                    Number(payment.amount) <= 0
            )
        ) {
            toast.error(
                'Todos los métodos seleccionados deben tener un importe mayor que cero.'
            );
            return;
        }

        // El pago debe cubrir exactamente el total.
        if (paymentDifference !== 0) {
            toast.error(
                paymentDifference > 0
                    ? `Falta distribuir S/ ${paymentDifference.toFixed(2)}.`
                    : `Hay un excedente de S/ ${Math.abs(paymentDifference).toFixed(2)}.`
            );

            return;
        }

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

            toast.success('Venta registrada', {
                description: `Venta ${sale.sale_code} por S/ ${Number(
                    sale.total
                ).toFixed(2)}`,
            });

            // =================================================
            // PREPARAR INFORMACIÓN DE PAGOS PARA EL TICKET
            // =================================================

            const paymentDescription = effectivePayments
                .map((payment) => {
                    return `${getPaymentMethodName(
                        payment.payment_method_id
                    )}: S/ ${Number(payment.amount).toFixed(2)}`;
                })
                .join(' | ');

            // =================================================
            // GENERAR TICKET
            // =================================================

            const newSale = {
                companyName:
                    profile?.store?.name || 'Mi tienda',

                taxId:
                    profile?.store?.ruc || '',

                companyAddress:
                    profile?.store?.address || '',

                companyCity: 'Jauja, Junín',
                companyCountry: 'PERÚ',

                fiscalRegime: '',
                expeditionPlace: 'Jauja',

                saleNumber: sale.sale_code || '',

                date: new Date().toLocaleString('es-PE'),

                customerName: 'Público en General',

                cashier:
                    profile?.full_name ||
                    profile?.name ||
                    'Administrador',

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

                paymentType:
                    paymentType === 'full'
                        ? 'Pago completo'
                        : 'Pago dividido',

                exchangeRate: 1,
            };

            try {
                await salePrint(newSale);
            } catch (printError) {
                console.error(
                    'Venta registrada, pero falló la impresión:',
                    printError
                );

                toast.warning(
                    'La venta se registró, pero no se pudo imprimir el ticket.'
                );
            }

            // =================================================
            // REINICIAR POS
            // =================================================

            setCart([]);
            setPayments([]);
            setPaymentType('full');

        } catch (saleError) {
            console.error(
                'Error registrando venta:',
                saleError
            );

            toast.error('No se pudo registrar la venta', {
                description:
                    saleError?.message ||
                    'Ocurrió un error inesperado.',
            });

        } finally {
            setLoadingSale(false);
        }
    }

    // =====================================================
    // ESTADOS DE CARGA
    // =====================================================

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

    // =====================================================
    // ESTADO DE ERROR
    // =====================================================

    if (error) {
        return (
            <div className="pos">
                <div className="pos__state pos__state--error">
                    <IconAlertTriangle size={24} />

                    <strong>
                        No se pudo cargar el punto de venta
                    </strong>

                    <span>{error}</span>

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

    // =====================================================
    // INTERFAZ POS
    // =====================================================

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
                    <button
                        className="btn btn--outline"
                        type="button"
                    >
                        <IconScan size={16} />
                        Escanear
                    </button>

                    <button
                        className="btn btn--ghost btn--icon"
                        type="button"
                        onClick={clearCart}
                        title="Nueva venta"
                        disabled={cart.length === 0}
                    >
                        <IconX size={17} />
                    </button>
                </div>
            </header>

            <div className="pos__layout">

                {/* =========================================
                    PRODUCTOS
                ========================================= */}

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
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                        />
                    </div>

                    {/* CATEGORÍAS */}

                    {categories.length > 1 && (
                        <div className="pos__categories">
                            {categories.map((item) => (
                                <button
                                    key={item}
                                    type="button"
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

                    {/* LISTADO DE PRODUCTOS */}

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

                                const outOfStock = stock <= 0;

                                return (
                                    <button
                                        key={product.id}
                                        type="button"
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

                {/* =========================================
                    CARRITO Y COBRO
                ========================================= */}

                <aside className="pos__cart">

                    {/* HEADER CARRITO */}

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
                                type="button"
                                className="btn btn--ghost btn--icon btn--sm"
                                onClick={clearCart}
                                title="Vaciar venta"
                            >
                                <IconTrash size={16} />
                            </button>
                        )}
                    </div>

                    {/* CLIENTE */}

                    <button
                        type="button"
                        className="pos__customer"
                    >
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

                    {/* PRODUCTOS DEL CARRITO */}

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
                                        <p>{item.name}</p>

                                        <span>
                                            S/ {item.price.toFixed(2)}
                                            {' · '}
                                            {item.unit}
                                        </span>

                                        <div className="pos__quantity">

                                            <button
                                                type="button"
                                                className="btn btn-primary btn-xs"
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
                                                className="btn btn-primary btn-sm"
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

                                            <button
                                                type="button"
                                                className="btn btn-secondary btn-sm"
                                                onClick={() =>
                                                    removeFromCart(
                                                        item.id
                                                    )
                                                }
                                            >
                                                <IconTrash size={14} />
                                            </button>
                                        </div>
                                    </div>

                                    <span className="pos__cart-item-total">
                                        S/ {(
                                            item.price *
                                            item.quantity
                                        ).toFixed(2)}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>

                    {/* RESUMEN */}

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

                    {/* =====================================
                        CONFIGURACIÓN DE PAGOS
                    ===================================== */}

                    <div className="pos__payment">

                        <p className="pos__payment-label">
                            Tipo de pago
                        </p>

                        <select
                            className="input"
                            value={paymentType}
                            style={{ marginBottom: '10px' }}
                            onChange={(event) =>
                                changePaymentType(
                                    event.target.value
                                )
                            }
                            disabled={loadingSale}
                        >
                            <option value="full">
                                FULL — Un solo método
                            </option>

                            <option value="partial">
                                PARTIAL — Dividir entre métodos
                            </option>
                        </select>

                        {/* MÉTODOS DISPONIBLES */}

                        <p className="pos__payment-label">
                            Métodos de pago
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
                                {paymentMethods.map((method) => {
                                    const selected = payments.some(
                                        (payment) =>
                                            payment.payment_method_id ===
                                            method.id
                                    );

                                    return (
                                        <button
                                            key={method.id}
                                            type="button"
                                            className={`pos__payment-method ${
                                                selected
                                                    ? 'pos__payment-method--active'
                                                    : ''
                                            }`}
                                            onClick={() =>
                                                togglePaymentMethod(
                                                    method
                                                )
                                            }
                                            disabled={loadingSale}
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

                                            {![
                                                'cash',
                                                'card',
                                                'digital_wallet',
                                            ].includes(method.type) && (
                                                <IconDeviceMobile size={18} />
                                            )}

                                            {method.name}

                                            {selected && (
                                                <IconCheck size={16} />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        )}

                        {/* DISTRIBUCIÓN DE PAGOS */}

                        {payments.length > 0 && (
                            <div className="pos__payment-allocation">

                                <p className="pos__payment-label">
                                    {paymentType === 'full'
                                        ? 'Importe del método seleccionado'
                                        : 'Distribución de importes'}
                                </p>

                                {payments.map((payment) => (
                                    <div
                                        key={payment.payment_method_id}
                                        className="pos__payment-allocation-row"
                                    >
                                        <label>
                                            {getPaymentMethodName(
                                                payment.payment_method_id
                                            )}
                                        </label>

                                        {paymentType === 'full' ? (
                                            <strong>
                                                S/ {total.toFixed(2)}
                                            </strong>
                                        ) : (
                                            <input
                                                className="input"
                                                type="number"
                                                min="0.01"
                                                step="0.01"
                                                inputMode="decimal"
                                                placeholder="0.00"
                                                value={payment.amount}
                                                onChange={(event) =>
                                                    updatePaymentAmount(
                                                        payment.payment_method_id,
                                                        event.target.value
                                                    )
                                                }
                                                disabled={loadingSale}
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* RESUMEN DE DISTRIBUCIÓN */}

                        <div className="pos__payment-summary">

                            <div>
                                <span>
                                    Total de venta
                                </span>

                                <strong>
                                    S/ {total.toFixed(2)}
                                </strong>
                            </div>

                            <div>
                                <span>
                                    Total distribuido
                                </span>

                                <strong>
                                    S/ {paymentTotal.toFixed(2)}
                                </strong>
                            </div>

                            <div>
                                <span>
                                    {paymentDifference > 0
                                        ? 'Falta distribuir'
                                        : paymentDifference < 0
                                          ? 'Excedente'
                                          : 'Diferencia'}
                                </span>

                                <strong
                                    className={
                                        paymentDifference === 0
                                            ? 'text-success'
                                            : 'text-danger'
                                    }
                                >
                                    S/ {Math.abs(
                                        paymentDifference
                                    ).toFixed(2)}
                                </strong>
                            </div>

                        </div>

                        {paymentType === 'partial' &&
                            payments.length === 1 && (
                                <small>
                                    Selecciona al menos otro método
                                    para dividir el pago.
                                </small>
                            )}
                    </div>

                    {/* =====================================
                        BOTÓN COBRAR
                    ===================================== */}

                    <button
                        type="button"
                        onClick={handleCompleteSale}
                        className="btn btn-primary pos__complete"
                        disabled={
                            cart.length === 0 ||
                            !paymentIsValid ||
                            paymentMethods.length === 0 ||
                            loadingSale
                        }
                    >
                        {loadingSale
                            ? 'Registrando venta...'
                            : `Cobrar S/ ${total.toFixed(2)}`}
                    </button>

                </aside>
            </div>
        </div>
    );
}
