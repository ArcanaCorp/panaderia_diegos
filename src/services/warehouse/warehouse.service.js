import { db } from '@/libs/supabase'

export async function getWarehouseDashboard(userId) {

    if (!userId) {
        throw new Error(
            'No se encontró el usuario.'
        )
    }

    const { data, error } = await db.rpc(
        'get_warehouse_dashboard',
        {
            p_user_id: userId,
        }
    )

    if (error) {

        console.error(
            'getWarehouseDashboard:',
            error
        )

        throw error
    }

    return data
}

export async function getWarehouseInventory({ userId, page = 1, pageSize = 10, search = '', categoryId = null, status = null }) {

    if (!userId) {
        throw new Error(
            'No se encontró el usuario.'
        )
    }

    const { data, error } = await db.rpc(
        'get_warehouse_inventory',
        {
            p_user_id: userId,
            p_page: page,
            p_page_size: pageSize,
            p_search: search || null,
            p_category_id: categoryId || null,
            p_status: status || null,
        }
    )

    if (error) {

        console.error(
            'getWarehouseInventory:',
            error
        )

        throw error
    }

    return data
}