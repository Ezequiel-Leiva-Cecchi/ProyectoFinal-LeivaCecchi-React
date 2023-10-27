import React, { useState, useEffect } from 'react';
import './pokemonDetail.css';
import PokemonCount from '../PokemonCount/PokemonCount';
import { db } from '../../index';
import { doc, getDoc } from 'firebase/firestore';
import { useParams } from 'react-router-dom';

function PokemonDetails() {
  const { pokemonName } = useParams(); 
  const [pokemon, setPokemon] = useState(null);
  
  async function getOnePokemon(db, nombre) {
    const pokemonRef = doc(db, 'pokemons', nombre);
    const response = await getDoc(pokemonRef);
    const onePokemon = { ...response.data(), id: response.id };
    return onePokemon;
  }

  useEffect(() => {
    getOnePokemon(db, pokemonName)
      .then((response) => {
        setPokemon(response);
      })
  }, [db, pokemonName]); 
  return (
    <div className="pokemon-details-container">
      <h1>Pokemon Details</h1>
      {pokemon ? (
        <div>
          <h2>{pokemon.name}</h2>
          <img className='image' src={pokemon.img} alt={`Imagen de ${pokemon.name}`} />
          <p>Tipo: {pokemon.tipo && pokemon.tipo.join(', ')}</p>
          <p className="abilities">Descripcion: {pokemon.descripcion && pokemon.descripcion.join(', ')}</p>
          <PokemonCount Pokemon={pokemon} />
        </div>
      ) : (
        <div>Cargando detalles del Pokémon...</div>
      )}
    </div>
  );
}

export default PokemonDetails;