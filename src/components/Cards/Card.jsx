import React from 'react';
import './card.css';
import { useFech } from '../ListaPokemon/Pokemonlist';
import { Link } from 'react-router-dom';

function Card() {
  const { data, loading } = useFech("https://pokeapi.co/api/v2/pokemon?limit=30&offset=0");
  let response
  if (loading) {
    response = "<div>Cargando...</div>";
  } else { response = mapeoDePokemons(data) }


  return (
    <div >
      <ul className='container-card'>
        {response}
      </ul>
    </div>
  );
}

function mapeoDePokemons(data = []) {
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
export default Card;