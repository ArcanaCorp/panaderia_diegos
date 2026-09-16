'use client'

import {
    useMemo,
    useState,
} from 'react'

import {
    IconPackages,
    IconAlertTriangle,
    IconCircleCheck,
    IconAlertCircle,
    IconSearch,
    IconFilter,
    IconChevronLeft,
    IconChevronRight,
    IconX,
    IconArrowDown,
} from '@tabler/icons-react'

import { useAuth } from '@/context/AuthContext'
import { useProductionInventory } from '@/hooks/useProductionInventory'


export default function InventoryProduccion() {

    const { profile } = useAuth()

    const {
        stats,
        supplies,
        loading,
        saving,
        error,
        registerExit,
    } = useProductionInventory()


    const [search, setSearch] = useState('')
    const [category, setCategory] = useState('Todas')
    const [status, setStatus] = useState('Todos')

    const [showModal, setShowModal] = useState(false)

    const [selectedProduct, setSelectedProduct] =
        useState(null)

    const [quantity, setQuantity] =
        useState('')

    const [reason, setReason] =
        useState('production')

    const [notes, setNotes] =
        useState('')

    const [modalError, setModalError] =
        useState(null)


    const categories = useMemo(() => {

        const values = supplies
            .map(item => item.category)
            .filter(Boolean)

        return [
            'Todas',
            ...new Set(values),
        ]

    }, [supplies])


    const filteredSupplies = useMemo(() => {

        return supplies.filter(supply => {

            const searchValue =
                search.trim().toLowerCase()

            const matchesSearch =
                !searchValue ||
                supply.name
                    ?.toLowerCase()
                    .includes(searchValue) ||
                supply.sku
                    ?.toLowerCase()
                    .includes(searchValue)

            const matchesCategory =
                category === 'Todas' ||
                supply.category === category

            const matchesStatus =
                status === 'Todos' ||
                supply.status === status

            return (
                matchesSearch &&
                matchesCategory &&
                matchesStatus
            )

        })

    }, [
        supplies,
        search,
        category,
        status,
    ])


    function openExitModal(supply) {

        setSelectedProduct(supply)
        setQuantity('')
        setReason('production')
        setNotes('')
        setModalError(null)
        setShowModal(true)

    }


    function closeExitModal() {

        if (saving) return

        setShowModal(false)
        setSelectedProduct(null)
        setModalError(null)

    }


    async function handleRegisterExit(event) {

        event.preventDefault()

        if (!selectedProduct) {
            return
        }

        const amount =
            Number(quantity)

        if (!amount || amount <= 0) {

            setModalError(
                'Ingresa una cantidad válida.'
            )

            return
        }

        if (amount > Number(selectedProduct.stock)) {

            setModalError(
                `Stock insuficiente. Disponible: ${selectedProduct.stock} ${selectedProduct.unit}.`
            )

            return
        }

        try {

            setModalError(null)

            await registerExit({

                productId:
                    selectedProduct.id,

                quantity:
                    amount,

                reason,

                notes:
                    notes.trim() || null,

            })

            closeExitModal()

        } catch (err) {

            setModalError(
                err?.message ||
                'No se pudo registrar la salida.'
            )

        }

    }


    const statCards = [

        {
            label: 'Total de insumos',
            value: stats.total,
            icon: IconPackages,
            modifier: '',
        },

        {
            label: 'Disponibles',
            value: stats.available,
            icon: IconCircleCheck,
            modifier: '',
        },

        {
            label: 'Stock bajo',
            value: stats.low,
            icon: IconAlertTriangle,
            modifier: 'warning',
        },

        {
            label: 'Insuficientes',
            value: stats.insufficient,
            icon: IconAlertCircle,
            modifier: 'danger',
        },

    ]


    return (

        <main className="inventory">

            {/* HEADER */}

            <header className="inventory__header">

                <div>

                    <p className="inventory__eyebrow">
                        Área de producción
                    </p>

                    <h1 className="inventory__title">
                        Insumos
                    </h1>

                    <p className="inventory__description">
                        Consulta y registra las salidas de insumos para producción.
                    </p>

                </div>


                <div className="inventory__actions">

                    <button
                        className="btn btn--primary"
                        onClick={() => {

                            if (!supplies.length) {
                                return
                            }

                            openExitModal(
                                supplies[0]
                            )

                        }}
                        disabled={
                            loading ||
                            !supplies.length
                        }
                    >
                        <IconArrowDown size={16} />
                        Registrar salida
                    </button>

                    <button
                        className="btn btn--outline"
                    >
                        <IconFilter size={16} />
                        Filtrar
                    </button>

                </div>

            </header>


            {/* ERROR */}

            {error && (

                <div className="alert alert--danger">
                    {error}
                </div>

            )}


            {/* STATS */}

            <section className="inventory__stats">

                {statCards.map((stat) => {

                    const Icon = stat.icon

                    return (

                        <article
                            className="card inventory__stat"
                            key={stat.label}
                        >

                            <div
                                className={`inventory__stat-icon ${
                                    stat.modifier
                                        ? `inventory__stat-icon--${stat.modifier}`
                                        : ''
                                }`}
                            >
                                <Icon size={17} />
                            </div>

                            <div>

                                <p className="inventory__stat-label">
                                    {stat.label}
                                </p>

                                <strong className="inventory__stat-value">
                                    {loading
                                        ? '—'
                                        : stat.value}
                                </strong>

                            </div>

                        </article>

                    )

                })}

            </section>


            {/* CONTENT */}

            <section className="card inventory__content">

                {/* TOOLBAR */}

                <div className="inventory__toolbar">

                    <div className="inventory__search">

                        <div className="input-group">

                            <IconSearch
                                size={16}
                                className="input-group__icon--left"
                            />

                            <input
                                type="text"
                                className="input"
                                placeholder="Buscar insumo, SKU..."
                                value={search}
                                onChange={(event) =>
                                    setSearch(
                                        event.target.value
                                    )
                                }
                            />

                        </div>

                    </div>


                    <div className="inventory__filters">

                        <select
                            className="input"
                            value={category}
                            onChange={(event) =>
                                setCategory(
                                    event.target.value
                                )
                            }
                        >

                            {categories.map(
                                item => (
                                    <option
                                        key={item}
                                        value={item}
                                    >
                                        {item === 'Todas'
                                            ? 'Todas las categorías'
                                            : item}
                                    </option>
                                )
                            )}

                        </select>


                        <select
                            className="input"
                            value={status}
                            onChange={(event) =>
                                setStatus(
                                    event.target.value
                                )
                            }
                        >

                            <option value="Todos">
                                Todos los estados
                            </option>

                            <option value="Disponible">
                                Disponible
                            </option>

                            <option value="Bajo">
                                Bajo
                            </option>

                            <option value="Insuficiente">
                                Insuficiente
                            </option>

                        </select>

                    </div>

                </div>


                {/* TABLE */}

                <div className="inventory__table-wrapper">

                    <table className="inventory__table">

                        <thead>

                            <tr>

                                <th>Insumo</th>

                                <th>SKU</th>

                                <th>Categoría</th>

                                <th>Stock</th>

                                <th>Reservado</th>

                                <th>Disponible</th>

                                <th>Mínimo</th>

                                <th>Estado</th>

                                <th></th>

                            </tr>

                        </thead>


                        <tbody>

                            {loading ? (

                                <tr>

                                    <td
                                        colSpan="9"
                                        style={{
                                            textAlign: 'center',
                                            padding: '40px',
                                        }}
                                    >
                                        Cargando insumos...
                                    </td>

                                </tr>

                            ) : filteredSupplies.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="9"
                                        style={{
                                            textAlign: 'center',
                                            padding: '40px',
                                        }}
                                    >

                                        <div className="inventory__empty">

                                            <IconPackages size={28} />

                                            <p>
                                                No hay insumos registrados.
                                            </p>

                                            <span>
                                                No se encontraron insumos con los filtros actuales.
                                            </span>

                                        </div>

                                    </td>

                                </tr>

                            ) : (

                                filteredSupplies.map(
                                    (supply) => (

                                        <tr
                                            key={supply.id}
                                        >

                                            <td>

                                                <div className="inventory__product">

                                                    <div className="inventory__product-icon">
                                                        <IconPackages size={16} />
                                                    </div>

                                                    <div>

                                                        <p className="inventory__product-name">
                                                            {supply.name}
                                                        </p>

                                                        <span className="inventory__product-unit">
                                                            {supply.unit}
                                                        </span>

                                                    </div>

                                                </div>

                                            </td>


                                            <td>

                                                <span className="inventory__sku">
                                                    {supply.sku}
                                                </span>

                                            </td>


                                            <td>

                                                <span className="inventory__category">
                                                    {supply.category}
                                                </span>

                                            </td>


                                            <td>

                                                <strong className="inventory__stock">
                                                    {supply.stock} {supply.unit}
                                                </strong>

                                            </td>


                                            <td>

                                                <span className="inventory__minimum">
                                                    {supply.reserved} {supply.unit}
                                                </span>

                                            </td>


                                            <td>

                                                <strong className="inventory__stock">
                                                    {supply.available} {supply.unit}
                                                </strong>

                                            </td>


                                            <td>

                                                <span className="inventory__minimum">
                                                    {supply.minimum} {supply.unit}
                                                </span>

                                            </td>


                                            <td>

                                                <span
                                                    className={`badge ${
                                                        supply.status === 'Disponible'
                                                            ? 'badge--success'
                                                            : supply.status === 'Bajo'
                                                                ? 'badge--warning'
                                                                : 'badge--danger'
                                                    }`}
                                                >
                                                    {supply.status}
                                                </span>

                                            </td>


                                            <td>

                                                <button
                                                    className="btn btn--icon btn--ghost btn--sm"
                                                    title="Registrar salida"
                                                    disabled={
                                                        Number(supply.stock) <= 0
                                                    }
                                                    onClick={() =>
                                                        openExitModal(
                                                            supply
                                                        )
                                                    }
                                                >
                                                    <IconArrowDown
                                                        size={16}
                                                    />
                                                </button>

                                            </td>

                                        </tr>

                                    )
                                )

                            )}

                        </tbody>

                    </table>

                </div>


                {/* FOOTER */}

                <footer className="inventory__footer">

                    <span>
                        Mostrando {
                            filteredSupplies.length
                        } de {
                            supplies.length
                        } insumos
                    </span>


                    <div className="inventory__pagination">

                        <button
                            className="btn btn--icon btn--ghost btn--sm"
                            disabled
                        >
                            <IconChevronLeft size={16} />
                        </button>

                        <button
                            className="btn btn--primary btn--sm"
                        >
                            1
                        </button>

                        <button
                            className="btn btn--icon btn--ghost btn--sm"
                            disabled
                        >
                            <IconChevronRight size={16} />
                        </button>

                    </div>

                </footer>

            </section>


            {/* MODAL */}

            {showModal && selectedProduct && (

                <div
                    className="modal-overlay"
                    onMouseDown={closeExitModal}
                >

                    <div
                        className="modal"
                        onMouseDown={(event) =>
                            event.stopPropagation()
                        }
                    >

                        <div className="modal__header">

                            <div>

                                <p className="inventory__eyebrow">
                                    Inventario
                                </p>

                                <h2 className="modal__title">
                                    Registrar salida
                                </h2>

                            </div>


                            <button
                                className="btn btn--icon btn--ghost"
                                onClick={closeExitModal}
                                disabled={saving}
                            >
                                <IconX size={18} />
                            </button>

                        </div>


                        <form
                            onSubmit={
                                handleRegisterExit
                            }
                        >

                            <div className="modal__body">

                                {modalError && (

                                    <div className="alert alert--danger">
                                        {modalError}
                                    </div>

                                )}


                                <div className="form-group">

                                    <label className="label">
                                        Insumo
                                    </label>

                                    <div className="card">
                                        <strong>
                                            {
                                                selectedProduct.name
                                            }
                                        </strong>

                                        <span>
                                            SKU: {
                                                selectedProduct.sku
                                            }
                                        </span>
                                    </div>

                                </div>


                                <div className="form-group">

                                    <label className="label">
                                        Stock disponible
                                    </label>

                                    <strong>
                                        {
                                            selectedProduct.stock
                                        } {
                                            selectedProduct.unit
                                        }
                                    </strong>

                                </div>


                                <div className="form-group">

                                    <label
                                        className="label"
                                        htmlFor="quantity"
                                    >
                                        Cantidad
                                    </label>

                                    <div className="input-group">

                                        <input
                                            id="quantity"
                                            type="number"
                                            className="input"
                                            min="0.001"
                                            max={
                                                selectedProduct.stock
                                            }
                                            step={
                                                selectedProduct.allow_fraction
                                                    ? '0.001'
                                                    : '1'
                                            }
                                            value={quantity}
                                            onChange={(event) =>
                                                setQuantity(
                                                    event.target.value
                                                )
                                            }
                                            autoFocus
                                        />

                                        <span>
                                            {
                                                selectedProduct.unit
                                            }
                                        </span>

                                    </div>

                                </div>


                                <div className="form-group">

                                    <label
                                        className="label"
                                        htmlFor="reason"
                                    >
                                        Motivo
                                    </label>

                                    <select
                                        id="reason"
                                        className="input"
                                        value={reason}
                                        onChange={(event) =>
                                            setReason(
                                                event.target.value
                                            )
                                        }
                                    >

                                        <option value="production">
                                            Producción
                                        </option>

                                        <option value="internal_use">
                                            Uso interno
                                        </option>

                                        <option value="damaged">
                                            Dañado
                                        </option>

                                        <option value="expired">
                                            Vencido
                                        </option>

                                        <option value="other">
                                            Otro
                                        </option>

                                    </select>

                                </div>


                                <div className="form-group">

                                    <label
                                        className="label"
                                        htmlFor="notes"
                                    >
                                        Observación
                                    </label>

                                    <textarea
                                        id="notes"
                                        className="input"
                                        rows="3"
                                        placeholder="Opcional..."
                                        value={notes}
                                        onChange={(event) =>
                                            setNotes(
                                                event.target.value
                                            )
                                        }
                                    />

                                </div>

                            </div>


                            <div className="modal__footer">

                                <button
                                    type="button"
                                    className="btn btn--outline"
                                    onClick={
                                        closeExitModal
                                    }
                                    disabled={saving}
                                >
                                    Cancelar
                                </button>

                                <button
                                    type="submit"
                                    className="btn btn--primary"
                                    disabled={saving}
                                >
                                    <IconArrowDown size={16} />

                                    {saving
                                        ? 'Registrando...'
                                        : 'Registrar salida'}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </main>
    )
}