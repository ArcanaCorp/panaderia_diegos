import { db } from '@/libs/supabase';

export async function createProductionOrder({
    companyId,
    userId,
    priority,
    notes,
    dueDate,
    items,
}) {

    if (!companyId) {
        throw new Error(
            'No se encontró la empresa.'
        );
    }

    if (!userId) {
        throw new Error(
            'No se encontró el usuario.'
        );
    }

    if (!Array.isArray(items) || items.length === 0) {
        throw new Error(
            'La orden debe contener al menos un producto.'
        );
    }


    const { data, error } = await db.rpc(
        'create_production_order',
        {
            p_company_id: companyId,
            p_user_id: userId,
            p_priority: priority || 'normal',
            p_due_date: dueDate || null,
            p_notes: notes || null,
            p_items: items,
        }
    );


    if (error) {
        console.error(
            'Error RPC create_production_order:',
            error
        );

        throw new Error(
            error.message ||
            'No se pudo crear la orden de producción.'
        );
    }


    return data;
}