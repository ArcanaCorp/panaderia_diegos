import { useAuth } from "@/context/AuthContext"
import { getProductsAll } from "@/services/products/product.service";
import { useEffect, useState } from "react";

export const useProducts = () => {

    const { profile } = useAuth();

    const [ products, setProducts ] = useState([]);
    const [ loading, setLoading ] = useState(false);

    const fetchProducts = async () => {
        try {
            setLoading(true)
            const data = await getProductsAll(profile?.company_id);
            setProducts(data)
        } catch (error) {
            console.error(error);
            setProducts([]);
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const load = async () => {
            if (products.length > 0) return; 
            await fetchProducts();
        }
        load();
    }, [profile?.company_id])

    return {
        products,
        loading,
        fetchProducts
    }

}