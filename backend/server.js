const app = require("./app");

const dotenv = require("dotenv");
const connectDatabase = require("./config/database");

// this is uncaughtException error code you can use this anywhere----
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("shutting down the server doe to uncaughtException");

  process.exit(1);
});


// config
dotenv.config({ path: "backend/config/.env" });

connectDatabase();

const server = app.listen(process.env.PORT, () => {
  console.log(`server is working on http://localhost:${process.env.PORT}`);
});

// this is unhandledRejection error code you can use this anywhere----
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(
    "shutting down the server doe to unhandledRejection promise Rejection"
  );

  server.close((err) => {
    process.exit(1);
  });
});
