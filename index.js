'use strict'

const  express = require('express');
const app = express();

var csv = require('csv');
var xlsx = require('node-xlsx');
var fs = require('fs');

let PORT = 8080;
let HOST = 'localhost';

// xlsx to csv file creation //

var obj = xlsx.parse('./Corpus.CSV.XLSX'); 
var rows = [];
var writeStr = "";

for(var i = 0; i < obj.length; i++)
{
    var sheet = obj[i];
    for(let j = 0; j < sheet['data'].length; j++)
    {
         rows.push(sheet['data'][j]);
    }
}

for(let i = 0; i < rows.length; i++)
{
    writeStr += rows[i].join(",") + "\n";
}


fs.writeFile("./sample.csv", writeStr, function(err) {
    if(err) {
        return console.log(err);
    }
});

console.info( "csv file is loaded in "+__dirname);
// converting csv to json && express server //

var obj = csv();

var Mydata = [];
var MyJson = {};



obj.from.path('./sample.csv').to.array(function(data){

    for( let index = 1; index < data.length;index++){
      Mydata.push(data[index]);

    }
     
    for(let i = 0 ;i<Mydata.length;i++){
       let tag = Mydata[i];
       MyJson[''+Mydata[i][0]] =  {key: Mydata[i][0], value : Mydata[i][1]}
    
    }
    

        app.get('/', function(req,res){
        res.send(JSON.stringify(MyJson));
       
        res.status(404).send('Sorry, we cannot find !');
        res.status(500).send({ error: 'Internal ServerError' });

        })

    console.log("Api Resources ....\n\n");

    for (let i = 0 ;i<Mydata.length;i++)
    {
        app.get('/'+Mydata[i][0], function(req,res){
        res.send(JSON.stringify(MyJson[''+Mydata[i][0]]));
        })

        console.log(`Running on http://${HOST}:${PORT}/`+Mydata[i][0]);
    }


    fs.writeFile("./App.json", JSON.stringify(MyJson), function(err) {
      if(err) {
          return console.log(err);
      }
      console.log("App.json was created for Testing the data!");
    });
})


app.listen(PORT ,HOST)
console.log(`Running on http://${HOST}:${PORT}\n`);