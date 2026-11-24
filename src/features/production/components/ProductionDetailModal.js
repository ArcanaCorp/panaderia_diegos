'use client';

import { IconChefHat, IconX, IconPackage, IconCalendar, IconUser, IconNotes } from '@tabler/icons-react';
import { getPriorityClass, getPriorityLabel, getStatusClass, getStatusLabel, formatDate } from '@/helpers/produccion.helper';

export default function ProductionDetailModal({ order, onClose }) {

    if (!order) return null;
    const items = order.items || [];
    const totalQuantity = items.reduce( (total, item) => total + Number(item.quantity || 0), 0);

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

            <div
                className="modal modal--lg"
                role="dialog"
                aria-modal="true"
            >

                {/* HEADER */}

                <div className="modal__header">

                    <div className="modal__title">

                        <div className="modal__icon">

                            <IconChefHat
                                size={20}
                            />

                        </div>

                        <div>

                            <h2>
                                {order.code || 'Orden de producción'}
                            </h2>

                            <p>
                                Detalle de la orden de producción.
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

                </div>


                {/* BODY */}

                <div className="modal__body">

                    {/* RESUMEN */}

                    <div className="modal__detail-grid">

                        <div className="modal__detail-item">

                            <span className="modal__detail-label">
                                Estado
                            </span>

                            <span
                                className={getStatusClass(
                                    order.status
                                )}
                            >
                                {getStatusLabel(
                                    order.status
                                )}
                            </span>

                        </div>


                        <div className="modal__detail-item">

                            <span className="modal__detail-label">
                                Prioridad
                            </span>

                            <span
                                className={getPriorityClass(
                                    order.priority
                                )}
                            >
                                {getPriorityLabel(
                                    order.priority
                                )}
                            </span>

                        </div>


                        <div className="modal__detail-item">

                            <span className="modal__detail-label">
                                Creada
                            </span>

                            <div className="modal__detail-value">

                                <IconCalendar
                                    size={16}
                                />

                                {formatDate(
                                    order.created_at
                                )}

                            </div>

                        </div>


                        <div className="modal__detail-item">

                            <span className="modal__detail-label">
                                Fecha límite
                            </span>

                            <div className="modal__detail-value">

                                <IconCalendar
                                    size={16}
                                />

                                {order.due_date
                                    ? formatDate(
                                        order.due_date
                                    )
                                    : 'Sin fecha'
                                }

                            </div>

                        </div>

                    </div>


                    {/* SOLICITANTE */}

                    <div className="modal__detail-section">

                        <h3>
                            <IconUser size={17} />
                            Información
                        </h3>

                        <div className="modal__detail-info">

                            <div>

                                <span>
                                    Solicitado por
                                </span>

                                <strong>
                                    {order.user_name ||
                                        order.user?.full_name ||
                                        'Usuario'}
                                </strong>

                            </div>


                            <div>

                                <span>
                                    Cantidad total
                                </span>

                                <strong>
                                    {totalQuantity}
                                </strong>

                            </div>

                        </div>

                    </div>


                    {/* PRODUCTOS */}

                    <div className="modal__detail-section">

                        <h3>
                            <IconPackage size={17} />
                            Productos a fabricar
                        </h3>


                        {items.length === 0 ? (

                            <div className="modal__detail-empty">
                                No hay productos registrados.
                            </div>

                        ) : (

                            <div className="modal__detail-list">

                                {items.map(
                                    (
                                        item,
                                        index
                                    ) => (

                                        <div
                                            className="modal__detail-product"
                                            key={
                                                item.id ||
                                                index
                                            }
                                        >

                                            <div className="modal__detail-product-icon">

                                                <IconPackage
                                                    size={17}
                                                />

                                            </div>


                                            <div className="modal__detail-product-main">

                                                <strong>
                                                    {item.product.name ||
                                                        item.product_name ||
                                                        item.name ||
                                                        'Producto'}
                                                </strong>

                                                {item.sku && (

                                                    <span>
                                                        SKU: {item.sku}
                                                    </span>

                                                )}

                                                {item.notes && (

                                                    <small>
                                                        {item.notes}
                                                    </small>

                                                )}

                                            </div>


                                            <div className="modal__detail-product-quantity">

                                                <strong>
                                                    {Number(
                                                        item.quantity
                                                    )}
                                                </strong>

                                                <span>
                                                    {item.unit_type ||
                                                        'unidades'}
                                                </span>

                                            </div>

                                        </div>

                                    )
                                )}

                            </div>

                        )}

                    </div>


                    {/* NOTAS */}

                    {order.notes && (

                        <div className="modal__detail-section">

                            <h3>
                                <IconNotes size={17} />
                                Notas
                            </h3>

                            <p className="modal__detail-notes">
                                {order.notes}
                            </p>

                        </div>

                    )}

                </div>


                {/* FOOTER */}

                <div className="modal__footer">

                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={onClose}
                    >
                        Cerrar
                    </button>

                </div>

            </div>

        </div>

    );
}