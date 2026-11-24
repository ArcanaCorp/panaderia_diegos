import { IconMinus, IconPlus, IconTransfer, IconTrash, IconX } from "@tabler/icons-react";
import { useState } from "react";

export default function TransferProducts ({ products, store, stores, transferring, close }) {

    const [destinationStore, setDestinationStore] = useState('');
    const [transferItems, setTransferItems] = useState([]);
    const [notes, setNotes] = useState('');

    function addTransferProduct(product) {

        const existing =
            transferItems.find(
                (item) =>
                    item.product_id === product.id
            );

        if (existing) {
            setTransferItems(
                transferItems.map((item) =>
                    item.product_id === product.id
                        ? {
                              ...item,
                              quantity: Math.min(
                                  item.quantity + 1,
                                  Number(product.stock)
                              ),
                          }
                        : item
                )
            );

            return;
        }

        setTransferItems([
            ...transferItems,
            {
                product_id: product.id,
                name: product.name,
                sku: product.sku,
                stock: Number(product.stock || 0),
                quantity: 1,
                unit: product.unit,
            },
        ]);
    }

    function updateTransferQuantity(
        productId,
        amount
    ) {
        setTransferItems(
            transferItems
                .map((item) => {

                    if (
                        item.product_id !==
                        productId
                    ) {
                        return item;
                    }

                    const quantity = Math.min(
                        Math.max(
                            item.quantity +
                                amount,
                            0
                        ),
                        item.stock
                    );

                    return {
                        ...item,
                        quantity,
                    };
                })
                .filter(
                    (item) =>
                        item.quantity > 0
                )
        );
    }

    function removeTransferProduct(
        productId
    ) {
        setTransferItems(
            transferItems.filter(
                (item) =>
                    item.product_id !==
                    productId
            )
        );
    }

    async function handleTransfer() {

        if (!destinationStore) {
            toast.warning('Selecciona una tienda de destino.');
            return;
        }

        if (transferItems.length === 0) {
            toast.warning('Agrega al menos un producto.');
            return;
        }

        const items = transferItems.map(
            (item) => ({
                product_id:
                    item.product_id,
                quantity:
                    item.quantity,
            })
        );

        try {

            await transfer({
                destinationStoreId:
                    destinationStore,
                items,
                notes,
            });

            setShowTransferModal(false);
            setDestinationStore('');
            setTransferItems([]);
            setNotes('');

            toast.success('Productos transferidos correctamente.');

        } catch (err) {
            console.log(err?.message || 'No se pudo realizar la transferencia.');
            toast.error('No se pudo realizar la transferencia.')
        }
    }

    const changeAddProduct = (e) => {
        const product = products.find((item) => item.id === e.target.value);
        if (product) {
            addTransferProduct(product);
        }
        e.target.value = '';
    }

    return (
        <div className="modal-overlay">
            
            <div className="modal">

                <div className="modal__header">
                    <div>
                        <h2>Transferir productos</h2>
                        <p>Desde{' '}<strong>{store?.name}</strong></p>
                    </div>
                    <button className="btn btn--ghost btn--icon" onClick={close} disabled={transferring}>
                        <IconX size={18}/>
                    </button>
                </div>

                <div className="modal__body">

                    <div className="form-group">
                        <label>Tienda de destino</label>
                        <select className="input" value={destinationStore} onChange={(e) => setDestinationStore(e.target.value)}>
                            <option value="">Seleccionar tienda...</option>
                            {stores.map((item) => (<option key={item.id} value={item.id}>{item.name}</option>))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Agregar productos</label>
                        <select className="input" defaultValue="" onChange={(e) => changeAddProduct(e)}>
                            <option value="">Seleccionar producto...</option>
                            {products
                                .filter((item) => Number(item.stock || 0) > 0)
                                .map((item) => (
                                <option key={item.id} value={item.id}>{item.name}{' '}— Stock:{' '}{item.stock}</option>
                            ))}
                        </select>
                    </div>

                    {transferItems.length > 0 && (
                        <div className="transfer-list">
                            {transferItems.map((item) => (
                                <div key={item.product_id} className="transfer-item">
                                    <div>
                                        <strong>{item.name}</strong>
                                        <span>{item.sku}{' '} · Stock:{' '}{item.stock}</span>
                                    </div>
                                    <div className="transfer-item__controls">
                                        {item.quantity === 1 ? (
                                            <button type="button" className="btn btn-primary btn-sm" onClick={() => removeTransferProduct(item.product_id)}>
                                                <IconTrash size={14} color="#FFF"/>
                                            </button>
                                        ) : (
                                            <button type="button" className="btn btn-primary btn-sm" onClick={() => updateTransferQuantity(item.product_id, -1)}>
                                                <IconMinus size={14} color="#FFF"/>
                                            </button>
                                        )}
                                        <div>{item.quantity}</div>
                                        <button type="button" className="btn btn-primary btn-sm" disabled={item.quantity >= item.stock} onClick={() => updateTransferQuantity(item.product_id, 1)}>
                                            <IconPlus size={14} color="#FFF"/>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="form-group">
                        <label>Observaciones</label>
                        <textarea className="input" rows="3" placeholder="Observaciones de la transferencia..." value={notes} onChange={(e) => setNotes(e.target.value)}/>
                    </div>
                </div>

                <div className="modal__footer">
                    <button className="btn btn-ghost" onClick={close} disabled={transferring}>Cancelar</button>
                    <button className="btn btn-primary text-white" onClick={handleTransfer} disabled={transferring || !destinationStore || transferItems.length === 0}>
                        <IconTransfer size={16}/>
                        {transferring ? 'Transfiriendo...' : 'Confirmar transferencia'}
                    </button>
                </div>

            </div>

        </div>
    )
}