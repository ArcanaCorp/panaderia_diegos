import { db } from '@/libs/supabase';

export async function getCompanyPaymentMethods(companyId) {
    if (!companyId) {
        throw new Error('La empresa es obligatoria.');
    }

    const { data, error } = await db
        .from('payment_methods')
        .select(`
            id,
            company_id,
            name,
            type,
            description,
            is_active,
            created_at,
            updated_at
        `)
        .eq('company_id', companyId)
        .order('name', { ascending: true });

    if (error) throw error;

    return data || [];
}

export async function createPaymentMethod({
    companyId,
    name,
    type,
    description,
    isActive,
}) {
    if (!companyId) {
        throw new Error('La empresa es obligatoria.');
    }

    if (!name?.trim()) {
        throw new Error('El nombre es obligatorio.');
    }

    if (!type) {
        throw new Error('El tipo es obligatorio.');
    }

    const validTypes = [
        'cash',
        'card',
        'digital_wallet',
        'transfer',
        'other',
    ];

    if (!validTypes.includes(type)) {
        throw new Error('El tipo de medio de pago no es válido.');
    }

    const { data, error } = await db
        .from('payment_methods')
        .insert({
            company_id: companyId,
            name: name.trim(),
            type,
            description: description?.trim() || null,
            is_active: Boolean(isActive),
        })
        .select(`
            id,
            company_id,
            name,
            type,
            description,
            is_active,
            created_at,
            updated_at
        `)
        .single();

    if (error) throw error;

    return data;
}