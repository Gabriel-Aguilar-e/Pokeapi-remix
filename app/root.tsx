import { json } from "@remix-run/node";
import type { LinksFunction } from "@remix-run/node";
import {
  Form,
  Link,
  Links,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useNavigate,
} from "@remix-run/react";
import appStylesHref from "./app.css?url";

// Configuración de enlaces CSS
export const links: LinksFunction = () => [
  { rel: "stylesheet", href: appStylesHref },
];

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const page = Number(searchParams.get("page") || 1);
  const search = searchParams.get("search") || "";
  const limit = 20;
  const offset = (page - 1) * limit;

  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
  );
  const data = await response.json();

  const filteredPokemons = data.results.filter(pokemon =>
    pokemon.name.toLowerCase().includes(search.toLowerCase())
  );

  return json({
    pokemons: filteredPokemons,
    totalPages: Math.ceil(filteredPokemons.length / limit),
    currentPage: page,
  });
};

export default function App() {
  const { pokemons, currentPage, totalPages } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  const handleSearch = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const search = formData.get("search");
    navigate(`/?search=${search}&page=${currentPage}`);
  };

  return (
    <html lang="es">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Pokédex Remix</title>
        <Meta />
        <Links />
      </head>
      <body>
        <div id="sidebar">
          <h1>Pokédex</h1>

          {/* Formulario de Búsqueda */}
          <form onSubmit={handleSearch}>
            <input
              type="text"
              name="search"
              placeholder="Buscar Pokémon"
              style={{ padding: "0.5rem", margin: "0.5rem 0" }}
            />
            <button type="submit" style={{ padding: "0.5rem" }}>
              Buscar
            </button>
          </form>

          {/* Lista de Pokémon */}
          <nav>
            <ul>
              {pokemons.map((pokemon, index) => (
                <li key={index}>
                  <NavLink
                    to={`/pokemon/${pokemon.name}?page=${currentPage}`}
                    className="capitalize"
                  >
                    {pokemon.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Paginación */}
          <div>
            {currentPage > 1 && (
              <button
                onClick={() => navigate(`/?page=${currentPage - 1}`)}
                style={{
                  marginTop: "1rem",
                  padding: "0.5rem",
                  display: "inline-block",
                  textDecoration: "none",
                  backgroundColor: "#007bff",
                  color: "#ffffff",
                  borderRadius: "4px",
                  textAlign: "center",
                  cursor: "pointer",
                  border: "none",
                }}
              >
                Anterior
              </button>
            )}
            {currentPage < totalPages && (
              <button
                onClick={() => navigate(`/?page=${currentPage + 1}`)}
                style={{
                  marginTop: "1rem",
                  padding: "0.5rem",
                  display: "inline-block",
                  textDecoration: "none",
                  backgroundColor: "#007bff",
                  color: "#ffffff",
                  borderRadius: "4px",
                  textAlign: "center",
                  cursor: "pointer",
                  border: "none",
                  marginLeft: "0.5rem",
                }}
              >
                Siguiente
              </button>
            )}
          </div>
        </div>
        <div id="detail">
          <Outlet />
        </div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
