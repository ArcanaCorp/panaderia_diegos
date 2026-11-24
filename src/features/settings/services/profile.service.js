import { db } from '@/libs/supabase';

export async function updateMyProfile({ userId, fullName, phone }) {
    if (!userId) {
        throw new Error('No se encontró el usuario.');
    }

    const { data, error } = await db
        .from('profiles')
        .update({
            full_name: fullName?.trim() || null,
            phone: phone?.trim() || null,
        })
        .eq('id', userId)
        .select(`
            id,
            company_id,
            full_name,
            phone,
            email,
            role,
            store_id,
            is_active
        `)
        .single();

    if (error) throw error;

    return data;
}