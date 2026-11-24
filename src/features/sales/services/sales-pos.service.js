import { db } from '@/libs/supabase';

export async function getSalesPOS(userId) {
    if (!userId) {
        throw new Error('No se encontró el usuario.');
    }

    const { data, error } = await db.rpc(
        'get_sales_pos',
        {
            p_user_id: userId,
        }
    );

    if (error) {
        console.error('getSalesPOS:', error);
        throw error;
    }

    return data;
}