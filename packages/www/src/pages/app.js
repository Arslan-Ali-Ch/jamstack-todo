import React, { useContext,  useRef} from 'react'
import {Router,Link} from "@reach/router";
import { IdentityContext } from "../../identity-context";
import {gql,useMutation,useQuery} from "@apollo/client";
import { 
    Container,
    Flex,
    NavLink,
    Button,
    Input,Label, Checkbox
} from 'theme-ui';

const ADD_TODO=gql`
mutation AddTodo($type:String!){
    addTodo(text:"one todo"){
        id
    }
}
`;
const UPDATE_TODO_DONE=gql`
mutation UdateTodoDone($id:ID!){
    updateTodoDone(id:$id){
        text
        done
    }
}
`;


const GET_TODOS=gql`
query GetTodos{
    todos{
        id
        text
        done
    }
}
`;


// const todosReducer=(state,action)=>{
//     switch(action.type){
//         case "addTodo":
//             return [{done:false,value:action.payload},...state]
//         case "toggleTodo":
//             const newState=[...state];
//             newState[action.payload]={
//                 done:!state[action.payload].done,
//                 value:state[action.payload].value
//             }
//             return newState;
//         }
// }
const Dash=()=>{
    const { user,netlifyIdentity }=useContext(IdentityContext);
    const inputRef=useRef();
   // const [todos,dispatch]=useReducer(todosReducer,[]);
   const [addTodo]=useMutation(ADD_TODO);
   const [updateTodoDone]=useMutation(UPDATE_TODO_DONE);
   const {loading,error,data,refetch}=useQuery(GET_TODOS)
    return(
    <Container>
        <Flex as="nav">
            <NavLink as={Link} to="/" p={2}>
                Home
            </NavLink>
            <NavLink as={Link} to={"/app"} p={2}>
                DashBoard
            </NavLink>
            {
                user && (
                    <NavLink
                    onClick={()=>{
                        netlifyIdentity.logout();
                    }} 
                    href='#!' p={2}>
                log out {user.user_metadata.full_name}
            </NavLink>
                )
            }
        </Flex>
        <Flex as="form" onSubmit={async e=>{
            e.preventDefault();
            await addTodo({variables:{text:inputRef.current.value}})
            inputRef.current.value="";
            await refetch();
        }}>
            <Label  >
                <span>Add &nbsp; Todo</span>
                
                <Input sx={{marginLeft:1}} ref={inputRef}></Input>
                </Label>
            <Button sx={{marginLeft:1}}>Submit</Button>
            
        </Flex>
        <Flex sx={{flexDirection:'column'}}>
            {loading ? <div>loading...</div>:null}
            {error ?<div>{error.message}</div>:null}
          {
            !loading && !error &&(
                <ul sx={{listStyleType:'none'}}>
                {data.todos.map((todo)=>(
                    <Flex key={todo.id} as="li" onClick={async()=>{
                       await updateTodoDone({variables:{id:todo.id}})
                        await refetch();
                    }}>
                        <Checkbox onChange={()=>{}} checked={todo.done}/>
                        <span>{todo.value}</span>
                    </Flex>
                ))}
            </ul>
            )
          }
        </Flex>
    </Container>
        );
};

export default props=>{
    return(
        <Router>
            <Dash path='/app'></Dash>
        </Router>
        
    );
};