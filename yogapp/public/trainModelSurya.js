let video;
let poseNet;
let pose;
let skeleton; 
let brain;
let state = 'waiting';
let targetLabel;
let poseLabel = "Def"

function setup(){
  createCanvas(640,480);
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
  brain.loadData('suryaFront.json',dataReady);
}
function gotPoses(poses){
 
  if(poses.length > 0) {
    pose = poses[0].pose;
    skeleton = poses[0].skeleton;
    let input =[];
    for(let i = 0; i < pose.keypoints.length;i++){
      let x = pose.keypoints[i].position.x;
      let y = pose.keypoints[i].position.y;
      input.push(x);
      input.push(y);
    }
  target = [targetLabel]
  brain.addData(input,target);
    }
  }

function dataReady(){
    brain.normalizeData();
    brain.train({epochs:700},finished);
}
function finished(){
    console.log("Model Trained ");
    brain.save();
}

function modelLoaded() {
  console.log('poseNet ready');
}