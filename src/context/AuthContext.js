"use client";

import { createContext, useContext, useEffect, useState } from "react";

import { login as loginService, logout as logoutService, getSession, getProfile } from "@/services/auth.service";
import { db } from "@/libs/supabase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {

    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    async function loadUser(session) {

        if (!session?.user) {
            setUser(null);
            setProfile(null);
            return;
        }

        setUser(session.user);

        try {
            const profileData = await getProfile(session.user.id);

            if (!profileData.is_active) {
                await logoutService();

                setUser(null);
                setProfile(null);

                return;
            }

            setProfile(profileData);

        } catch (error) {
            console.error("Error cargando perfil:", error);

            setProfile(null);
        }
    }

    useEffect(() => {

        let mounted = true;

        async function initialize() {

            try {

                const session = await getSession();

                if (mounted) {
                    await loadUser(session);
                }

            } catch (error) {

                console.error("Error inicializando sesión:", error);

            } finally {

                if (mounted) {
                    setLoading(false);
                }

            }
        }

        initialize();

        const { data: { subscription }} = db.auth.onAuthStateChange(
            async (event, session) => {
                if (!mounted) return;
                await loadUser(session);
            }
        );

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };

    }, []);

    async function signIn(email, password) {

        const data = await loginService(email, password);

        await loadUser(data.session);

        return data;
    }

    async function signOut() {

        await logoutService();

        setUser(null);
        setProfile(null);
    }

    const role = profile?.role || null;

    return (
        <AuthContext.Provider
            value={{
                user,
                profile,
                role,
                loading,
                signIn,
                signOut
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}