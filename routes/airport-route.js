/* eslint-disable new-cap */
const {Router} = require("express");
const AiportController = require("../controllers/airports-controller");

/**
 * API Route to Airports Controller.
 */
class AirportRoute {
    path;
    router;
    airportController;
    #logger;

    /**
     * Creates instance of `AirportRoute`.
     */
    constructor(logger) {
        this.path = "/airports";
        this.router = Router();
        this.#logger= logger;
        this.airportController = new AiportController(this.#logger);
        this.#initializeRoute();
    }

    /**
     * Initializes Route
     */
    #initializeRoute() {
        this.#logger.info(`Initializing ${this.constructor.name}'s route.`);

        this.router
            .route(`${this.path}`)
            .get(this.airportController.getAllAirports);
        this.#logger.info(`Completed initializing ${this.constructor.name}'s route.`);
    }
}

module.exports = AirportRoute;
