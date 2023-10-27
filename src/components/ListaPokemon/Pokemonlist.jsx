import {collection,getDocs} from 'firebase/firestore'


  // const [data, setData] = useState([]);
  // const [loading, setLoading] = useState(true);

  async function getPokemons(db) {
    const pokemonCol = collection(db, 'pokemons');
    const pokemonList = getDocs(pokemonCol).then(element=>{
     return element.docs.map(doc => doc.data())
    });
  
    return await pokemonList
  }
  export default getPokemons;


// const llamdaFS=() => {
//   const PokemonsColeccion = collection(db,"pokemons");
//   console.log(PokemonsColeccion);
//   getDocs(PokemonsColeccion).then((response) => {
//     let pokemon = response.docs.map((element)=> element)
//     console.log(pokemon)
//   })
  
// }
// useEffect(()=>{
//   llamdaFS()
// },[])




























// Get a list of cities from your database



























//   useEffect(() => {
//     async function fetchData() {
//       try {
//         const response = await fetch(url);
//         const result = await response.json();

//         const pokemonData = await Promise.all(
//           result.results.map(async (pokemon) => {
//             const pokemonResponse = await fetch(pokemon.url);
//             const pokemonDetails = await pokemonResponse.json();
//             const types = pokemonDetails.types.map((typeInfo) => typeInfo.type.name)
//             const pokeId = pokemonDetails.id;
//             const abilities = pokemonDetails.abilities.map((abilityInfo) => abilityInfo.ability.name);
//             return {
//               name: pokemon.name,
//               imageUrl: pokemonDetails.sprites.front_default,
//               types: types, 
//               pokeId: pokeId,
//               abilities: abilities,
//             };
//           })
//         );

//         setData(pokemonData);
//         setLoading(false);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//         setLoading(false);
//       }
//     }

//     fetchData();
//   }, );

//   return{data, loading}