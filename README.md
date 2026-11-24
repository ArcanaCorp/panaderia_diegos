# Diego's ERP

Sistema de gestión para la operación de Panadería y Pastelería Diegos.

## Stack

- **Framework:** Next.js 16 (App Router).
- **UI:** React 19 y JavaScript/JSX.
- **Backend y persistencia:** Supabase (Auth, PostgreSQL, Storage/Functions según el módulo).
- **Estilos:** CSS organizado por tokens, base, layout, componentes, utilidades y páginas.
- **Iconografía:** Tabler Icons.
- **Notificaciones:** Sonner.

## Objetivo de arquitectura

El proyecto sigue una **Clean Architecture pragmática orientada a funcionalidades (feature-oriented)**. No se busca crear capas ceremoniales ni abstraer todo; se busca que cada archivo tenga una ubicación predecible, que los módulos mantengan su lógica cerca y que las piezas realmente compartidas no dependan de un módulo de negocio.

### Regla principal

- Si pertenece a un único proceso o dominio (productos, ventas, producción, inventario, tiendas, etc.), vive dentro de `src/features/<dominio>/`.
- Si es una pieza visual o técnica reutilizable por varios módulos, vive en una carpeta global de `src/components/`, `src/hooks/` (cuando exista), `src/context/`, `src/services/` o `src/utils/`, según su responsabilidad.
- Si define una URL o composición de layouts de Next.js, vive en `src/app/`. Las páginas deben delegar la lógica y la interfaz de negocio a `features/`.
- No crear una carpeta global para un archivo que solo utiliza una feature.

## Mapa de carpetas

```text
.
├── public/                    # Recursos estáticos servidos directamente por Next.js.
├── src/
│   ├── app/                   # App Router: rutas, layouts, páginas y endpoints HTTP.
│   │   ├── api/               # Route Handlers; adaptadores HTTP, no lógica de negocio extensa.
│   │   └── dashboard/         # Rutas protegidas del ERP. Componen vistas de features.
│   ├── components/            # Componentes visuales globales y reutilizables.
│   │   ├── ui/                # Primitivos de interfaz: botones, inputs, badges, etc.
│   │   ├── layout/            # Estructura visual global: shell, sidebar y guards de rutas.
│   │   ├── Cards/             # Tarjetas compartidas (nombre histórico; normalizar a minúsculas).
│   │   └── Modals/            # Orquestador de modales globales (nombre histórico; normalizar).
│   ├── config/                # Configuración estática transversal, por ejemplo navegación.
│   ├── context/               # Estado global React: autenticación, aplicación y modales.
│   ├── features/              # Módulos de negocio; cada uno es dueño de su UI y lógica.
│   │   ├── alerts/            # Alertas y notificaciones operativas.
│   │   ├── dashboard/         # Vistas de inicio, composición por rol y métricas.
│   │   ├── inventory/         # Inventario y existencias.
│   │   ├── production/        # Órdenes y procesos de producción.
│   │   ├── products/          # Catálogo, categorías y gestión de productos.
│   │   ├── sales/             # Ventas y punto de venta.
│   │   ├── settings/          # Configuración del negocio y del usuario.
│   │   ├── stores/            # Tiendas, transferencias y stock por tienda.
│   │   └── suppliers/         # Proveedores y abastecimiento.
│   ├── helpers/               # Helpers heredados; no agregar nuevos aquí.
│   ├── libs/                  # Clientes/configuración de librerías externas (Supabase).
│   ├── providers/             # Composición de providers globales en el árbol React.
│   ├── services/              # Servicios compartidos heredados y algunos servicios por dominio.
│   ├── styles/                # Sistema CSS global.
│   │   ├── base/              # Reset y estilos base del navegador.
│   │   ├── components/        # Estilos de componentes compartidos.
│   │   ├── layout/            # Layout, display y espaciado.
│   │   ├── pages/             # Estilos de páginas/módulos existentes.
│   │   ├── token/             # Variables de diseño: color, tipografía, espacios, radios, etc.
│   │   └── utilities/         # Clases utilitarias de color, texto y bordes.
│   └── utils/                 # Funciones puras y genéricas reutilizables.
├── .env                       # Variables locales; nunca subir secretos.
├── jsconfig.json              # Alias `@/*` → `src/*`.
└── package.json               # Dependencias y scripts.
```

> El mapa refleja la estructura existente al iniciar esta normalización. Las carpetas marcadas como históricas o heredadas son candidatas a consolidación gradual; no se deben crear nuevos archivos allí.

## Responsabilidad de cada área

### `src/app/` — rutas y composición

- Mantener aquí únicamente convenciones del App Router: `page.js`, `layout.js`, `loading.js`, `error.js`, `route.js`, metadata y archivos propios de rutas.
- Las páginas conectan la URL con una vista de `features/`; no deben convertirse en contenedores de lógica de negocio.
- Los Route Handlers validan/transforman la entrada HTTP y delegan el trabajo a servicios.
- No importar componentes de una ruta desde otra ruta. Compartirlos desde `components/` o desde la feature propietaria.

### `src/features/<dominio>/` — módulos de negocio

Cada feature es propietaria de sus componentes, hooks, servicios, vistas y configuración específica. Estructura sugerida (crear subcarpetas solo cuando haya contenido real):

```text
features/<dominio>/
├── components/   # Componentes usados dentro de este dominio.
├── hooks/        # Hooks que encapsulan estado/comportamiento del dominio.
├── services/     # Acceso a datos y operaciones del dominio.
├── views/        # Vistas completas consumidas por las rutas.
├── config/       # Constantes y configuración exclusiva del dominio.
└── utils/        # Funciones puras exclusivas del dominio (si hacen falta).
```

No es obligatorio que toda feature tenga todas estas carpetas. Evitar carpetas vacías y no mover lógica a una feature solo para completar el esquema.

**Límites entre features:**
- Una feature puede consumir contratos públicos de otra cuando el caso de uso lo requiera, pero no debe importar componentes internos arbitrarios de ella.
- No crear dependencias circulares entre features.
- Si una pieza comienza a ser usada por dos o más dominios y no contiene reglas de negocio particulares, evaluar moverla a la capa global.
- Si el componente solo es usado por un módulo, mantenerlo en ese módulo aunque visualmente parezca genérico.

### `src/components/` — interfaz global

- `ui/`: componentes pequeños, reutilizables y sin conocimiento del negocio (Button, Input, Badge, Dialog, etc.).
- `layout/`: estructura transversal de la aplicación (shell, sidebar, guards y contenedores).
- Las tarjetas, tablas, formularios y modales globales deben ser agnósticos del dominio.
- Un modal de producto, una tabla de inventario o un formulario de proveedor pertenecen a su feature, no a esta carpeta.
- Los componentes globales reciben datos y callbacks por props; no consultan tablas de negocio ni importan hooks internos de una feature.

### `src/context/` y `src/providers/`

- `context/`: estado compartido entre varias áreas (sesión, preferencias de interfaz y coordinación global de modales).
- `providers/`: orden y composición de providers en el árbol de React.
- No colocar componentes de negocio ni llamadas de datos de una feature en los providers globales.
- Mantener explícito el orden de providers cuando exista dependencia entre ellos.

### `src/services/`, `src/libs/`, `src/utils/` y `src/helpers/`

- `libs/`: inicialización/configuración de SDK externos. No debe contener reglas de negocio.
- `services/`: operaciones de acceso a datos o integraciones realmente compartidas. Los servicios exclusivos de un dominio deben residir en su feature.
- `utils/`: funciones puras, genéricas, sin JSX ni acceso directo a React/DOM/Supabase.
- `helpers/`: carpeta heredada en proceso de retirada. Los nuevos helpers deben vivir en la feature propietaria o en `utils/` si son transversales.
- No duplicar funciones de formato o validación: buscar primero si ya existe una utilidad equivalente.

### `src/config/`

Configuración estática transversal (por ejemplo, navegación, permisos de presentación y constantes de aplicación). La configuración específica de un módulo vive en `features/<dominio>/config/`. No guardar secretos ni valores de entorno aquí.

### `src/styles/`

- `token/`: fuente única de variables visuales.
- `base/`: reset y estilos base.
- `layout/`: reglas estructurales de distribución.
- `components/`: estilos compartidos por componentes globales.
- `utilities/`: clases de propósito único.
- `pages/`: estilos de páginas existentes; a mediano plazo, los estilos exclusivos de una feature deben acercarse a esa feature si la estrategia CSS lo permite.
- `global.css`: punto de entrada e imports ordenados. No añadir estilos de negocio nuevos sin identificar primero su propietario.

## Reglas de dependencias

Dirección preferida:

```text
app ───────► features ───────► services/libs
  │              │
  └──────────────┴───────────► components (global UI)

providers ─► context
features ──► components/ui
```

- `components/` no importa desde `features/`.
- `utils/` no importa desde componentes, features, context ni servicios.
- `libs/` no conoce el negocio.
- `features/` no debe depender de `app/`.
- `app/` puede importar features y componentes globales.
- Los servicios acceden a la infraestructura (por ejemplo Supabase); las vistas no deben duplicar consultas de datos.
- Evitar barrel files (`index.js`) que oculten dependencias o generen ciclos. Usarlos solo cuando simplifiquen una API estable.

## Convenciones de nombres

- Carpetas: `kebab-case` o minúsculas; nunca mezclar mayúsculas y minúsculas en rutas.
- Componentes React: `PascalCase.jsx` o `PascalCase.js`.
- Hooks: prefijo `use`, por ejemplo `useProducts.js`.
- Servicios: `<dominio>.service.js` o nombre consistente ya adoptado dentro de la feature.
- Utilidades: nombres descriptivos en `camelCase.js`.
- CSS: `kebab-case.css`.
- Imports internos: preferir alias `@/` y respetar exactamente mayúsculas/minúsculas del path.
- No crear archivos genéricos llamados `helpers.js`, `common.js` o `misc.js`; nombrar según su responsabilidad.

## Reglas para crear o mover archivos

1. Identificar quién es el propietario funcional del código.
2. Buscar todos los imports y usos antes de mover o renombrar.
3. Mantener la API pública y el comportamiento; un cambio de ubicación no justifica refactorizar lógica.
4. Actualizar todos los imports, CSS imports, alias y referencias dinámicas.
5. Verificar que no queden referencias al path anterior.
6. Revisar el diff y ejecutar `npm run build` y `npm run lint` cuando corresponda.
7. No borrar código solo porque parezca antiguo: confirmar primero que no tiene consumidores.
8. Hacer movimientos pequeños y coherentes, con commits fáciles de revisar.

## Desarrollo local

```bash
npm install
npm run dev
```

Validación:

```bash
npm run lint
npm run build
```

Configurar las variables de entorno requeridas por Supabase en el archivo local correspondiente. Nunca publicar claves privadas, tokens ni credenciales.

## Estado de normalización

La estructura por features ya existe y es la ubicación preferida para el nuevo desarrollo. Se están identificando y retirando gradualmente las ubicaciones heredadas (`helpers/` y servicios de dominio ubicados fuera de `features/`), además de normalizar los nombres históricos de carpetas de componentes. Cada migración debe incluir la actualización completa de sus imports y verificación local.

**Principio rector:** primero claridad de responsabilidades, después optimización. No mover por mover y no romper producción para conseguir una estructura visualmente bonita.
