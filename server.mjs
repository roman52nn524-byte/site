import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve, extname} from 'node:path';
const root = import.meta.dirname;
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml'};
http.createServer(async(req,res)=>{
  try {
    const path=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    const file=resolve(root,'.'+(path==='/'?'/index.html':path));
    if(!file.startsWith(root+'/') || !['.html','.css','.js','.svg'].includes(extname(file))) {res.writeHead(404);res.end('Not found');return;}
    const body=await readFile(file);res.writeHead(200,{'Content-Type':types[extname(file)],'X-Content-Type-Options':'nosniff'});res.end(body);
  } catch {res.writeHead(404);res.end('Not found');}
}).listen(process.env.PORT||3000,'0.0.0.0',()=>console.log('Piro Family running on port '+(process.env.PORT||3000)));
