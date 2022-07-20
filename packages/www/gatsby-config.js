require("dotenv").config({
    path: `.env.${process.env.FAUNA_DB}`,
  })

module.exports={
    plugins:[
        {
            resolve:'gatsby-plugin-create-client-paths',
            options:{prefixes:['/app/*']}
        },
      
    ]
}