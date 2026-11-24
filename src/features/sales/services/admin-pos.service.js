import { db } from "@/libs/supabase";

const getId = (value) => {
    if (value === null || value === undefined || value === "") {
        return null;
    }

    if (typeof value === "object") {
        return value?.id ?? null;
    }

    return value;
};

export const createdSale = async ({
    companyId,
    profile,
    selectedStore,
    paymentType,
    payments,
    total,
    items,
    customerName = "Público general",
    customerDni = null,
}) => {
    try {
        if (!companyId || !profile?.id || !selectedStore) {
            throw new Error("Faltan datos para registrar la venta.");
        }

        if (!["full", "partial"].includes(paymentType)) {
            throw new Error("Tipo de pago inválido.");
        }

        if (!Array.isArray(payments) || payments.length === 0) {
            throw new Error("Debes seleccionar métodos de pago.");
        }

        if (paymentType === "full" && payments.length !== 1) {
            throw new Error("FULL requiere exactamente un método.");
        }

        if (paymentType === "partial" && payments.length < 2) {
            throw new Error("PARTIAL requiere al menos dos métodos.");
        }

        const normalizedPayments = payments.map((payment) => ({
            payment_method_id: getId(payment.payment_method_id),
            amount: Number(payment.amount),
        }));

        const paymentTotal = normalizedPayments.reduce(
            (sum, payment) => sum + payment.amount,
            0
        );

        if (Math.round(paymentTotal * 100) !== Math.round(Number(total) * 100)) {
            throw new Error("Los pagos no coinciden con el total de venta.");
        }

        if (normalizedPayments.some(
            (payment) =>
                !payment.payment_method_id ||
                !Number.isFinite(payment.amount) ||
                payment.amount <= 0
        )) {
            throw new Error("Hay métodos de pago o importes inválidos.");
        }

        if (!Array.isArray(items) || items.length === 0) {
            throw new Error("Agrega productos a la venta.");
        }

        const normalizedDni = customerDni ? String(customerDni).trim() : null;

        if (normalizedDni && !/^\d{8}$/.test(normalizedDni)) {
            throw new Error("El DNI del cliente debe tener 8 dígitos.");
        }

        const { data: sale, error } = await db.rpc("register_sale", {
            p_company_id: companyId,
            p_store_id: getId(selectedStore),
            p_user_id: profile.id,

            p_customer_name: customerName.trim() || "Público general",
            p_customer_whatsapp: null,
            p_customer_dni: normalizedDni,

            p_payment_type: paymentType,
            p_payments: normalizedPayments,

            p_items: items.map((item) => ({
                product_id: item.product_id,
                quantity: Number(item.quantity),
            })),
        });

        if (error) throw error;

        if (!sale?.success) {
            throw new Error("No se pudo completar la venta.");
        }

        return sale;

    } catch (error) {
        console.error("Error registrando venta:", error);
        throw error;
    }
};