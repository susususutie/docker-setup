const express = require('express')

const app = express()
// 有效 token 及查询数据，暂时写死，实际应该从数据库来
const tokens = ['foo', 'bar', 'baz']
const repos = [
  { name: 'express', url: 'https://github.com/expressjs/express' },
  { name: 'stylus', url: 'https://github.com/learnboost/stylus' },
  { name: 'cluster', url: 'https://github.com/learnboost/cluster' },
]
const users = [{ name: 'tobi' }, { name: 'loki' }, { name: 'jane' }]
const userRepos = {
  tobi: [repos[0], repos[1]],
  loki: [repos[1]],
  jane: [repos[2]],
}

function error(status, msg) {
  const err = new Error(msg)
  err.status = status
  return err
}

app.use('/api', function (req, res, next) {
  // http://localhost:3000/api/users?token=foo
  const queryToken = req.query.token
  // curl -H 'Auth-Token:foo' http://localhost:3000/api/users, key值会自动转换成小写
  const headerToken = req.headers['auth-token']
  const userToken = queryToken || headerToken

  if (!userToken) return next(error(400, '必须传入 Token'))

  if (!tokens.includes(userToken)) return next(error(401, 'Token 无效，请登录'))

  req.key = userToken // 可以存起来方便后续使用
  next()
})

// example:
// curl http://localhost:3000/api/users?token=foo
// curl -H 'Auth-Token:foo' http://localhost:3000/api/users
app.get('/api/users', function (req, res) {
  res.send(users)
})

// example:
// curl http://localhost:3000/api/repos/?token=foo
// curl -H 'Auth-Token:foo' http://localhost:3000/api/repos/?token=foo
app.get('/api/repos', function (req, res) {
  res.send(repos)
})

// example:
// curl http://localhost:3000/api/user/tobi/repos/?token=foo
// curl -H 'Auth-Token:foo' http://localhost:3000/api/user/tobi/repos
app.get('/api/user/:name/repos', function (req, res, next) {
  const name = req.params.name
  const user = userRepos[name]

  if (user) res.send(user)
  else next()
})

app.use(function (err, req, res, next) {
  res.status(err.status || 500)
  res.send(err.message)
})

app.use(function (req, res) {
  res.status(404)
  res.send('Not Found')
})

if (require.main) {
  app.listen(3000)
  console.log('Express started on port 3000')
}
