import { AuthProvider } from "@/context/AuthContext"

export const Providers = ({ children }) => {
    return (
        <>
            <AuthProvider>
                {children}
            </AuthProvider>
        </>
    )
}