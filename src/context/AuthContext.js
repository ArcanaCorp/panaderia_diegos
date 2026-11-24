"use client";

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";

import {
    login as loginService,
    logout as logoutService,
    getProfile,
} from "@/services/auth.service";

import { db } from "@/libs/supabase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    const mountedRef = useRef(false);

    const profileRequestRef = useRef({
        userId: null,
        promise: null,
        requestId: 0,
    });

    const loadUser = useCallback((session) => {
        const sessionUser = session?.user;

        if (!sessionUser) {
            const requestId =
                profileRequestRef.current.requestId + 1;

            profileRequestRef.current = {
                userId: null,
                promise: null,
                requestId,
            };

            if (mountedRef.current) {
                setUser(null);
                setProfile(null);
                setLoading(false);
            }

            return Promise.resolve(null);
        }

        const userId = sessionUser.id;
        const currentRequest = profileRequestRef.current;

        // Evitar cargar dos veces el perfil del mismo usuario.
        if (
            currentRequest.userId === userId &&
            currentRequest.promise
        ) {
            return currentRequest.promise;
        }

        const requestId = currentRequest.requestId + 1;

        if (mountedRef.current) {
            setUser(sessionUser);
            setLoading(true);
        }

        const promise = (async () => {
            try {
                const profileData = await getProfile(userId);

                if (
                    profileRequestRef.current.requestId !== requestId
                ) {
                    return null;
                }

                if (!profileData.is_active) {
                    await logoutService();

                    if (
                        profileRequestRef.current.requestId === requestId &&
                        mountedRef.current
                    ) {
                        setUser(null);
                        setProfile(null);
                    }

                    return null;
                }

                if (mountedRef.current) {
                    setProfile(profileData);
                }

                return profileData;
            } catch (error) {
                console.error("Error cargando perfil:", error);

                if (
                    profileRequestRef.current.requestId === requestId &&
                    mountedRef.current
                ) {
                    setProfile(null);
                }

                return null;
            } finally {
                if (
                    profileRequestRef.current.requestId === requestId &&
                    mountedRef.current
                ) {
                    setLoading(false);
                }
            }
        })();

        profileRequestRef.current = {
            userId,
            promise,
            requestId,
        };

        return promise;
    }, []);

    useEffect(() => {
        mountedRef.current = true;

        const {
            data: { subscription },
        } = db.auth.onAuthStateChange((event, session) => {
            // No ejecutar consultas Supabase dentro del callback.
            Promise.resolve().then(() => {
                if (!mountedRef.current) return;

                return loadUser(session);
            });
        });

        return () => {
            mountedRef.current = false;
            subscription.unsubscribe();

            profileRequestRef.current = {
                userId: null,
                promise: null,
                requestId:
                    profileRequestRef.current.requestId + 1,
            };
        };
    }, [loadUser]);

    async function signIn(email, password) {
        const data = await loginService(email, password);

        await loadUser(data.session);

        return data;
    }

    async function signOut() {
        await logoutService();
        await loadUser(null);
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
                signOut,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
