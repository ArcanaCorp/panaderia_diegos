'use client';

import { useMemo, useState } from 'react';

import { IconSearch, IconShoppingCart, IconScan, IconChevronDown, IconX, IconBuildingStore, IconLoader2 } from '@tabler/icons-react';
import { usePOS } from '@/hooks/usePos';
import POSCard from '@/components/Cards/POSCard';

export default function PosAdmin() {

    const { stores, selectedStore, setSelectedStore, products, paymentMethods, loadingStores, loadingProducts, error } = usePOS();

    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('Todas');
    const [cart, setCart] = useState([]);

    // --------------------------------
    // Categorías
    // --------------------------------

    const categories = useMemo(() => {

        const uniqueCategories = [
            ...new Set(
                products
                    .map(product => product.category)
                    .filter(Boolean)
            )
        ];

        return ['Todas', ...uniqueCategories];

    }, [products]);

    // --------------------------------
    // Productos filtrados
    // --------------------------------

    const filteredProducts = useMemo(() => {

        const query = search.trim().toLowerCase();

        return products.filter(product => {

            const matchesSearch =
                !query ||
                product.name?.toLowerCase().includes(query) ||
                product.sku?.toLowerCase().includes(query);

            const matchesCategory =
                category === 'Todas' ||
                product.category === category;

            return matchesSearch && matchesCategory;

        });

    }, [products, search, category]);

    // --------------------------------
    // Agregar producto
    // --------------------------------

    function addToCart(product) {

        setCart(currentCart => {

            const existing = currentCart.find(
                item => item.id === product.id
            );

            if (existing) {

                if (existing.quantity >= product.stock) {
                    return currentCart;
                }

                return currentCart.map(item =>
                    item.id === product.id
                        ? {
                            ...item,
                            quantity: item.quantity + 1
                        }
                        : item
                );
            }

            return [
                ...currentCart,
                {
                    id: product.id,
                    name: product.name,
                    price: Number(product.price || 0),
                    stock: Number(product.stock || 0),
                    quantity: 1
                }
            ];

        });

    }

    // --------------------------------
    // Vaciar carrito
    // --------------------------------

    const clearCart = () => setCart([]);

    return (
        <main className="pos" style={{display: 'grid', placeItems: 'center'}}>

            <div style={{textAlign: 'center'}}>
                <p className="pos__eyebrow">Punto de venta</p>
                <h1 className="pos__title">Ventas</h1>
                <p className="pos__eyebrow">Pestaña en construcción</p>
            </div>

        </main>
    );
}