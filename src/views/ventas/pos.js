'use client';

import { useMemo, useState } from 'react';
import { IconSearch, IconAlertTriangle, IconRefresh, IconPackage } from '@tabler/icons-react';

import { useAuth } from '@/context/AuthContext';
import { useSalesPOS } from '@/hooks/useSalesPOS';
import { toast } from 'sonner';
import ItemCart from '@/components/Cards/ItemCart';
import CartCard from '@/components/Cards/CartCard';

export default function POSVentas() {
    
    const { profile } = useAuth();
    const { products, categories: dbCategories, paymentMethods, loading, error, reload } = useSalesPOS();

    const [category, setCategory] = useState('Todos');
    const [search, setSearch] = useState('');
    const [cart, setCart] = useState([]);

    // =====================================================
    // CATEGORÍAS
    // =====================================================

    const categories = useMemo(() => ['Todos', ...dbCategories.map((item) => item.name)], [dbCategories]);

    // =====================================================
    // FILTRAR PRODUCTOS
    // =====================================================

    const filteredProducts = useMemo(() => {
        const searchValue = search.trim().toLowerCase();

        return products.filter((product) => {
            const matchesCategory =
                category === 'Todos' || product.category === category;

            const matchesSearch =
                !searchValue ||
                product.name?.toLowerCase().includes(searchValue) ||
                product.sku?.toLowerCase().includes(searchValue);

            return matchesCategory && matchesSearch;
        });
    }, [products, category, search]);


    // =====================================================
    // AGREGAR PRODUCTO
    // =====================================================

    function addToCart(product) {
        const stock = Number(product.stock || 0);

        if (stock <= 0) {
            toast.error('Producto sin stock disponible.');
            return;
        }

        setCart((current) => {
            const existing = current.find(
                (item) => item.id === product.id
            );

            if (existing) {
                return current.map((item) =>
                    item.id === product.id
                        ? {
                              ...item,
                              quantity: Math.min(
                                  item.quantity + 1,
                                  stock
                              ),
                          }
                        : item
                );
            }

            return [
                ...current,
                {
                    id: product.id,
                    name: product.name,
                    sku: product.sku,
                    price: Number(product.price || 0),
                    quantity: 1,
                    unit: product.unit || 'unidad',
                    stock,
                },
            ];
        });
    }

    // =====================================================
    // ESTADOS DE CARGA
    // =====================================================

    if (loading) {
        return (
            <div className="pos">
                <div className="pos__state">
                    <IconRefresh
                        size={24}
                        className="pos__state-icon"
                    />

                    <strong>
                        Cargando punto de venta...
                    </strong>

                    <span>
                        Estamos preparando los productos de tu tienda.
                    </span>
                </div>
            </div>
        );
    }

    // =====================================================
    // ESTADO DE ERROR
    // =====================================================

    if (error) {
        return (
            <div className="pos">
                <div className="pos__state pos__state--error">
                    <IconAlertTriangle size={24} />

                    <strong>
                        No se pudo cargar el punto de venta
                    </strong>

                    <span>{error}</span>

                    <button
                        className="btn btn--outline"
                        onClick={reload}
                    >
                        <IconRefresh size={16} />
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    // =====================================================
    // INTERFAZ POS
    // =====================================================

    return (
        <div className="pos">

            {/* HEADER */}

            <header className="pos__header">
                <div>
                    <p className="pos__eyebrow">{profile?.store?.name || 'Mi tienda'}</p>
                    <h1 className="pos__title">Punto de venta</h1>
                </div>
            </header>

            <div className={`pos__layout ${cart.length > 0 && 'pos__layout--expand'}`}>

                {/* =========================================
                    PRODUCTOS
                ========================================= */}

                <section className="pos__products">

                    <div className="input-group">
                        <span className="input-group__icon--left">
                            <IconSearch size={16} />
                        </span>
                        <input className="input" type="search" placeholder="Buscar producto..." value={search} onChange={(event) => setSearch(event.target.value)}/>
                    </div>

                    {/* CATEGORÍAS */}

                    {categories.length > 1 && (
                        <div className="pos__categories">
                            {categories.map((item) => (
                                <button key={item} type="button" className={`pos__category ${category === item ? 'pos__category--active' : ''}`} onClick={() => setCategory(item)}>
                                    {item}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* LISTADO DE PRODUCTOS */}

                    {filteredProducts.length === 0 ? (
                        <div className="pos__empty">
                            <IconPackage size={32} />
                            <strong>No encontramos productos</strong>
                            <span>{search ? 'Prueba con otro término de búsqueda.' : 'No hay productos disponibles en esta tienda.'}</span>
                        </div>
                    ) : (
                        <div className={`pos__product-grid ${cart.length > 0 ? 'pos__product-grid-3' : 'pos__product-grid-4'}`}>
                            {filteredProducts.map((product) => (
                                <ItemCart key={product.id} product={product} addToCart={addToCart}/>
                            ))}
                        </div>
                    )}
                </section>

                {/* =========================================
                    CARRITO Y COBRO
                ========================================= */}
                {cart.length > 0 && (
                    <CartCard cart={cart} setCart={setCart} paymentMethods={paymentMethods} profile={profile} />
                )}

            </div>

        </div>
    );
}
