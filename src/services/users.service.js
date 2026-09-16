import { db } from '@/libs/supabase';

export async function getCompanyUsers(companyId) {
    if (!companyId) {
        throw new Error('La empresa es obligatoria.');
    }

    const { data, error } = await db
        .from('profiles')
        .select(`
            id,
            company_id,
            full_name,
            email,
            phone,
            role,
            store_id,
            is_active,
            stores!profiles_store_id_fkey (
                id,
                name,
                code
            )
        `)
        .eq('company_id', companyId)
        .order('full_name', { ascending: true });

    if (error) throw error;

    return data || [];
}

export async function createCompanyUser({
    companyId,
    fullName,
    email,
    password,
    role,
    storeId = null,
    isActive = true,
}) {
    if (!companyId) throw new Error('La empresa es obligatoria.');
    if (!fullName?.trim()) throw new Error('El nombre es obligatorio.');
    if (!email?.trim()) throw new Error('El correo es obligatorio.');
    if (!password) throw new Error('La contraseña es obligatoria.');

    if (password.length < 8) {
        throw new Error('La contraseña debe tener al menos 8 caracteres.');
    }

    const validRoles = ['admin', 'almacen', 'produccion', 'ventas'];

    if (!validRoles.includes(role)) {
        throw new Error('El rol seleccionado no es válido.');
    }

    if (role === 'ventas' && !storeId) {
        throw new Error(
            'Debes seleccionar una tienda para el usuario de ventas.'
        );
    }

    const { data, error } = await db.functions.invoke(
        'create-company-user',
        {
            body: {
                companyId,
                fullName: fullName.trim(),
                email: email.trim().toLowerCase(),
                password,
                role,
                storeId: role === 'ventas' ? storeId : null,
                isActive,
            },
        }
    );

    console.log('Edge Function data:', data);
    console.log('Edge Function error:', error);

    if (error) {
        let message = error.message;

        // Intentar obtener el body real de la respuesta
        if (error.context) {
            try {
                const responseData = await error.context.json();

                if (responseData?.error) {
                    message = responseData.error;
                }
            } catch {
                // No se pudo leer el body
            }
        }

        throw new Error(message);
    }

    if (data?.error) {
        throw new Error(data.error);
    }

    return data;
}