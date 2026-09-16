import { db } from "@/libs/supabase";

export const getProductsAll = async (companyId) => {
    try {

        if (!companyId) return [];
        
        const { data, error } = await db
            .from('products')
            .select(`
                *,
                product_categories(
                    *
                )
            `)
            .eq('company_id', companyId)

        if (error) throw error;

        return data ?? [];
        
    } catch (error) {
        console.error(error);
        return [];
    }
}