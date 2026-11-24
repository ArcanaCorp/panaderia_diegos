import { db } from '@/libs/supabase';

export async function getWarehouseDashboard(userId) {
    if (!userId) {
        throw new Error('No se encontró el usuario.');
    }

    const { data, error } = await db.rpc('get_warehouse_dashboard', {
        p_user_id: userId,
    });

    if (error) {
        console.error('getWarehouseDashboard:', error);
        throw error;
    }

    return data;
}
