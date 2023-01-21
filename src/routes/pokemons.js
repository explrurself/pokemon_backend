const express = require("express");
const router = express.Router();
const axios = require("axios");
const Pokemon = require("../models/pokemon");
const verify_token = require("../config/auth");


// <------------- Create API for Pokemon ----------> 
// the data in the api is taken from 3rd party API.


router.post("/create", async (req, res) => {
  try {
    await axios
      .get("https://api.pokemontcg.io/v2/cards?page=2&pageSize=30")
      .then(async (data) => {
        for (const pokemon of data.data.data) {
          let abilities = [];
          let attacks = [];
          if (pokemon.attacks) {
            pokemon.attacks.forEach((item) => {
              attacks.push(item.name);
            });
          }

          if (pokemon.abilities) {
            pokemon?.abilities.forEach((item) => {
              abilities.push(item.name);
            });
          }
          const payload = {
            name: pokemon.name,
            abilities,
            attacks,
            images_url: pokemon.images?.large,
            hp: parseInt(pokemon.hp),
          };
          // console.log(payload)
          await Pokemon.create(payload).then((data) => {
            console.log("pokemon created successfully");
          });
        }
      });
  } catch (error) {
    res.status(500).send({
      status: "failed",
      message: error.message,
    });
  }
});

// <-------------GET ALL POKEMONS API ------------->

router.get("/", verify_token, async (req, res) => {
  try {
    let query = {
      page: req.query.page ? parseInt(req.query.page) : 1,
      limit: req.query.pageSize ? parseInt(req.query.pageSize) : 12,
    };

    await Pokemon.paginate({}, query).then((data) => {
      res.status(200).send({
        status: "success",
        message: "successfully fetched",
        data: data,
      });
    });
  } catch (error) {
    res.status(500).send({
      status: "failed",
      message: error.message,
    });
  }
});

module.exports = router;
