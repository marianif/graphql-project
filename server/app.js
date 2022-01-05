const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const schema = require("./schema/schema");
const mongoose = require("mongoose");
// const schema = require("./schema/types_schema");
const app = express();

mongoose.connect(
  "mongodb+srv://marianif:GTG17daoU4mUFwEy@cluster0.sl4t0.mongodb.net/graphql-course?retryWrites=true&w=majority"
);
mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB instance");
});

app.use(
  "/graphql",
  graphqlHTTP({
    graphiql: true,
    schema,
  })
);

app.listen(4000, () => {
  console.log("Listening for request on port 4000");
});
