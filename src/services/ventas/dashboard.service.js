import { db } from '@/libs/supabase';

export async function getSalesDashboard(userId) {
    if (!userId) {
        throw new Error('No se encontró el usuario.');
    }

    const { data, error } = await db.rpc(
        'get_sales_dashboard',
        {
            p_user_id: userId,
        }
    );

    if (error) {
        console.error('getSalesDashboard:', error);
        throw error;
    }

    return data;
}