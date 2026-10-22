# Guía para pasar el sitio nuevo a https://transgas.com.ar

Hoy `transgas.com.ar` muestra el sitio viejo (WordPress, en Hostinger, detrás de Cloudflare) y el sitio nuevo vive en
`palegoldenrod-yak-367928.hostingersite.com`. Esta guía explica cómo cambiarlos sin perder el correo, las posiciones en Google ni los enlaces viejos.

> **Regla de oro:** NO cambies los *nameservers* del dominio (están en Cloudflare) y NO toques los registros **MX**, **SPF** ni los de `mail.` —
> el correo de Transgas (`mail.transgas.com.ar`) está en otro servidor y dejaría de funcionar. Solo se cambian los registros **A** de `@` y `www`.

## Lo que ya está hecho en el código

- Los PDF del WordPress (cuadros tarifarios, reglamento, manual de emergencias, instructivos) ya están en el sitio nuevo (`/documentos`) y los
  enlaces viejos `…/wp-content/uploads/…pdf` redirigen a ellos.
- Las 16 URLs viejas (`/tarifa-social/`, `/el-monoxido-de-carbono-mata/`…) redirigen a las páginas nuevas, y `/wp-sitemap.xml` y
  `/sitemap_index.xml` apuntan al mapa nuevo (`/sitemap.xml`).
- `www.transgas.com.ar` redirige a `transgas.com.ar`.
- Con `ALLOW_INDEXING=true` el sitio pide a Google que lo indexe, publica `robots.txt`, `sitemap.xml` y `llms.txt` con el dominio real.

## FASE 1 — Antes del cambio (se puede hacer hoy, sin riesgo)

1. **Copia de seguridad del WordPress.** En hPanel (hosting donde está el WordPress) → *Copias de seguridad* → generar una copia completa
   (archivos + base de datos) y descargarla. Guardala: es tu red de seguridad.
2. **Anotá cómo está el DNS hoy.** En Cloudflare → *DNS* → *Records*: sacale una captura a todos los registros (sobre todo `A` de `@` y `www`).
3. **Bajá el TTL** de los registros `A` de `@` y `www` a *2 min* (así el cambio y una eventual vuelta atrás son rápidos).
4. **Pasá este código** (`git push`) y comprobá que el sitio nuevo sigue andando en el dominio de prueba.
5. **Revisá la casilla de correo para el CRM.** Pedile a quien administra `mail.transgas.com.ar` que cree `no-responder@transgas.com.ar`
   (o usá otra casilla). Vas a cargar en el CRM: servidor `mail.transgas.com.ar`, puerto `465`, usuario = el correo completo y su contraseña.
6. **Supabase → Authentication → URL Configuration:**
   - *Site URL*: `https://transgas.com.ar`
   - *Redirect URLs*: agregá `https://transgas.com.ar/crm/auth/callback` (dejá también la del dominio de prueba por ahora).

## FASE 2 — El cambio (elegí un horario tranquilo, por ejemplo, un domingo a la mañana)

### 2.1 Variables de entorno de la app (hPanel → tu app Node.js → Variables de entorno)

| Variable | Valor |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://transgas.com.ar` (sin barra al final) |
| `ALLOW_INDEXING` | `true` |

Después hacé **Redeploy**. Es obligatorio volver a compilar: `NEXT_PUBLIC_SITE_URL` se "graba" al compilar.
Las demás variables (`DATABASE_URL`, Supabase, `CRON_SECRET`…) quedan igual.

### 2.2 Conectar el dominio a la app de Hostinger

1. Si `transgas.com.ar` está asignado al WordPress en **la misma cuenta de Hostinger**, primero desvinculalo de ese sitio
   (hPanel → *Sitios web* → WordPress → *Dominio* / *Quitar o cambiar dominio*). Un dominio solo puede estar en un sitio a la vez.
   **No borres el WordPress todavía.**
2. En la app Node.js → *Dominios* / *Conectar dominio* → escribí `transgas.com.ar`. Hostinger te va a mostrar la **IP del servidor** a la que
   hay que apuntar (anotala).

### 2.3 Apuntar el dominio en Cloudflare

En Cloudflare → *DNS* → *Records*:

1. Editá el registro **A** de `@` (transgas.com.ar): poné la **IP de Hostinger** del paso anterior.
2. Editá el de `www`: lo mismo (o un `CNAME` a `transgas.com.ar`).
3. Dejá la nube en **naranja (Proxied)** o en gris (*DNS only*): cualquiera de las dos sirve. Si Hostinger no logra emitir el certificado SSL,
   ponelo en gris unos minutos.
4. **No toques** `MX`, `mail`, `TXT`/SPF ni nada del correo.

En Cloudflare → *SSL/TLS*: modo **Full** (y **Full (strict)** cuando Hostinger ya haya emitido el certificado) y activá *Always Use HTTPS*.
En *Speed → Optimization*: **desactivá Rocket Loader y Auto Minify** (rompen la carga de este sitio). Después, *Caching → Purge Everything*.

### 2.4 Probar (a los 5–30 minutos)

Abrí `https://transgas.com.ar` en una ventana privada y verificá:

- [ ] Carga el sitio nuevo, con candado de HTTPS. `https://www.transgas.com.ar` redirige a `https://transgas.com.ar`.
- [ ] `https://transgas.com.ar/tarifa-social/` redirige a la página nueva.
- [ ] `https://transgas.com.ar/wp-content/uploads/2023/08/reglamento-servicio-distribucion-2021_compressed.pdf` abre el PDF.
- [ ] `https://transgas.com.ar/robots.txt` dice `Allow: /` y menciona `https://transgas.com.ar/sitemap.xml`.
- [ ] `https://transgas.com.ar/crm` permite ingresar (los usuarios tienen que volver a iniciar sesión: es normal).
- [ ] Enviá un formulario de prueba desde el sitio: aparece en CRM → Contactos.
- [ ] CRM → Configuración → *Servidor de correo*: cargá `mail.transgas.com.ar`, puerto 465, la casilla y su contraseña → *Enviar mail de prueba*.
- [ ] Abrí `/preguntas-frecuentes`, `/documentos` y el chat.

### 2.4 bis. Tarea programada (cron)

En hPanel → *Avanzado → Cron Jobs*, actualizá el comando con el dominio nuevo:

```bash
curl -s "https://transgas.com.ar/api/cron/avisos?secret=TU_CRON_SECRET" > /dev/null
```

(Esa tarea, una vez por día, también mantiene activa la base gratuita de Supabase.)

## FASE 3 — Después del cambio (los días siguientes)

1. **Google Search Console** (ya debería existir la propiedad de `transgas.com.ar`; si no, creala con verificación por DNS en Cloudflare):
   *Sitemaps* → enviar `https://transgas.com.ar/sitemap.xml` y quitar los viejos. En *Inspección de URLs* pedí indexar la home.
2. **Bing Webmaster Tools:** importar el sitio desde Search Console.
3. **Google Business Profile:** el enlace al sitio ya es el mismo. Revisá que dirección y teléfono coincidan con el sitio.
4. Subí el TTL de Cloudflare otra vez (Auto) y, tras **30 días** de que todo esté estable, dá de baja el WordPress viejo y su hosting.
5. Si tenés mails con enlaces al sitio viejo o impresos con direcciones como `/informar-un-pago/`, siguen funcionando por las redirecciones.

## Si algo sale mal (vuelta atrás en 5 minutos)

En Cloudflare, volvé a poner en los registros `A` de `@` y `www` los valores que anotaste en la Fase 1. Como bajaste el TTL, en pocos minutos el
WordPress vuelve a verse. Después se revisa con calma qué falló.

## Preguntas frecuentes

- **¿Se cae el correo?** No, si no se tocan los nameservers ni los registros `MX`/`mail`. Esta guía solo cambia dos registros `A`.
- **¿Se pierde el posicionamiento en Google?** No: es el mismo dominio y las URLs viejas redirigen (308) a las nuevas. Puede haber
  oscilaciones normales durante algunas semanas mientras Google vuelve a rastrear.
- **¿Hay que migrar contenido del WordPress?** El contenido de las 19 páginas ya está en el sitio nuevo. Los PDF se conservaron.
  Lo único que no se traslada es el blog de ejemplo de WordPress ("Hello world").
- **¿Y las imágenes del WordPress?** No se usan en el sitio nuevo (tiene sus propias imágenes).
