const { ApolloServer, gql } = require('apollo-server-lambda')

const typeDefs = gql`
  type Query {
    todos:[Todo]!
   }
   type Todo{
    id:ID!
    text:String!
    done:Boolean!
   }
   type Mutation {
    addTodo(text!):Todo
    updateTodoDone(id:ID!):Todo
   }
  `;
  const todos={};
var todoIndex=0;
const resolvers = {
  Query: {
    todos:()=>{
      return Object.values(todos);
    }  
  
  },
  Mutation:{
    addTodo:(_,{text})=>{
      todoIndex++;
      const id=`Key-${todoIndex}`;
      todos[id]={id,text,done:false};
      return todos[id];

    },

  updateTodoDone:(_,{id})=>{
    todos[id].done=true;
    return todos[id];
  }
  }
  
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



