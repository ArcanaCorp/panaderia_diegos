import ProtectedRoute from "@/components/auth/ProtectedRoute"
import SideBar from "@/components/layout/SideBar"

export const metadata = {
    title: 'Dashboard'
}

export default function DashboardLayout ({ children }) {

    return (
        <ProtectedRoute>
            <div className="screen grid grid-cols-300-1">
                <SideBar />
                <main className="w h-screen p-md overflow-y-auto" style={{"--w": "calc(100dvw - 300px)"}}>
                    {children}
                </main>
            </div>
        </ProtectedRoute>
    )
}