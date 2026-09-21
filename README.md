# Music Player

Reproductor de música con estética editorial, construido con React + Vite.

![preview](docs/preview.png)

## Stack

- React 18 + Vite 6 (sin framework de UI, CSS plano con custom properties)
- Sin dependencias de iconos: los SVG son inline
- Audio con la API `HTMLAudioElement` nativa

## Desarrollo

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # genera dist/
npm run preview  # sirve el build
```

## Características

**Reproducción**
- Play / pausa, anterior, siguiente
- Aleatorio (nunca repite la pista actual)
- Repetir: `off` → `all` → `one`
- "Anterior" reinicia la pista si ya pasaron 3 s, como en Spotify

**Interfaz**
- Vinilo que gira, con anillo de progreso arrastrable alrededor del disco
- Lista de pistas con duraciones leídas de los metadatos de cada archivo
- Modo claro / oscuro automático según el sistema
- Responsive: dos columnas en escritorio, apilado en móvil

**Accesibilidad**
- Navegable por teclado con foco visible
- `aria-label` / `aria-pressed` en los controles; el anillo expone `role="slider"`
- Respeta `prefers-reduced-motion`

**Integración con el sistema**
- Media Session API: controles nativos y teclas de medios del teclado

### Atajos de teclado

| Tecla | Acción |
| --- | --- |
| `Espacio` | Reproducir / pausar |
| `←` / `→` | Retroceder / adelantar 5 s |
| `Shift` + `←` / `→` | Pista anterior / siguiente |
| `↑` / `↓` | Subir / bajar volumen |
| `M` | Silenciar |
| `S` | Aleatorio |
| `R` | Cambiar modo de repetición |

## Estructura

```
src/
  main.jsx              punto de entrada
  App.jsx               composición del layout
  tracks.js             catálogo de pistas
  hooks/usePlayer.js    motor de audio y estado
  components/
    Vinyl.jsx           disco + anillo de progreso
    TrackList.jsx       lista de pistas
    Controls.jsx        transporte y volumen
    icons.jsx           iconos SVG
  styles/index.css      tokens y estilos
public/
  music/                archivos .mp3
  images/               portadas
```

## Agregar música

Colocá el `.mp3` en `public/music/` y la portada en `public/images/`, después
sumá la entrada en [`src/tracks.js`](src/tracks.js):

```js
{
  id: 'mi-cancion',
  name: 'Mi Canción',
  artist: 'Artista',
  album: 'Álbum',
  cover: 'images/mi-portada.jpg',
  src: 'music/mi-cancion.mp3',
}
```

> Los clips incluidos duran 30 s: son fragmentos, no las pistas completas.

## Deploy

`vite.config.js` usa `base: './'`, así que el contenido de `dist/` funciona en
GitHub Pages desde cualquier subcarpeta:

```bash
npm run build
npx gh-pages -d dist   # o subí dist/ a la rama gh-pages
```
