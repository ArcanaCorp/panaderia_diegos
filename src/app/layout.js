import { Montserrat } from "next/font/google";
import '@/styles/global.css';
import { Providers } from "@/providers";
import { Toaster } from "sonner";

const montserrat = Montserrat({
    variable: '--font-sans',
    subsets: ["latin"],
    weight: ["200", "300", "400", "500", "600", "700", "800"]
})

export const metadata = {
    metadataBase: new URL('https://panaderiadiegos.vercel.app'),
    title: {
        default: 'Diegos | ERP de la Panadería y Pastelería Diegos',
        template: '%s | Diegos | ERP de la Panadería y Pastelería Diegos',
    },
}

export default function RootLayout ({ children }) {
    return (
        <html lang="es" className={`${montserrat.className}`} data-scroll-behavior="smooth">
            <body>
                <Providers>
                    {children}
                </Providers>
                <Toaster position="top-center" duration={5000} closeButton />
            </body>
        </html>
    )
}