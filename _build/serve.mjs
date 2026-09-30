import http from "http"; import fs from "fs"; import path from "path"; import url from "url";
const MIME={".html":"text/html;charset=utf-8",".css":"text/css;charset=utf-8",".js":"text/javascript;charset=utf-8",".webp":"image/webp",".svg":"image/svg+xml",".woff2":"font/woff2",".mp4":"video/mp4",".txt":"text/plain",".json":"application/json"};
http.createServer((req,res)=>{
  let p=decodeURIComponent(url.parse(req.url).pathname);
  if(p.endsWith("/"))p+="index.html";
  const fp=path.join(process.cwd(),p);
  fs.readFile(fp,(e,b)=>{ if(e){res.writeHead(404);return res.end("404 "+p);} res.writeHead(200,{"Content-Type":MIME[path.extname(fp)]||"application/octet-stream","Cache-Control":"no-store"}); res.end(b); });
}).listen(8422,()=>console.log("serving :8422"));
