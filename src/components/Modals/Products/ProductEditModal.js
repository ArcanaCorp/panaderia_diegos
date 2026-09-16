'use client';

import { IconEdit, IconX } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { db } from '@/libs/supabase';
import { updateProduct } from '@/services/products/product.service';

const INITIAL_FORM = {
    name: '',
    description: '',
    category_id: '',
    unit_type: 'unidad',
    unit_weight: '',
    unit_measure: '',
    allow_fraction: false,
    price_unit: '',
    price_dozen: '',
    cost_price: '',
    track_inventory: true,
    is_perishable: false,
    requires_expiration_date: false,
    image_url: '',
};

export default function ProductEditModal({ product, onClose, onSuccess }) {

    const [form, setForm] = useState(INITIAL_FORM);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setForm({
            name: product.name || '',
            description: product.description || '',
            category_id: product.category_id || '',
            unit_type: product.unit_type || 'unidad',
            unit_weight: product.unit_weight || '',
            unit_measure: product.unit_measure || '',
            allow_fraction: product.allow_fraction || false,
            price_unit: product.price_unit || '',
            price_dozen: product.price_dozen || '',
            cost_price: product.cost_price || '',
            track_inventory: product.track_inventory ?? true,
            is_perishable: product.is_perishable || false,
            requires_expiration_date: product.requires_expiration_date || false,
            image_url: product.image_url || '',
        });
    }, [product]);

    useEffect(() => {
        async function loadCategories() {
            try {
                const { data, error } = await db
                    .from('product_categories')
                    .select('id, name')
                    .eq('is_active', true)
                    .order('name');

                if (error) {
                    throw error;
                }

                setCategories(data || []);
            } catch (err) {
                console.error(
                    'Error cargando categorías:',
                    err
                );
            } finally {
                setLoadingCategories(false);
            }
        }

        loadCategories();
    }, []);

    function handleChange(event) {
        const {
            name,
            value,
            type,
            checked,
        } = event.target;

        setForm(current => ({
            ...current,
            [name]:
                type === 'checkbox'
                    ? checked
                    : value,
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();

        try {
            setLoading(true);
            setError(null);

            const updatedProduct = await updateProduct(product.id, form);
            onSuccess(updatedProduct);
        } catch (err) {
            console.error(
                'Error actualizando producto:',
                err
            );

            setError(
                err?.message ||
                'No se pudo actualizar el producto.'
            );
        } finally {
            setLoading(false);
        }
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
                            <IconEdit size={18} />
                        </div>

                        <div>
                            <h2>
                                Editar producto
                            </h2>

                            <p>
                                Actualiza la información
                                del producto.
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

                            <div className="modal__form-grid">

                                <div className="modal__field modal__field--full">
                                    <label>
                                        Nombre del producto *
                                    </label>

                                    <input
                                        name="name"
                                        value={form.name}
                                        onChange={
                                            handleChange
                                        }
                                        required
                                        placeholder="Ej. Pan francés"
                                    />
                                </div>

                                <div className="modal__field modal__field--full">
                                    <label>
                                        Descripción
                                    </label>

                                    <textarea
                                        name="description"
                                        value={
                                            form.description
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        rows={3}
                                        placeholder="Descripción del producto..."
                                    />
                                </div>

                                <div className="modal__field">
                                    <label>
                                        Categoría
                                    </label>

                                    <select
                                        name="category_id"
                                        value={
                                            form.category_id
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        disabled={
                                            loadingCategories
                                        }
                                    >
                                        <option value="">
                                            Sin categoría
                                        </option>

                                        {categories.map(
                                            category => (
                                                <option
                                                    key={
                                                        category.id
                                                    }
                                                    value={
                                                        category.id
                                                    }
                                                >
                                                    {
                                                        category.name
                                                    }
                                                </option>
                                            )
                                        )}
                                    </select>
                                </div>

                                <div className="modal__field">
                                    <label>
                                        Unidad
                                    </label>

                                    <select
                                        name="unit_type"
                                        value={
                                            form.unit_type
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    >
                                        <option value="unidad">
                                            Unidad
                                        </option>
                                        <option value="kg">
                                            Kilogramo
                                        </option>
                                        <option value="g">
                                            Gramo
                                        </option>
                                        <option value="litro">
                                            Litro
                                        </option>
                                        <option value="ml">
                                            Mililitro
                                        </option>
                                        <option value="metro">
                                            Metro
                                        </option>
                                        <option value="paquete">
                                            Paquete
                                        </option>
                                        <option value="docena">
                                            Docena
                                        </option>
                                    </select>
                                </div>

                                <div className="modal__field">
                                    <label>
                                        Precio unitario *
                                    </label>

                                    <input
                                        type="number"
                                        name="price_unit"
                                        value={
                                            form.price_unit
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        min="0"
                                        step="0.01"
                                        required
                                    />
                                </div>

                                <div className="modal__field">
                                    <label>
                                        Precio por docena
                                    </label>

                                    <input
                                        type="number"
                                        name="price_dozen"
                                        value={
                                            form.price_dozen
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        min="0"
                                        step="0.01"
                                    />
                                </div>

                                <div className="modal__field">
                                    <label>
                                        Costo
                                    </label>

                                    <input
                                        type="number"
                                        name="cost_price"
                                        value={
                                            form.cost_price
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        min="0"
                                        step="0.01"
                                    />
                                </div>

                                <div className="modal__field">
                                    <label>
                                        Peso por unidad
                                    </label>

                                    <input
                                        type="number"
                                        name="unit_weight"
                                        value={
                                            form.unit_weight
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        min="0"
                                        step="0.001"
                                    />
                                </div>

                                <div className="modal__field">
                                    <label>
                                        Medida
                                    </label>

                                    <input
                                        name="unit_measure"
                                        value={
                                            form.unit_measure
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Ej. 500 g"
                                    />
                                </div>

                                <div className="modal__field">
                                    <label>
                                        URL de imagen
                                    </label>

                                    <input
                                        name="image_url"
                                        value={
                                            form.image_url
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="https://..."
                                    />
                                </div>

                            </div>

                            <div className="modal__options">

                                <label className="modal__switch">
                                    <div className="modal__switch-content">
                                        <span className="modal__switch-label">
                                            Permitir cantidades fraccionadas
                                        </span>
                                        <span className="modal__switch-description">
                                            Permite registrar cantidades como 0.5, 1.5, etc.
                                        </span>
                                    </div>

                                    <input
                                        type="checkbox"
                                        name="allow_fraction"
                                        checked={form.allow_fraction}
                                        onChange={handleChange}
                                    />

                                    <span className="modal__switch-control" />
                                </label>


                                <label className="modal__switch">
                                    <div className="modal__switch-content">
                                        <span className="modal__switch-label">
                                            Controlar inventario
                                        </span>
                                        <span className="modal__switch-description">
                                            Registra y controla el stock del producto.
                                        </span>
                                    </div>

                                    <input
                                        type="checkbox"
                                        name="track_inventory"
                                        checked={form.track_inventory}
                                        onChange={handleChange}
                                    />

                                    <span className="modal__switch-control" />
                                </label>


                                <label className="modal__switch">
                                    <div className="modal__switch-content">
                                        <span className="modal__switch-label">
                                            Producto perecible
                                        </span>
                                        <span className="modal__switch-description">
                                            Indica que el producto puede tener vencimiento.
                                        </span>
                                    </div>

                                    <input
                                        type="checkbox"
                                        name="is_perishable"
                                        checked={form.is_perishable}
                                        onChange={handleChange}
                                    />

                                    <span className="modal__switch-control" />
                                </label>


                                <label className="modal__switch">
                                    <div className="modal__switch-content">
                                        <span className="modal__switch-label">
                                            Requiere vencimiento
                                        </span>
                                        <span className="modal__switch-description">
                                            Solicita fecha de vencimiento al registrar stock.
                                        </span>
                                    </div>

                                    <input
                                        type="checkbox"
                                        name="requires_expiration_date"
                                        checked={form.requires_expiration_date}
                                        onChange={handleChange}
                                    />

                                    <span className="modal__switch-control" />
                                </label>

                            </div>

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
                            disabled={loading}
                        >
                            {loading
                                ? 'Guardando...'
                                : 'Guardar cambios'}
                        </button>

                    </footer>

                </form>

            </div>
        </div>
    );
}