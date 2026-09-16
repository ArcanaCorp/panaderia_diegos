import { AuthProvider } from "@/context/AuthContext"
import { DBProvider } from "@/context/DBContext"

export const Providers = ({ children }) => {
    return (
        <>
            <AuthProvider>
                <DBProvider>
                    {children}
                </DBProvider>
            </AuthProvider>
        </>
    )
}