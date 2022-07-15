const { ApolloServer, gql } = require('apollo-server-lambda')

const typeDefs = gql`
  type Query {
    hello: String 
   }
  `;

const resolvers = {
  Query: {
    hello: () => 'Hello, world!',
  
  },
}



 const getHandler = (event, context) => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    playground:true,
    introspection:true,
  });
  const graphqlHandler = server.createHandler();
  if (!event.requestContext) {
      event.requestContext = context;
  }
  return graphqlHandler(event, context);
}

exports.handler = getHandler;



