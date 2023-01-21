const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const pokemon_schema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    attacks: {
      type: Array,
    },
    abilities: {
      type: Array,
    },
    images_url: {
      type: String,
    },
    hp: {
      type: Number,
    },
  },
  { timestamps: true, versionKey: false }
);

pokemon_schema.plugin(mongoosePaginate);
const Pokemon = new mongoose.model("pokemon", pokemon_schema);
module.exports = Pokemon;
