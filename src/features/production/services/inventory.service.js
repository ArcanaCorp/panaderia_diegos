import { db } from '@/libs/supabase'

export async function getProductionInventory(userId) {
    if (!userId) {
        throw new Error('No se encontró el usuario.')
    }

    const { data, error } = await db.rpc(
        'get_production_inventory',
        {
            p_user_id: userId,
        }
    )

    if (error) {
        console.error(
            'getProductionInventory:',
            error
        )

        throw error
    }

    return data
}


export async function registerInventoryExit({
    companyId,
    productId,
    quantity,
    userId,
    reason,
    notes,
}) {

    if (!companyId) {
        throw new Error('No se encontró la empresa.')
    }

    if (!productId) {
        throw new Error('Selecciona un insumo.')
    }

    if (!quantity || Number(quantity) <= 0) {
        throw new Error(
            'La cantidad debe ser mayor que cero.'
        )
    }

    if (!userId) {
        throw new Error('No se encontró el usuario.')
    }

    const { data, error } = await db.rpc(
        'register_inventory_movement',
        {
            p_company_id: companyId,
            p_product_id: productId,
            p_movement_type: 'exit',
            p_quantity: Number(quantity),
            p_created_by: userId,
            p_unit_cost: null,
            p_lot_number: null,
            p_manufacturing_date: null,
            p_expiration_date: null,
            p_reason: reason || 'production',
            p_notes: notes || null,
        }
    )

    if (error) {
        console.error(
            'registerInventoryExit:',
            error
        )

        throw error
    }

    return data
}