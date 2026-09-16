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

export async function createProduct(form) {
    const {
        data: companyId,
        error: companyError,
    } = await db.rpc('get_my_company_id');

    if (companyError) {
        throw companyError;
    }

    if (!companyId) {
        throw new Error(
            'No se encontró la empresa del usuario.'
        );
    }

    const payload = {
        company_id: companyId,

        name: form.name.trim(),

        description:
            form.description.trim() || null,

        category_id:
            form.category_id || null,

        product_type:
            'finished_product',

        unit_type:
            form.unit_type,

        unit_weight:
            form.unit_weight
                ? Number(form.unit_weight)
                : null,

        unit_measure:
            form.unit_measure.trim() || null,

        allow_fraction:
            form.allow_fraction,

        price_unit:
            form.price_unit
                ? Number(form.price_unit)
                : 0,

        price_dozen:
            form.price_dozen
                ? Number(form.price_dozen)
                : null,

        cost_price:
            form.cost_price
                ? Number(form.cost_price)
                : 0,

        track_inventory:
            form.track_inventory,

        is_perishable:
            form.is_perishable,

        requires_expiration_date:
            form.requires_expiration_date,

        image_url:
            form.image_url.trim() || null,

        is_active: true,
    };

    const {
        data,
        error,
    } = await db
        .from('products')
        .insert(payload)
        .select(`
            id,
            sku,
            name,
            description,
            category_id,
            product_type,
            unit_type,
            unit_weight,
            unit_measure,
            allow_fraction,
            price_unit,
            price_dozen,
            cost_price,
            track_inventory,
            is_perishable,
            requires_expiration_date,
            image_url,
            is_active
        `)
        .single();

    if (error) {
        throw error;
    }

    /*
     * Obtenemos la categoría únicamente para que
     * el producto nuevo tenga la misma estructura
     * visual que los productos existentes.
     */
    let category = 'Sin categoría';

    if (data.category_id) {
        const {
            data: categoryData,
            error: categoryError,
        } = await db
            .from('product_categories')
            .select('name')
            .eq('id', data.category_id)
            .single();

        if (!categoryError && categoryData) {
            category = categoryData.name;
        }
    }

    return {
        ...data,

        category,

        stock: 0,

        minimum_stock: 0,

        maximum_stock: null,

        status: data.is_active
            ? 'active'
            : 'inactive',
    };
}

export async function updateProduct(productId, form ) {
    const payload = {
        name: form.name.trim(),

        description:
            form.description.trim() || null,

        category_id:
            form.category_id || null,

        unit_type:
            form.unit_type,

        unit_weight:
            form.unit_weight
                ? Number(form.unit_weight)
                : null,

        unit_measure:
            form.unit_measure.trim() || null,

        allow_fraction:
            form.allow_fraction,

        price_unit:
            form.price_unit
                ? Number(form.price_unit)
                : 0,

        price_dozen:
            form.price_dozen
                ? Number(form.price_dozen)
                : null,

        cost_price:
            form.cost_price
                ? Number(form.cost_price)
                : 0,

        track_inventory:
            form.track_inventory,

        is_perishable:
            form.is_perishable,

        requires_expiration_date:
            form.requires_expiration_date,

        image_url:
            form.image_url.trim() || null,
    };

    const { data, error } = await db
        .from('products')
        .update(payload)
        .eq('id', productId)
        .select(`
            id,
            sku,
            name,
            description,
            category_id,
            product_type,
            unit_type,
            unit_weight,
            unit_measure,
            allow_fraction,
            price_unit,
            price_dozen,
            cost_price,
            track_inventory,
            is_perishable,
            requires_expiration_date,
            image_url,
            is_active
        `)
        .single();

    if (error) {
        throw error;
    }

    let category = 'Sin categoría';

    if (data.category_id) {
        const {
            data: categoryData,
        } = await db
            .from('product_categories')
            .select('name')
            .eq('id', data.category_id)
            .single();

        if (categoryData) {
            category = categoryData.name;
        }
    }

    return {
        ...data,
        category,
    };
}

export async function deleteProduct(productId) {
    const {
        error,
    } = await db
        .from('products')
        .delete()
        .eq('id', productId);

    if (error) {
        throw error;
    }

    return true;
}