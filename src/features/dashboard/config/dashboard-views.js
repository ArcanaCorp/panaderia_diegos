import dynamic from "next/dynamic";
import FeatureSkeleton from "@/features/dashboard/components/FeatureSkeleton";

const loadView = (loader) =>
    dynamic(loader, {
        loading: () => <DashboardSkeleton />,
    });

const AlertsAdmin = loadView(() => import("@/features/alerts/views/AlertsView"));
const DashboardAdmin = loadView(() => import("@/features/dashboard/views/admin/AdminDashboardView"));
const InventaryAdmin = loadView(() => import("@/features/inventory/views/AdminInventoryView"));
const PosAdmin = loadView(() => import("@/features/sales/views/AdminPOSView"));
const ProduccionAdmin = loadView(() => import("@/features/production/views/AdminProductionView"));
const ProductsAdmin = loadView(() => import("@/features/products/views/ProductsView"));
const SettingsAdmin = loadView(() => import("@/features/settings/views/SettingsView"));
const StoresAdmin = loadView(() => import("@/features/stores/views/StoresView"));

const DashboardAlmacen = loadView(() => import("@/features/dashboard/views/warehouse/WarehouseDashboardView"), "dashboard");
const InventaryAlmacen = loadView(() => import("@/features/inventory/views/WarehouseInventoryView"), "inventory");
const SuppliersAlmacen = loadView(() => import("@/features/suppliers/views/SuppliersView"), "suppliers");

const DashboardProduccion = loadView(() => import("@/features/dashboard/views/production/ProductionDashboardView"), "dashboard");
const InventoryProduccion = loadView(() => import("@/features/production/views/ProductionInventoryView"), "inventory");
const ProduccionView = loadView(() => import("@/features/production/views/ProductionView"), "production");

const DashboardVentas = loadView(() => import("@/features/dashboard/views/sales/SalesDashboardView"), "dashboard");
const POSVentas = loadView(() => import("@/features/sales/views/SalesPOSView"), "pos");
const ShowcasesView = loadView(() => import("@/features/sales/views/ShowcasesView"), "showcase");

export const DASHBOARD_VIEWS = {
    admin: {
        "/dashboard": DashboardAdmin,
        "/dashboard/products": ProductsAdmin,
        "/dashboard/pos": PosAdmin,
        "/dashboard/inventary": InventaryAdmin,
        "/dashboard/produccion": ProduccionAdmin,
        "/dashboard/store": StoresAdmin,
        "/dashboard/suppliers": SuppliersAlmacen,
        "/dashboard/settings": SettingsAdmin,
    },

    almacen: {
        "/dashboard": DashboardAlmacen,
        "/dashboard/inventary": InventaryAlmacen,
        "/dashboard/suppliers": SuppliersAlmacen,
    },

    ventas: {
        "/dashboard": DashboardVentas,
        "/dashboard/pos": POSVentas,
        "/dashboard/showcases": ShowcasesView,
    },

    produccion: {
        "/dashboard": DashboardProduccion,
        "/dashboard/produccion": ProduccionView,
        "/dashboard/inventary": InventoryProduccion,
    },
};
