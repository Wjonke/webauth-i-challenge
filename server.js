const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const session = require("express-session");
const KnexSessionStore = require("connect-session-knex")(session);

//Routers get made here
const UsersRouter = require("./users/users-router");
const AuthRouter = require("./auth/auth-router");
const knexConnection = require("./data/db-config");

const server = express();

const sessionOptions = {
  name: "notsession",
  secret: process.env.COOKIE_SECRET || "I'm not telling",
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: process.env.COOKIE_SECURE || false,
    maxAge: 1000 * 60 * 60,
    httpOnly: true
  },
  store: new KnexSessionStore({
    knex: knexConnection,
    createtable: true,
    clearInterval: 1000 * 60 * 60
  })
};

server.use(helmet());
server.use(cors());
server.use(express.json());
server.use(session(sessionOptions));

//Use routers here
server.use("/api/users", UsersRouter);
server.use("/api/auth", AuthRouter);

server.get("/", (req, res) => {
  res.json({ api: "up", session: req.session });
});

module.exports = server;
