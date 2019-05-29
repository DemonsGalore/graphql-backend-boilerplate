const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const schemaDirectives = require('./graphql/directives');

const {
  mongoURI,
  inProduction,
  sessionID,
  sessionSecret,
  sessionLifetime,
} = require('./config/keys');

// ExpressServer initialization
const app = express();
app.disable('x-powered-by');

app.use(session({
  store: new MongoStore({ url: mongoURI }),
  name: sessionID,
  secret: sessionSecret,
  resave: true, rolling: true, // resave session and update cookie
  saveUninitialized: false,
  cookie: {
    maxAge: sessionLifetime,
    sameSite: true,
    secure: inProduction
  }
}));

// ApolloServer initialization
const server = new ApolloServer({
  typeDefs,
  resolvers,
  schemaDirectives,
  playground: inProduction ? false : {
    settings: {
      'request.credentials': 'include'
    }
  },
  context: ({ req, res }) => ({ req, res })
});
server.applyMiddleware({ app, cors: false });

// connect to MongoDB
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('MongoDB connected.');
    // start server
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () =>
      console.log(`Server started at http://localhost:${PORT}${server.graphqlPath}`));
  })
  .catch(error => console.log("Error", error));
