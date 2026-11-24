'use client';

import {
    IconPackage,
    IconPlus,
    IconX,
} from '@tabler/icons-react';

import { useEffect, useMemo, useState } from 'react';

import { db } from '@/libs/supabase';

export default function ProductStockModal({ product, onClose, onSuccess }) {
    
    const [stores, setStores] = useState([]);

    const [storeId, setStoreId] = useState('');

    const [quantity, setQuantity] = useState('');

    const [loading, setLoading] = useState(false);

    const [loadingStores, setLoadingStores] = useState(true);

    const [error, setError] = useState(null);

    useEffect(() => {
        async function loadStores() {
            try {
                const {
                    data,
                    error,
                } = await db
                    .from('stores')
                    .select(`
                        id,
                        name,
                        code,
                        is_main,
                        is_active
                    `)
                    .eq('is_active', true)
                    .order('is_main', {
                        ascending: false,
                    })
                    .order('name');

                if (error) {
                    throw error;
                }

                setStores(data || []);

                if (data?.length) {
                    setStoreId(data[0].id);
                }

            } catch (err) {
                console.error(
                    'Error cargando tiendas:',
                    err
                );

                setError(
                    'No se pudieron cargar las tiendas.'
                );
            } finally {
                setLoadingStores(false);
            }
        }

        loadStores();
    }, []);

    const selectedStore = useMemo(
        () =>
            stores.find(
                store =>
                    store.id === storeId
            ),
        [stores, storeId]
    );

    async function handleSubmit(event) {
        event.preventDefault();

        const amount = Number(quantity);

        if (!storeId) {
            setError(
                'Selecciona una tienda.'
            );
            return;
        }

        if (!amount || amount <= 0) {
            setError(
                'Ingresa una cantidad válida.'
            );
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const {
                data: companyId,
                error: companyError,
            } = await db.rpc(
                'get_my_company_id'
            );

            if (companyError) {
                throw companyError;
            }

            if (!companyId) {
                throw new Error(
                    'No se encontró la empresa.'
                );
            }

            const {
                error: stockError,
            } = await db.rpc(
                'add_product_stock',
                {
                    p_company_id:
                        companyId,

                    p_store_id:
                        storeId,

                    p_product_id:
                        product.id,

                    p_quantity:
                        amount,
                }
            );

            if (stockError) {
                throw stockError;
            }

            /*
             * El RPC ya modificó la base.
             *
             * Para actualizar la fila inmediatamente
             * necesitamos conocer el nuevo stock.
             *
             * Si product.stock representa el stock
             * total de todas las tiendas, se suma
             * directamente la cantidad agregada.
             */
            const updatedProduct = {
                ...product,
                stock:
                    Number(product.stock || 0) +
                    amount,
            };

            onSuccess(updatedProduct);

        } catch (err) {
            console.error(
                'Error agregando stock:',
                err
            );

            setError(
                err?.message ||
                'No se pudo agregar el stock.'
            );
        } finally {
            setLoading(false);
        }
    }

    const currentStock = Number(product.stock || 0);

    const addedStock = Number(quantity || 0);

    const newStock = currentStock + addedStock;

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
            <div className="modal modal--sm">

                <header className="modal__header">

                    <div className="modal__title">

                        <div className="modal__icon">
                            <IconPlus size={18} />
                        </div>

                        <div>
                            <h2>
                                Agregar stock
                            </h2>

                            <p>
                                {product.name}
                            </p>
                        </div>

                    </div>

                    <button
                        type="button"
                        className="modal__close"
                        onClick={onClose}
                        disabled={loading}
                    >
                        <IconX size={18} />
                    </button>

                </header>

                <form onSubmit={handleSubmit}>

                    <div className="modal__body">

                        <div className="modal__form">

                            <div className="modal__field">
                                <label>
                                    Tienda *
                                </label>

                                <select
                                    value={storeId}
                                    onChange={event =>
                                        setStoreId(
                                            event.target.value
                                        )
                                    }
                                    disabled={
                                        loading ||
                                        loadingStores
                                    }
                                    required
                                >
                                    <option value="">
                                        Seleccionar tienda
                                    </option>

                                    {stores.map(
                                        store => (
                                            <option
                                                key={
                                                    store.id
                                                }
                                                value={
                                                    store.id
                                                }
                                            >
                                                {store.name}
                                                {store.is_main
                                                    ? ' · Principal'
                                                    : ''}
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>

                            <div className="modal__field">
                                <label>
                                    Cantidad a agregar *
                                </label>

                                <input
                                    type="number"
                                    value={quantity}
                                    onChange={event =>
                                        setQuantity(
                                            event.target.value
                                        )
                                    }
                                    min="0.001"
                                    step={
                                        product.allow_fraction
                                            ? '0.001'
                                            : '1'
                                    }
                                    placeholder="0"
                                    required
                                />
                            </div>

                            <div className="modal__options">

                                <div className="modal__field">
                                    <label>
                                        Stock actual
                                    </label>

                                    <strong>
                                        {currentStock}{' '}
                                        {product.unit_type}
                                    </strong>
                                </div>

                                <div className="modal__field">
                                    <label>
                                        Nuevo stock
                                    </label>

                                    <strong>
                                        {newStock}{' '}
                                        {product.unit_type}
                                    </strong>
                                </div>

                            </div>

                            {selectedStore && (
                                <div>
                                    Se agregará stock a{' '}
                                    <strong>
                                        {selectedStore.name}
                                    </strong>.
                                </div>
                            )}

                            {error && (
                                <div className="modal__error">
                                    {error}
                                </div>
                            )}

                        </div>

                    </div>

                    <footer className="modal__footer">

                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={
                                loading ||
                                loadingStores
                            }
                        >
                            <IconPlus size={16} />

                            {loading
                                ? 'Agregando...'
                                : 'Agregar stock'}
                        </button>

                    </footer>

                </form>

            </div>
        </div>
    );
}