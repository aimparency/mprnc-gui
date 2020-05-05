const express = require('express')
const app = express()
const port = 3000

app.use(express.static('dist', {
  setHeaders: (res, path) => {
    res.set("Cache-Control", "no-cache")
  }
}))

app.listen(8000)
