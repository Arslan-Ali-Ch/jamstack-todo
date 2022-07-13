import React, { useEffect } from "react";
import { Button, Container, Flex, Heading } from "theme-ui";
import netlifyIdentity from 'netlify-identity-widget';
const Index=()=>{
  useEffect(()=>{
    netlifyIdentity.init({});
  },[])
    return(
        <div>
          <Container>
            <Flex sx={{flexDirection:'column',padding:3,gap:2}}>
                <Heading as="h1">TODO</Heading>
                <Button onClick={()=>{netlifyIdentity.open()}}>login</Button>
            </Flex>
          </Container>
        </div>
    )
}
export default Index;