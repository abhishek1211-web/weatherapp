const http = require('http');
const fs = require('fs');

var requests = require('requests');

const appFile = fs.readFileSync("./app.html", "utf-8");

const replaceval=(tempval,orgval)=>{
   let temperature = tempval.replace("{%tempval%}",orgval.main.temp);
    temperature = temperature.replace("{%tempmin%}",orgval.main.temp_min);
    temperature = temperature.replace("{%tempmax%}",orgval.main.temp_max);
    temperature = temperature.replace("{%location%}",orgval.name);
    temperature = temperature.replace("{%country%}",orgval.sys.country);
    temperature = temperature.replace("{%tempstatus%}",orgval.weather[0].main);

   return temperature;
}

// console.log(appFile);

const server = http.createServer((req, res) => {

    if (req.url == "/") {

requests("http://api.openweathermap.org/data/2.5/weather?q=Saharanpur&units=metric&appid=35834226cf612076e62d6f0ec2d6f7f5")
            .on('data', (chunk) =>{
                const objdata = JSON.parse(chunk);
                const arrdata = [objdata];
                // console.log(arrdata[0].main.temp);
 const realTimedata = arrdata.map((val)=>replaceval(appFile,val)).join("");

 res.write(realTimedata);
                
            })
            .on('end',  (err) =>{
                if (err) return console.log('connection closed due to errors', err);

                res.end();
            });
    }


});


server.listen(8000, "127.0.0.1");
