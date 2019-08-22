const server = require("./server.js");

const PORT = process.env.PORT || 5001;

server.listen(PORT, () => {
  console.log(`Aye Capn. Listening on port ${PORT}...`);
});
