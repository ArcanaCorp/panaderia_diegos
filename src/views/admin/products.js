'use client';

import RowsProduct from '@/components/Table/RowsProduct';
import { useModal } from '@/context/ModalContext';
import { useAdminProducts } from '@/hooks/useAdminProducts';
import { exportProductsToExcel } from '@/utils/exportProducts';
import { IconPlus, IconSearch, IconDownload, IconPackage, IconBox, IconRefresh } from '@tabler/icons-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';


export default function ProductsAdmin() {

    const { openModal } = useModal();
    const { products, loading, error, refresh, addProduct, updateProductInState, removeProduct } = useAdminProducts();

    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('all');
    const [status, setStatus] = useState('all');

    const categories = useMemo(() => {

        return [
            ...new Set(
                (products || [])
                    .map(product => product.category)
                    .filter(Boolean)
            )
        ];

    }, [products]);


    const filteredProducts = useMemo(() => {

        return (products || []).filter(product => {

            const searchValue = search
                .toLowerCase()
                .trim();

            const matchesSearch =
                !searchValue ||
                product.name
                    ?.toLowerCase()
                    .includes(searchValue) ||
                product.sku
                    ?.toLowerCase()
                    .includes(searchValue);

            const matchesCategory =
                category === 'all' ||
                product.category === category;

            const matchesStatus =
                status === 'all' ||
                product.status === status;

            return (
                matchesSearch &&
                matchesCategory &&
                matchesStatus
            );

        });

    }, [ products, search, category, status ]);


    /* =========================================================
       ESTADÍSTICAS
       ========================================================= */

    const productList = products || [];

    const totalProducts = productList.length;

    const availableProducts =
        productList.filter(
            product => product.status === 'Disponible'
        ).length;

    const lowStockProducts =
        productList.filter(
            product => product.status === 'Stock bajo'
        ).length;

    const outOfStockProducts =
        productList.filter(
            product => product.status === 'Sin stock'
        ).length;


    /* =========================================================
       ACCIONES
       ========================================================= */


    const handleProductCreated = (product) => {
        addProduct(product);
        toast.success('Producto creado con éxito')
    }

    const handleNewProduct = () => {
        openModal('product-create', null, {
            onSuccess: handleProductCreated,
        });
    };

    const handleExport = () => {
        const exported = exportProductsToExcel(filteredProducts);
        if (!exported) return;
    }


    /* =========================================================
       LOADING
       ========================================================= */

    if (loading) {

        return (

            <main className="products">

                <header className="products__header">

                    <div>

                        <div className="products__title-row">

                            <div className="products__title-icon">
                                <IconPackage size={18} />
                            </div>

                            <div>

                                <h1 className="products__title">
                                    Productos
                                </h1>

                                <p className="products__description">
                                    Cargando catálogo...
                                </p>

                            </div>

                        </div>

                    </div>

                </header>

            </main>

        );

    }


    /* =========================================================
       ERROR
       ========================================================= */

    if (error) {

        return (

            <main className="products">

                <header className="products__header">

                    <div>

                        <div className="products__title-row">

                            <div className="products__title-icon">
                                <IconPackage size={18} />
                            </div>

                            <div>

                                <h1 className="products__title">
                                    Productos
                                </h1>

                                <p className="products__description">
                                    {error}
                                </p>

                            </div>

                        </div>

                    </div>


                    <button
                        className="btn btn--primary"
                        onClick={refresh}
                    >
                        <IconRefresh size={16} />
                        Reintentar
                    </button>

                </header>

            </main>

        );

    }

    return (
        <main className="products">

            <header className="products__header">
                <div>
                    <div className="products__title-row">
                        <div className="products__title-icon">
                            <IconPackage size={18} />
                        </div>

                        <div>
                            <h1 className="products__title">Productos</h1>

                            <p className="products__description">Administra el catálogo, precios y stock de tus productos.</p>
                        </div>
                    </div>
                </div>

                <button
                    className="btn btn--primary"
                    onClick={handleNewProduct}
                >
                    <IconPlus size={16} />
                    Nuevo producto
                </button>
            </header>

            <section className="products__stats">

                <div className="card products__stat">
                    <div className="products__stat-icon">
                        <IconPackage size={17} />
                    </div>
                    <div>
                        <span>Total productos</span>
                        <strong>{products.length}</strong>
                    </div>
                </div>

                <div className="card products__stat">
                    <div className="products__stat-icon products__stat-icon--success">
                        <IconBox size={17} />
                    </div>
                    <div>
                        <span>Disponibles</span>
                        <strong>{availableProducts}</strong>
                    </div>
                </div>

                <div className="card products__stat">
                    <div className="products__stat-icon products__stat-icon--warning">
                        <IconRefresh size={17} />
                    </div>
                    <div>
                        <span>Stock bajo</span>
                        <strong>{lowStockProducts}</strong>
                    </div>
                </div>

                <div className="card products__stat">
                    <div className="products__stat-icon products__stat-icon--danger">
                        <IconPackage size={17} />
                    </div>
                    <div>
                        <span>Sin stock</span>
                        <strong>{outOfStockProducts}</strong>
                    </div>
                </div>

            </section>

            <section className="card products__panel">

                <div className="products__toolbar">
                    <div className="products__search">
                        <IconSearch size={16} />
                        <input type="text" value={search} placeholder="Buscar producto, SKU..." onChange={(event) => setSearch(event.target.value)}/>
                    </div>
                    <div className="products__filters">
                        <select className="btn btn--outline btn--sm" value={category} onChange={(event) => setCategory(event.target.value)}>
                            <option value="all">Todas las categorías</option>
                            {categories.map(item => (
                                <option key={item} value={item}>{item}</option>
                            ))}
                        </select>
                        <select className="btn btn--outline btn--sm" value={status} onChange={(event) => setStatus(event.target.value)}>
                            <option value="all">Todos los estados</option>
                            <option value="Disponible">Disponible</option>
                            <option value="Stock bajo">Stock bajo</option>
                            <option value="Sin stock">Sin stock</option>
                            <option value="Inactivo">Inactivo</option>
                        </select>
                        <button className="btn btn--ghost btn--sm" onClick={refresh}>
                            <IconRefresh size={15} />
                            Actualizar
                        </button>
                        <button className="btn btn--ghost btn--sm" onClick={handleExport}><IconDownload size={15} /> Exportar</button>
                    </div>
                </div>

                <div className="products__table-wrapper">
                    <table className="products__table">
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th>SKU</th>
                                <th>Categoría</th>
                                <th>Precio</th>
                                <th>Stock</th>
                                <th>Estado</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.length > 0 ? (
                                filteredProducts.map(product => (
                                    <RowsProduct key={product.id} product={product} onProductUpdated={updateProductInState} onProductDeleted={removeProduct} onStockUpdated={updateProductInState}/>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" style={{ textAlign: 'center', padding: '40px'}}>No se encontraron productos.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="products__pagination">
                    <span>Mostrando {filteredProducts.length} de{' '} {totalProducts} productos </span>
                    <div>
                        <button className="btn btn--outline btn--sm" disabled>Anterior</button>
                        <button className="btn btn--outline btn--sm">Siguiente</button>
                    </div>
                </div>

            </section>

        </main>
    );
}