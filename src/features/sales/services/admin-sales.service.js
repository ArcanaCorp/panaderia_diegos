import { db } from '@/libs/supabase';

const LIMA_TIME_ZONE = 'America/Lima';
const LIMA_UTC_OFFSET = '-05:00';

function shiftCalendarDay(day, amount = 0) {
    const [year, month, date] = day.split('-').map(Number);
    const shifted = new Date(Date.UTC(year, month - 1, date + amount));

    return [
        shifted.getUTCFullYear(),
        String(shifted.getUTCMonth() + 1).padStart(2, '0'),
        String(shifted.getUTCDate()).padStart(2, '0'),
    ].join('-');
}

function getLimaDate(referenceDate = new Date()) {
    const parts = new Intl.DateTimeFormat('en-CA', {
        timeZone: LIMA_TIME_ZONE,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).formatToParts(referenceDate);

    const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));

    return `${values.year}-${values.month}-${values.day}`;
}

function getLimaDayRange(dayOffset = 0) {
    const currentLimaDay = getLimaDate();
    const day = shiftCalendarDay(currentLimaDay, dayOffset);
    const nextDay = shiftCalendarDay(day, 1);

    // Supabase compara timestamptz como instantes UTC.
    // Perú usa UTC-05:00; el rango representa medianoche local [inicio, fin).
    const start = new Date(`${day}T00:00:00${LIMA_UTC_OFFSET}`);
    const end = new Date(`${nextDay}T00:00:00${LIMA_UTC_OFFSET}`);

    return {
        day,
        start: start.toISOString(),
        end: end.toISOString(),
    };
}

export async function getAdminSales({ day = 'today' } = {}) {
    const dayOffset = day === 'yesterday' ? -1 : 0;
    const { data: companyId, error: companyError } = await db.rpc('get_my_company_id');

    if (companyError) throw companyError;
    if (!companyId) throw new Error('No se encontró la empresa del usuario.');

    const range = getLimaDayRange(dayOffset);

    const [salesResult, storesResult] = await Promise.all([
        db
            .from('sales')
            .select('*')
            .eq('company_id', companyId)
            .gte('created_at', range.start)
            .lt('created_at', range.end)
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
        day: range.day,
        sales: salesResult.data || [],
        stores: storesResult.data || [],
    };
}