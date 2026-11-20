import { db } from "@/libs/supabase";

const getId = (value) => {
    if (value === null || value === undefined || value === "") return null;

    if (typeof value === "object") {
        return value?.id ?? null;
    }

    return value;
};

export const createdSale = async ({ companyId, profile, selectedStore, selectedPaymentMethod, total, items }) => {

    try {

        const { data: sale, error: saleError } = await db.rpc('register_sale', {
            p_company_id: companyId,
            p_store_id: getId(selectedStore),
            p_user_id: profile.id,
            p_customer_name: 'Público general',
            p_customer_whatsapp: null,
            p_customer_dni: null,
            p_payment_method_id: getId(selectedPaymentMethod),
            p_items: items,
            p_payment_amount: total
        });

        if (saleError) throw saleError;

        console.log(sale);
        console.log(saleError);

        return sale;

    } catch (error) {
        console.error(error);
    }
}