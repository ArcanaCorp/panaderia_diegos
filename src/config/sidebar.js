import AlertsAdmin from "@/views/admin/alerts";
import DashboardAdmin from "@/views/admin/dashboard";
import InventaryAdmin from "@/views/admin/inventary";
import PosAdmin from "@/views/admin/pos";
import ProduccionAdmin from "@/views/admin/produccion";
import ProductsAdmin from "@/views/admin/products";
import SettingsAdmin from "@/views/admin/settings";
import StoresAdmin from "@/views/admin/stores";
import DashboardAlmacen from "@/views/almacen/dashboard";
import InventaryAlmacen from "@/views/almacen/inventary";
import SuppliersAlmacen from "@/views/almacen/suppliers";
import DashboardProduccion from "@/views/produccion/dashboard";
import InventoryProduccion from "@/views/produccion/inventary";
import ProduccionView from "@/views/produccion/produccion";
import DashboardView from "@/views/ventas/dashboard";
import POSVentas from "@/views/ventas/pos";
import ShowcasesView from "@/views/ventas/showcases";
import { IconLayoutDashboard, IconShoppingCart, IconPackages, IconToolsKitchen2, IconPalette, IconSettings, IconListCheck, IconBuildingStore, IconBell, IconUsers } from "@tabler/icons-react";

export const SIDEBAR = {
    admin: [
        {
            path: "/dashboard",
            label: "Dashboard",
            icon: <IconLayoutDashboard />,
            view: <DashboardAdmin/>
        },
        {
            path: '/dashboard/products',
            label: 'Productos',
            icon: <IconListCheck/>,
            view: <ProductsAdmin/>
        },
        {
            path: "/dashboard/pos",
            label: "Ventas",
            icon: <IconShoppingCart />,
            view: <PosAdmin/>
        },
        {
            path: "/dashboard/inventary",
            label: "Almacén",
            icon: <IconPackages />,
            view: <InventaryAdmin/>
        },
        {
            path: "/dashboard/produccion",
            label: "Producción",
            icon: <IconToolsKitchen2 />,
            view: <ProduccionAdmin/>
        },
        {
            path: '/dashboard/store',
            label: 'Tiendas',
            icon: <IconBuildingStore/>,
            view: <StoresAdmin/>
        },
        {
            path: '/dashboard/alerts',
            label: 'Alertas',
            icon: <IconBell/>,
            view: <AlertsAdmin/>
        },
        {
            path: "/dashboard/settings",
            label: "Administración",
            icon: <IconSettings />,
            view: <SettingsAdmin/>
        }
    ],

    almacen: [
        {
            path: "/dashboard",
            label: "Dashboard",
            icon: <IconLayoutDashboard />,
            view: <DashboardAlmacen/>
        },
        {
            path: "/dashboard/inventary",
            label: "Almacén",
            icon: <IconPackages />,
            view: <InventaryAlmacen/>
        },
        {
            path: '/dashboard/suppliers',
            label: 'Proveedores',
            icon: <IconUsers/>,
            view: <SuppliersAlmacen/>
        }
    ],

    ventas: [
        {
            path: "/dashboard",
            label: "Dashboard",
            icon: <IconLayoutDashboard />,
            view: <DashboardView/>
        },
        {
            path: "/dashboard/pos",
            label: "Ventas",
            icon: <IconShoppingCart />,
            view: <POSVentas/>
        },
        {
            path: '/dashboard/showcases',
            label: "Vitrina",
            icon: <IconListCheck />,
            view: <ShowcasesView/>
        }
    ],

    produccion: [
        {
            path: "/dashboard",
            label: "Dashboard",
            icon: <IconLayoutDashboard />,
            view: <DashboardProduccion/>
        },
        {
            path: "/dashboard/produccion",
            label: "Producción",
            icon: <IconToolsKitchen2 />,
            view: <ProduccionView/>
        },
        {
            path: "/dashboard/inventary",
            label: "Almacén",
            icon: <IconPackages />,
            view: <InventoryProduccion/>
        },
    ]
};