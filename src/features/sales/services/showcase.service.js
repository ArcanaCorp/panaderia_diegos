import { db } from '@/libs/supabase';
import { getActiveFinishedProducts } from '@/features/products/services/product.service';

export async function getStoreShowcase(userId) {
    if (!userId) {
        throw new Error('No se encontró el usuario.');
    }

    const { data, error } = await db.rpc(
        'get_store_showcase',
        {
            p_user_id: userId,
        }
    );

    if (error) {
        console.error('getStoreShowcase:', error);
        throw error;
    }

    return data;
}

export async function getCatalogProducts(companyId) {
    return getActiveFinishedProducts(companyId);
}

export async function transferProductsBetweenStores({
    companyId,
    sourceStoreId,
    destinationStoreId,
    createdBy,
    items,
    notes = null,
}) {
    const { data, error } = await db.rpc(
        'transfer_products_between_stores',
        {
            p_company_id: companyId,
            p_source_store_id: sourceStoreId,
            p_destination_store_id: destinationStoreId,
            p_created_by: createdBy,
            p_items: items,
            p_notes: notes,
        }
    );

    if (error) {
        console.error(
            'transferProductsBetweenStores:',
            error
        );

        throw error;
    }

    return data;
}

export async function addProductsToStore({ companyId, storeId, items }) {
    const { data, error } = await db.rpc(
        'add_existing_products_to_store',
        {
            p_company_id: companyId,
            p_store_id: storeId,
            p_items: items,
        }
    );

    if (error) {
        console.error('addProductsToStore:', error);
        throw error;
    }

    if (!data?.success) {
        throw new Error('No se pudieron actualizar los productos.');
    }

    return data;
}