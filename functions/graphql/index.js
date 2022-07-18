const { ApolloServer, gql } = require('apollo-server-lambda')

const typeDefs = gql`
  type Query {
    todos:[Todo]
   }
   type Todo{
    id: ID!
    text: String!
    done: Boolean!
   }
   type Mutation {
    addTodo(text: String!): Todo
    updateTodoDone(id: ID!): Todo
   }
  `;
  const todos={};
var todoIndex=0;
const resolvers = {
  Query: {
    todos:(parent,args,{user})=>{
      console.log('i am user',user);
      if(!user){
        return [];
      }
      else{
        return Object.values(todos);
    
      }
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
    context:({context})=>{
      if(context.clientContext.user){
        return {user:context.clientContext.user.sub};
    
      }
      else {
        return {};
      }
    },
    playground:true,
    introspection:true,
  });
  const graphqlHandler = server.createHandler({
    cors:{
      origin:"*",
      credentials:true
    }
  });
  if (!event.requestContext) {
      event.requestContext = context;
  }
  return graphqlHandler(event, context);
}

exports.handler = getHandler;



