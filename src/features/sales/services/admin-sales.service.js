import { db } from '@/libs/supabase';

function getLimaDayRange() {
    const day = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'America/Lima',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).format(new Date());

    const start = new Date(`${day}T00:00:00-05:00`);
    const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);

    return { day, start: start.toISOString(), end: end.toISOString() };
}

export async function getAdminSales() {
    const { data: companyId, error: companyError } = await db.rpc('get_my_company_id');

    if (companyError) throw companyError;
    if (!companyId) throw new Error('No se encontró la empresa del usuario.');

    const { day, start, end } = getLimaDayRange();

    const [salesResult, storesResult] = await Promise.all([
        db
            .from('sales')
            .select('*')
            .eq('company_id', companyId)
            .gte('created_at', start)
            .lt('created_at', end)
            .order('created_at', { ascending: false }),
        db
            .from('stores')
            .select('id, name')
            .eq('company_id', companyId)
            .order('name', { ascending: true }),
    ]);

    if (salesResult.error) throw salesResult.error;
    if (storesResult.error) throw storesResult.error;

    return {
        day,
        sales: salesResult.data || [],
        stores: storesResult.data || [],
    };
}
