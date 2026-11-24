import { db } from '@/libs/supabase';

export async function getCompany(companyId) {
    if (!companyId) {
        throw new Error('La empresa es obligatoria.');
    }

    const { data, error } = await db
        .from('companies')
        .select(`
            id,
            business_name,
            trade_name,
            document_number,
            address,
            phone,
            email,
            website,
            logo_url,
            is_active
        `)
        .eq('id', companyId)
        .single();

    if (error) throw error;

    return data;
}

export async function updateCompany({
    companyId,
    businessName,
    tradeName,
    address,
    phone,
    email,
    website,
}) {
    if (!companyId) {
        throw new Error('La empresa es obligatoria.');
    }

    if (!businessName?.trim()) {
        throw new Error('La razón social es obligatoria.');
    }

    const { data, error } = await db
        .from('companies')
        .update({
            business_name: businessName.trim(),
            trade_name: tradeName?.trim() || null,
            address: address?.trim() || null,
            phone: phone?.trim() || null,
            email: email?.trim() || null,
            website: website?.trim() || null,
        })
        .eq('id', companyId)
        .select(`
            id,
            business_name,
            trade_name,
            document_number,
            address,
            phone,
            email,
            website,
            logo_url,
            is_active
        `)
        .single();

    if (error) throw error;

    return data;
}