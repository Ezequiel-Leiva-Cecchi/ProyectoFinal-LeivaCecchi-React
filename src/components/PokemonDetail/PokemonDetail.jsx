import React, { useState, useEffect } from 'react';
import './pokemonDetail.css';
import PokemonCount from '../PokemonCount/PokemonCount'
import { useParams } from 'react-router-dom';
import { useFech } from '../ListaPokemon/Pokemonlist';
function PokemonDetails() {
  const { name } = useParams();
  const [pokemon, setPokemon] = useState({});
  const { data, loading } = useFech("https://pokeapi.co/api/v2/pokemon?limit=30&offset=0");

  useEffect(() => {
    if (Array.isArray(data)) {
      const selectedPokemon = data.find((p) => p.name === name);
      if (selectedPokemon) {
        setPokemon(selectedPokemon);
      }
    }
  }, [name, data]);
  if (loading) {
    return <div>Cargando...</div>;
  }
 
  return (
    <div className="pokemon-details-container">
      <h1>Pokemon Details</h1>
      <div key={pokemon.pokeId}>
        <h2>{pokemon.name}</h2>
        <img className='image' src={pokemon.imageUrl} alt="" />
        <p>Type: {pokemon.types && pokemon?.types.join(', ')}</p>
        <p className="abilities">Abilities: {pokemon.abilities && pokemon?.abilities.join(', ')}</p>
        <PokemonCount/>
      </div>
    </div>
  );
}

export default PokemonDetails;