"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function ProtectedRoute({ children }) {
    const router = useRouter();
    const { user, profile, loading } = useAuth();

    useEffect(() => {
        if (!loading && (!user || !profile)) {
            router.replace("/");
        }
    }, [user, profile, loading, router]);

    // Keep the route tree mounted while Supabase resolves the initial session.
    // RoleBasedView owns the single visible loading state (the module skeleton).
    if (!loading && (!user || !profile)) {
        return null;
    }

    return children;
}
