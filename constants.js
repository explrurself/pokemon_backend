const users = require("./src/routes/users");
const pokemon = require("./src/routes/pokemons");

const api_endpoints_route = [
  {
    path: "/api/users",
    route: users,
  },
  {
    path: "/api/pokemon",
    route: pokemon,
  },
];

module.exports = api_endpoints_route;
