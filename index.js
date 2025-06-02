require('dotenv').config();
const Snoway = require('./source/structures/client/index')
const client = new Snoway() 
module.exports = client

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => res.send('Bot is running!'));

app.listen(port, () => console.log(`Web server listening on port ${port}`));


process.on("uncaughtException", (e) => {
      if (e.code === 50013) return;
       if (e.code === 50001) return;
       if (e.code === 50035) return;
       if (e.code === 10062) return;
     
       console.log(e)
   })
