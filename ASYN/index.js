const fs =require('fs');

const superagent =require('superagent');

fs.readFile(`${__dirname}/dog.txt`,(err,data)=>{
  console.log(`Species: ${data}`);

  superagent.get(`https://dog.ceo/api/breeds/image/random`).end((err,res)=>{
    if(err){
      return(
      console.log(err.message)
      )~~
    }
    console.log(res.body)

    fs.writeFile('dog-img.txt',res.body.message,err=>{
      console.log('Random dog image saved to file')
    })

  })
})