import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "https://pokeapi.co/api/v2/pokemon/";

const PokemonInfo = () => {
  const [searchTerm, setSearchTerm] = useState("1");
  const [pokemon, setPokemon] = useState(null);
  const [pokemonList, setPokemonList] = useState([]);
  const [pokemonId, setPokemonId] = useState(1);

  useEffect(() => {
    const fetchPokemonList = async () => {
      try {
        const response = await axios.get(`${API_URL}?limit=100`);
        setPokemonList(response.data.results);
      } catch (error) {
        console.error("Error fetching Pokémon list:", error);
      }
    };
    fetchPokemonList();
  }, []);

  // Fetching Pokémon details
  const fetchPokemon = async (nameOrId) => {
    try {
      const response = await axios.get(`${API_URL}${nameOrId}`);
      setPokemon(response.data);
      setPokemonId(response.data.id);
    } catch (error) {
      console.error("Error fetching Pokémon:", error);
      setPokemon(null);
    }
  };

  useEffect(() => {
    fetchPokemon(searchTerm);
  }, []);

  const handleSearch = () => {
    if (searchTerm.trim() !== "") {
      fetchPokemon(searchTerm.toLowerCase());
    }
  };

  const handleNext = () => {
    const nextId = pokemonId + 1;
    fetchPokemon(nextId);
  };

  const handlePrevious = () => {
    if (pokemonId > 1) {
      fetchPokemon(pokemonId - 1);
    }
  };

  return (
    <div className="container text-center">
      <h2 className="text-2xl font-bold my-4">Pokémon Info App</h2>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Enter Pokémon name or ID..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border p-2 w-60 rounded-md mx-2"
      />
      <button
        onClick={handleSearch}
        className="bg-blue-500 text-white px-4 py-2 rounded-md"
      >
        Search
      </button>

      <select
        onChange={(e) => fetchPokemon(e.target.value)}
        className="border p-2 w-60 rounded-md mt-2"
      >
        {pokemonList.map((p) => (
          <option key={p.name} value={p.name}>
            {p.name.toUpperCase()}
          </option>
        ))}
      </select>

      {pokemon ? (
        <div className="bg-white shadow-lg p-4 rounded-md mt-4 inline-block">
          <img
            src={pokemon.sprites.front_default}
            alt={pokemon.name}
            className="w-32 mx-auto"
          />
          <h3 className="text-xl font-bold">{pokemon.name.toUpperCase()}</h3>
          <p className="text-gray-600">
            Type: {pokemon.types.map((t) => t.type.name).join(", ")}
          </p>
          <p className="font-semibold">Base Stats:</p>
          <ul className="text-left inline-block">
            {pokemon.stats.map((stat) => (
              <li key={stat.stat.name}>
                {stat.stat.name}: {stat.base_stat}
              </li>
            ))}
          </ul>

          <div className="mt-4">
            <button
              onClick={handlePrevious}
              className="bg-gray-500 text-white px-4 py-2 mx-6 rounded-md"
              disabled={pokemonId <= 1}
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              className="bg-green-500 text-white px-4 py-2 mx-4 rounded-md"
            >
              Next
            </button>
          </div>
        </div>
      ) : (
        <p className="text-red-500 mt-4">No Pokémon found</p>
      )}
    </div>
  );
};

export default PokemonInfo;
