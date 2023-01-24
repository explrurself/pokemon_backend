const express = require("express");
const USERS = require("../models/users");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const corsOptions = {
  credentials: true,
  origin: "http://localhost:3000",
};

// <------------CREATE USER API ---------------->

router.post("/create", async (req, res) => {
  try {
    console.log("api hit successfully");
    const hash = await bcrypt.hash(req.body.password, 10);
    const body = {
      name: req.body.name,
      email: req.body.email,
      password: hash,
    };
    await USERS.create(body)
      .then((data) => {
        //   console.log(data);
        res.status(200).send({
          status: "success",
          message: `User created successfully!`,
        });
      })
      .catch((err) => {
        res.status(400).send({
          status: "failed",
          message: err.message,
        });
      });
  } catch (error) {
    res.status(500).send({
      status: "failed",
      message: error.message,
    });
  }
});

// <------------LOGIN USER API ---------------- >

router.post("/login", cors(corsOptions), async (req, res) => {
  try {
    if (req.body.email) {
      const found_user = await USERS.findOne({ email: req.body.email });
      if (!found_user) {
        res.status(402).send({
          status: "failed",
          message: "No user against this email!",
        });
      } else {
        const pass_compare = await bcrypt.compare(
          req.body.password,
          found_user.password
        );
        if (pass_compare === false) {
          res.status(403).send({
            status: "failed",
            message: "Incorrect credentials!!",
          });
        } else {
          //   var token = jwt.sign(
          //     { _id: found_user._id },
          //     process.env.ACCESS_SECRET_TOKEN
          //   );
          var token = jwt.sign(
            { _id: found_user._id },
            process.env.ACCESS_SECRET_TOKEN,
            {
              expiresIn: "59m",
            }
          );

          await USERS.findOneAndUpdate(
            { _id: found_user._id },
            { token },
            { new: true }
          )
            .then((data) => {
              res
                .cookie("token", token, {
                  httpOnly: false,
                  path: "/",
                  expires: new Date(Date.now() + 6000 * 60),
                })
                .status(200)
                .send({
                  status: "success",
                  message: "Login successfull!",
                  token,
                  name: data.name,
                });
            })
            .catch((err) => {
              res.status(400).send({
                status: "failed",
                message: err?.message,
              });
            });
        }
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: error.message,
    });
  }
});

module.exports = router;
