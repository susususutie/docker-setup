import url from "node:url";
import http from "node:http";
import fs from "node:fs/promises";

const server = http.createServer((req, res) => {
  // 获取url的各个部分
  // url.parse可以将req.url解析成一个对象
  // 里面包含有pathname和querystring等
  const urlObject = url.parse(req.url);
  const { pathname } = urlObject;

  // api开头的是API请求
  if (pathname.startsWith("/api")) {
    // 再判断路由
    if (pathname === "/api/users") {
      const method = req.method;
      if (method === "GET") {
        res.setHeader("Content-Type", "application/json");
        (async () => {
          const resData = await fs.readFile("./data.json", { encoding: "utf-8" });
          let jsonData;
          try {
            jsonData = JSON.parse(resData);
          } catch (error) {
            jsonData = { message: "JSON.parse Error" };
          }
          res.end(JSON.stringify(jsonData) + "\n");
        })();
        return;
      }
      if (method === "POST") {
        (async () => {
          const resData = await fs.readFile("./data.json", { encoding: "utf-8" });
          try {
            const data = JSON.parse(resData);
            data[0].age++;
            await fs.writeFile("./data.json", JSON.stringify(data), { encoding: "utf-8" });
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(data) + "\n");
          } catch (error) {
            res.setHeader("Content-Type", "application/text");
            res.end("Error\n");
          }
        })();
        return;
      }
      console.log(method);
      res.end("200\n");
    }
  }
});

server.listen(3000, () => {
  console.log(`Server is running on http://127.0.0.1:3000/`);
});
