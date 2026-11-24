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
src/
├── app/                         # Rutas, layouts y Route Handlers de Next.js.
├── components/
│   ├── layout/                  # Shell, sidebar y guards globales.
│   └── ui/                      # Componentes visuales globales y agnósticos del negocio.
│       └── button/              # Botón base reutilizable.
├── config/                      # Configuración transversal (navegación, permisos UI).
├── context/                     # Estado global React (auth, app y modal).
├── features/
│   ├── alerts/                  # Alertas operativas.
│   ├── auth/                    # Servicios de autenticación y sesión.
│   ├── dashboard/               # Dashboards, métricas y agregación de vistas por rol.
│   ├── inventory/               # Inventario central y almacén.
│   ├── production/              # Producción, órdenes y consumo de insumos.
│   ├── products/                # Catálogo y gestión de productos.
│   ├── sales/                   # POS, vitrina, transferencias comerciales e impresión de ventas.
│   ├── settings/                # Empresa, perfil, usuarios, pagos y preferencias.
│   ├── stores/                  # Tiendas, inventario por tienda y transferencias.
│   └── suppliers/               # Proveedores y abastecimiento.
├── libs/                        # Clientes de SDK externos (Supabase).
├── providers/                   # Composición global de providers y montaje de overlays.
├── styles/
│   ├── base/                    # Reset y estilos base.
│   ├── components/              # CSS compartido de componentes globales.
│   ├── layout/                  # Layout, display y spacing.
│   ├── pages/                   # CSS de páginas heredadas, agrupado por módulo.
│   ├── token/                   # Design tokens.
│   └── utilities/               # Clases CSS utilitarias.
└── utils/                       # Funciones puras realmente transversales.
```

## Responsabilidad de cada área

### `src/app/`
Solo convenciones de Next.js: rutas, layouts, páginas, metadata y endpoints. Las páginas delegan la interfaz y lógica de negocio a la feature correspondiente.

### `src/features/<dominio>/`
Cada módulo es dueño de sus componentes, hooks, servicios, utilidades y vistas. Crear subcarpetas solo cuando haya archivos reales. No crear servicios globales para operaciones que pertenecen a un dominio.

### `src/components/ui/`
Contiene componentes visuales base, reutilizables y sin conocimiento del negocio: botones, inputs, badges, tablas, diálogos y tarjetas genéricas cuando existan. Reciben datos y callbacks por props; nunca importan features ni consultan tablas de negocio. Una pieza usada por una sola feature permanece en esa feature.

### `src/components/layout/`
Estructura transversal de la aplicación: sidebar, shell y protección de rutas. No colocar aquí componentes de negocio.

### `src/context/`
Estado global compartido por varias áreas. Los contextos no deben convertirse en repositorios de lógica de un módulo específico.

### `src/providers/`
Compone los providers en el orden requerido y monta componentes de infraestructura global, como el coordinador de modales. No contiene vistas ni lógica de negocio.

### `src/features/*/services/`
Acceso a datos e integraciones del dominio. Cada servicio vive junto a la feature propietaria:
- `auth`: autenticación y perfil asociado a la sesión.
- `dashboard`: consultas agregadas de paneles por rol.
- `inventory`: consultas de inventario de almacén.
- `production`: órdenes y operaciones de producción.
- `products`: catálogo y categorías.
- `sales`: POS, vitrina e impresión de ventas.
- `settings`: empresa, perfil, usuarios y medios de pago.
- `stores`: tiendas, stock y transferencias.
- `suppliers`: proveedores.

### `src/libs/`
Inicialización de SDK externos. No contiene consultas de negocio ni funciones específicas de módulos.

### `src/styles/`
Fuente central de CSS global: tokens, reset, layout, utilidades y estilos compartidos. Los estilos de negocio se mantienen identificados por módulo mientras se completa su migración a estilos locales.

### `src/utils/`
Solo funciones puras y genéricas que pueden utilizar varias features sin depender de React, JSX, Supabase ni del negocio.

## Reglas de dependencias

Dirección preferida:

```text
app ─────► features ─────► libs
  │            │
  └────────────┴────────► components/ui
providers ──────────────► context
providers ──────────────► features (solo composición de overlays)
```

- `components/ui` nunca importa desde `features`.
- Una feature no depende de `app`.
- Las utilidades globales no importan React, JSX, contextos ni servicios.
- Los servicios de una feature no deben ubicarse en `src/services`.
- No crear dependencias circulares entre features.
- Los servicios encapsulan acceso a datos; hooks coordinan estado de interfaz; vistas presentan información.

## Convenciones de nombres

- Carpetas: minúsculas y `kebab-case`.
- Componentes React: `PascalCase.jsx` o `PascalCase.js`.
- Hooks: `useNombre.js`.
- Servicios: `nombre.service.js`.
- Utilidades: `nombre.utils.js`.
- CSS: `kebab-case.css`.
- Imports internos: alias `@/` y rutas con capitalización exacta.

## Proceso para cambios

1. Identificar la feature propietaria.
2. Buscar consumidores e imports antes de mover.
3. Mantener contratos, nombres exportados y comportamiento.
4. Actualizar imports estáticos, dinámicos y CSS.
5. Confirmar que no queden referencias a rutas antiguas.
6. Revisar diff y ejecutar `npm run lint` y `npm run build`.
7. No borrar código sin comprobar que no tenga consumidores.

## Desarrollo local

```bash
npm install
npm run dev
npm run lint
npm run build
```

No subir secretos ni credenciales. Configurar las variables de Supabase en el entorno local.

**Principio rector:** cada archivo tiene un propietario claro. Lo global es agnóstico; lo específico permanece dentro de su feature. No crear abstracciones ceremoniales ni mover archivos solo por estética.



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
