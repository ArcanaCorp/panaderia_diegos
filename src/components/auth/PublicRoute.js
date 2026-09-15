"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function PublicRoute({ children }) {

    const router = useRouter();

    const {
        user,
        profile,
        loading
    } = useAuth();

    useEffect(() => {

        if (loading) return;

        if (user && profile) {
            router.replace("/dashboard");
        }

    }, [user, profile, loading, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                Cargando...
            </div>
        );
    }

    if (user && profile) {
        return null;
    }

    return children;
}