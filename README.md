# NovaDex

Una Pokédex moderna, rápida y responsive construida con React. NovaDex permite explorar la Pokédex Nacional completa, investigar cada especie y armar una colección personal sin crear una cuenta ni entregar datos sensibles.

> El catálogo no tiene un total escrito a mano: consulta PokéAPI y se adapta automáticamente. Al momento de esta renovación contiene **1.025 especies**, desde Bulbasaur hasta Pecharunt.

## Qué incluye

- Pokédex Nacional con búsqueda por nombre o número.
- Filtros por tipo y generación.
- Orden alfabético y por número nacional.
- Filtros y páginas reflejados en la URL para conservar y compartir búsquedas.
- Paginación y estados claros de carga, error y resultados vacíos.
- Fichas con arte oficial, descripción en español, tipos, habilidades y medidas.
- Estadísticas base y cadena evolutiva.
- Acceso a formas y variantes disponibles en PokéAPI.
- Favoritos persistentes en el navegador.
- Equipo personal de hasta seis Pokémon.
- Resumen de tipos y estadísticas del equipo armado.
- Comparador visual de estadísticas entre dos especies.
- Selección aleatoria y atajo `/` para abrir el buscador.
- Diseño adaptable a celulares, tablets y escritorio.
- Navegación accesible por teclado y soporte para movimiento reducido.

## Tecnología

- [React 19](https://react.dev/) para la interfaz.
- [Vite](https://vite.dev/) para desarrollo y compilación.
- [React Router](https://reactrouter.com/) para las rutas.
- [TanStack Query](https://tanstack.com/query/latest) para caché y sincronización de datos.
- [PokéAPI](https://pokeapi.co/) como fuente pública de información e imágenes.
- CSS modularizado por responsabilidad, sin una librería visual externa.
- Vitest y Testing Library para pruebas.

## Estructura

```text
src/
├── api/          # Comunicación y normalización de PokéAPI
├── components/   # Piezas reutilizables de la interfaz
├── config/       # Tipos, generaciones y constantes visuales
├── context/      # Estado local de favoritos y equipo
├── hooks/        # Comportamientos reutilizables
├── pages/        # Pantallas asociadas a cada ruta
├── styles/       # Tokens, base, componentes y responsive
├── test/         # Configuración común de pruebas
└── utils/        # Funciones puras de formato y filtrado
```

El código contiene comentarios en español donde explican decisiones o comportamientos que no son evidentes. Los nombres de funciones y componentes siguen siendo descriptivos para evitar comentarios que sólo repitan el código.

## Ejecutarlo en tu computadora

Necesitás Node.js 22.13 o superior. La versión recomendada para este proyecto está indicada en `.nvmrc`.

```bash
git clone https://github.com/Ezequiel-Leiva-Cecchi/ProyectoFinal-LeivaCecchi-React.git
cd ProyectoFinal-LeivaCecchi-React
npm install
npm run dev
```

Vite mostrará en la terminal la dirección local que tenés que abrir.

## Comandos disponibles

| Comando | Uso |
| --- | --- |
| `npm run dev` | Inicia el entorno de desarrollo. |
| `npm run build` | Genera la versión optimizada en `dist/`. |
| `npm run preview` | Prueba localmente la compilación. |
| `npm run lint` | Revisa errores y malas prácticas. |
| `npm run test` | Ejecuta todas las pruebas una vez. |
| `npm run test:watch` | Repite pruebas mientras programás. |
| `npm run check` | Ejecuta lint, pruebas y build en conjunto. |

## Privacidad y seguridad

Esta versión elimina el checkout, Firebase y la recolección de nombre, teléfono, domicilio o tarjeta que tenía el proyecto educativo original.

- No utiliza credenciales privadas ni secretos en el frontend.
- No almacena información en servidores propios.
- Favoritos y equipo se guardan únicamente en `localStorage` del dispositivo.
- Las rutas externas se limitan a PokéAPI y a sus imágenes oficiales.
- Las dependencias se revisan con `npm audit` y GitHub Actions valida cada cambio.

Si en el futuro se agrega autenticación o una base de datos, las claves privadas deberán permanecer en un backend y nunca dentro del código enviado al navegador.

## Calidad

El flujo automático de GitHub ejecuta en cada pull request:

1. análisis estático con ESLint;
2. pruebas de utilidades, API, estado y pantalla principal;
3. compilación de producción.

También podés ejecutar exactamente la misma validación con:

```bash
npm run check
```

## Aclaración legal

Proyecto personal y educativo, sin fines comerciales. Pokémon y sus personajes pertenecen a Nintendo, Game Freak y The Pokémon Company. NovaDex no está afiliada ni respaldada por esas compañías.
