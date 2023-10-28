import React, { useState, useEffect  } from 'react';
import './card.css';
import { Link } from 'react-router-dom';
import getPokemons  from '../ListaPokemon/Pokemonlist';
import {db} from '../../index.js'

function Card() {
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [data, setData] = useState([]);
  let response;
  useEffect(() => {
    getPokemons(db) 
      .then(response => {
        setData(response);
      })
      .catch(error => {
        console.error('Error al obtener datos de la base de datos:', error);
      });
  }, []); 

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

function mapeoDePokemons(data = []) {
  return data.map(function (pokemon) {
    const typeClass = pokemon.tipo[0].toLowerCase();

    return (
      <div className={`card-container ${typeClass}`} key={pokemon.id}>
        <li className="card" key={pokemon.id}>
          <img className="image" src={pokemon.img} alt={`Imagen de ${pokemon.nombre}`} />
          <div className="card-body">
            <p className="card-text">Nombre: {pokemon.nombre}</p>
            <p className={`card-text ${typeClass}`}>Tipo: {pokemon.tipo.join(", ")} </p>
            <button><Link to={`/detalles/${pokemon.id}`}>Más Detalles</Link></button>
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
