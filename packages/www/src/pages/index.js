import React, { useContext, useEffect, useState } from "react";
import { Button, Container, Flex, Heading, NavLink } from "theme-ui";
import netlifyIdentity from 'netlify-identity-widget';
import {Link} from 'gatsby';
import { IdentityContext } from "../../identity-context";

const Index=()=>{
  const {user,netlifyIdentity}=useContext(IdentityContext);
  console.log(user); 
  return(
        <div>
          <Container>
            <Flex as='nav'>
              <NavLink as={Link} to="/" p={2}>Home</NavLink>
              <NavLink as={Link} to="/app" p={2}>DashBoard</NavLink>
             {
             user &&  (
               <NavLink p={2}>{user.user_metadata.full_name}</NavLink>
               )
             }
            </Flex>
            <Flex sx={{flexDirection:'column',padding:3,gap:2}}>
                <Heading as="h1">TODO</Heading>
                <Button onClick={()=>{netlifyIdentity.open()}}>login</Button>
                <Button  onClick={()=>{netlifyIdentity.logout()}}>logout</Button>
            
            </Flex>
          </Container>
        </div>
    )
}
export default Index;