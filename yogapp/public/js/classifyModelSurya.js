let video;
let poseNet;
let pose;
let skeleton; 
let brain;
let state = 'waiting';
let targetLabel;
let poseLabel = "def"

function setup(){
  var canvas = createCanvas(640, 480);
  canvas.position(50, 50);
  video = createCapture(VIDEO);
  video.hide();
  poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on('pose',gotPoses);
  let options={
    inputs: 34 ,
    outputs: 12,
    task: 'classification',
    debug: true
  };
  brain = ml5.neuralNetwork(options);
  const modelInfo = {
    model: '../models/modelSuryaFront/model.json',
    metadata: '../models/modelSuryaFront/model_meta.json',
    weights: '../models/modelSuryaFront/model.weights.bin',
  };
  brain.load(modelInfo, brainLoaded);
  
}
function gotPoses(poses){
 
  if(poses.length > 0) {
    pose = poses[0].pose;
    skeleton = poses[0].skeleton;
    
    }
  }

function brainLoaded() {
  console.log("pose classification ready!");
  classifyPose();
}

function classifyPose() {
  if(pose) {
    let inputs = [];
    for(let i = 0; i < pose.keypoints.length; i++){
      let x = pose.keypoints[i].position.x;
      let y = pose.keypoints[i].position.y;
      inputs.push(x);
      inputs.push(y);
    }
    brain.classify(inputs, gotResult);
  } else {
    setTimeout(classifyPose, 100);
  }
}

function gotResult(error, results){
  if(results[0].confidence > 0.80){
    poseLabel = results[0].label;
    console.log(results);
    console.log(results[0].label);
    console.log(results[0].confidence);
  }
  classifyPose();
}

function modelLoaded() {
  console.log('poseNet ready');
}

function draw(){
  push(); 
  translate(video.width, 0);
  scale(-1, 1);
  image(video,0,0,video.width, video.height)
  image(video,0,0);
  if(pose) {
  for(let i = 0; i < pose.keypoints.length;i++){
    let x = pose.keypoints[i].position.x;
    let y = pose.keypoints[i].position.y;
    fill(0,255,0);
    ellipse(x,y,16,16);
  }
  for (let i = 0; i < skeleton.length; i++) {
    let a = skeleton[i][0];
    let b = skeleton[i][1];
    strokeWeight(2);
    stroke(244, 194, 194);
    line(a.position.x, a.position.y, b.position.x, b.position.y);
  }
  }
  pop();
  fill(255, 0, 255);
  textSize(256);
  textAlign(CENTER, CENTER);
  text(poseLabel, width / 2, height / 2); 
}


