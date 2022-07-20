const { ApolloServer, gql } = require('apollo-server-lambda')
const faunadb=require('faunadb');
const q=faunadb.query;

var client=new faunadb.Client({secret:process.env.FAUNA_DB});


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
    updateTodoDone(id: ID!,done: Boolean): Todo
   }
  `;
  const todos={};
var setDone=false;
const resolvers = {
  Query: {
    todos:async (parent,args,{user})=>{
      console.log('i am user',user);
      // if(!user){
      //   return [];
      // }
      
        const results= await client.query(
          q.Paginate(q.Match(q.Index("todos_by_user"),user))
        );
        return results.data.map(([ref,text,done])=>({
          id:ref.id,
          text,
          done
        }));
    
      
    }  
  
  },
  Mutation:{
    addTodo:async (_,{text},{user})=>{
      // if(!user){
      //   throw new Error("Must be authenticated");
      // }
      const results=await client.query(
        q.Create(q.Collection("todos"),{
          data:{
            text,
            done:setDone,
            owner:user
          }
        })
      );
      return {
        ...results.data,
        id:results.ref.id
      };

    },

  updateTodoDone:async(_,{id},{done})=>{
    
 
    // if(!user){
    //   throw new Error("Must be authenticated");
    // }
    const results=await client.query(
      q.Update(q.Ref(q.Collection("todos"),id),{
        data:{done:done
        }
      })
    );
    return{
      ...results.data,
      id:results.ref.id
    };

  }
  }
  
}



 const getHandler = (event, context) => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    // context:({context})=>{
    //   if(context.clientContext.user){
    //     return {user:context.clientContext.user.sub};
    
    //   }
    //   else {
    //     return {};
    //   }
    // },
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



