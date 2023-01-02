const express = require("express");
const app = express();
const {data} = require("./data")
// mongodb connector gives a error and crashes nodejs
// const { CovidTally } = require("./connector");
// Parse JSON bodies (as sent by API clients)
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.status(200).send("HELLO WORLD");
});

// your code goes here
let recovered = data.reduce((currentSum, currentObj)=>currentSum + currentObj.recovered, 0);

app.get("/totalRecovered", (req, res)=>{
  let result = [{"_id":"total", recovered}];
  res.json({data:result})
})

let infected = data.reduce((currentSum, currentObj)=>currentSum + currentObj.infected, 0);
app.get("/totalActive",(req, res)=>{
  let active = infected - recovered
  let result = [{"_id":"total", active}];
  res.json({data:result})
})

let deaths = data.reduce((currentSum, currentObj)=>currentSum + currentObj.death, 0);
app.get("/totalDeaths",(req, res)=>{
  let result = [{"_id":"total", deaths}];
  res.json({data:result})
})

app.get("/hotspotStates",(req, res)=>{
  let hotspots = data.map(calculateHotspot);
  hotspots.sort(sortAscending)
  res.json({data:hotspots})
})
function isHotSpot(details) {
  const {infected, recovered} = details;
  let rate = (infected - recovered) /infected;
  return rate > 0.1
}
function calculateHotspot(details) {
 const {infected, recovered} = details;
 let rate = (infected - recovered) /infected;
   return {_id:details.state, rate: Number(String(rate.toFixed(5)))}
}

app.get("/healthyStates", (req, res)=>{
 let healthy = data.map(calculateMortality);
 healthy.sort(sortAscending)
 res.json({data:healthy})
})
function isHealthy(details) {
  const {death, infected} = details;
  let rate = death  / infected;
  return rate < 0.005
}
function calculateMortality(details) {
  const {death, infected} = details;
  let rate = death  / infected;
  return {_id:details.state, rate: Number(String(rate.toFixed(5)))}
}

function sortAscending(currentState, nextState) {
  return currentState._id.localeCompare(nextState._id)
}
module.exports = app;
