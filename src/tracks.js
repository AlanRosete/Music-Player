// Catálogo local. Las rutas apuntan a /public, servidas tal cual.
// en dev no pasa por el bundler.
export const TRACKS = [
  {
    id: 'get-you',
    name: 'Get You',
    artist: 'Daniel Caesar, Kali Uchis',
    album: 'Freudian',
    cover: 'images/GetYou.jfif',
    src: 'music/get-you-feat-kali-uchis_YKcljgMH.mp3',
  },
  {
    id: 'havana',
    name: 'Havana',
    artist: 'Camila Cabello',
    album: 'Camila',
    cover: 'images/Havana.png',
    src: 'music/camila-cabello-havana-audio-ft-young-thug_MzviZJq4.mp3',
  },
  {
    id: 'gorilla',
    name: 'Gorilla',
    artist: 'Bruno Mars',
    album: 'Unorthodox Jukebox',
    cover: 'images/Gorilla.jpg',
    src: 'music/bruno-mars-gorilla_Fd0vYtkg.mp3',
  },
  {
    id: 'stay',
    name: 'Stay',
    artist: 'The Kid LAROI, Justin Bieber',
    album: 'F*ck Love 3',
    cover: 'images/stay.png',
    src: 'music/stay.mp3',
  },
];

// Encabezado editorial, limpio para que se pueda cambiar sin tocar el código.
export const FEATURED = {
  title: ['MIXED', 'FEELINGS'],
  genres: ['R&B', 'POP', 'FUNK', 'SYNTH', 'SOUL'],
};
