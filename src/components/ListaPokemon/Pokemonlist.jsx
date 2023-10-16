
import React, { useState, useEffect } from 'react';

export function useFech(url) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(url);
        const result = await response.json();

        const pokemonData = await Promise.all(
          result.results.map(async (pokemon) => {
            const pokemonResponse = await fetch(pokemon.url);
            const pokemonDetails = await pokemonResponse.json();
            const types = pokemonDetails.types.map((typeInfo) => typeInfo.type.name)
            const pokeId = pokemonDetails.id;
            const abilities = pokemonDetails.abilities.map((abilityInfo) => abilityInfo.ability.name);
            return {
              name: pokemon.name,
              imageUrl: pokemonDetails.sprites.front_default,
              types: types, 
              pokeId: pokeId,
              abilities: abilities,
            };
          })
        );

        setData(pokemonData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    }

    fetchData();
  }, []);


  return{data, loading}
}