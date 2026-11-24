import { db } from "@/libs/supabase";

export async function login(email, password) {
    const { data, error } = await db.auth.signInWithPassword({email, password});
    if (error) {
        throw error;
    }

    return data;
}

export async function logout() {
    const { error } = await db.auth.signOut();

    if (error) {
        throw error;
    }
}

export async function getSession() {
    const { data, error } = await db.auth.getSession();

    if (error) {
        throw error;
    }

    return data.session;
}

export async function getProfile(userId) {
    const { data: profile, error } = await db
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

    if (error) {
        throw error;
    }

    if (profile.role === "ventas" && profile.store_id) {
        const { data: store, error: storeError } = await db
            .from("stores")
            .select("*")
            .eq("id", profile.store_id)
            .single();

        if (storeError) {
            throw storeError;
        }

        profile.store = store;
    }

    return profile;
}