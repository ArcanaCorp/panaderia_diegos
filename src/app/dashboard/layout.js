import ProtectedRoute from "@/components/auth/ProtectedRoute"
import DashboardShell from "@/components/layout/DashboardShell"

export const metadata = {
    title: 'Dashboard'
}

export default function DashboardLayout ({ children }) {

    return (
        <ProtectedRoute>
            <DashboardShell>{children}</DashboardShell>
        </ProtectedRoute>
    )
}
