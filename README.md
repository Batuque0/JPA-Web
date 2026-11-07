# Remitos JPA

Aplicación web (PWA) para generar remitos a partir del PDF original de un comprobante, y compartirlos desde el celular.

Funciona **sin conexión a Internet**, se instala en Android e iOS y no requiere servidor: todo se procesa en el dispositivo.

## Qué hace

1. Lee un PDF de remito descargado en el celular.
2. Detecta número de remito, cliente, descuento y productos.
3. Permite confirmar o cambiar el **cliente**, elegir la **ganancia** (13.5 % o 15 %) y, si el PDF no trae descuento, elegir el porcentaje.
4. Genera el nuevo remito en PDF y lo muestra junto con el original (deslizando hacia el costado).
5. Lo comparte con el menú nativo del celular (WhatsApp, Gmail, Telegram, Drive, etc.).

La pantalla de inicio tiene un botón **?** con una ayuda breve de uso.

## Cómo se usa

1. Descargá el remito del mail al celular (acordate dónde lo guardás).
2. Tocá **Cargar remito** y seleccioná el PDF.
3. Verificá los datos y tocá **Generar remito**.
4. Tocá **Compartir** y elegí la aplicación.

Si no hay señal, se puede hacer todo el proceso igual: el mensaje se envía cuando vuelva la conexión.

## Instalación en el celular

**Android (Chrome):** abrir la dirección de la app → menú ⋮ → *Instalar aplicación* / *Agregar a la pantalla principal*.

**iPhone (Safari):** abrir la dirección de la app → botón Compartir → *Agregar a inicio*.

> **Importante:** después de instalar, abrir la app **una vez con Internet** desde su ícono. Ahí se guardan todos los archivos para usarla sin conexión. Cuando aparece **"✓ Lista para usar sin conexión"** en la pantalla de inicio, ya está lista.

## Estructura del proyecto

```
index.html              Aplicación completa (pantallas, lógica y estilos)
sw.js                   Service Worker: caché sin conexión y actualizaciones
manifest.webmanifest    Datos de instalación de la PWA
logo_jpa.png            Logo (ícono de la app y encabezado del remito)
vendor/
  pdf.min.js            PDF.js 3.11.174  (lectura y visualización de PDF)
  pdf.worker.min.js     PDF.js 3.11.174  (worker)
  jspdf.umd.min.js      jsPDF 2.5.1      (generación del PDF)
```

Las librerías están dentro del repositorio (no se cargan desde un CDN) para que la app funcione sin Internet.

### Descargar las librerías de `vendor/`

Si hace falta recrear la carpeta, guardar estos archivos con estos nombres:

| Archivo | Origen |
|---|---|
| `vendor/pdf.min.js` | https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js |
| `vendor/pdf.worker.min.js` | https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js |
| `vendor/jspdf.umd.min.js` | https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js |

## Publicación (GitHub Pages)

1. Subir todos los archivos a la raíz del repositorio.
2. En *Settings → Pages*, elegir la rama principal y la carpeta raíz (`/`).
3. La app queda disponible en `https://USUARIO.github.io/REPOSITORIO/`.

## Cómo actualizar la app

Cada vez que se modifique **cualquier archivo** de la app (`index.html`, `vendor/*`, `logo_jpa.png`, `manifest.webmanifest`):

1. Subir el número de `VERSION` al principio de `sw.js` (por ejemplo, de `"4"` a `"5"`).
2. Subir los cambios a GitHub.

Si se olvida este paso, los celulares seguirán usando la copia guardada y no se enterarán del cambio.

Cuando un celular con Internet abre la app, descarga la versión nueva en segundo plano y muestra en la pantalla de inicio el aviso **"Hay una versión nueva → Actualizar"**. Nunca se actualiza sola durante el uso, para no perder un remito a medio hacer. La versión que está corriendo se ve en gris al pie de la pantalla de inicio.

## Configuración

Al comienzo del script de `index.html`:

```js
const GANANCIA = 0.135;            // ganancia por defecto (13.5 %)
const EMPRESA = "DISTRIBUIDORA JPA";
const TIPO = "Comprobante";
const CONDICION = "Contado";
```

Las opciones de ganancia que se ofrecen en pantalla (13.5 % y 15 %) están en el selector `id="ganancia"` de la pantalla *Confirmar datos*.

## Cómo funciona sin conexión

- **Service Worker (`sw.js`):** en la primera visita descarga y guarda todos los archivos de la app. Después responde siempre desde esa copia local.
- **Versiones de caché:** cada versión tiene su propia caché (`remitos-jpa-vN`). Al activar una versión nueva se borran las anteriores.
- **Datos:** no se guarda nada. El PDF se lee desde el dispositivo, se procesa en memoria y no se envía a ningún servidor.

## Compatibilidad y límites conocidos

- **Compartir archivos** usa la Web Share API. Está soportada en Chrome para Android y en Safari de iOS 15 o posterior, incluyendo la app instalada. En navegadores que no la soportan (por ejemplo, algunas computadoras), el PDF se descarga.
- **iPhone:** la app instalada guarda sus archivos aparte de Safari, por eso hay que abrirla una vez con Internet desde el ícono. El ícono y el nombre no se actualizan solos: para cambiarlos hay que reinstalar.
- **Botón atrás de Android:** vuelve a la pantalla anterior; desde la pantalla de inicio cierra la app.

## Cómo probar el modo sin conexión

1. Abrir la app con Internet y esperar a ver **"✓ Lista para usar sin conexión"**.
2. Activar el modo avión y cerrar la app por completo.
3. Abrirla desde el ícono, cargar un PDF, generar el remito y compartirlo.

## Tecnologías

HTML, CSS y JavaScript puro, sin frameworks. [PDF.js](https://mozilla.github.io/pdf.js/) para leer los PDF y [jsPDF](https://github.com/parallax/jsPDF) para generarlos.
