'use client';
import PublicRoute from "@/components/auth/PublicRoute";
import { useAuth } from "@/context/AuthContext";
import { IconLock, IconMail } from "@tabler/icons-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Page() {

    const { signIn } = useAuth();
    const [ email, setEmail ] = useState('')
    const [ password, setPassword ] = useState('')
    const [ loading, setLoading ] = useState(false)
    const [ error, setError ] = useState('')

    const handleLogin = async (e) => {
        
        e.preventDefault();
        
        try {
            setError('')
            setLoading(true);
            await signIn(email, password);
            toast.success('Inicio de sesión exitoso')
        } catch (error) {
            console.error(error);
            setError(error.message)
            toast.error('Hubo un error. Inténtalo más tarde')
        } finally {
            setEmail('')
            setPassword('')
            setLoading(false)
        }
    }

    return (
        <PublicRoute>
            <main className="login">
                <section className="login__container">
                    <div className="login__brand">
                        <div className="login__logo">D</div>
                        <div>
                            <p className="login__brand-name">Diego's</p>
                            <p className="login__brand-subtitle">Gestión empresarial</p>
                        </div>
                    </div>
                    <div className="login__header">
                        <h1 className="login__title">Bienvenido</h1>
                        <p className="login__description">Ingresa a tu cuenta para continuar.</p>
                    </div>

                    <form className="card login__card" onSubmit={handleLogin}>

                        <div className="login__fields">

                            <div className="input-field">
                                <label className="input-label" htmlFor="email">Correo electrónico</label>

                                <div className="input-group input-group--left">
                                    <span className="input-group__icon--left">
                                        <IconMail size={16} />
                                    </span>
                                    <input id="email" name="email" type="email" className="input" placeholder="correo@ejemplo.com" autoComplete="email" onChange={(e) => setEmail(e.target.value)}/>
                                </div>
                            </div>

                            <div className="input-field">
                                <div className="input-label-row">
                                    <label className="input-label" htmlFor="password">Contraseña</label>
                                    <button type="button" className="login__forgot">¿Olvidaste tu contraseña?</button>
                                </div>

                                <div className="input-group input-group--left input-group--right">
                                    <span className="input-group__icon--left">
                                        <IconLock size={16} />
                                    </span>
                                    <input id="password" name="password" type="password" className="input" placeholder="••••••••" autoComplete="current-password" onChange={(e) => setPassword(e.target.value)}/>
                                </div>
                            </div>

                        </div>
                        <button type="submit" className={`btn btn-primary login__submit ${loading && 'btn-loading'}`} disabled={loading}>Iniciar sesión</button>

                    </form>
                    <p className="login__footer">Sistema de gestión · Diego's</p>

                </section>
            </main>
        </PublicRoute>
    );
}