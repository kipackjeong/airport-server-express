const fs = require("fs").promises;
const axios = require("axios");

/**
 * Airport controller.
 */
class AirportController {
    #url;
    #logger;
    #jsonDataFileName = "./airports.json";

    /**
   * Creates instance of `AirportController`.
   * @param {logger} logger
   */
    constructor(logger) {
        this.#logger = logger;
    }

    /**
   * Gets all the airports in the US.
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
    getAllAirports = async (req, res, next) => {
        try {
            // in prod
            const airports = await this.#callRapidApiToGetUSAirports();


            // in development
            // const airports = await this.#getAirportsFromLocalJson();

            res.status(200).json(airports);
        } catch (error) {
            next(error);
        }
    };
    /**
    * Gets all airports from the local file. This is only used in development.
    */
    #getAirportsFromLocalJson = async () => {
        const airports = JSON.parse(await fs.readFile(this.#jsonDataFileName, "utf8"));
        return airports;
    };
    /**
   *This will call rapid api to get all the airports in the US.
   * @returns airports
   */
    #callRapidApiToGetUSAirports = async () => {
        const options = {
            method: "GET",
            url: process.env.API_URL,
            headers: {
                "X-RapidAPI-Key": process.env.API_KEY,
                "X-RapidAPI-Host": process.env.API_HOST,
            },
        };

        const res = await axios.request(options);
        const airports = this.#scanAndRefineAirports(res.data.results);

        const resStr = JSON.stringify(airports);

        await fs.writeFile(this.#jsonDataFileName, resStr, (err) => {
            if (err) {
                console.error(err);
            } else {
                console.log("Successfully wrote airports.json file.");
            }
        });

        return airports;
    };

    /**
    *
    * @param {*} airports
    * @returns
    */
    #scanAndRefineAirports(airports) {
        return airports.filter(
            (a) =>
                a.type !== "heliport" &&
                a.type !== "closed" &&
                a.type !== "small_airport" &&
                a.country.toLowerCase() == "us",
        );
    }
};


module.exports = AirportController;
