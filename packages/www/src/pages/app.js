import React, { useContext, useReducer, useRef, useState } from 'react'
import {Router,Link} from "@reach/router";
import netlifyIdentity from "netlify-identity-widget"
import { IdentityContext } from "../../identity-context";
import { 
    Container,
    Flex,
    NavLink,
    Button,Heading,
    Input,Label, Checkbox
} from 'theme-ui';

const todosReducer=(state,action)=>{
    switch(action.type){
        case "addTodo":
            return [{done:false,value:action.payload},...state]
        case "toggleTodo":
            const newState=[...state];
            newState[action.payload]={
                done:!state[action.payload].done,
                value:state[action.payload].value
            }
            return newState;
        }
}
const Dash=()=>{
    const { user,netlifyIdentity }=useContext(IdentityContext);
    const inputRef=useRef();
    const [todos,dispatch]=useReducer(todosReducer,[]);
   
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
        <Flex as="form" onSubmit={e=>{
            e.preventDefault();
            dispatch({type:"addTodo",payload:inputRef.current.value})
            inputRef.current.value="";
        }}>
            <Label  >
                <span>Add &nbsp; Todo</span>
                
                <Input sx={{marginLeft:1}} ref={inputRef}></Input>
                </Label>
            <Button sx={{marginLeft:1}}>Submit</Button>
            
        </Flex>
        <Flex sx={{flexDirection:'column'}}>
            <ul sx={{listStyleType:'none'}}>
                {todos.map((todo,index)=>(
                    <Flex key={index} as="li" onClick={()=>{
                        dispatch({
                            type:"toggleTodo",
                            payload:index
                        });
                    }}>
                        <Checkbox onChange={()=>{}} checked={todo.done}/>
                        <span>{todo.value}</span>
                    </Flex>
                ))}
            </ul>
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