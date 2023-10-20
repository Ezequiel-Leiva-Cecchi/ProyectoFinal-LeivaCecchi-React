import React, { useState } from 'react';
import './card.css';
import { useFech } from '../ListaPokemon/Pokemonlist';
import { Link } from 'react-router-dom';

function Card() {
  const { data, loading } = useFech("https://pokeapi.co/api/v2/pokemon?limit=30&offset=0");
  const [selectedTypes, setSelectedTypes] = useState([]);

  let response;

  if (loading) {
    response = <div>Cargando...</div>;
  } else {
    const filteredData = data.filter(pokemon => {
      if (selectedTypes.length === 0) {
        return true;
      }
      return selectedTypes.every(type => pokemon.types.includes(type));
    });

    if (filteredData.length === 0) {
      response = (
        <div className="error-container">
          <div className="no-pokemon-found">
            No se encontró ninguna combinación de tipos.
          </div>
        </div>
      );
    } else {
      response = mapeoDePokemons(filteredData, selectedTypes);
    }
  }

  const handleTypeChange = (type) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter(t => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  return (
    <div>
      <div className="type-checkboxes">
        <div className="checkbox-label">
          <label>
            <input
              type="checkbox"
              value="all"
              checked={selectedTypes.length === 0}
              onChange={() => setSelectedTypes([])}
            />
            <span></span> Mostrar Todos
          </label>
        </div>
        {getUniqueTypes(data).map(type => (
          <div className="checkbox-label" key={type}>
            <label>
              <input
                type="checkbox"
                value={type}
                checked={selectedTypes.includes(type)}
                onChange={() => handleTypeChange(type)}
              />
              <span className={`checkbox-checkmark ${type.toLowerCase()}`}></span> {type}
            </label>
          </div>
        ))}
      </div>
      <ul className='container-card'>
        {response}
      </ul>
    </div>
  );
}

function mapeoDePokemons(data = [], selectedTypes) {
  return data.map(function (pokemon) {
    const typeClass = pokemon.types[0].toLowerCase();

    return (
      <div className={`card-container ${typeClass}`} key={pokemon.name}>
        <li className="card" key={pokemon.name}>
          <img className="image" src={pokemon.imageUrl} alt={"Imagen de"} />
          <div className="card-body">
            <p className="card-text">Name: {pokemon.name}</p>
            <p className={`card-text ${typeClass}`}>Type: {pokemon.types.join(', ')} </p>
            <button><Link to={`/detalles/${pokemon.name}`}>More Details</Link></button>
          </div>
        </li>
      </div>
    );
  });
}

function getUniqueTypes(data) {
  const allTypes = data.flatMap(pokemon => pokemon.types);
  return [...new Set(allTypes)];
}

export default Card;