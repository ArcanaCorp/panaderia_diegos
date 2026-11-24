import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function DashboardSkeleton() {
    return (
        <main className="dashboard">
            {/* Header */}
            <section className="dashboard__header">
                <div style={{ width: "100%", maxWidth: 420 }}>
                    <Skeleton width={150} height={14} />
                    <Skeleton width="75%" height={32} style={{ marginTop: 10 }} />
                    <Skeleton width="100%" height={16} style={{ marginTop: 8 }} />
                </div>
            </section>

            {/* KPI */}
            <section className="dashboard__stats">
                {Array.from({ length: 4 }).map((_, index) => (
                    <article className="card card--stat" key={index}>
                        <div className="card__content" style={{ width: "100%" }}>
                            <Skeleton width="65%" height={14} />
                            <Skeleton width="80%" height={30} style={{ marginTop: 10 }} />
                            <Skeleton width="55%" height={13} style={{ marginTop: 8 }} />
                        </div>

                        <div className="card__icon">
                            <Skeleton circle width={36} height={36} />
                        </div>
                    </article>
                ))}
            </section>

            {/* Gráfico y actividad */}
            <section className="dashboard__grid">
                <article className="card dashboard__sales">
                    <div className="card__header">
                        <div style={{ width: "65%" }}>
                            <Skeleton width={170} height={20} />
                            <Skeleton width="90%" height={14} style={{ marginTop: 8 }} />
                        </div>
                        <Skeleton width={36} height={36} borderRadius={8} />
                    </div>

                    <div className="relative dashboard__chart">
                        <Skeleton
                            width="100%"
                            height={300}
                            borderRadius={10}
                        />
                    </div>
                </article>

                <article className="card dashboard__activity">
                    <div className="card__header">
                        <div style={{ width: "70%" }}>
                            <Skeleton width={150} height={20} />
                            <Skeleton width={110} height={14} style={{ marginTop: 8 }} />
                        </div>
                    </div>

                    <div className="dashboard__activity-list">
                        {Array.from({ length: 5 }).map((_, index) => (
                            <div
                                key={index}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 12,
                                    padding: "12px 0",
                                }}
                            >
                                <Skeleton circle width={38} height={38} />

                                <div style={{ flex: 1 }}>
                                    <Skeleton width="75%" height={14} />
                                    <Skeleton width="90%" height={12} style={{ marginTop: 7 }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </article>
            </section>

            {/* Stock */}
            <section className="card dashboard__stock">
                <div className="card__header">
                    <div style={{ width: "60%" }}>
                        <Skeleton width={190} height={20} />
                        <Skeleton width="100%" height={14} style={{ marginTop: 8 }} />
                    </div>
                    <Skeleton width={100} height={30} borderRadius={8} />
                </div>

                <div className="dashboard__stock-list">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div
                            key={index}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 12,
                                padding: "12px 0",
                            }}
                        >
                            <Skeleton circle width={36} height={36} />

                            <div style={{ flex: 1 }}>
                                <Skeleton width="65%" height={14} />
                                <Skeleton width="40%" height={12} style={{ marginTop: 7 }} />
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}