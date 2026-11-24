import { IconDotsVertical, IconPackage } from "@tabler/icons-react";
import { formatDate, getPriorityClass, getPriorityLabel, getStatusClass, getStatusLabel } from '@/helpers/produccion.helper';

export default function RowsProduction ({ order, handleDetail }) {

    const firstItem = order.items?.[0];
    const totalItems =  order.items?.length || 0;
    const quantity = order.items?.reduce((total, item) => total + Number(item.quantity || 0), 0) || 0;

    return (
        <tr>
            <td>
                <span className="production__order-id">{order.code || order.id}</span>
            </td>
            <td>
                <div className="production__product">
                    <div className="production__product-icon">
                        <IconPackage size={16} />
                    </div>
                    <div>
                        <p className="production__product-name">{firstItem?.product.name || 'Producto'}</p>
                        {totalItems > 1 && (
                            <span className="production__unit">+ {totalItems - 1} productos</span>
                        )}
                    </div>
                </div>
            </td>
            <td>
                <strong className="production__quantity">{quantity}</strong>
                <span className="production__unit">{firstItem?.unit_type || 'unidades'}</span>
            </td>
            <td>
                <span className={getPriorityClass(order.priority)}>{getPriorityLabel(order.priority)}</span>
            </td>
            <td>
                <span className="production__requested">{order.user_id ? 'Usuario' : '-'}</span>
            </td>
            <td>
                <span className="production__date">{formatDate(order.created_at)}</span>
            </td>
            <td>
                <span className={getStatusClass(order.status)}>{getStatusLabel(order.status)}</span>
            </td>
            <td>
                <button type="button" className="btn btn--ghost btn--icon" title="Ver detalles" onClick={() => handleDetail(order)}>
                    <IconDotsVertical size={17}/>
                </button>
            </td>
        </tr>
    )
}