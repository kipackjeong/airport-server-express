const App = require("./app");

try {
    const app = new App();
    app.start();
} catch (e) {
    console.error(e);
}

