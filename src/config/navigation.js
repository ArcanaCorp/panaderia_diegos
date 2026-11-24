import {
    IconLayoutDashboard,
    IconShoppingCart,
    IconPackages,
    IconToolsKitchen2,
    IconListCheck,
    IconBuildingStore,
    IconBell,
    IconUsers,
    IconSettings,
} from "@tabler/icons-react";

export const NAVIGATION = {
    admin: [
        { path: "/dashboard", label: "Dashboard", icon: IconLayoutDashboard },
        { path: "/dashboard/products", label: "Productos", icon: IconListCheck },
        { path: "/dashboard/pos", label: "Ventas", icon: IconShoppingCart },
        { path: "/dashboard/inventary", label: "Almacén", icon: IconPackages },
        { path: "/dashboard/produccion", label: "Producción", icon: IconToolsKitchen2 },
        { path: "/dashboard/store", label: "Tiendas", icon: IconBuildingStore },
        { path: "/dashboard/alerts", label: "Alertas", icon: IconBell },
        { path: "/dashboard/settings", label: "Configuración", icon: IconSettings },
    ],

    almacen: [
        { path: "/dashboard", label: "Dashboard", icon: IconLayoutDashboard },
        { path: "/dashboard/inventary", label: "Almacén", icon: IconPackages },
        { path: "/dashboard/suppliers", label: "Proveedores", icon: IconUsers },
    ],

    ventas: [
        { path: "/dashboard", label: "Dashboard", icon: IconLayoutDashboard },
        { path: "/dashboard/pos", label: "Ventas", icon: IconShoppingCart },
        { path: "/dashboard/showcases", label: "Vitrina", icon: IconListCheck },
    ],

    produccion: [
        { path: "/dashboard", label: "Dashboard", icon: IconLayoutDashboard },
        { path: "/dashboard/produccion", label: "Producción", icon: IconToolsKitchen2 },
        { path: "/dashboard/inventary", label: "Almacén", icon: IconPackages },
    ],
};
