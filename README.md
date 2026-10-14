# Transgas — sitio público, CRM y chatbot (Fase 1)

Plataforma web de Transgas (cooperativa de gas natural, sur de Córdoba): **sitio público**, **panel de administración (CRM)** en `/crm` y **chatbot flotante** basado en reglas (sin IA).

- **Stack:** Next.js 14 (App Router) · TypeScript · Tailwind CSS · Prisma · PostgreSQL (Supabase) · Supabase Auth + Storage.
- **Hosting de la app:** Hostinger Business → *Node.js App*. Supabase se usa **solo** como base de datos, Auth y Storage.
- **Identidad visual:** tomada de `transgas-portal-premium-v4-premium.html` (tokens en `tailwind.config.ts` y `src/app/globals.css`).

---

## 1. Requisitos

- Node.js **18.18 o superior** (recomendado 20 o 22) y npm.
- Un proyecto de [Supabase](https://supabase.com) (el plan gratuito alcanza para empezar).

## 2. Puesta en marcha local

```bash
npm install
cp .env.example .env     # y completá los valores (ver sección 3)
npm run db:deploy        # aplica las migraciones a la base
npm run db:seed          # carga datos de ejemplo + el primer usuario admin
npm run dev              # http://localhost:3000
```

> En Windows (PowerShell): `Copy-Item .env.example .env`.

### Preparar Supabase (una sola vez)

1. Creá un proyecto en Supabase (región cercana, ej. *South America – São Paulo*).
2. **Project Settings → Database → Connection string**: copiá la cadena del **Connection pooler**:
   - *Transaction mode* (puerto **6543**) → `DATABASE_URL` (agregale `?pgbouncer=true&connection_limit=1`).
   - *Session mode* (puerto **5432**) → `DIRECT_URL` (la usa Prisma para migrar).
   - Usá el *pooler* y no el host directo `db.xxxx.supabase.co`: el host directo es solo IPv6 y muchos hostings no lo alcanzan.
3. **Project Settings → API**: copiá `Project URL`, la clave `anon` y la clave `service_role`.
4. **Authentication → Providers → Email**: dejá habilitado *Email*. Conviene **desactivar "Allow new users to sign up"** (Authentication → Sign In / Providers): los usuarios del CRM los da de alta un administrador, no se autoregistran.
5. **Storage**: no hace falta crear nada a mano; el bucket (`SUPABASE_STORAGE_BUCKET`, por defecto `transgas-public`) se crea solo, como **público**, la primera vez que se sube un archivo. Se usa para el PDF del cuadro tarifario y las portadas de noticias.

## 3. Variables de entorno

| Variable | Obligatoria | Descripción |
|---|---|---|
| `DATABASE_URL` | Sí | Conexión Postgres por *pooler* (puerto 6543, `?pgbouncer=true`). La usa la app. |
| `DIRECT_URL` | Sí | Conexión Postgres directa/session (puerto 5432). La usa Prisma para migrar. |
| `NEXT_PUBLIC_SUPABASE_URL` | Sí | URL del proyecto de Supabase. **Se incrusta en el build.** |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Sí | Clave `anon`. **Se incrusta en el build.** |
| `SUPABASE_SERVICE_ROLE_KEY` | Sí | Clave `service_role`. **Solo servidor, secreta.** Alta/baja de usuarios y subida de archivos. |
| `SUPABASE_STORAGE_BUCKET` | No | Nombre del bucket (default `transgas-public`). |
| `NEXT_PUBLIC_SITE_URL` | Sí (prod.) | URL pública del sitio (para `sitemap.xml`, `robots.txt` y metadatos). |
| `CHAT_ENGINE` | No | Motor del chatbot. **Hoy solo `rules`** (default). |
| `WHATSAPP_NUMBER` | Sí | Número para el botón de WhatsApp, internacional y solo dígitos (Argentina móvil: `549` + área + número, ej. `5493385123456`). |
| `EMERGENCY_PHONE_DISPLAY` / `EMERGENCY_PHONE_TEL` | No | Teléfono de emergencias que muestra el chatbot (default 0800-777-8427). |
| `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` | Solo seed | Credenciales del primer administrador (se crea en Supabase Auth y en la tabla `users`). |

> ⚠️ Las variables `NEXT_PUBLIC_*` se **incrustan al hacer `npm run build`**: tienen que estar definidas *antes* del build (también en Hostinger).
> ⚠️ Nunca subas `.env` a un repositorio. Ya está en `.gitignore`.

## 4. Migraciones y seed

```bash
npm run db:deploy      # prisma migrate deploy  → aplica prisma/migrations (producción y local)
npm run db:migrate     # prisma migrate dev     → solo para desarrollo, si cambiás schema.prisma
npm run db:seed        # datos de ejemplo
npm run db:studio      # explorador visual de la base
```

Hay dos migraciones: `init` (tablas) y `enable_rls` (activa *Row Level Security* sin políticas en todas las tablas, para que la API REST pública de Supabase **no pueda** leer ni escribir datos con la clave `anon`; la app accede con el rol `postgres`, que no se ve afectado).

El **seed** crea (solo lo que falta, **nunca pisa** lo que ya editaste en el CRM):

- 34 preguntas frecuentes con palabras clave y 2–3 variantes de respuesta cada una.
- 12 categorías tarifarias (R1, R2-1…R3-4, SGP1…SGP3-b) y 1 cuadro tarifario vigente (enlace al PDF actual del sitio viejo).
- 2 noticias publicadas, 1 vencimiento vigente, 1 aviso de servicio **de ejemplo** (programado).
- Las 8 cooperativas (Ítalo, Jovita, La Cesira, Mattaldi, Pueblo Italiano, Serrano, Viamonte, Villa Valeria) **sin dirección/teléfono/horario** (completar desde el CRM).
- 3 gasistas **de ejemplo** (reemplazar por el listado real).
- El usuario administrador (`SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`).

## 5. Primer ingreso al CRM

1. Entrá a `/crm/login` con `SEED_ADMIN_EMAIL` y `SEED_ADMIN_PASSWORD`.
2. **Cambiá esa contraseña** (Supabase → Authentication → Users) o creá tu propio administrador desde *Usuarios del CRM* y dá de baja el de ejemplo.
3. Roles: **admin** (todo) y **editor** (todo menos *Usuarios del CRM*).

Para que alguien pueda entrar necesita **las dos cosas**: sesión válida en Supabase Auth **y** un registro en la tabla `users` (que define el rol). Alta/baja desde *Usuarios del CRM* (requiere `SUPABASE_SERVICE_ROLE_KEY`).

### Módulos del CRM

Tarifas (categorías + PDF vigente con histórico) · Noticias (editor enriquecido, portada, borrador/publicado) · Vencimientos · Contactos (bandeja única de leads: filtros, detalle, estados, **exportar CSV**) · Cooperativas · Gasistas matriculados · Preguntas frecuentes · Estado del servicio · Usuarios (solo admin) · Historial del chatbot. El inicio (`/crm`) resume contactos sin atender, próximo vencimiento, próximo corte/aviso, últimas 5 noticias y últimas 5 conversaciones.

## 6. Chatbot (Fase 1: reglas, sin IA)

```
Widget (ChatWidget.tsx) ──POST /api/chat──▶ guardas de seguridad ──▶ ChatEngine.getResponse(historial, mensaje)
                                                                         └─ RuleBasedEngine (FAQ de la base)
```

- **Única fuente de respuestas:** la tabla `faqs` (CRM → *Preguntas frecuentes*). Cada FAQ tiene categoría, **palabras clave** y **2–3 variantes** de respuesta; el motor elige una al azar (sin repetir literalmente la anterior).
- **Cómo puntúa:** normaliza (minúsculas, sin tildes ni signos, plurales, sinónimos simples como *boleta→factura*, verbos como *conectarme→alta*, tolerancia a un error de tipeo) y compara con las palabras clave. Una **frase** («olor a gas») pesa más que una palabra suelta; la mejor palabra clave manda y las demás suman poco, para que no gane la FAQ que simplemente tiene más palabras cargadas. Mínimo para responder: 2 puntos.
- **Memoria:** recuerda la última FAQ respondida de la conversación, así «¿y eso cuánto tarda?» después de hablar de un nuevo servicio se resuelve por contexto. El historial sale de la base (`chat_messages`), no del navegador: nadie puede inyectar turnos falsos.
- **Sin coincidencia:** repregunta **una vez** («¿Es sobre tu factura, sobre una emergencia, o sobre un trámite?»); si vuelve a fallar, ofrece WhatsApp.
- **Derivación a WhatsApp** (`https://wa.me/<número>?text=<resumen>`): pedido de hablar con una persona · emergencia · dos intentos sin coincidencia.
- **Emergencias** (olor a gas, fuga, monóxido…): la respuesta **empieza siempre con el 0800**, después las instrucciones de seguridad y el botón de WhatsApp.
- **Datos sensibles:** si alguien escribe una tarjeta, CBU o contraseña, el endpoint **no llama al motor**, responde con un aviso y guarda `[Mensaje omitido: contenía datos sensibles]` en lugar del texto. Esta guarda es independiente del motor, por lo que sigue protegiendo si algún día se cambia.
- **Registro:** cada conversación queda en `chat_conversations` / `chat_messages` y se ve en el CRM (con si respondió FAQ, derivó a WhatsApp o fue emergencia).

### Preparado para sumar IA

`src/lib/chat/types.ts` define la interfaz `ChatEngine { getResponse(historial, mensaje) }`. `src/lib/chat/claudeEngine.ts` es un **stub** que lanza `not implemented`. `CHAT_ENGINE` hoy solo acepta `rules`; la fábrica está en `src/lib/chat/engine.ts`. Para sumar un motor con IA: implementar la interfaz, agregarlo al `switch` de la fábrica y poner `CHAT_ENGINE=<nombre>`. El endpoint, el widget y el CRM no cambian.

## 7. Scripts y calidad

```bash
npm run dev         # desarrollo
npm run build       # prisma generate + next build
npm start           # producción (respeta la variable PORT)
npm run lint        # ESLint
npm run typecheck   # TypeScript
npm test            # tests del motor del chatbot y de la validación de formularios
```

## 8. Deploy en Hostinger (Business → Node.js App)

1. **Subí el código** a un repositorio de GitHub (sin `.env`) o preparalo en un ZIP **sin** `node_modules` ni `.next`.
2. En **hPanel → Sitios web → Agregar sitio web → Node.js Apps** (nombre según versión del panel), importá el repositorio o el ZIP.
3. Configuración de la app:
   - **Versión de Node:** 20.x o 22.x.
   - **Preset/Framework:** *Next.js*.
   - **Install command:** `npm install` · **Build command:** `npm run build` · **Start command:** `npm start`.
4. **Variables de entorno** (sección *Environment variables* de la app): cargá **todas** las de la sección 3 *antes* del primer build, en especial `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Poné `NEXT_PUBLIC_SITE_URL` con el dominio real.
5. **Migrar la base de producción** (no se hace sola en el deploy). Desde tu PC, con el `.env` apuntando a Supabase de producción:
   ```bash
   npm run db:deploy
   npm run db:seed    # opcional: solo si querés los datos de ejemplo
   ```
   (Si tu plan tiene SSH, también podés correr esos comandos en el servidor.)
6. Desplegá y asociá el dominio. Verificá `https://TU-DOMINIO/` y `https://TU-DOMINIO/crm/login`.

Notas:
- Prisma ya trae los *binary targets* para Linux (`debian-openssl-3.0.x` y `rhel-openssl-3.0.x`) en `prisma/schema.prisma`.
- Si el *build* se queda sin memoria en el plan compartido, compilá en tu PC y subí el resultado, o pedile a Hostinger más memoria para la app.
- Para actualizar: subí los cambios y volvé a desplegar. Si hubo migraciones nuevas, corré `npm run db:deploy` antes.
- El sitio público se renderiza en cada request (`force-dynamic`) para que lo que se carga en el CRM se vea al instante; el *build* **no** necesita conexión a la base.
- El límite anti-abuso de `/api/leads` y `/api/chat` está **en memoria del proceso**: sirve para una sola instancia. Si algún día se escala a varias, hay que moverlo a Redis/Upstash.

## 9. Qué editar antes de publicar

- **Textos "placeholder"** (bien escritos, pero a validar por Transgas): `/tarifas/categorias`, `/tarifas/tarifa-social`, `/tarifas/zona-fria`, `/ayuda/entender-tu-factura`, `/ayuda/inquilinos`, `/usuarios/derechos`, `/seguridad/prevencion-de-danos`. Están en `src/app/(site)/…/page.tsx`; cada uno tiene un comentario `TODO(cliente)` indicando qué validar (requisitos vigentes, normativa, documentación). Las páginas de seguridad (monóxido, uso eficiente) contienen recomendaciones estándar de prevención y conviene que Transgas las revise.
- **WhatsApp:** completar `WHATSAPP_NUMBER`.
- **Cooperativas y gasistas:** cargar datos reales desde el CRM (el seed trae cooperativas sin dirección/teléfono/horario y gasistas de ejemplo).
- **Aviso de servicio de ejemplo:** editarlo o eliminarlo desde *Estado del servicio*.
- **Imágenes de la home:** son las del HTML de referencia y están **enlazadas desde sitios de terceros** (`src/lib/site.ts → images`). Conviene reemplazarlas por archivos propios (por ejemplo, en `public/`) antes de publicar, porque pueden dejar de cargar o tener restricciones de uso. El reglamento de servicio sigue enlazando al PDF del sitio actual de Transgas.
- **Banner de emergencias:** queda fijo en el código (`src/components/site/TopBar.tsx` y `src/lib/site.ts`), como pide la Fase 1.

## 10. Estructura

```
prisma/               schema, migraciones y seed (seed-data/faqs.ts)
src/app/(site)/       sitio público (páginas)
src/app/crm/          login y panel (módulos con sus Server Actions)
src/app/api/          /api/leads y /api/chat
src/components/       site/ home/ forms/ chat/ crm/ ui/
src/lib/chat/         ChatEngine, RuleBasedEngine, stub de IA, guardas, WhatsApp
src/lib/leads/        config única de formularios (cliente + servidor)
src/lib/supabase/     clientes de Supabase (sesión, middleware, admin)
src/middleware.ts     protege /crm
```

## 11. Fuera de alcance de la Fase 1

API de IA (solo el stub) · WhatsApp Business API (solo el enlace `wa.me`) · avisos automáticos por mail/SMS de vencimientos · banner de emergencia editable desde el CRM · auditoría de cambios del CRM · multi-idioma.
