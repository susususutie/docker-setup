import url from "node:url";
import http from "node:http";
import fs from "node:fs/promises";
import { init, close, getItems, storeItem } from "./sqlite.js";

const setup = async () => {
  try {
    await init();
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
              const resData = await getItems();
              res.end(JSON.stringify(resData) + "\n");
            })();
            return;
          }
          if (method === "POST") {
            (async () => {
               await storeItem({
                id: Math.floor(Math.random() * 100000),
                name: Math.random().toString(34),
                male: Math.random() > 0.5,
              });
              const resData = await getItems();
              try {
                res.end(JSON.stringify(resData) + "\n");
              } catch (error) {
                res.setHeader("Content-Type", "application/text");
                res.end("Error\n");
              }
            })();
            return;
          }
          console.log(method);
        }
      }
      res.end("ok");
    });

    server.listen(3000, () => {
      console.log(`Server is running on http://127.0.0.1:3000/`);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

setup()