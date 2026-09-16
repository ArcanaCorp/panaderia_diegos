import { db } from '@/libs/supabase';

/**
 * Obtener tiendas activas de una empresa
 */
export async function getStores(companyId) {
    if (!companyId) {
        throw new Error('La empresa es obligatoria.');
    }

    const { data, error } = await db
        .from('stores')
        .select(`
            id,
            company_id,
            name,
            code,
            address,
            phone,
            manager_id,
            is_main,
            is_active,
            opening_time,
            closing_time
        `)
        .eq('company_id', companyId)
        .eq('is_active', true)
        .order('name');

    if (error) throw error;

    return data || [];
}

/**
 * Obtener productos terminados activos
 */
export async function getStoreTransferProducts(companyId) {
    if (!companyId) {
        throw new Error('La empresa es obligatoria.');
    }

    const { data, error } = await db
        .from('products')
        .select(`
            id,
            sku,
            name,
            description,
            unit_type,
            price_unit,
            price_dozen,
            cost_price,
            image_url,
            is_active,
            product_type
        `)
        .eq('company_id', companyId)
        .eq('is_active', true)
        .eq('product_type', 'finished_product')
        .order('name');

    if (error) throw error;

    return data || [];
}

/**
 * Enviar productos del almacén central a una tienda
 */
export async function sendProductsToStore({
    companyId,
    storeId,
    createdBy,
    items,
    notes = null,
}) {
    if (!companyId) {
        throw new Error('La empresa es obligatoria.');
    }

    if (!storeId) {
        throw new Error('La tienda es obligatoria.');
    }

    if (!createdBy) {
        throw new Error('El usuario es obligatorio.');
    }

    if (!Array.isArray(items) || items.length === 0) {
        throw new Error('Debes agregar al menos un producto.');
    }

    const rpcItems = items.map((item) => ({
        productId: item.productId,
        quantity: Number(item.quantity),
    }));

    const { data, error } = await db.rpc(
        'send_products_to_store',
        {
            p_company_id: companyId,
            p_store_id: storeId,
            p_created_by: createdBy,
            p_items: rpcItems,
            p_notes: notes || null,
        }
    );

    if (error) throw error;

    return data;
}

export async function getStoreInventory(storeId) {
    if (!storeId) {
        throw new Error('La tienda es obligatoria.');
    }

    const { data, error } = await db
        .from('store_products')
        .select(`
            id,
            store_id,
            product_id,
            stock,
            minimum_stock,
            created_at,
            updated_at,
            products (
                id,
                sku,
                name,
                unit_type,
                price_unit,
                image_url,
                is_active
            )
        `)
        .eq('store_id', storeId)
        .order('updated_at', { ascending: false });

    if (error) throw error;

    return data || [];
}

export async function getStoreSalesUsers(storeId, companyId) {
    if (!storeId) {
        throw new Error('La tienda es obligatoria.');
    }

    const query = db
        .from('profiles')
        .select(`
            id,
            full_name,
            email,
            phone,
            role,
            is_active,
            store_id
        `)
        .eq('store_id', storeId)
        .eq('role', 'ventas')
        .order('full_name', { ascending: true });

    if (companyId) {
        query.eq('company_id', companyId);
    }

    const { data, error } = await query;

    if (error) throw error;

    return data || [];
}


export async function getCompanyStores(companyId) {
    if (!companyId) {
        throw new Error('La empresa es obligatoria.');
    }

    const { data, error } = await db
        .from('stores')
        .select(`
            id,
            company_id,
            name,
            code,
            address,
            phone,
            manager_id,
            is_main,
            is_active,
            opening_time,
            closing_time,
            created_at,
            manager:profiles!stores_manager_id_fkey (
                id,
                full_name,
                email
            )
        `)
        .eq('company_id', companyId)
        .order('is_main', { ascending: false })
        .order('name', { ascending: true });

    if (error) throw error;

    return data || [];
}

export async function getStoreManagers(companyId) {
    if (!companyId) {
        throw new Error('La empresa es obligatoria.');
    }

    const { data, error } = await db
        .from('profiles')
        .select(`
            id,
            full_name,
            email,
            role,
            is_active
        `)
        .eq('company_id', companyId)
        .eq('is_active', true)
        .in('role', ['admin', 'ventas'])
        .order('full_name', { ascending: true });

    if (error) throw error;

    return data || [];
}

export async function createStore({
    companyId,
    name,
    code,
    address,
    phone,
    managerId,
    isMain,
    isActive,
    openingTime,
    closingTime,
}) {
    if (!companyId) {
        throw new Error('La empresa es obligatoria.');
    }

    if (!name?.trim()) {
        throw new Error('El nombre de la tienda es obligatorio.');
    }

    const { data, error } = await db
        .from('stores')
        .insert({
            company_id: companyId,
            name: name.trim(),
            code: code?.trim() || null,
            address: address?.trim() || null,
            phone: phone?.trim() || null,
            manager_id: managerId || null,
            is_main: Boolean(isMain),
            is_active: Boolean(isActive),
            opening_time: openingTime || null,
            closing_time: closingTime || null,
        })
        .select(`
            id,
            company_id,
            name,
            code,
            address,
            phone,
            manager_id,
            is_main,
            is_active,
            opening_time,
            closing_time,
            created_at,
            manager:profiles!stores_manager_id_fkey (
                id,
                full_name,
                email
            )
        `)
        .single();

    if (error) throw error;

    return data;
}