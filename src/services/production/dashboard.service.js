import { db } from '@/libs/supabase';

export async function getProductionDashboard(userId) {

    if (!userId) {
        throw new Error(
            'No se encontró el usuario.'
        );
    }

    const { data, error } = await db.rpc(
        'get_production_dashboard',
        {
            p_user_id: userId,
        }
    );

    if (error) {
        console.error(
            'getProductionDashboard:',
            error
        );

        throw error;
    }

    return data;
}

export async function updateProductionOrderStatus( orderId, userId, status ) {

    if (!orderId) {
        throw new Error('No se encontró la orden.')
    }

    if (!userId) {
        throw new Error('No se encontró el usuario.')
    }

    if (!status) {
        throw new Error('No se indicó el estado.')
    }

    const { data, error } = await db.rpc(
        'update_production_order_status',
        {
            p_order_id: orderId,
            p_user_id: userId,
            p_status: status,
        }
    )

    if (error) {
        console.error(
            'updateProductionOrderStatus:',
            error
        )

        throw error
    }

    return data
}