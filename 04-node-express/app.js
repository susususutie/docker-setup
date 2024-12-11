const express = require('express')
const app = express()
const port = 3000

const path = require('path')

// app.use(express.static('public'))
// curl http://localhost:3000/index.css

// app.use('/static', express.static('public'))
// 使用绝对路径
app.use('/static', express.static(path.join(__dirname, 'public')))
// curl http://localhost:3000/static/index.css

app.get('/', (req, res) => {
  res.send('Hello World!\n')
})

app.put('/user', (req, res) => {
  res.send('Got a PUT request at /user\n')
})

app.delete('/user', (req, res) => {
  res.send('Got a DELETE request at /user\n')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
