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
  const page = Number(searchParams.get("page") || 1); // Página actual
  const limit = 20;
  const offset = (page - 1) * limit;

  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
  );
  const data = await response.json();
  console.log(data);

  return json({
    pokemons: data.results,
    totalPages: Math.ceil(data.count / limit),
    currentPage: page,
  });
};

export default function App() {
  const { pokemons, currentPage, totalPages } = useLoaderData<typeof loader>();
  const navigate = useNavigate(); // Usar useNavigate para la navegación

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
              >
                Anterior
              </button>
            )}
            {currentPage < totalPages && (
              <button
                onClick={() => navigate(`/?page=${currentPage + 1}`)}
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
