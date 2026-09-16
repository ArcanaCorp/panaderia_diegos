"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function ProtectedRoute({ children }) {

    const router = useRouter();

    const { user, profile, loading } = useAuth();

    useEffect(() => {

        if (loading) return;

        if (!user || !profile) {
            router.replace("/");
        }

    }, [user, profile, loading, router]);

    if (loading) {
        return (
            <div className="screen center">
                Cargando...
            </div>
        );
    }

    if (!user || !profile) {
        return null;
    }

    return children;
}