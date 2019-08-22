const router = require("express").Router();
const bcrypt = require("bcryptjs");

const Users = require("../users/users-model");

//Creates a user using the information sent inside the body of the request. Hash the password before saving the user to the database.
router.post("/register", (req, res) => {
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 13);
  user.password = hash;

  Users.add(user)
    .then(savedUser => {
      res.status(201).json(savedUser);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

//Use the credentials sent inside the body to authenticate the user. On successful login, create a new session for the user and send back a 'Logged in' message and a cookie that contains the user id. If login fails, respond with the correct status code and the message: 'You shall not pass!'
router.post("/login", (req, res) => {
  let { username, password } = req.body;
  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        req.session.username = user.username;
        res.status(200).json({ message: `Logged in as ${user.username}` });
      } else {
        res.status(401).json({ message: "You shall not pass!" });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

router.get("/logout", (req, res) => {
  req.session.destroy(error => {
    res.status(200).json({ message: "Later homie!" });
  });
});

module.exports = router;
