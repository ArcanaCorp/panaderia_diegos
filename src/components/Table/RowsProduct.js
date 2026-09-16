import { IconDotsVertical, IconEdit, IconPackage, IconRefresh, IconTrash } from "@tabler/icons-react";

export default function RowsProduct ({ product, handleDelete, handleEdit, handleStock }) {
    return (
        <tr>
            <td>
                <div className="products__product">
                    <div className="products__product-icon">
                        <IconPackage size={16} />
                    </div>
                    <div>
                        <strong>{product.name}</strong>
                        <span>{product.unit}</span>
                    </div>
                </div>
            </td>
            <td>
                <span className="products__sku">{product.sku}</span>
            </td>
            <td>{product?.product_categories?.name}</td>
            <td>
                <strong>S/ {product.price_unit.toFixed(2)}</strong>
            </td>
            <td>
                <div className="products__stock">
                    <strong>{product.stock}</strong>
                    <span>mín. {product.minStock}</span>
                </div>
            </td>
            <td>
                <span className={`badge ${product.status === 'Disponible' ? 'badge--success' : product.status === 'Stock bajo' ? 'badge--warning' : 'badge--danger'}`}>
                    {product.status}
                </span>
            </td>
            <td>
                <div className="products__actions">
                    <button className="btn btn--icon btn--ghost btn--sm" title="Rellenar stock" onClick={() => handleStock(product)}>
                        <IconRefresh size={16} />
                    </button>
                    <button className="btn btn--icon btn--ghost btn--sm" title="Editar" onClick={() => handleEdit(product)}>
                        <IconEdit size={16} />
                    </button>
                    <button className="btn btn--icon btn--ghost btn--sm products__delete" title="Eliminar" onClick={() => handleDelete(product)}>
                        <IconTrash size={16} />
                    </button>
                    <button className="btn btn--icon btn--ghost btn--sm" title="Más opciones">
                        <IconDotsVertical size={16} />
                    </button>
                </div>
            </td>
        </tr>
    )
}