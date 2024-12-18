const express = require('express')
// const session = require('express-session')
const cookieParser = require('cookie-parser')
const path = require('path')
const app = express()

// config

app.set('view engine', 'ejs') // 必须安装ejs模块
app.set('views', path.join(__dirname, 'views'))
// middleware

app.use(express.json())
app.use(cookieParser())

app.get(['/', '/index.html'], function (req, res) {
  const cookieToken = req.cookies['auth-token']
  console.log(req.path)
  if (!cookieToken && req.path !== '/login.html') {
    res.redirect('/login.html')
  }
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

// 设置静态文件目录，例如 public 文件夹
app.use(express.static(path.join(__dirname, 'public')))

// app.use(
//   session({
//     resave: false, // don't save session if unmodified
//     saveUninitialized: false, // don't create session until something stored
//     secret: 'secret key',
//   })
// )

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

// authMiddleware.js
// function isAuthenticated(req, res, next) {
//   // 这里假设你有一个session或者某种方式来存储用户的登录状态
//   // 例如，检查req.session中是否有user属性
//   if (req.session && req.session.user) {
//     // 用户已登录，继续执行下一个中间件或路由处理器
//     return next();
//   }
//   // 用户未登录，重定向到登录页面
//   res.redirect('/login.html');
// }

// // 使用上面创建的鉴权中间件
// app.use(isAuthenticated);

app.use(['/ejs', '/ejs.html'], function (req, res) {
  res.render('ejs', { title: 'Hello World', message: 'This is a test message' })
})

app.get('/logout.html', function (req, res) {
  res.clearCookie('auth-token', { path: '/' })
  res.send(
    '<h1>Cookie cleared, go to <a href="/login.html">Login</a>, or go to <a href="/index.html">Home Page</a></h1>'
  )
})

app.use('/api', function (req, res, next) {
  console.log('/api')

  // 登录接口不鉴权
  if (req.path === '/user/login') {
    next()
    return
  }
  // http://localhost:3000/api/users?token=foo
  const queryToken = req.query.token
  // curl -H 'Auth-Token:foo' http://localhost:3000/api/users, key值会自动转换成小写
  const headerToken = req.headers['auth-token']
  // curl --cookie "auth-token=foo;" http://localhost:3000/api/users
  // 需要使用 cookie-parser 中间件，req.cookies 才有值，否则为空就只能通过 req.header.cookie 拿到 cookie
  const cookieToken = req.cookies['auth-token']
  const userToken = queryToken || headerToken || cookieToken

  if (!userToken) return next(error(400, '必须传入 Token'))

  if (!tokens.includes(userToken)) return next(error(401, 'Token 无效，请登录'))

  req.key = userToken // 可以存起来方便后续使用
  next()
})

// example:
// curl http://localhost:3000/api/users?token=foo
// curl -H 'Auth-Token:foo' http://localhost:3000/api/users
// curl --cookie "auth-token=foo;" http://localhost:3000/api/users
app.get('/api/users', function (req, res) {
  console.log('get /api/users')
  res.status(200).json(users)
})

// example:
// curl http://localhost:3000/api/repos/?token=foo
// curl -H 'Auth-Token:foo' http://localhost:3000/api/repos/?token=foo
// curl --cookie "auth-token=foo;" http://localhost:3000/api/repos
app.get('/api/repos', function (req, res) {
  console.log('get /api/repos')
  res.send(repos)
})

// example:
// curl http://localhost:3000/api/user/tobi/repos/?token=foo
// curl -H 'Auth-Token:foo' http://localhost:3000/api/user/tobi/repos
// curl --cookie "auth-token=foo;" http://localhost:3000/api/user/tobi/repos
app.get('/api/user/:name/repos', function (req, res, next) {
  console.log(`get /api/user/${req.params.name}/repos`)

  const name = req.params.name
  const user = userRepos[name]

  if (user) res.send(user)
  else next()
})

/**
 * 登录校验账密，校验通过后设置cookie，后续可通过cookie校验身份
 * 
 * 登录并打印服务器返回的cookie：
curl -X POST \
     -H 'content-type:application/json' \
     -d '{"username":"admin","password":"pwd"}' \
     --cookie-jar - http://localhost:3000/api/user/login
 */
app.post('/api/user/login', function (req, res, next) {
  console.log('post /api/user/login')
  if (!req.body) {
    res.send(401).json({
      success: false,
      message: '请输入用户名和密码',
    })
    return
  }

  const username = req.body.username
  const password = req.body.password
  // 模拟登录
  if (username === 'admin' && password === 'pwd') {
    res.cookie('auth-token', 'foo')
    res.cookie('test', '123')
    res.cookie('demo', 'asd')
    // res.redirect('/index.html');
    res.status(200).json({
      success: true,
      message: '登陆成功',
      data: 'foo',
    })
  } else {
    res.status(401).json({
      success: false,
      message: '账密错误',
    })
  }
})

app.use(function (err, req, res, next) {
  console.log('err ' + req.path)
  res.status(err.status || 500)
  res.send(err.message)
})

app.use(function (req, res) {
  console.log('404 ' + req.path)
  res.status(404)
  res.send('Not Found\n')
})

if (require.main) {
  app.listen(3000)
  console.log('Express started on port 3000')
}
