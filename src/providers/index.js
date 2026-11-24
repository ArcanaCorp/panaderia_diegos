import GlobalModals from "@/components/Modals/GlobalModals";
import { AppProvider } from "@/context/AppContext";
import { AuthProvider } from "@/context/AuthContext";
import { ModalProvider } from "@/context/ModalContext";

export const Providers = ({ children }) => {
    return (
        <AppProvider>
            <AuthProvider>
                <ModalProvider>
                    {children}
                    <GlobalModals />
                </ModalProvider>
            </AuthProvider>
        </AppProvider>
    );
};