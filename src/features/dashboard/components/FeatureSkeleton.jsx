import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const repeat = (count, render) =>
    Array.from({ length: count }, (_, index) => render(index));

function Header({ wide = false }) {
    return (
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 20, marginBottom: 24 }}>
            <div style={{ flex: 1, maxWidth: wide ? 520 : 420 }}>
                <Skeleton width={130} height={13} />
                <Skeleton width="72%" height={30} style={{ marginTop: 8 }} />
                <Skeleton width="92%" height={14} style={{ marginTop: 8 }} />
            </div>
            <Skeleton width={wide ? 150 : 116} height={38} borderRadius={8} />
        </header>
    );
}

function Stats({ count = 4 }) {
    return (
        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 14, marginBottom: 22 }}>
            {repeat(count, (index) => (
                <article className="card" key={index} style={{ padding: 18 }}>
                    <Skeleton width="58%" height={13} />
                    <Skeleton width="42%" height={28} style={{ marginTop: 12 }} />
                    <Skeleton width="70%" height={11} style={{ marginTop: 8 }} />
                </article>
            ))}
        </section>
    );
}

function TableBody({ rows = 6, columns = 5 }) {
    return (
        <div className="card" style={{ padding: 18, overflow: "hidden" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 18 }}>
                <Skeleton width={150} height={19} />
                <Skeleton width={100} height={32} borderRadius={8} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${columns}, minmax(70px, 1fr))`, gap: 12, paddingBottom: 12, borderBottom: "1px solid var(--border, #e5e7eb)" }}>
                {repeat(columns, (index) => <Skeleton key={index} height={13} />)}
            </div>
            {repeat(rows, (index) => (
                <div key={index} style={{ display: "grid", gridTemplateColumns: `repeat(${columns}, minmax(70px, 1fr))`, gap: 12, alignItems: "center", padding: "15px 0", borderBottom: "1px solid var(--border, #e5e7eb)" }}>
                    {repeat(columns, (cell) => <Skeleton key={cell} height={cell === 0 ? 18 : 14} width={cell === 0 ? "78%" : "65%"} />)}
                </div>
            ))}
        </div>
    );
}

function Cards({ count = 6 }) {
    return (
        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 16 }}>
            {repeat(count, (index) => (
                <article className="card" key={index} style={{ padding: 16 }}>
                    <Skeleton height={112} borderRadius={8} />
                    <Skeleton width="75%" height={17} style={{ marginTop: 14 }} />
                    <Skeleton width="48%" height={13} style={{ marginTop: 8 }} />
                    <Skeleton width="100%" height={34} borderRadius={8} style={{ marginTop: 16 }} />
                </article>
            ))}
        </section>
    );
}

function DashboardLayout() {
    return (
        <>
            <Header />
            <Stats />
            <section style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.7fr) minmax(250px, 1fr)", gap: 16, marginBottom: 18 }}>
                <article className="card" style={{ padding: 18 }}>
                    <Skeleton width={180} height={19} />
                    <Skeleton height={260} style={{ marginTop: 18 }} />
                </article>
                <article className="card" style={{ padding: 18 }}>
                    <Skeleton width={150} height={19} />
                    {repeat(5, (index) => <div key={index} style={{ display: "flex", gap: 12, marginTop: 22 }}><Skeleton circle width={36} height={36} /><div style={{ flex: 1 }}><Skeleton width="78%" /><Skeleton width="55%" style={{ marginTop: 8 }} /></div></div>)}
                </article>
            </section>
            <TableBody rows={4} columns={4} />
        </>
    );
}

function POSLayout() {
    return (
        <>
            <Header wide />
            <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.7fr) minmax(280px, 0.9fr)", gap: 18 }}>
                <div>
                    <div style={{ display: "flex", gap: 10, marginBottom: 16 }}><Skeleton height={38} width="65%" /><Skeleton height={38} width="30%" /></div>
                    <Cards count={4} />
                </div>
                <aside className="card" style={{ padding: 18 }}>
                    <Skeleton width="55%" height={21} />
                    {repeat(4, (index) => <div key={index} style={{ display: "flex", gap: 12, marginTop: 22 }}><Skeleton width={52} height={52} /><div style={{ flex: 1 }}><Skeleton width="80%" /><Skeleton width="45%" style={{ marginTop: 9 }} /></div></div>)}
                    <Skeleton height={1} style={{ marginTop: 24 }} />
                    <Skeleton width="70%" height={20} style={{ marginTop: 18 }} />
                    <Skeleton height={42} style={{ marginTop: 18 }} />
                </aside>
            </div>
        </>
    );
}

function AlertsLayout() {
    return (
        <>
            <Header />
            <Stats count={4} />
            <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>{repeat(5, (index) => <Skeleton key={index} width={index === 0 ? 90 : 110} height={34} borderRadius={18} />)}</div>
            <article className="card" style={{ padding: 18 }}>
                <Skeleton width={180} height={20} />
                {repeat(6, (index) => <div key={index} style={{ display: "flex", gap: 14, alignItems: "center", padding: "16px 0", borderBottom: "1px solid var(--border, #e5e7eb)" }}><Skeleton circle width={38} height={38} /><div style={{ flex: 1 }}><Skeleton width="50%" /><Skeleton width="82%" style={{ marginTop: 8 }} /></div><Skeleton width={24} height={24} /></div>)}
            </article>
        </>
    );
}

function SettingsLayout() {
    return (
        <>
            <Header />
            <div style={{ display: "grid", gridTemplateColumns: "minmax(170px, 0.65fr) minmax(0, 1.8fr)", gap: 18 }}>
                <nav className="card" style={{ padding: 16 }}>{repeat(7, (index) => <Skeleton key={index} height={38} style={{ marginBottom: 9 }} />)}</nav>
                <section className="card" style={{ padding: 22 }}>
                    <Skeleton width="38%" height={22} />
                    <Skeleton width="72%" height={13} style={{ marginTop: 10, marginBottom: 24 }} />
                    {repeat(4, (index) => <div key={index} style={{ marginBottom: 20 }}><Skeleton width="28%" height={13} /><Skeleton height={40} style={{ marginTop: 8 }} /></div>)}
                    <Skeleton width={120} height={38} borderRadius={8} />
                </section>
            </div>
        </>
    );
}

export default function FeatureSkeleton({ variant = "table" }) {
    return (
        <main aria-busy="true" aria-label="Cargando pantalla" style={{ width: "100%", paddingBottom: 24 }}>
            {variant === "dashboard" && <DashboardLayout />}
            {variant === "pos" && <POSLayout />}
            {variant === "alerts" && <AlertsLayout />}
            {variant === "settings" && <SettingsLayout />}
            {variant === "stores" && <><Header /><Stats count={5} /><Cards count={4} /></>}
            {variant === "showcase" && <><Header /><div style={{ display: "flex", gap: 10, marginBottom: 18 }}><Skeleton width="55%" height={38} /><Skeleton width={110} height={38} /></div><Cards count={8} /></>}
            {variant === "production" && <><Header /><Stats count={3} /><TableBody rows={6} columns={6} /></>}
            {variant === "suppliers" && <><Header /><div style={{ display: "flex", gap: 12, marginBottom: 18 }}><Skeleton width="45%" height={38} /><Skeleton width={120} height={38} /></div><TableBody rows={7} columns={5} /></>}
            {variant === "inventory" && <><Header /><Stats count={4} /><div style={{ display: "flex", gap: 12, marginBottom: 18 }}><Skeleton width="48%" height={38} /><Skeleton width={130} height={38} /></div><TableBody rows={7} columns={6} /></>}
            {variant === "table" && <><Header /><Stats count={4} /><div style={{ display: "flex", gap: 12, marginBottom: 18 }}><Skeleton width="45%" height={38} /><Skeleton width={120} height={38} /><Skeleton width={120} height={38} /></div><TableBody rows={7} columns={6} /></>}
        </main>
    );
}
