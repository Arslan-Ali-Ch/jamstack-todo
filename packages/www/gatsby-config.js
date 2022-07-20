require("dotenv").config({
    path: `.env.${process.env.NODE_ENV}`,
  })

module.exports={
    plugins:[
        {
            resolve:'gatsby-plugin-create-client-paths',
            options:{prefixes:['/app/*']}
        },
        {
            resolve: `gatsby-source-custom`,
            options: {
              apiKey: process.env.FAUNA_DB,
            },
          },
    ]
}