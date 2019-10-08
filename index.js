// 1 - Most of NodeJS Code (70% is C/C++ Code - 30% JS Code)

// 2- NodeJS Expose Javascript Standard Libaraies Module For Working With Javascript In Server (Lib Folder ) - (fs - crypto - http - util - ...)

// 3 - NodeJS Bind Js Code To The C++ Implementation By Using process.binding() and connect NodeJS C/C++ with Javascript and serve as a bridge between JS and C/C++ code

// 4 - NodeJS Event Loop is a control structure used by NodeJS to hanlde asyncrounys code

// 5 - When NodeJS run it starts a process with staring the event loop with One Threads To Hanlde Async Code In NodeJS

// 6 - Thread is list of to do unit instructions to be processed

// 7 - Single Process Can Have More Than One Threads And They run with OS Scheduling and it decide which thread to process with running zero events first

// 8 - To Impove The Rate Of Processing Threads is with 2 wayes
// a - Increase CPU CORES (More Cores = More Threads)
// b - Allow The OS Scheduler To Mange Threads

// 9 - NodeJS run the event loop in one thread

// 10 - Event Loop
// a - node File.js
// b - The Content of File.js first get executed and compiled in one file
// c - shouldContinue Function that run after compliling code for NodeJS to start event loop or exit back to terminal
function shouldContiue() {
  //  check for pending Timers (setTimepout(), setInterval(), setImediate())
  //  check for pending OS Tasks (Network Request)
  //  check for pending Long Eunning Operations Tasks (crypto or fs code running)
  let pendingTimers = [];
  let pendingOStasks = [];
  let pendingOperations = [];
  return (
    pendingTimers.length || pendingOStasks.length || pendingOperations.length
  );
}
// d - The Event Loop Is represented as while loop what is excute in one tick with some conditions and if the condition is true after comiling code event loop will execute otherwise NodeJS will exit back to terminal
while (shouldContiue()) {
  // 1 - check for any pending timers and run the callback
  // 2 - check for any pending OSTasks, Operations Tasks and the relevant callback
  // 3 - create a pause phase and check for any callback is done
  // 4 - check for setImediate and run the callback
  // 5 - check for any close events
  // exit back to terminal if there is no other operations
}

// 11 - NodeJS Event loop is single threaded

// 12 - Some of the code running inside nodejs and outside event loop is multi threaded like fs Module or crypto module that uses the pool worker threads or http the delegated to OS To Handle Request and response events
const crypto = require("crypto");
const fs = require("fs");
const http = require("http");
const EventEmitter = require("events");
const util = require("util");
// Thread Pool By Default in NodeJS is a series of four threads and i can be configured and increased in env object
process.env.UV_THREADPOOL_SIZE = 1;

const date = Date.now();
crypto.pbkdf2("String A", "String B", 100000, 512, "sha512", () => {
  console.log("1 - One   =====> ", Date.now() - date);
});

// Reading Files By LibUV First make a request to get info about the file location and size then LibUV put it in the queue
const readable = fs.createReadStream(__dirname + "/cookies.js", {
  encoding: "utf8"
});

readable.on("data", function(data) {
  console.log("6 - File  =====> ", Date.now() - date);
});

// Network Calls trigred by http is delagted by NodeJS and Handled By OS
function doRequest() {
  http
    .request("http://google.com", res => {
      console.log("7 - Network ====> ", Date.now() - date);
    })
    .end();
}

// NodeJS and LibUV has no code to handle http requests
// Http Requests is Delgated By LibUV To Underinline Operating System and LibUV waits for completion notice to run inside LibUV Single Thread
const requests = [
  doRequest,
  doRequest,
  doRequest,
  doRequest,
  doRequest,
  doRequest
];

function DORequests() {}

util.inherits(DORequests, EventEmitter);

const doReqs = new DORequests();

doReqs.on("makeRequests", function(data) {
  for (let item of data) {
    item();
  }
});

doReqs.emit("makeRequests", requests);

crypto.pbkdf2("String A", "String B", 100000, 512, "sha512", () => {
  console.log("2 - Two   =====> ", Date.now() - date);
});

crypto.pbkdf2("String A", "String B", 100000, 512, "sha512", () => {
  console.log("3 - Three =====> ", Date.now() - date);
});

crypto.pbkdf2("String A", "String B", 100000, 512, "sha512", () => {
  console.log("4 - Four  =====> ", Date.now() - date);
});

crypto.pbkdf2("String A", "String B", 100000, 512, "sha512", () => {
  console.log("5 - Five  =====> ", Date.now() - date);
});

/* ================================================================================= */

// Two Wayes To Improve Performance In NodeJS
// 1 - Strting NodeJS in Cluster Mode/Slave Mode/Child Mode and faking multithreads
// 2 - Use Worker Threads
const express = require("express");
const cluster = require("cluster"); // Cluster Manager is used to manage multiple instances of node js started as a child proceses of nodejs
const app = express();

function doWork() {
  const start = Date.now();
  while (Date.now() - start < 5000) {}
}

console.log(cluster.isMaster); // Cluster.isMaster is alwayes in parent instance

// cluster.isMater by default is set TRUE untill cluster.fork() is called
if (cluster.isMaster) {
  // When Fork is called - NodeJS Go Back And Execute File in slave Mode or child Mode
  cluster.fork();
  cluster.fork();
} else {
  // Child Mode That Act As Seperate Instance
  app.get("/", function(req, res) {
    crypto.pbkdf2("String A", "String B", 100000, 512, "sha512", () => {
      console.log("5 - Five  =====> ", Date.now() - date);
    });
    res.send("Express");
  });

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server started at port ${port}`);
  });
}
