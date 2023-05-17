const fs = require("fs");
const server = require("http").createServer();

server.on("request", (req, res) => {
  
// Solution 1 Stream

  // fs.readFile('./txt/final.txt',(err,data)=>{
  //   if(err)console.log(err);
  //   res.end(data)
  // })




  // Sloution 2 Stream

  const readble = fs.createReadStream("./txt/final.txt");

  readble.on("data", (chunk) => {
    res.write(chunk);
  });

  readble.on("end", () => {
    res.end();
  });
  readble.on("error", err => {
    console.log(err);
    res.statusCode=500;
    res.end("File not found");
  });
});

// Solution 3

  //  const readble = fs.createReadStream("./txt/final.txt");

  //  readble.pipe(res)




server.listen(8000, "127.0.0.1", () => {
  console.log("Listening ....");
});
