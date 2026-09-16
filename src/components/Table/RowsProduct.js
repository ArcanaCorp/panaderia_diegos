'use client';

import {
    IconDotsVertical,
    IconEdit,
    IconPackage,
    IconRefresh,
    IconTrash,
} from '@tabler/icons-react';

import { useState } from 'react';
import { toast } from 'sonner';

import { useModal } from '@/context/ModalContext';
import { deleteProduct } from '@/services/products/product.service';

export default function RowsProduct({
    product,
    onProductUpdated,
    onProductDeleted,
    onStockUpdated,
}) {

    const { openModal } = useModal();

    const [deleting, setDeleting] = useState(false);

    function handleEdit() {
        openModal('product-edit', product, {
            onSuccess: (updatedProduct) => {
                onProductUpdated(updatedProduct);

                toast.success(
                    'Producto actualizado'
                );
            },
        });
    }

    function handleStock() {
        openModal('product-stock', product, {
            onSuccess: (updatedProduct) => {
                onStockUpdated(updatedProduct);

                toast.success(
                    'Stock actualizado'
                );
            },
        });
    }

    function handleDetail() {
        openModal(
            'product-detail',
            product
        );
    }

    async function handleDelete() {
        const confirmed = window.confirm(
            `¿Eliminar "${product.name}"?`
        );

        if (!confirmed) return;

        try {
            setDeleting(true);

            await deleteProduct(
                product.id
            );

            onProductDeleted(
                product.id
            );

            toast.success(
                'Producto eliminado',
                {
                    description:
                        `${product.name} fue eliminado correctamente.`,
                }
            );

        } catch (error) {
            console.error(
                'Error eliminando producto:',
                error
            );

            toast.error(
                'No se pudo eliminar el producto',
                {
                    description:
                        error?.message ||
                        'Ocurrió un error inesperado.',
                }
            );

        } finally {
            setDeleting(false);
        }
    }

    return (
        <tr>

            <td>
                <div className="products__product">

                    <div className="products__product-icon">
                        <IconPackage size={16} />
                    </div>

                    <div>
                        <strong>
                            {product.name}
                        </strong>

                        <span>
                            {product.unit ||
                                product.unit_type}
                        </span>
                    </div>

                </div>
            </td>

            <td>
                <span className="products__sku">
                    {product.sku}
                </span>
            </td>

            <td>
                {product.category ||
                    product?.product_categories?.name ||
                    'Sin categoría'}
            </td>

            <td>
                <strong>
                    S/ {Number(
                        product.price_unit || 0
                    ).toFixed(2)}
                </strong>
            </td>

            <td>
                <div className="products__stock">

                    <strong>
                        {product.stock || 0}
                    </strong>

                    <span>
                        mín. {
                            product.minimum_stock ??
                            product.minStock ??
                            0
                        }
                    </span>

                </div>
            </td>

            <td>
                <span
                    className={`badge ${
                        product.status ===
                        'Disponible'
                            ? 'badge--success'
                            : product.status ===
                              'Stock bajo'
                                ? 'badge--warning'
                                : 'badge--danger'
                    }`}
                >
                    {product.status}
                </span>
            </td>

            <td>
                <div className="products__actions">

                    <button
                        type="button"
                        className="btn btn--icon btn--ghost btn--sm"
                        title="Rellenar stock"
                        onClick={handleStock}
                    >
                        <IconRefresh size={16} />
                    </button>

                    <button
                        type="button"
                        className="btn btn--icon btn--ghost btn--sm"
                        title="Editar"
                        onClick={handleEdit}
                    >
                        <IconEdit size={16} />
                    </button>

                    <button
                        type="button"
                        className="btn btn--icon btn--ghost btn--sm products__delete"
                        title="Eliminar"
                        disabled={deleting}
                        onClick={handleDelete}
                    >
                        <IconTrash size={16} />
                    </button>

                    <button
                        type="button"
                        className="btn btn--icon btn--ghost btn--sm"
                        title="Más opciones"
                        onClick={handleDetail}
                    >
                        <IconDotsVertical size={16} />
                    </button>

                </div>
            </td>

        </tr>
    );
}