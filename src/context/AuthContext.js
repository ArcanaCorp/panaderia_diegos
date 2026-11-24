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
} from "@/features/auth/services/auth.service";

import { db } from "@/libs/supabase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    const mountedRef = useRef(false);

    // Solo conserva solicitudes en curso; no reutiliza promesas ya resueltas.
    const profileRequestRef = useRef({
        userId: null,
        promise: null,
        requestId: 0,
    });
    const loadedProfileUserRef = useRef(null);

    const clearUser = useCallback(() => {
        const requestId = profileRequestRef.current.requestId + 1;

        profileRequestRef.current = {
            userId: null,
            promise: null,
            requestId,
        };
        loadedProfileUserRef.current = null;

        if (mountedRef.current) {
            setUser(null);
            setProfile(null);
            setLoading(false);
        }
    }, []);

    const loadUser = useCallback(async (session, { force = false } = {}) => {
        const sessionUser = session?.user;

        if (!sessionUser) {
            clearUser();
            return null;
        }

        const userId = sessionUser.id;
        const currentRequest = profileRequestRef.current;

        if (
            loadedProfileUserRef.current &&
            loadedProfileUserRef.current !== userId
        ) {
            loadedProfileUserRef.current = null;

            if (mountedRef.current) {
                setProfile(null);
            }
        }

        if (currentRequest.userId === userId && currentRequest.promise) {
            return currentRequest.promise;
        }

        // Los refresh de token no requieren volver a consultar el perfil.
        if (!force && loadedProfileUserRef.current === userId) {
            if (mountedRef.current) {
                setUser(sessionUser);
            }
            return null;
        }

        const requestId = currentRequest.requestId + 1;

        if (mountedRef.current) {
            setUser(sessionUser);
            setLoading(true);
        }

        const promise = (async () => {
            try {
                const profileData = await getProfile(userId);

                if (profileRequestRef.current.requestId !== requestId) {
                    return null;
                }

                if (!profileData?.is_active) {
                    loadedProfileUserRef.current = null;
                    await logoutService();
                    clearUser();
                    return null;
                }

                loadedProfileUserRef.current = userId;

                if (mountedRef.current) {
                    setProfile(profileData);
                }

                return profileData;
            } catch (error) {
                console.error("Error cargando perfil:", error);

                if (profileRequestRef.current.requestId === requestId) {
                    loadedProfileUserRef.current = null;

                    if (mountedRef.current) {
                        setProfile(null);
                    }
                }

                return null;
            } finally {
                if (
                    profileRequestRef.current.requestId === requestId &&
                    mountedRef.current
                ) {
                    setLoading(false);
                }

                if (profileRequestRef.current.requestId === requestId) {
                    profileRequestRef.current = {
                        userId,
                        promise: null,
                        requestId,
                    };
                }
            }
        })();

        profileRequestRef.current = {
            userId,
            promise,
            requestId,
        };

        return promise;
    }, [clearUser]);

    useEffect(() => {
        mountedRef.current = true;

        const {
            data: { subscription },
        } = db.auth.onAuthStateChange((event, session) => {
            // Las operaciones de datos se ejecutan fuera del callback de Supabase.
            Promise.resolve().then(() => {
                if (!mountedRef.current) return;

                if (event === "SIGNED_OUT" || !session?.user) {
                    clearUser();
                    return;
                }

                if (event === "USER_UPDATED") {
                    return loadUser(session, { force: true });
                }

                // SIGNED_IN e INITIAL_SESSION se deduplican con la solicitud activa.
                // TOKEN_REFRESHED actualiza el usuario sin volver a consultar el perfil.
                return loadUser(session);
            });
        });

        return () => {
            mountedRef.current = false;
            subscription.unsubscribe();

            profileRequestRef.current = {
                userId: null,
                promise: null,
                requestId: profileRequestRef.current.requestId + 1,
            };
            loadedProfileUserRef.current = null;
        };
    }, [clearUser, loadUser]);

    async function signIn(email, password) {
        const data = await loginService(email, password);
        await loadUser(data.session);
        return data;
    }

    async function signOut() {
        // SIGNED_OUT dispara clearUser desde el listener; no duplicar la limpieza.
        await logoutService();
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
