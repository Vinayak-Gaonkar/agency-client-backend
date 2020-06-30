const config = require("./config/default.config");

const express = require("express");

const app = express();

const bodyParser = require("body-parser");

const swaggerUi = require("swagger-ui-express");

const swaggerJsdoc = require("swagger-jsdoc");
const path = require("path");
const passport = require("passport");
const cookieSession = require("cookie-session");
var cookieParser = require("cookie-parser");
app.use(bodyParser.json());
app.use(
  cookieSession({
    maxAge: 20 * 60 * 60 * 1000,
    keys: [config.cookies.key],
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(function (req, res, next) {
  // console.log("sessiom",req.session);

  res.header(
    "Access-Control-Allow-Origin",
    process.env.NODE_ENV ? config["frontEndpoint"] : config["prodfrontEndPoint"]
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Credentials", true);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

// const AuthorizationRouter = require("./app/routes/auth.routes");

const AgencyRouter = require("./app/routes/agency.router");


const Ajv = require("ajv");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

let router = express.Router();
// let passAuth = AuthorizationRouter.routesConfig(router);
let agencyRoutes = AgencyRouter.routesConfig(router);

app.use("/api", [agencyRoutes]);

// Swagger definition

const swaggerDefinition = {
  info: { // API informations (required)
    swagger: '2.0',
    title: 'Test', // Title (required)
    version: 1.0, // Version (required)
    description: 'Saheli API Documentation List', // Description (optional)
  },
  // Path to the API docs
  host: config.host,
  basePath: "/",
  schemes: ["http", "https"],
  securityDefinitions: {
    JWT: {},
  },
  produces: "application/json"
};
const swaggerSpec = swaggerJsdoc({ swaggerDefinition: swaggerDefinition, apis: ['./app/routes/*.js'] });

app.get("/api-docs.json", function (req, res) {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/images", express.static(path.join(__dirname, "/public/images")));
app.on("listening", function () {
  console.log("ok, server is running", process.env);
});
app.listen(config.port, function () {
  console.log("app listening at port %s", config.port, process.env.NODE_ENV);
});
