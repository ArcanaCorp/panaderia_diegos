'use client';

import {
    IconCheck,
    IconInfoCircle,
    IconPackage,
    IconX,
} from '@tabler/icons-react';

export default function ProductDetailModal({
    product,
    onClose,
}) {
    const stock =
        Number(product.stock || 0);

    const minimumStock =
        Number(product.minimum_stock || 0);

    const formatCurrency = value =>
        `S/ ${Number(
            value || 0
        ).toFixed(2)}`;

    function DetailRow({
        label,
        children,
    }) {
        return (
            <div className="modal__detail-row">
                <span>
                    {label}
                </span>

                <strong>
                    {children}
                </strong>
            </div>
        );
    }

    function StatusItem({
        active,
        children,
    }) {
        return (
            <div className="modal__checkbox">
                {active ? (
                    <IconCheck size={16} />
                ) : (
                    <IconX size={16} />
                )}

                <span>
                    {children}
                </span>
            </div>
        );
    }

    return (
        <div
            className="modal-overlay"
            onMouseDown={(event) => {
                if (
                    event.target ===
                    event.currentTarget
                ) {
                    onClose();
                }
            }}
        >
            <div className="modal modal--lg">

                <header className="modal__header">

                    <div className="modal__title">

                        <div className="modal__icon">
                            <IconPackage size={18} />
                        </div>

                        <div>
                            <h2>
                                Detalle del producto
                            </h2>

                            <p>
                                Información completa
                                del producto.
                            </p>
                        </div>

                    </div>

                    <button
                        type="button"
                        className="modal__close"
                        onClick={onClose}
                    >
                        <IconX size={18} />
                    </button>

                </header>

                <div className="modal__body">

                    <div className="modal__form">

                        <div className="modal__detail-header">

                            <div className="modal__detail-icon">
                                <IconPackage
                                    size={24}
                                />
                            </div>

                            <div>
                                <h3>
                                    {product.name}
                                </h3>

                                <span>
                                    SKU: {product.sku}
                                </span>
                            </div>

                        </div>

                        <section className="modal__detail-section">

                            <div className="modal__detail-section-title">
                                <IconInfoCircle
                                    size={16}
                                />

                                <span>
                                    Información general
                                </span>
                            </div>

                            <div className="modal__detail-grid">

                                <DetailRow label="Categoría">
                                    {product.category ||
                                        'Sin categoría'}
                                </DetailRow>

                                <DetailRow label="Unidad">
                                    {product.unit_type ||
                                        '—'}
                                </DetailRow>

                                <DetailRow label="Peso por unidad">
                                    {product.unit_weight
                                        ? `${product.unit_weight}`
                                        : '—'}
                                </DetailRow>

                                <DetailRow label="Medida">
                                    {product.unit_measure ||
                                        '—'}
                                </DetailRow>

                                <DetailRow label="Estado">
                                    <span
                                        className={
                                            `badge ${
                                                product.status ===
                                                'Disponible'
                                                    ? 'badge--success'
                                                    : product.status ===
                                                      'Stock bajo'
                                                        ? 'badge--warning'
                                                        : 'badge--danger'
                                            }`
                                        }
                                    >
                                        {product.status}
                                    </span>
                                </DetailRow>

                                <DetailRow label="Tipo">
                                    Producto terminado
                                </DetailRow>

                            </div>

                        </section>

                        <section className="modal__detail-section">

                            <div className="modal__detail-section-title">
                                <span>
                                    Precios
                                </span>
                            </div>

                            <div className="modal__detail-grid">

                                <DetailRow label="Precio unitario">
                                    {formatCurrency(
                                        product.price_unit
                                    )}
                                </DetailRow>

                                <DetailRow label="Precio por docena">
                                    {product.price_dozen
                                        ? formatCurrency(
                                            product.price_dozen
                                        )
                                        : '—'}
                                </DetailRow>

                                <DetailRow label="Costo">
                                    {formatCurrency(
                                        product.cost_price
                                    )}
                                </DetailRow>

                            </div>

                        </section>

                        <section className="modal__detail-section">

                            <div className="modal__detail-section-title">
                                <span>
                                    Inventario
                                </span>
                            </div>

                            <div className="modal__detail-grid">

                                <DetailRow label="Stock actual">
                                    {stock}{' '}
                                    {product.unit_type}
                                </DetailRow>

                                <DetailRow label="Stock mínimo">
                                    {minimumStock}{' '}
                                    {product.unit_type}
                                </DetailRow>

                                <DetailRow label="Control de inventario">
                                    {product.track_inventory
                                        ? 'Sí'
                                        : 'No'}
                                </DetailRow>

                            </div>

                        </section>

                        <section className="modal__detail-section">

                            <div className="modal__detail-section-title">
                                <span>
                                    Configuración
                                </span>
                            </div>

                            <div className="modal__options">

                                <StatusItem
                                    active={
                                        product.is_active
                                    }
                                >
                                    Producto activo
                                </StatusItem>

                                <StatusItem
                                    active={
                                        product.track_inventory
                                    }
                                >
                                    Controla inventario
                                </StatusItem>

                                <StatusItem
                                    active={
                                        product.allow_fraction
                                    }
                                >
                                    Permite cantidades
                                    fraccionadas
                                </StatusItem>

                                <StatusItem
                                    active={
                                        product.is_perishable
                                    }
                                >
                                    Producto perecible
                                </StatusItem>

                                <StatusItem
                                    active={
                                        product.requires_expiration_date
                                    }
                                >
                                    Requiere vencimiento
                                </StatusItem>

                            </div>

                        </section>

                        {product.description && (
                            <section className="modal__detail-section">

                                <div className="modal__detail-section-title">
                                    <span>
                                        Descripción
                                    </span>
                                </div>

                                <p>
                                    {product.description}
                                </p>

                            </section>
                        )}

                    </div>

                </div>

                <footer className="modal__footer">

                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={onClose}
                    >
                        Cerrar
                    </button>

                </footer>

            </div>
        </div>
    );
}