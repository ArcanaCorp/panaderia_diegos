import GlobalModals from "@/components/Modals/GlobalModals"
import { AuthProvider } from "@/context/AuthContext"
import { DBProvider } from "@/context/DBContext"
import { ModalProvider } from "@/context/ModalContext"

export const Providers = ({ children }) => {
    return (
        <>
            <AuthProvider>
                <DBProvider>
                    <ModalProvider>
                        {children}
                        <GlobalModals/>
                    </ModalProvider>
                </DBProvider>
            </AuthProvider>
        </>
    )
}