import GlobalModals from "@/components/Modals/GlobalModals"
import { AppProvider } from "@/context/AppContext"
import { AuthProvider } from "@/context/AuthContext"
import { DBProvider } from "@/context/DBContext"
import { ModalProvider } from "@/context/ModalContext"

export const Providers = ({ children }) => {
    return (
        <>
            <AppProvider>
                <AuthProvider>
                    <DBProvider>
                        <ModalProvider>
                            {children}
                            <GlobalModals/>
                        </ModalProvider>
                    </DBProvider>
                </AuthProvider>
            </AppProvider>
        </>
    )
}