const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const pino = require("express-pino-logger")();
const axios = require("axios");
const fs = require("fs");

const port = 3001;

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(pino);
app.use(helmet());
app.use(cors());

app.get("/api", async (req, res, next) => {
  try {
    // in prod
    const airports = await callRapidApiToGetUSAirports();
    res.json(airports);

    // in development
    // const airports = getAirportsFromLocalJson();
  } catch (error) {
    next(error);
  }

  async function callRapidApiToGetUSAirports() {
    function scanAndRefineAirports(airports) {
      return airports.filter(
        (a) =>
          a.type !== "heliport" &&
          a.type !== "closed" &&
          a.type !== "small_airport" &&
          a.country.toLowerCase() == "us"
      );
    }

    const options = {
      method: "GET",
      url: "https://ourairport-data-search.p.rapidapi.com/api/airports/us",
      headers: {
        "X-RapidAPI-Key": "bb7c540eafmsh899ae8ebf5b34fbp14f87bjsn2c5edbb60724",
        "X-RapidAPI-Host": "ourairport-data-search.p.rapidapi.com",
      },
    };

    const res = await axios.request(options);
    let airports = scanAndRefineAirports(res.data.results);

    let resStr = JSON.stringify(airports);

    await fs.writeFile("./airports.json", resStr, (err) => {
      if (err) {
        console.error(err);
      } else {
        console.log("Successfully wrote airports.json file.");
      }
    });
    console.log("Getting ");
    return airports;
  }

  function getAirportsFromLocalJson() {
    fs.readFile("./airports.json", "utf8", (err, jsonString) => {
      if (err) {
        return;
      }
      try {
        const airports = JSON.parse(jsonString);
        res.json(airports);
      } catch (err) {
        console.log("Error parsing JSON string:", err);
      }
    });
  }
});

app.listen(port, () =>
  console.log("Express server is running on localhost:" + port)
);
