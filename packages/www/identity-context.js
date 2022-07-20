const React = require('react');
const netlifyIdentity = require('netlify-identity-widget');
const IdentityContext=React.createContext({});
const {useEffect}=require('react');
const {useState}=require('react');

exports.IdentityContext=IdentityContext;
const IdentityProvider=props=>{
    const [user,setUser]=useState();
    const [done,setDone]=useState(false);

    useEffect(()=>{
      netlifyIdentity.init({});
    
    },[]);
    netlifyIdentity.on("login",data=>{
      netlifyIdentity.close();
      setUser(data);
  //    console.log(user.user_metadata.full_name);
    });
    netlifyIdentity.on("logout",()=>{
      setUser();
    });

    return (
        <IdentityContext.Provider value={{netlifyIdentity:netlifyIdentity,
        user:user,done,setDone}}>
            {props.children}
        </IdentityContext.Provider>
    )
}
exports.Provider=IdentityProvider;