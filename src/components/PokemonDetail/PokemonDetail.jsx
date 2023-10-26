import React, { useState, useEffect } from 'react';
import './pokemonDetail.css';
import PokemonCount from '../PokemonCount/PokemonCount';
import {db} from '../../index.js'
import getPokemon from '../ListaPokemon/Pokemonlist'

function PokemonDetails() {
  const [pokemon, setPokemon] = useState({});
  const numeroPokedex ="";
  // const { data, loading } = useFech("https://pokeapi.co/api/v2/pokemon?limit=30&offset=0");
  useEffect(() => {
   getPokemon(db,numeroPokedex)
   .then(response=>{
    setPokemon(response);
   })
   .catch(error => {
    console.error('Error al obtener datos de la base de datos:', error);
  });
  },[numeroPokedex] ); 

  // if (loading) {
  //   return <div>Cargando...</div>;
  // }

  return (
    <div className="pokemon-details-container">
      <h1>Pokemon Details</h1>
      <div key={pokemon.numeroPokedex}>
        <h2>{pokemon.nombre}</h2>
        <img className='image' src={pokemon.img} alt="" />
        <p>Tipo: {pokemon.tipo && pokemon?.tipo.join(', ')}</p>
        <p className="abilities">Descripcion: {pokemon.descripcion && pokemon?.descripcion.join(', ')}</p>
        <PokemonCount Pokemon={pokemon} />
      </div>
    </div>
  );
}

export default PokemonDetails;