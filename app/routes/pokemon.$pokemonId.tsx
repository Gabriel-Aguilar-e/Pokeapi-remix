import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";




export const loader = async ({ params }: { params: { pokemonId: string } }) => {
  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon/${params.pokemonId}`
  );
  if (!response.ok) {
    throw new Response("No se encontró el Pokémon", { status: 404 });
  }
  const pokemon = await response.json();
  return json({ pokemon });
};

export default function PokemonDetail() {
  const { pokemon } = useLoaderData<typeof loader>();

  return (
    <div>
      <h1 className="capitalize">{pokemon.name}</h1>
      <img
        src={pokemon.sprites.front_default}
        alt={pokemon.name}
        width={200}
        height={200}
      />
      <ul>
        <li>
          <strong>Peso:</strong> {pokemon.weight/10} kg
        </li>
        <li>
          <strong>Altura:</strong> {pokemon.height/10 } m
        </li>
        <li>
          <strong>Experiencia base:</strong> {pokemon.base_experience}
        </li>
      </ul>
      <button
        onClick={() => playSound(pokemon.id)}
        style={{ marginTop: "1rem", padding: "0.5rem" }}
      >
        Reproducir Sonido
      </button>
    </div>
  );
}

function playSound(id: number) {
  const soundUrl = `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${id}.ogg`;
  console.log("Sonido pokemon:", soundUrl);
  const audio = new Audio(soundUrl);
  audio.play();
}
