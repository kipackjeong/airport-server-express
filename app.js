const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const dotenv = require("dotenv");
const pino = require("express-pino-logger");
const prettifier = require("pino-colada");
const AirportRoute = require("./routes/airport-route");

/**
 * Express App class.
 */
class App {
    #app;
    #logger;
    routes;
    port;
    env;
    /**
 * Create instance of `App`.
 */
    constructor() {
        this.#app = express();
        this.#app.get("/", (req, res) => {
            res.status(200).json({message: "successfully connected to server."});
        });
        this.#logger = pino({
            prettifier,
        }).logger;

        dotenv.config();

        this.port = process.env.PORT || 3001;
        this.env = process.env.NODE_ENV || "development";

        this.#initializeDependencies();

        this.#initializeRoutes();
    }

    /**
 * Initializes Dependencies needed for the app.
 */
    #initializeDependencies() {
        this.#logger.info("Initializing dependencies");
        this.#app.use(bodyParser.urlencoded({extended: false}));
        this.#app.use(pino());
        this.#app.use(helmet());
        this.#app.use(cors());
        this.#logger.info("Completed initializing dependencies");
    }

    /**
 * Initialize Routes needed for the app.
 */
    #initializeRoutes() {
        this.routes = [new AirportRoute(this.#logger)];


        this.#logger.info("Attaching routes to app");
        this.routes.forEach((route) => {
            this.#app.use("/", route.router);
        });
        this.#logger.info("Completed attaching routes to app");
    }

    /**
 *  Gets the `app=express()` instance.
 * @returns app
 */
    getServer() {
        return this.#app;
    }

    /**
 * Starts the app by listening to the port.
 */
    start() {
        this.#logger.info("Start running application");
        this.#app.listen(this.port, () =>
            this.#logger.info(
                "Express server is running on localhost:" + this.port,
            ),
        );
    }
}

module.exports = App;
