let video;
let poseNet;
let pose;
let skeleton; 
let brain;
let state = 'waiting';
let targetLabel;
let poseLabel = "Def"

function setup(){
  
  let options={
    inputs: 34 ,
    outputs: 4,
    task: 'classification',
    debug: true
  };
  brain = ml5.neuralNetwork(options);
  brain.loadData('basics.json',dataReady);
}


function dataReady(){
    brain.normalizeData();
    brain.train({epochs:500},finished);
}
function finished(){
    console.log("Model Trained ");
    brain.save();
}

function modelLoaded() {
  console.log('poseNet ready');
}