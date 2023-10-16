import React, { useState, useEffect } from 'react';
import { useFech } from '../ListaPokemon/Pokemonlist';
import '../Navbar/sidebar.css';

function Sidebar() {
  const { data: pokemonData, loading } = useFech('https://pokeapi.co/api/v2/pokemon?limit=30&offset=0');
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [filteredPokemon, setFilteredPokemon] = useState([]);

  const handleTypeChange = (event) => {
    const type = event.target.value;
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter((t) => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  const allTypes = Array.isArray(pokemonData)
    ? [...new Set(pokemonData.flatMap((pokemon) => pokemon.types))]
    : [];

  const filterPokemonByType = () => {
    if (selectedTypes.length === 0) {
      setFilteredPokemon(pokemonData);
    } else {

      const filtered = pokemonData.filter((pokemon) =>
        pokemon.types.some((type) => selectedTypes.includes(type))
      );
      setFilteredPokemon(filtered);
    }
  };

  useEffect(() => {
    filterPokemonByType();
  }, [selectedTypes]);

  return (
    <div className="sidebar">
      <h2>Tipo de Pokémon</h2>
      {loading ? (
        <div>Cargando...</div>
      ) : (
        <div>
          <ul>
            {allTypes.map((type) => (
              <li key={type}>
                <label>
                  <input
                    type="checkbox"
                    value={type}
                    checked={selectedTypes.includes(type)}
                    onChange={handleTypeChange}
                  />
                  <span className={type}>{type}</span>
                </label>
              </li>
            ))}
          </ul>
          {selectedTypes.length > 0 && (
            <div>
              <h3>Tipo(s) seleccionado(s): {selectedTypes.join(', ')}</h3>
              <ul>
                {filteredPokemon.map((pokemon) => (
                  <li key={pokemon.name}>{pokemon.name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Sidebar;