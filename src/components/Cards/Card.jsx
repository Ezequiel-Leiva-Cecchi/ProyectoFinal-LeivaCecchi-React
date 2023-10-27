import React, { useState, useEffect  } from 'react';
import './card.css';
import { Link } from 'react-router-dom';
import getPokemons  from '../ListaPokemon/Pokemonlist';
import {db} from '../../index.js'

function Card() {
  // const { data, loading } = useFech("https://pokeapi.co/api/v2/pokemon?limit=30&offset=0");
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [data, setData] = useState([]);
  let response;
console.log(data)
  useEffect(() => {
    getPokemons(db) // Llama a getPokemon con la base de datos
      .then(response => {
        setData(response);
      })
      .catch(error => {
        console.error('Error al obtener datos de la base de datos:', error);
      });
  }, []); // El array vacío asegura que esta función se ejecute solo una vez al montar el componente

  if (data) {
    const filteredData = data.filter(pokemon => {
      if (selectedTypes.length === 0) {
        return true;
      }
      return selectedTypes.every(type => pokemon.tipo.includes(type));
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
    const typeClass = pokemon.tipo[0].toLowerCase();

    return (
      <div className={`card-container ${typeClass}`} key={pokemon.nombre}>
        <li className="card" key={pokemon.nombre}>
          <img className="image" src={pokemon.img} alt={"Imagen de"} />
          <div className="card-body">
            <p className="card-text">Nombre: {pokemon.nombre}</p>
            <p className={`card-text ${typeClass}`}>Tipo: {pokemon.tipo.join(", ")} </p>
            <button><Link to={`/detalles/${pokemon.nombre}`}>Más Detalles</Link></button>
          </div>
        </li>
      </div>
    );
  });
}

function getUniqueTypes(data) {
  const allTypes = data.flatMap(pokemon => pokemon.tipo);
  return [...new Set(allTypes)];
}

export default Card;
