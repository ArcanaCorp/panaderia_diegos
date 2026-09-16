'use client'

import {
    useState,
} from 'react'

import {
    IconTruckDelivery,
    IconPlus,
    IconSearch,
    IconPhone,
    IconMail,
    IconMapPin,
    IconDots,
    IconEdit,
    IconPower,
    IconInfoCircle,
    IconBrandWhatsapp,
    IconX,
    IconDeviceFloppy,
} from '@tabler/icons-react'

import {
    useWarehouseSuppliers,
} from '@/hooks/useWarehouseSuppliers'


const emptyForm = {
    name: '',
    documentType: 'RUC',
    documentNumber: '',
    contactName: '',
    phone: '',
    whatsapp: '',
    email: '',
    address: '',
    notes: '',
}


export default function SuppliersAlmacen() {

    const {
        suppliers,
        stats,
        pagination,
        page,
        search,
        status,
        loading,
        saving,
        error,

        setSearch,
        setStatus,

        addSupplier,
        editSupplier,
        changeSupplierStatus,

        nextPage,
        previousPage,
    } = useWarehouseSuppliers()


    const [modal, setModal] =
        useState(null)

    const [selectedSupplier, setSelectedSupplier] =
        useState(null)

    const [form, setForm] =
        useState(emptyForm)


    /*
     * =======================================================
     * MODAL CREAR
     * =======================================================
     */

    function openCreate() {

        setSelectedSupplier(null)

        setForm(emptyForm)

        setModal('create')
    }


    /*
     * =======================================================
     * MODAL EDITAR
     * =======================================================
     */

    function openEdit(supplier) {

        setSelectedSupplier(supplier)

        setForm({
            name:
                supplier.name || '',

            documentType:
                supplier.document_type ||
                'RUC',

            documentNumber:
                supplier.document_number ||
                '',

            contactName:
                supplier.contact_name ||
                '',

            phone:
                supplier.phone ||
                '',

            whatsapp:
                supplier.whatsapp ||
                '',

            email:
                supplier.email ||
                '',

            address:
                supplier.address ||
                '',

            notes:
                supplier.notes ||
                '',
        })

        setModal('edit')
    }


    /*
     * =======================================================
     * MODAL INFORMACIÓN
     * =======================================================
     */

    function openInfo(supplier) {

        setSelectedSupplier(
            supplier
        )

        setModal('info')
    }


    /*
     * =======================================================
     * CERRAR
     * =======================================================
     */

    function closeModal() {

        if (saving) {
            return
        }

        setModal(null)

        setSelectedSupplier(null)

        setForm(emptyForm)
    }


    /*
     * =======================================================
     * FORM
     * =======================================================
     */

    function handleChange(
        field,
        value
    ) {

        setForm(current => ({
            ...current,
            [field]: value,
        }))

    }


    /*
     * =======================================================
     * GUARDAR
     * =======================================================
     */

    async function handleSubmit(
        event
    ) {

        event.preventDefault()

        try {

            if (modal === 'create') {

                await addSupplier(form)

            } else {

                await editSupplier(
                    selectedSupplier.id,
                    form
                )

            }

            closeModal()

        } catch (err) {

            // El hook ya registra el error.
            // Mantenemos el modal abierto
            // para que el usuario pueda corregirlo.

            console.error(err)

        }

    }


    /*
     * =======================================================
     * ESTADO
     * =======================================================
     */

    async function handleToggleStatus(
        supplier
    ) {

        const nextStatus =
            !supplier.is_active

        const message =
            nextStatus
                ? '¿Activar este proveedor?'
                : '¿Desactivar este proveedor?'

        if (!window.confirm(message)) {
            return
        }

        try {

            await changeSupplierStatus(
                supplier.id,
                nextStatus
            )

        } catch (err) {

            console.error(err)

        }

    }


    return (
        <main className="suppliers">

            {/* =================================================
                HEADER
            ================================================= */}

            <header className="suppliers__header">

                <div className="suppliers__title-row">

                    <div className="suppliers__title-icon">
                        <IconTruckDelivery size={19} />
                    </div>

                    <div>

                        <p className="suppliers__eyebrow">
                            Almacén
                        </p>

                        <h1 className="suppliers__title">
                            Proveedores
                        </h1>

                        <p className="suppliers__description">
                            Gestiona los proveedores y abastecimiento del almacén.
                        </p>

                    </div>

                </div>

                <button
                    className="btn btn--primary"
                    onClick={openCreate}
                >
                    <IconPlus size={16} />
                    Nuevo proveedor
                </button>

            </header>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <div className="suppliers__error">
                    {error}
                </div>

            )}


            {/* =================================================
                STATS
            ================================================= */}

            <section className="suppliers__stats">

                <article className="card suppliers__stat">

                    <span className="suppliers__stat-label">
                        Total proveedores
                    </span>

                    <strong className="suppliers__stat-value">
                        {stats.total}
                    </strong>

                </article>


                <article className="card suppliers__stat">

                    <span className="suppliers__stat-label">
                        Activos
                    </span>

                    <strong className="suppliers__stat-value suppliers__stat-value--success">
                        {stats.active}
                    </strong>

                </article>


                <article className="card suppliers__stat">

                    <span className="suppliers__stat-label">
                        Inactivos
                    </span>

                    <strong className="suppliers__stat-value">
                        {stats.inactive}
                    </strong>

                </article>


                <article className="card suppliers__stat">

                    <span className="suppliers__stat-label">
                        Registros mostrados
                    </span>

                    <strong className="suppliers__stat-value">
                        {suppliers.length}
                    </strong>

                </article>

            </section>


            {/* =================================================
                CONTENT
            ================================================= */}

            <section className="card suppliers__content">


                {/* =================================================
                    TOOLBAR
                ================================================= */}

                <div className="suppliers__toolbar">

                    <div className="suppliers__search">

                        <div className="input-group">

                            <IconSearch
                                size={16}
                                className="input-group__icon--left"
                            />

                            <input
                                type="text"
                                className="input"
                                placeholder="Buscar proveedor, RUC..."
                                value={search}
                                onChange={(event) =>
                                    setSearch(
                                        event.target.value
                                    )
                                }
                            />

                        </div>

                    </div>


                    <div className="suppliers__filters">

                        <button
                            className={
                                !status
                                    ? 'btn btn--outline btn--sm'
                                    : 'btn btn--ghost btn--sm'
                            }
                            onClick={() =>
                                setStatus(null)
                            }
                        >
                            Todos
                        </button>


                        <button
                            className={
                                status === 'activo'
                                    ? 'btn btn--outline btn--sm'
                                    : 'btn btn--ghost btn--sm'
                            }
                            onClick={() =>
                                setStatus('activo')
                            }
                        >
                            Activos
                        </button>


                        <button
                            className={
                                status === 'inactivo'
                                    ? 'btn btn--outline btn--sm'
                                    : 'btn btn--ghost btn--sm'
                            }
                            onClick={() =>
                                setStatus('inactivo')
                            }
                        >
                            Inactivos
                        </button>

                    </div>

                </div>


                {/* =================================================
                    TABLE
                ================================================= */}

                <div className="suppliers__table-wrapper">

                    <table className="suppliers__table">

                        <thead>

                            <tr>

                                <th>
                                    Proveedor
                                </th>

                                <th>
                                    Contacto
                                </th>

                                <th>
                                    Dirección
                                </th>

                                <th>
                                    Estado
                                </th>

                                <th></th>

                            </tr>

                        </thead>


                        <tbody>

                            {loading ? (

                                <tr>

                                    <td
                                        colSpan="5"
                                        className="suppliers__empty"
                                    >
                                        Cargando proveedores...
                                    </td>

                                </tr>

                            ) : suppliers.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="5"
                                        className="suppliers__empty"
                                    >

                                        <IconTruckDelivery
                                            size={30}
                                        />

                                        <strong>
                                            No hay proveedores
                                        </strong>

                                        <span>
                                            No encontramos proveedores con los filtros actuales.
                                        </span>

                                    </td>

                                </tr>

                            ) : (

                                suppliers.map(
                                    (supplier) => (

                                        <tr
                                            key={
                                                supplier.id
                                            }
                                        >

                                            {/* PROVEEDOR */}

                                            <td>

                                                <div className="suppliers__supplier">

                                                    <div className="suppliers__supplier-icon">
                                                        <IconTruckDelivery
                                                            size={16}
                                                        />
                                                    </div>

                                                    <div>

                                                        <p className="suppliers__supplier-name">
                                                            {
                                                                supplier.name
                                                            }
                                                        </p>

                                                        <span className="suppliers__supplier-ruc">

                                                            {
                                                                supplier.document_type ||
                                                                'Documento'
                                                            }

                                                            {' '}

                                                            {
                                                                supplier.document_number ||
                                                                'Sin documento'
                                                            }

                                                        </span>

                                                    </div>

                                                </div>

                                            </td>


                                            {/* CONTACTO */}

                                            <td>

                                                <div className="suppliers__contact">

                                                    {supplier.contact_name && (

                                                        <span>
                                                            {supplier.contact_name}
                                                        </span>

                                                    )}

                                                    {supplier.phone && (

                                                        <span>
                                                            <IconPhone size={13} />
                                                            {supplier.phone}
                                                        </span>

                                                    )}

                                                    {supplier.email && (

                                                        <span>
                                                            <IconMail size={13} />
                                                            {supplier.email}
                                                        </span>

                                                    )}

                                                </div>

                                            </td>


                                            {/* DIRECCIÓN */}

                                            <td>

                                                <span className="suppliers__address">

                                                    {supplier.address ? (
                                                        <>
                                                            <IconMapPin
                                                                size={13}
                                                            />
                                                            {
                                                                supplier.address
                                                            }
                                                        </>
                                                    ) : (
                                                        'Sin dirección'
                                                    )}

                                                </span>

                                            </td>


                                            {/* ESTADO */}

                                            <td>

                                                <span
                                                    className={
                                                        supplier.is_active
                                                            ? 'badge badge--success'
                                                            : 'badge badge--neutral'
                                                    }
                                                >
                                                    {
                                                        supplier.is_active
                                                            ? 'Activo'
                                                            : 'Inactivo'
                                                    }
                                                </span>

                                            </td>


                                            {/* ACTIONS */}

                                            <td>

                                                <div className="suppliers__actions">

                                                    <button
                                                        className="btn btn--icon btn--ghost btn--sm"
                                                        title="Información"
                                                        onClick={() =>
                                                            openInfo(
                                                                supplier
                                                            )
                                                        }
                                                    >
                                                        <IconInfoCircle
                                                            size={15}
                                                        />
                                                    </button>


                                                    <button
                                                        className="btn btn--icon btn--ghost btn--sm"
                                                        title="Editar"
                                                        onClick={() =>
                                                            openEdit(
                                                                supplier
                                                            )
                                                        }
                                                    >
                                                        <IconEdit
                                                            size={15}
                                                        />
                                                    </button>


                                                    <button
                                                        className="btn btn--icon btn--ghost btn--sm"
                                                        title={
                                                            supplier.is_active
                                                                ? 'Desactivar'
                                                                : 'Activar'
                                                        }
                                                        onClick={() =>
                                                            handleToggleStatus(
                                                                supplier
                                                            )
                                                        }
                                                    >
                                                        <IconPower
                                                            size={15}
                                                        />
                                                    </button>

                                                </div>

                                            </td>

                                        </tr>

                                    )
                                )

                            )}

                        </tbody>

                    </table>

                </div>


                {/* =================================================
                    FOOTER
                ================================================= */}

                <footer className="suppliers__footer">

                    <span>

                        Mostrando{' '}

                        {suppliers.length}

                        {' '}de{' '}

                        {pagination.total}

                        {' '}proveedores

                    </span>


                    <div className="suppliers__pagination">

                        <button
                            className="btn btn--ghost btn--sm"
                            disabled={
                                page <= 1
                            }
                            onClick={
                                previousPage
                            }
                        >
                            Anterior
                        </button>


                        <button
                            className="btn btn--primary btn--sm"
                        >
                            {page}
                        </button>


                        <button
                            className="btn btn--ghost btn--sm"
                            disabled={
                                page >=
                                pagination.total_pages
                            }
                            onClick={
                                nextPage
                            }
                        >
                            Siguiente
                        </button>

                    </div>

                </footer>

            </section>


            {/* =================================================
                MODAL CREAR / EDITAR
            ================================================= */}

            {(modal === 'create' ||
                modal === 'edit') && (

                <div className="modal-overlay">

                    <div className="modal">

                        <header className="modal__header">

                            <div>

                                <h2 className="modal__title">

                                    {modal === 'create'
                                        ? 'Nuevo proveedor'
                                        : 'Editar proveedor'}

                                </h2>

                                <p className="modal__description">

                                    {modal === 'create'
                                        ? 'Registra un nuevo proveedor para el almacén.'
                                        : 'Actualiza la información del proveedor.'}

                                </p>

                            </div>


                            <button
                                className="btn btn--icon btn--ghost"
                                onClick={
                                    closeModal
                                }
                            >
                                <IconX size={18} />
                            </button>

                        </header>


                        <form
                            className="modal__body"
                            onSubmit={
                                handleSubmit
                            }
                        >

                            <div className="form-grid">

                                <div className="form-field form-field--full">

                                    <label>
                                        Nombre del proveedor *
                                    </label>

                                    <input
                                        className="input"
                                        value={
                                            form.name
                                        }
                                        onChange={(event) =>
                                            handleChange(
                                                'name',
                                                event.target.value
                                            )
                                        }
                                        required
                                    />

                                </div>


                                <div className="form-field">

                                    <label>
                                        Tipo de documento
                                    </label>

                                    <select
                                        className="input"
                                        value={
                                            form.documentType
                                        }
                                        onChange={(event) =>
                                            handleChange(
                                                'documentType',
                                                event.target.value
                                            )
                                        }
                                    >

                                        <option value="RUC">
                                            RUC
                                        </option>

                                        <option value="DNI">
                                            DNI
                                        </option>

                                        <option value="CE">
                                            CE
                                        </option>

                                        <option value="Otro">
                                            Otro
                                        </option>

                                    </select>

                                </div>


                                <div className="form-field">

                                    <label>
                                        Número de documento
                                    </label>

                                    <input
                                        className="input"
                                        value={
                                            form.documentNumber
                                        }
                                        onChange={(event) =>
                                            handleChange(
                                                'documentNumber',
                                                event.target.value
                                            )
                                        }
                                    />

                                </div>


                                <div className="form-field form-field--full">

                                    <label>
                                        Persona de contacto
                                    </label>

                                    <input
                                        className="input"
                                        value={
                                            form.contactName
                                        }
                                        onChange={(event) =>
                                            handleChange(
                                                'contactName',
                                                event.target.value
                                            )
                                        }
                                    />

                                </div>


                                <div className="form-field">

                                    <label>
                                        Teléfono
                                    </label>

                                    <input
                                        className="input"
                                        value={
                                            form.phone
                                        }
                                        onChange={(event) =>
                                            handleChange(
                                                'phone',
                                                event.target.value
                                            )
                                        }
                                    />

                                </div>


                                <div className="form-field">

                                    <label>
                                        WhatsApp
                                    </label>

                                    <input
                                        className="input"
                                        value={
                                            form.whatsapp
                                        }
                                        onChange={(event) =>
                                            handleChange(
                                                'whatsapp',
                                                event.target.value
                                            )
                                        }
                                    />

                                </div>


                                <div className="form-field form-field--full">

                                    <label>
                                        Correo electrónico
                                    </label>

                                    <input
                                        type="email"
                                        className="input"
                                        value={
                                            form.email
                                        }
                                        onChange={(event) =>
                                            handleChange(
                                                'email',
                                                event.target.value
                                            )
                                        }
                                    />

                                </div>


                                <div className="form-field form-field--full">

                                    <label>
                                        Dirección
                                    </label>

                                    <input
                                        className="input"
                                        value={
                                            form.address
                                        }
                                        onChange={(event) =>
                                            handleChange(
                                                'address',
                                                event.target.value
                                            )
                                        }
                                    />

                                </div>


                                <div className="form-field form-field--full">

                                    <label>
                                        Notas
                                    </label>

                                    <textarea
                                        className="input"
                                        rows="3"
                                        value={
                                            form.notes
                                        }
                                        onChange={(event) =>
                                            handleChange(
                                                'notes',
                                                event.target.value
                                            )
                                        }
                                    />

                                </div>

                            </div>


                            <footer className="modal__footer">

                                <button
                                    type="button"
                                    className="btn btn--ghost"
                                    onClick={
                                        closeModal
                                    }
                                    disabled={
                                        saving
                                    }
                                >
                                    Cancelar
                                </button>


                                <button
                                    type="submit"
                                    className="btn btn--primary"
                                    disabled={
                                        saving
                                    }
                                >

                                    <IconDeviceFloppy
                                        size={16}
                                    />

                                    {saving
                                        ? 'Guardando...'
                                        : 'Guardar proveedor'}

                                </button>

                            </footer>

                        </form>

                    </div>

                </div>

            )}


            {/* =================================================
                MODAL INFORMACIÓN
            ================================================= */}

            {modal === 'info' &&
                selectedSupplier && (

                <div className="modal-overlay">

                    <div className="modal modal--sm">

                        <header className="modal__header">

                            <div>

                                <p className="suppliers__eyebrow">
                                    Proveedor
                                </p>

                                <h2 className="modal__title">
                                    {
                                        selectedSupplier.name
                                    }
                                </h2>

                            </div>


                            <button
                                className="btn btn--icon btn--ghost"
                                onClick={
                                    closeModal
                                }
                            >
                                <IconX size={18} />
                            </button>

                        </header>


                        <div className="modal__body">

                            <div className="supplier-detail">

                                <div className="supplier-detail__status">

                                    <span
                                        className={
                                            selectedSupplier.is_active
                                                ? 'badge badge--success'
                                                : 'badge badge--neutral'
                                        }
                                    >
                                        {
                                            selectedSupplier.is_active
                                                ? 'Activo'
                                                : 'Inactivo'
                                        }
                                    </span>

                                </div>


                                <div className="supplier-detail__row">

                                    <span>
                                        Documento
                                    </span>

                                    <strong>
                                        {
                                            selectedSupplier.document_type ||
                                            '—'
                                        }

                                        {' '}

                                        {
                                            selectedSupplier.document_number ||
                                            '—'
                                        }
                                    </strong>

                                </div>


                                <div className="supplier-detail__row">

                                    <span>
                                        Contacto
                                    </span>

                                    <strong>
                                        {
                                            selectedSupplier.contact_name ||
                                            '—'
                                        }
                                    </strong>

                                </div>


                                <div className="supplier-detail__row">

                                    <span>
                                        Teléfono
                                    </span>

                                    <strong>
                                        {
                                            selectedSupplier.phone ||
                                            '—'
                                        }
                                    </strong>

                                </div>


                                <div className="supplier-detail__row">

                                    <span>
                                        WhatsApp
                                    </span>

                                    <strong>
                                        {
                                            selectedSupplier.whatsapp ||
                                            '—'
                                        }
                                    </strong>

                                </div>


                                <div className="supplier-detail__row">

                                    <span>
                                        Correo
                                    </span>

                                    <strong>
                                        {
                                            selectedSupplier.email ||
                                            '—'
                                        }
                                    </strong>

                                </div>


                                <div className="supplier-detail__row">

                                    <span>
                                        Dirección
                                    </span>

                                    <strong>
                                        {
                                            selectedSupplier.address ||
                                            '—'
                                        }
                                    </strong>

                                </div>


                                <div className="supplier-detail__notes">

                                    <span>
                                        Notas
                                    </span>

                                    <p>
                                        {
                                            selectedSupplier.notes ||
                                            'Sin notas registradas.'
                                        }
                                    </p>

                                </div>


                                <div className="supplier-detail__row">

                                    <span>
                                        Registrado
                                    </span>

                                    <strong>
                                        {
                                            selectedSupplier.created_at
                                                ? new Date(
                                                    selectedSupplier.created_at
                                                ).toLocaleDateString(
                                                    'es-PE'
                                                )
                                                : '—'
                                        }
                                    </strong>

                                </div>

                            </div>

                        </div>


                        <footer className="modal__footer">

                            <button
                                className="btn btn--ghost"
                                onClick={
                                    closeModal
                                }
                            >
                                Cerrar
                            </button>


                            <button
                                className="btn btn--primary"
                                onClick={() =>
                                    openEdit(
                                        selectedSupplier
                                    )
                                }
                            >
                                <IconEdit size={15} />
                                Editar
                            </button>

                        </footer>

                    </div>

                </div>

            )}

        </main>
    )
}