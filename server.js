require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
require("http");
const https = require("https");

app.use(cors());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
const PORT = process.env.PORT;
const connectToDatabase = require("./src/config/database");
const api_endpoints_route = require("./constants");

app.get("/", (req, res) => {
  res.send("************* WELCOME to POKEMON APPLICATION *************");
});
api_endpoints_route.map((item) => app.use(item.path, item.route));

//  PRODUCTION ENVIRONMENT
if (process.env.ENVIRONMENT === "PRODUCTION") {
  var https_options = {
    // server file location
  };

  var server = https.createServer(https_options, app);
  server.listen(PORT, () => {
    console.log("Server is up at :" + PORT);
  });

  server,
    {
      cors: {
        origin: ["https://localhost:3000"],
        methods: ["GET", "POST"],
      },
    };
}

if (process.env.ENVIRONMENT === "DEVELOPMENT") {
  var http = require("http").createServer(app);
  http.listen(PORT, () => {
    console.log("*******************************************");
    console.log(`port is listening on ${PORT}`);
  });
}

connectToDatabase();
