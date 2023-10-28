import React, { useState, useEffect } from 'react';
import './pokemonDetail.css';
import PokemonCount from '../PokemonCount/PokemonCount';
import { db } from '../../index';
import { doc, getDoc } from 'firebase/firestore';
import { useParams } from 'react-router-dom';

function PokemonDetails() {
  const { pokemonName } = useParams();
  const [pokemon, setPokemon] = useState(null);

  useEffect(() => {
    async function getOnePokemon(db, pokemonName) {
      const pokemonDoc = doc(db, 'pokemons', pokemonName);
      const pokemonData = await getDoc(pokemonDoc);
      if (pokemonData.exists()) {
        setPokemon({ ...pokemonData.data(), id: pokemonData.id });
      } else {
        console.error(`El Pokémon con nombre ${pokemonName} no existe.`);
      }
    }

    getOnePokemon(db, pokemonName);
  }, );

  return (
    <div className="pokemon-details-container">
      <h1>Pokemon Details</h1>
      {pokemon ? (
        <div>
          <h2>{pokemon.nombre}</h2>
          <img className='image' src={pokemon.img} alt={`Imagen de ${pokemon.nombre}`} />
          <p>Tipo: {pokemon.tipo && pokemon.tipo.join(', ')}</p>
          <p className="abilities">Descripcion: {Array.isArray(pokemon.descripcion) ? pokemon.descripcion.join(', ') : pokemon.descripcion}</p>
          <PokemonCount Pokemon={pokemon} />
        </div>
      ) : (
        <div>Cargando detalles del Pokémon...</div>
      )}
    </div>
  );
}

export default PokemonDetails;