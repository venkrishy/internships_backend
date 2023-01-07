import {scrape} from './scrape_page'
import express from 'express'
const app = express()
var cors = require('cors')

app.use(cors())

app.get('/', async (req, res) => {
  const results = await scrape("https://github.com/pittcsc/Summer2023-Internships");
  res.send(results);
});

var port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
