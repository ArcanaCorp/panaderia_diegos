import { db } from "@/libs/supabase";

const CACHE_TTL = 60_000;

let categoriesCache = null;
let cacheExpiresAt = 0;
let categoriesRequest = null;

export async function getActiveProductCategories({ force = false } = {}) {
    if (
        !force &&
        categoriesCache &&
        Date.now() < cacheExpiresAt
    ) {
        return categoriesCache;
    }

    if (categoriesRequest) {
        return categoriesRequest;
    }

    categoriesRequest = (async () => {
        const { data, error } = await db
            .from("product_categories")
            .select("id, name")
            .eq("is_active", true)
            .order("name");

        if (error) throw error;

        categoriesCache = data || [];
        cacheExpiresAt = Date.now() + CACHE_TTL;

        return categoriesCache;
    })();

    try {
        return await categoriesRequest;
    } finally {
        categoriesRequest = null;
    }
}

export function invalidateProductCategoriesCache() {
    categoriesCache = null;
    cacheExpiresAt = 0;
}
