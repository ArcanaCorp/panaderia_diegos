import { db } from '@/libs/supabase'


/*
 * =========================================================
 * OBTENER PROVEEDORES
 * =========================================================
 */

export async function getWarehouseSuppliers({
    userId,
    page = 1,
    pageSize = 10,
    search = '',
    status = null,
}) {
    if (!userId) {
        throw new Error(
            'No se encontró el usuario.'
        )
    }

    const { data, error } = await db.rpc(
        'get_warehouse_suppliers',
        {
            p_user_id: userId,
            p_page: page,
            p_page_size: pageSize,
            p_search: search || null,
            p_status: status || null,
        }
    )

    if (error) {
        console.error(
            'getWarehouseSuppliers:',
            error
        )

        throw error
    }

    return data
}


/*
 * =========================================================
 * CREAR PROVEEDOR
 * =========================================================
 */

export async function createSupplier({
    userId,
    name,
    documentType,
    documentNumber,
    contactName,
    phone,
    whatsapp,
    email,
    address,
    notes,
}) {
    if (!userId) {
        throw new Error(
            'No se encontró el usuario.'
        )
    }

    if (!name?.trim()) {
        throw new Error(
            'El nombre del proveedor es obligatorio.'
        )
    }

    const { data, error } = await db.rpc(
        'create_supplier',
        {
            p_user_id: userId,
            p_name: name.trim(),
            p_document_type:
                documentType || null,
            p_document_number:
                documentNumber || null,
            p_contact_name:
                contactName || null,
            p_phone:
                phone || null,
            p_whatsapp:
                whatsapp || null,
            p_email:
                email || null,
            p_address:
                address || null,
            p_notes:
                notes || null,
        }
    )

    if (error) {
        console.error(
            'createSupplier:',
            error
        )

        throw error
    }

    return data
}


/*
 * =========================================================
 * EDITAR PROVEEDOR
 * =========================================================
 */

export async function updateSupplier({
    userId,
    supplierId,
    name,
    documentType,
    documentNumber,
    contactName,
    phone,
    whatsapp,
    email,
    address,
    notes,
}) {
    if (!userId) {
        throw new Error(
            'No se encontró el usuario.'
        )
    }

    if (!supplierId) {
        throw new Error(
            'No se encontró el proveedor.'
        )
    }

    if (!name?.trim()) {
        throw new Error(
            'El nombre del proveedor es obligatorio.'
        )
    }

    const { data, error } = await db.rpc(
        'update_supplier',
        {
            p_user_id: userId,
            p_supplier_id: supplierId,
            p_name: name.trim(),
            p_document_type:
                documentType || null,
            p_document_number:
                documentNumber || null,
            p_contact_name:
                contactName || null,
            p_phone:
                phone || null,
            p_whatsapp:
                whatsapp || null,
            p_email:
                email || null,
            p_address:
                address || null,
            p_notes:
                notes || null,
        }
    )

    if (error) {
        console.error(
            'updateSupplier:',
            error
        )

        throw error
    }

    return data
}


/*
 * =========================================================
 * ACTIVAR / DESACTIVAR
 * =========================================================
 */

export async function toggleSupplierStatus({
    userId,
    supplierId,
    isActive,
}) {
    if (!userId) {
        throw new Error(
            'No se encontró el usuario.'
        )
    }

    if (!supplierId) {
        throw new Error(
            'No se encontró el proveedor.'
        )
    }

    const { data, error } = await db.rpc(
        'toggle_supplier_status',
        {
            p_user_id: userId,
            p_supplier_id: supplierId,
            p_is_active: isActive,
        }
    )

    if (error) {
        console.error(
            'toggleSupplierStatus:',
            error
        )

        throw error
    }

    return data
}