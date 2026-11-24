import AlertsAdmin from "@/features/alerts/views/AlertsView";
import DashboardAdmin from "@/features/dashboard/views/admin/AdminDashboardView";
import InventaryAdmin from "@/features/inventory/views/AdminInventoryView";
import PosAdmin from "@/features/sales/views/AdminPOSView";
import ProduccionAdmin from "@/features/production/views/AdminProductionView";
import ProductsAdmin from "@/features/products/views/ProductsView";
import SettingsAdmin from "@/features/settings/views/SettingsView";
import StoresAdmin from "@/features/stores/views/StoresView";

import DashboardAlmacen from "@/features/dashboard/views/warehouse/WarehouseDashboardView";
import InventaryAlmacen from "@/features/inventory/views/WarehouseInventoryView";
import SuppliersAlmacen from "@/features/suppliers/views/SuppliersView";

import DashboardProduccion from "@/features/dashboard/views/production/ProductionDashboardView";
import InventoryProduccion from "@/features/production/views/ProductionInventoryView";
import ProduccionView from "@/features/production/views/ProductionView";

import DashboardVentas from "@/features/dashboard/views/sales/SalesDashboardView";
import POSVentas from "@/features/sales/views/SalesPOSView";
import ShowcasesView from "@/features/sales/views/ShowcasesView";

export const DASHBOARD_VIEWS = {
    admin: {
        "/dashboard": DashboardAdmin,
        "/dashboard/products": ProductsAdmin,
        "/dashboard/pos": PosAdmin,
        "/dashboard/inventary": InventaryAdmin,
        "/dashboard/produccion": ProduccionAdmin,
        "/dashboard/store": StoresAdmin,
        "/dashboard/alerts": AlertsAdmin,
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






