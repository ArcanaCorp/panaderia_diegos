# Diego's ERP

Sistema de gestión para la operación de Panadería y Pastelería Diegos.

## Stack

- Next.js 16 con App Router.
- React 19 y JavaScript/JSX.
- Supabase: autenticación, PostgreSQL y Edge Functions.
- CSS propio con design tokens.
- Tabler Icons y Sonner.

## Arquitectura

El proyecto utiliza una **Clean Architecture pragmática orientada a features**. La regla central es que cada módulo de negocio es dueño de su interfaz, hooks, servicios y lógica. Las carpetas globales contienen únicamente infraestructura o piezas reutilizables y agnósticas del negocio.

### Estructura actual

```text
src/
├── app/                         # Rutas, layouts y endpoints de Next.js.
├── components/
│   ├── layout/                  # Shell, sidebar y guards de rutas.
│   └── ui/                      # Componentes visuales base globales.
│       └── button/              # Botón reutilizable.
├── config/                      # Configuración transversal, como navegación.
├── context/                     # Estado global React: app, auth y modal.
├── features/
│   ├── alerts/                  # Alertas operativas.
│   ├── auth/
│   │   └── services/            # Operaciones de autenticación y perfil de sesión.
│   ├── dashboard/
│   │   ├── components/          # Componentes exclusivos de dashboards.
│   │   ├── config/              # Vistas por rol y configuración del dashboard.
│   │   ├── helpers/             # Formateadores y adaptadores visuales del dashboard.
│   │   ├── hooks/               # Estado y carga de datos del dashboard.
│   │   ├── services/            # Consultas agregadas de paneles por rol.
│   │   └── views/               # Dashboards completos por rol.
│   ├── inventory/
│   │   ├── hooks/               # Estado y operaciones de inventario.
│   │   ├── services/            # Consultas del almacén e inventario.
│   │   └── views/               # Vistas de inventario.
│   ├── production/
│   │   ├── components/          # Componentes y modales de producción.
│   │   ├── hooks/               # Estado y operaciones de producción.
│   │   ├── services/            # Consultas y operaciones de producción.
│   │   ├── utils/               # Funciones puras de producción.
│   │   └── views/               # Vistas de producción.
│   ├── products/
│   │   ├── components/          # Componentes y modales de productos.
│   │   ├── hooks/               # Estado y operaciones de productos.
│   │   ├── services/            # Catálogo y categorías.
│   │   └── views/               # Vistas de productos.
│   ├── sales/
│   │   ├── components/          # Componentes del POS y ventas.
│   │   ├── hooks/               # Estado del POS y vitrina.
│   │   ├── services/            # POS, vitrina e impresión de ventas.
│   │   └── views/               # POS y vitrina.
│   ├── settings/
│   │   ├── components/          # Configuración y secciones de ajustes.
│   │   ├── services/            # Empresa, perfil, usuarios y medios de pago.
│   │   └── views/               # Pantallas de configuración.
│   ├── stores/
│   │   ├── components/          # Tiendas, ajustes y modales de tienda.
│   │   ├── hooks/               # Estado de tiendas.
│   │   ├── services/            # Tiendas, stock y transferencias.
│   │   └── views/               # Vistas de tiendas.
│   └── suppliers/
│       ├── hooks/               # Estado de proveedores.
│       ├── services/            # Consultas de proveedores.
│       └── views/               # Vistas de proveedores.
├── libs/                        # Clientes e inicialización de SDK externos.
├── providers/                   # Composición de providers y overlays globales.
├── styles/
│   ├── base/                    # Reset y estilos base del navegador.
│   ├── components/              # CSS global de componentes reutilizables.
│   ├── layout/                  # Estructura, display y espaciado.
│   ├── pages/                   # Estilos de páginas existentes, agrupados por módulo.
│   ├── token/                   # Variables y design tokens.
│   └── utilities/               # Clases utilitarias CSS.
└── utils/                       # Funciones puras y genéricas transversales.
```

Las subcarpetas se crean cuando hay contenido real. No es obligatorio que todas las features tengan todas las capas.

## Responsabilidad de cada carpeta

### `src/app/` — routing

Contiene exclusivamente las convenciones del App Router: `page.js`, `layout.js`, `loading.js`, `error.js`, `route.js`, metadata y composición de rutas. Las páginas delegan la lógica y la UI a las features.

### `src/components/ui/` — UI global

Contiene componentes visuales base reutilizables en toda la aplicación: botones, inputs, badges, tablas, diálogos y tarjetas genéricas cuando se implementen. Deben ser agnósticos del negocio, recibir datos y callbacks por props, y no importar módulos de `features/`.

Un componente utilizado por una sola feature permanece dentro de esa feature. No trasladar modales de productos, ventas o tiendas a la UI global por el solo hecho de ser modales.

### `src/components/layout/` — estructura global

Contiene shell, sidebar, guards y componentes que estructuran la navegación. No contiene componentes específicos de negocio.

### `src/features/<dominio>/` — módulos de negocio

Cada feature es propietaria de sus componentes, hooks, servicios, vistas, configuración y utilidades específicas.

- `components/`: piezas visuales internas del módulo; los modales de negocio viven aquí.
- `hooks/`: estado, efectos y coordinación de interacción del módulo.
- `services/`: consultas a Supabase, RPC y operaciones externas del dominio.
- `views/`: pantallas completas que consumen las rutas de Next.js.
- `config/`: configuración exclusiva del módulo.
- `utils/`: funciones puras específicas del módulo.
- `helpers/`: adaptadores o helpers específicos del módulo que no encajan como utilidades puras (por ejemplo, helpers que devuelven iconos React).

No crear carpetas vacías ni servicios globales para operaciones que pertenecen a un dominio.

### `src/context/` — estado global

Contiene contextos compartidos entre varias áreas, como autenticación, estado de aplicación y coordinación del modal. No debe convertirse en una carpeta de lógica de negocio.

### `src/providers/` — composición de la aplicación

Define el orden de los providers globales y monta coordinadores de infraestructura como `GlobalModals`. El coordinador puede conectar identificadores globales de modal con los modales que pertenecen a cada feature; la implementación de cada modal sigue siendo propiedad de su feature.

### `src/libs/` — infraestructura externa

Inicialización y configuración de SDK externos (actualmente Supabase). No colocar aquí consultas de negocio.

### `src/config/` — configuración transversal

Configuración estática compartida por toda la aplicación, como navegación. La configuración de un solo módulo pertenece a `features/<dominio>/config/`.

### `src/styles/` — sistema visual global

- `token/`: colores, tipografía, espacios, radios y demás variables de diseño.
- `base/`: reset y reglas base.
- `layout/`: reglas de estructura y distribución.
- `components/`: estilos compartidos de componentes globales.
- `utilities/`: clases de utilidad.
- `pages/`: estilos de pantallas existentes. Los estilos nuevos exclusivos de una feature deben mantenerse identificados con su módulo.

`global.css` es el punto de entrada de los estilos globales. No duplicar reglas de componentes en CSS locales y globales.

### `src/utils/` — utilidades transversales

Solo funciones genéricas y puras que puedan ser usadas por distintas features. No deben importar React, JSX, contextos, componentes ni servicios de negocio.

## Dirección de dependencias

```text
app ─────────────► features ─────────► libs
 │                    │
 └────────────────────┴─────────────► components/ui

providers ───────────► context
providers ───────────► features (solo composición de overlays)
features ────────────► context (solo contratos globales necesarios)
```

Reglas:

1. `components/ui` nunca importa desde `features/`.
2. Una feature nunca depende de `app/`.
3. Los servicios viven dentro de la feature propietaria; no existe una carpeta global `src/services/`.
4. Los helpers específicos viven dentro de su feature; no existe una carpeta global `src/helpers/`.
5. `libs/` no conoce reglas de negocio.
6. `utils/` no importa React ni infraestructura.
7. Evitar dependencias circulares entre features.
8. Los hooks coordinan estado; los servicios acceden a datos; las vistas presentan información.

## Convenciones

- Carpetas en minúsculas y `kebab-case`.
- Componentes React en `PascalCase.jsx` o `PascalCase.js`.
- Hooks con prefijo `use`, por ejemplo `useProducts.js`.
- Servicios con sufijo `.service.js`.
- Utilidades con sufijo `.utils.js`.
- CSS en `kebab-case.css`.
- Imports internos mediante el alias `@/`.
- Evitar archivos genéricos llamados `common.js`, `misc.js` o `helpers.js`.

## Procedimiento para mover o crear archivos

1. Determinar el propietario funcional del código.
2. Buscar todos los imports y consumidores, incluidos imports dinámicos y CSS.
3. Mover el archivo sin alterar contratos ni comportamiento.
4. Actualizar todas las referencias.
5. Confirmar que no quedan imports hacia rutas eliminadas.
6. Revisar el diff.
7. Ejecutar `npm run lint` y `npm run build` localmente.
8. No eliminar archivos hasta verificar que no tengan consumidores.

## Desarrollo local

```bash
npm install
npm run dev
npm run lint
npm run build
```

Configurar las variables de entorno requeridas por Supabase en el entorno local. Nunca subir secretos, tokens ni credenciales.

**Principio rector:** cada archivo tiene un propietario claro. Lo global es agnóstico; lo específico permanece dentro de su feature. Priorizar claridad y estabilidad antes que abstracciones innecesarias.
