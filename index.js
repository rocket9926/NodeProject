// const { log } = require("console");
// const fs = require("fs");
// var http = require("http");

// const url = require("url");

// // const textIn=fs.readFileSync('./txt/input.txt','utf8');
// // console.log(textIn)

// // const textOpt =`Hello  from My side: ${textIn} and ${Date.now()}`;

// // fs.writeFileSync('./txt/Output.txt',textOpt);

// // console.log('File Writeen');

// // Non-Blocking async Function

// // fs.readFile ('./txt/input.txt','utf8',(err,data)=>{
// //   // console.log(data.toString());
// //   console.log(data);
// // })

// // console.log('Hello Jonas');

// // fs.readFile('./txt/Start.txt','utf8',(err,data)=>{
// //   fs.readFile(`./txt/${data}.txt`,'utf8',(err,data1)=>{
// //     console.log(data1);
// //     fs.readFile(`./txt/input.txt`,'utf8',(err,data2)=>{
// //       console.log(data2)
// //       fs.writeFile('./txt/final.txt',`${data1}\n ${data2}`,(err)=>{
// //        console.log('Your file is written😉');
// //       }
// //       )
// //     })
// //   })
// // })

// // console.log('Before we create the file')

// // Creating A Server

// const replaceTemplate =(temp,product)=>{
//   let output=temp.replace(/{%PRODUCTNAME%}/g,product.productName);

//   output.replace(/{%IMAGE%}/g,product.image)
//   output.replace(/{%PRICE%}/g,product.price)
//   output.replace(/{%FROM%}/g,product.from)
//   output.replace(/{%NUTRIENTS%}/g,product.nutrients)
//   output.replace(/{%QUANTITY%}/g,product.quantity)
//   output.replace(/{%DESCRIPTION%}/g,product.description)
//   output.replace(/{%ID%}/g,product.id)

//   if(!product.organic){
//     output.replace(/{%NOT_ORGANIC%}/g,'not-organic')
//   }
//   return output;
// }

// const overviewTemp = fs.readFileSync(
//   `${__dirname}/Template/overview.html`,
//   "utf8"
// );
// const productTemp = fs.readFileSync(
//   `${__dirname}/Template/product.html`,
//   "utf8"
// );
// const cardTemp = fs.readFileSync(`${__dirname}/Template/card.html`, "utf8");

// const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf8");
// const dataObj = JSON.parse(data);



// const server = http.createServer((req, res) => {

//   console.log(req.url);
//   console.log(url.parse(req.url,true));
//   const pathName = req.url;


//   // OverView Page
//   if (pathName === "/" || pathName === "/overview") {
//     res.writeHead(200, {
//       "Content-type": "text/html",
//     });

    

//     res.end(overviewTemp);
//   }
//   // Product Page
//   else if (pathName === "/product") {
//     res.writeHead(404, {
//       "Content-type": "text/html",
//       "my-own-header": "hello-world",

//     });

//     const cardHtml=dataObj.map(el=> replaceTemplate(productTemp,el))

//     console.log(cardHtml)
//     res.end(productTemp);
//   }
//   // API
//   else if (pathName === "/api") {
//     res.writeHead(200, {
//       "Content-type": "application/json",
//     });

//     res.end(data);
//   }

//   // Page Not Found
//   else {
//     res.writeHead(404, {
//       "Content-type": "text/html",
//       "my-own-header": "hello-world",
//     });
//     res.end(`<h1>Page not Found!</h1>`);
//   }
// });

// server.listen(8000, "127.0.0.1", () => {
//   console.log("Listen request from 8000 port");
// });
const fs = require('fs');
const http = require('http');
const url = require('url');
const slugify = require('slugify');
const replaceTemplate = require('./Module/replaceTemplate');

/////////////////////////////////
// FILES

// Blocking, synchronous way
// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
// console.log(textIn);
// const textOut = `This is what we know about the avocado: ${textIn}.\nCreated on ${Date.now()}`;
// fs.writeFileSync('./txt/output.txt', textOut);
// console.log('File written!');

// Non-blocking, asynchronous way
// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
//   if (err) return console.log('ERROR! 💥');

//   fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//     console.log(data2);
//     fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
//       console.log(data3);

//       fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', err => {
//         console.log('Your file has been written 😁');
//       })
//     });
//   });
// });
// console.log('Will read file!');

/////////////////////////////////
// SERVER
const tempOverview = fs.readFileSync(
  `${__dirname}/Template/overview.html`,
  'utf-8'
);
const tempCard = fs.readFileSync(
  `${__dirname}/Template/card.html`,
  'utf-8'
);
const tempProduct = fs.readFileSync(
  `${__dirname}/Template/product.html`,
  'utf-8'
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);     
const slugs = dataObj.map(el => slugify(el.productName, { lower: true }));
console.log(slugs);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  // Overview page
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, {
      'Content-type': 'text/html'
    });

    const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
    res.end(output);

    // Product page
  } else if (pathname === '/product') {
    res.writeHead(200, {
      'Content-type': 'text/html'
    });
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);

    // API
  } else if (pathname === '/api') {
    res.writeHead(200, {
      'Content-type': 'application/json'
    });
    res.end(data);

    // Not found
  } else {
    res.writeHead(404, {
      'Content-type': 'text/html',
      'my-own-header': 'hello-world'
    });
    res.end('<h1>Page not found!</h1>');
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log('Listening to requests on port 8000');
});



// Event Loop
const timeoutScheduled = Date.now();

setTimeout(() => {
  const delay = Date.now() - timeoutScheduled;

  console.log(`${delay}ms have passed since I was scheduled`);
}, 0);


console.log('First');

fs.readFile('./txt/Output.txt',()=>{
  console.log('second')
});

console.log('third')


// MicroTask Queues

// console.log('First MicroTask');

// process.nextTick (()=>console.log('this is next task'));
// console.log('third task');
// console.log('Fourth Task');


// Timer Queues

setTimeout(()=>console.log('First Timer'),0)
setTimeout(()=>{
  console.log('This is second timeOut');
  process.nextTick(()=>{
    console.log('This is inner timeOut ')
  })
})
setTimeout(()=>console.log('3 Timer'),0)


process.nextTick(()=>console.log('this is nextTick 1'));

process.nextTick (()=>{
  console.log('this is next task 2');
  process.nextTick (()=>
  console.log('This is innner nextTick'))
})
process.nextTick(()=>console.log('this is nextTick 3'));

Promise.resolve().then (()=>console.log('thi is 1 Resolve'));
Promise.resolve().then (()=>{
  console.log('this is next Resolve 2');
  Promise.resolve().then (()=>
  console.log('This is innner Resolve'))
})
Promise.resolve().then(()=>console.log('this is resolve 3'));


setImmediate(()=>console.log('This is SetImmediate Fun'))