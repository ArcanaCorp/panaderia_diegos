'use client';

import {
    IconChefHat,
    IconX,
    IconPlus,
    IconTrash,
    IconPackage,
    IconSearch,
} from '@tabler/icons-react';

import { useEffect, useState } from 'react';

import { db } from '@/libs/supabase';
import { useAuth } from '@/context/AuthContext';
import { createProductionOrder } from '@/services/produccion.service';


const INITIAL_FORM = {
    priority: 'normal',
    notes: '',
    due_date: '',
    due_time: '',
    items: [],
};


export default function ProductionModal({
    onClose,
    onSuccess,
}) {

    const { profile } = useAuth();


    /*
     * ============================================================
     * FORMULARIO
     * ============================================================
     */

    const [form, setForm] =
        useState(INITIAL_FORM);


    /*
     * ============================================================
     * PRODUCTOS
     * ============================================================
     */

    const [products, setProducts] =
        useState([]);

    const [loadingProducts, setLoadingProducts] =
        useState(true);


    /*
     * ============================================================
     * PRODUCTO A AGREGAR
     * ============================================================
     */

    const [productSearch, setProductSearch] =
        useState('');

    const [selectedProduct, setSelectedProduct] =
        useState(null);

    const [productQuantity, setProductQuantity] =
        useState(1);


    /*
     * ============================================================
     * ESTADO
     * ============================================================
     */

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState(null);


    /*
     * ============================================================
     * CARGAR PRODUCTOS
     * ============================================================
     */

    useEffect(() => {

        async function loadProducts() {

            try {

                setLoadingProducts(true);
                setError(null);

                const {
                    data,
                    error: productsError,
                } = await db
                    .from('products')
                    .select(`
                        id,
                        sku,
                        name,
                        unit_type,
                        price_unit,
                        is_active,
                        product_type
                    `)
                    .eq(
                        'company_id',
                        profile.company_id
                    )
                    .eq(
                        'is_active',
                        true
                    )
                    .eq(
                        'product_type',
                        'finished_product'
                    )
                    .order(
                        'name',
                        {
                            ascending: true,
                        }
                    );

                if (productsError) {
                    throw productsError;
                }

                setProducts(
                    Array.isArray(data)
                        ? data
                        : []
                );

            } catch (err) {

                console.error(
                    'Error cargando productos:',
                    err
                );

                setError(
                    err?.message ||
                    'No se pudieron cargar los productos.'
                );

            } finally {

                setLoadingProducts(false);

            }

        }


        if (profile?.company_id) {
            loadProducts();
        }

    }, [profile?.company_id]);


    /*
     * ============================================================
     * CAMBIAR FORMULARIO
     * ============================================================
     */

    function handleChange(event) {

        const {
            name,
            value,
        } = event.target;

        setForm(current => ({
            ...current,

            [name]:
                value ?? '',
        }));

        if (error) {
            setError(null);
        }

    }


    /*
     * ============================================================
     * RESULTADOS DEL BUSCADOR
     * ============================================================
     */

    const searchQuery =
        productSearch
            .trim()
            .toLowerCase();


    const searchResults =
        searchQuery
            ? products
                .filter(product => {

                    const name =
                        product.name
                            ?.toLowerCase() ||
                        '';

                    const sku =
                        product.sku
                            ?.toLowerCase() ||
                        '';

                    return (
                        name.includes(
                            searchQuery
                        ) ||
                        sku.includes(
                            searchQuery
                        )
                    );

                })
                .filter(product =>
                    !form.items.some(
                        item =>
                            item.product_id ===
                            product.id
                    )
                )
                .slice(0, 8)
            : [];


    /*
     * ============================================================
     * SELECCIONAR PRODUCTO
     * ============================================================
     */

    function handleSelectProduct(product) {

        setSelectedProduct(product);

        setProductSearch(
            product.name || ''
        );

        setError(null);

    }


    /*
     * ============================================================
     * AGREGAR PRODUCTO
     * ============================================================
     */

    function addItem() {

        if (!selectedProduct) {

            setError(
                'Selecciona un producto.'
            );

            return;
        }


        const quantity =
            Number(productQuantity);


        if (
            !Number.isFinite(quantity) ||
            quantity <= 0
        ) {

            setError(
                'La cantidad debe ser mayor que 0.'
            );

            return;
        }


        const alreadyExists =
            form.items.some(
                item =>
                    item.product_id ===
                    selectedProduct.id
            );


        if (alreadyExists) {

            setError(
                'Este producto ya fue agregado a la orden.'
            );

            return;
        }


        setForm(current => ({
            ...current,

            items: [
                ...current.items,

                {
                    product_id:
                        selectedProduct.id,

                    quantity,

                    notes: '',
                },
            ],
        }));


        /*
         * Limpiar buscador
         */

        setSelectedProduct(null);

        setProductSearch('');

        setProductQuantity(1);

        setError(null);

    }


    /*
     * ============================================================
     * ACTUALIZAR NOTA DE ITEM
     * ============================================================
     */

    function updateItem(
        index,
        field,
        value
    ) {

        setForm(current => {

            const items = [
                ...current.items,
            ];

            items[index] = {
                ...items[index],

                [field]:
                    value ?? '',
            };

            return {
                ...current,
                items,
            };

        });

    }


    /*
     * ============================================================
     * ELIMINAR ITEM
     * ============================================================
     */

    function removeItem(index) {

        setForm(current => ({
            ...current,

            items:
                current.items.filter(
                    (_, itemIndex) =>
                        itemIndex !== index
                ),
        }));

    }


    /*
     * ============================================================
     * CREAR ORDEN
     * ============================================================
     */

    async function handleSubmit(event) {

        event.preventDefault();

        setError(null);


        /*
         * Empresa
         */

        if (!profile?.company_id) {

            setError(
                'No se encontró la empresa del usuario.'
            );

            return;
        }


        /*
         * Productos
         */

        if (
            !Array.isArray(form.items) ||
            form.items.length === 0
        ) {

            setError(
                'Agrega al menos un producto a la orden.'
            );

            return;
        }


        /*
         * Validar items
         */

        const invalidItem =
            form.items.find(item => {

                const quantity =
                    Number(item.quantity);

                return (
                    !item.product_id ||
                    !Number.isFinite(
                        quantity
                    ) ||
                    quantity <= 0
                );

            });


        if (invalidItem) {

            setError(
                'Verifica los productos y cantidades.'
            );

            return;
        }


        /*
         * ========================================================
         * FECHA + HORA
         * ========================================================
         */

        let dueDate = null;


        const hasDate =
            Boolean(
                form.due_date
            );

        const hasTime =
            Boolean(
                form.due_time
            );


        /*
         * Si coloca uno, debe colocar ambos.
         */

        if (
            hasDate &&
            !hasTime
        ) {

            setError(
                'Selecciona la hora límite.'
            );

            return;
        }


        if (
            !hasDate &&
            hasTime
        ) {

            setError(
                'Selecciona la fecha límite.'
            );

            return;
        }


        /*
         * Combinar fecha + hora
         */

        if (
            hasDate &&
            hasTime
        ) {

            dueDate =
                `${form.due_date}T${form.due_time}:00`;

        }


        /*
         * ========================================================
         * GUARDAR
         * ========================================================
         */

        try {

            setSaving(true);


            const order =
                await createProductionOrder({

                    companyId:
                        profile.company_id,

                    userId:
                        profile.id,

                    priority:
                        form.priority ||
                        'normal',

                    notes:
                        form.notes?.trim() ||
                        null,

                    dueDate,

                    items:
                        form.items,

                });


            /*
             * GlobalModals se encarga
             * de cerrar el modal.
             */

            onSuccess(order);


        } catch (err) {

            console.error(
                'Error creando orden:',
                err
            );

            setError(
                err?.message ||
                'No se pudo crear la orden.'
            );

        } finally {

            setSaving(false);

        }

    }


    /*
     * ============================================================
     * RENDER
     * ============================================================
     */

    return (

        <div
            className="modal-overlay"
            onMouseDown={(event) => {

                if (
                    event.target ===
                    event.currentTarget
                ) {

                    if (!saving) {
                        onClose();
                    }

                }

            }}
        >

            <div
                className="modal modal--lg"
                role="dialog"
                aria-modal="true"
            >


                {/* ==================================================
                    HEADER
                ================================================== */}

                <div className="modal__header">

                    <div className="modal__title">

                        <div className="modal__icon">

                            <IconChefHat
                                size={20}
                            />

                        </div>


                        <div>

                            <h2>
                                Nueva orden de producción
                            </h2>

                            <p>
                                Define los productos, cantidades y fecha límite.
                            </p>

                        </div>

                    </div>


                    <button
                        type="button"
                        className="modal__close"
                        onClick={onClose}
                        disabled={saving}
                        aria-label="Cerrar"
                    >

                        <IconX
                            size={18}
                        />

                    </button>

                </div>


                {/* ==================================================
                    FORM
                ================================================== */}

                <form
                    className="modal__form"
                    onSubmit={handleSubmit}
                >


                    {/* ==================================================
                        BODY
                    ================================================== */}

                    <div className="modal__body">


                        {/* ==================================================
                            INFORMACIÓN GENERAL
                        ================================================== */}

                        <div className="modal__form-grid mb-lg">


                            {/* PRIORIDAD */}

                            <div className="modal__field">

                                <label>
                                    Prioridad
                                </label>

                                <select
                                    name="priority"
                                    value={
                                        form.priority ||
                                        'normal'
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    disabled={saving}
                                >

                                    <option value="baja">
                                        Baja
                                    </option>

                                    <option value="normal">
                                        Normal
                                    </option>

                                    <option value="alta">
                                        Alta
                                    </option>

                                    <option value="urgente">
                                        Urgente
                                    </option>

                                </select>

                            </div>


                            {/* FECHA */}

                            <div className="modal__field">

                                <label>
                                    Fecha límite
                                </label>

                                <input
                                    type="date"
                                    name="due_date"
                                    value={
                                        form.due_date ||
                                        ''
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    disabled={saving}
                                    min={
                                        new Date()
                                            .toISOString()
                                            .split('T')[0]
                                    }
                                />

                            </div>


                            {/* HORA */}

                            <div className="modal__field">

                                <label>
                                    Hora límite
                                </label>

                                <input
                                    type="time"
                                    name="due_time"
                                    value={
                                        form.due_time ||
                                        ''
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    disabled={saving}
                                />

                            </div>


                            {/* NOTAS */}

                            <div className="modal__field modal__field--full">

                                <label>
                                    Notas
                                </label>

                                <textarea
                                    name="notes"
                                    rows="3"
                                    placeholder="Indicaciones adicionales para producción..."
                                    value={
                                        form.notes ||
                                        ''
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    disabled={saving}
                                />

                            </div>

                        </div>


                        {/* ==================================================
                            PRODUCTOS
                        ================================================== */}

                        <div className="production-modal__items">


                            {/* HEADER */}

                            <div className="production-modal__items-header">

                                <div>

                                    <h3>
                                        Productos a fabricar
                                    </h3>

                                    <p>
                                        Busca un producto, selecciona la cantidad y agrégalo a la orden.
                                    </p>

                                </div>

                            </div>


                            {/* ==================================================
                                AGREGAR PRODUCTO
                            ================================================== */}

                            <div className="production-modal__add">


                                {/* BUSCADOR */}

                                <div className="production-modal__search">

                                    <label>
                                        Producto
                                    </label>


                                    <div className="production-modal__search-input">

                                        <IconSearch
                                            size={16}
                                        />

                                        <input
                                            type="text"
                                            placeholder="Buscar por nombre o SKU..."
                                            value={
                                                productSearch ||
                                                ''
                                            }
                                            onChange={(event) => {

                                                setProductSearch(
                                                    event.target.value
                                                );

                                                setSelectedProduct(
                                                    null
                                                );

                                            }}
                                            disabled={
                                                saving ||
                                                loadingProducts
                                            }
                                        />

                                    </div>


                                    {/* RESULTADOS */}

                                    {searchQuery &&
                                        !selectedProduct && (

                                            <div className="production-modal__search-results">

                                                {loadingProducts ? (

                                                    <div className="production-modal__search-empty">

                                                        Cargando productos...

                                                    </div>

                                                ) : searchResults.length === 0 ? (

                                                    <div className="production-modal__search-empty">

                                                        No se encontraron productos.

                                                    </div>

                                                ) : (

                                                    searchResults.map(
                                                        product => (

                                                            <button
                                                                key={
                                                                    product.id
                                                                }
                                                                type="button"
                                                                className="production-modal__search-item"
                                                                onClick={() =>
                                                                    handleSelectProduct(
                                                                        product
                                                                    )
                                                                }
                                                            >

                                                                <div className="production-modal__search-icon">

                                                                    <IconPackage
                                                                        size={16}
                                                                    />

                                                                </div>


                                                                <div className="production-modal__search-info">

                                                                    <strong>
                                                                        {
                                                                            product.name
                                                                        }
                                                                    </strong>

                                                                    <span>
                                                                        SKU: {
                                                                            product.sku
                                                                        }
                                                                    </span>

                                                                </div>

                                                            </button>

                                                        )
                                                    )

                                                )}

                                            </div>

                                        )}

                                </div>


                                {/* CANTIDAD */}

                                <div className="production-modal__quantity">

                                    <label>
                                        Cantidad
                                    </label>

                                    <input
                                        type="number"
                                        min="0.001"
                                        step="0.001"
                                        value={
                                            productQuantity ??
                                            1
                                        }
                                        onChange={(event) =>
                                            setProductQuantity(
                                                event.target.value
                                            )
                                        }
                                        disabled={
                                            saving
                                        }
                                    />

                                </div>


                                {/* AGREGAR */}

                                <button
                                    type="button"
                                    className="btn btn-secondary production-modal__add-button"
                                    onClick={addItem}
                                    disabled={
                                        saving ||
                                        loadingProducts ||
                                        !selectedProduct ||
                                        Number(
                                            productQuantity
                                        ) <= 0
                                    }
                                >

                                    <IconPlus
                                        size={16}
                                    />

                                    Agregar

                                </button>

                            </div>


                            {/* ==================================================
                                LISTA
                            ================================================== */}

                            <div className="production-modal__list">


                                {/* HEADER LISTA */}

                                <div className="production-modal__list-header">

                                    <span>
                                        Productos agregados
                                    </span>

                                    <span>
                                        {
                                            form.items.length
                                        }
                                    </span>

                                </div>


                                {/* SIN PRODUCTOS */}

                                {form.items.length === 0 ? (

                                    <div className="production-modal__empty">

                                        <IconChefHat
                                            size={28}
                                        />

                                        <span>
                                            Aún no agregaste productos a la orden.
                                        </span>

                                    </div>

                                ) : (


                                    /* PRODUCTOS */

                                    <div className="production-modal__items-list">

                                        {form.items.map(
                                            (
                                                item,
                                                index
                                            ) => {

                                                const product =
                                                    products.find(
                                                        product =>
                                                            product.id ===
                                                            item.product_id
                                                    );


                                                return (

                                                    <div
                                                        className="production-modal__item"
                                                        key={
                                                            `${item.product_id}-${index}`
                                                        }
                                                    >


                                                        {/* ICONO */}

                                                        <div className="production-modal__item-icon">

                                                            <IconPackage
                                                                size={18}
                                                            />

                                                        </div>


                                                        {/* PRODUCTO */}

                                                        <div className="production-modal__item-info">

                                                            <strong>
                                                                {
                                                                    product?.name ||
                                                                    'Producto'
                                                                }
                                                            </strong>

                                                            <span>
                                                                SKU: {
                                                                    product?.sku ||
                                                                    '-'
                                                                }
                                                            </span>

                                                        </div>


                                                        {/* CANTIDAD */}

                                                        <div className="production-modal__item-quantity">

                                                            <span>
                                                                Cantidad
                                                            </span>

                                                            <strong>
                                                                {
                                                                    item.quantity
                                                                }
                                                            </strong>

                                                        </div>


                                                        {/* NOTA */}

                                                        <div className="production-modal__item-notes">

                                                            <input
                                                                type="text"
                                                                placeholder="Nota opcional..."
                                                                value={
                                                                    item.notes ||
                                                                    ''
                                                                }
                                                                onChange={(event) =>
                                                                    updateItem(
                                                                        index,
                                                                        'notes',
                                                                        event.target.value
                                                                    )
                                                                }
                                                                disabled={
                                                                    saving
                                                                }
                                                            />

                                                        </div>


                                                        {/* ELIMINAR */}

                                                        <button
                                                            type="button"
                                                            className="btn btn-icon btn-sm btn-ghost"
                                                            title="Eliminar producto"
                                                            onClick={() =>
                                                                removeItem(
                                                                    index
                                                                )
                                                            }
                                                            disabled={
                                                                saving
                                                            }
                                                        >

                                                            <IconTrash
                                                                size={17}
                                                            />

                                                        </button>

                                                    </div>

                                                );

                                            }
                                        )}

                                    </div>

                                )}

                            </div>

                        </div>


                        {/* ERROR */}

                        {error && (

                            <div className="modal__error">
                                {error}
                            </div>

                        )}

                    </div>


                    {/* ==================================================
                        FOOTER
                    ================================================== */}

                    <div className="modal__footer">

                        <button
                            type="button"
                            className="btn btn-ghost"
                            onClick={onClose}
                            disabled={saving}
                        >
                            Cancelar
                        </button>


                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={
                                saving ||
                                form.items.length === 0
                            }
                        >

                            {saving ? (
                                'Creando...'
                            ) : (
                                <>
                                    <IconPlus
                                        size={16}
                                    />

                                    Crear orden
                                </>
                            )}

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

}