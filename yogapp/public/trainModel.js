let video;
let poseNet;
let pose;
let skeleton; 
let brain;
let state = 'waiting';
let targetLabel;
let poseLabel = "D"


function keyPressed(){
  if(key == 's'){
    brain.saveData('./values.json')
  } else {
  targetLabel = key;
  console.log("printing:"+ targetLabel)

  setTimeout(function(){
    console.log('collecting');
    state='collecting';
    setTimeout(function(){
      console.log('not collecting');
      state='waiting';
      }, 10000);
    }, 10000);
  }
}
function setup(){
  createCanvas(640,480);
  video = createCapture(VIDEO);
  video.hide();
  poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on('pose',gotPoses);
  let options={
    inputs: 34 ,
    outputs: 4,
    task: 'classification',
    debug: true
  };
  brain = ml5.neuralNetwork(options);
  brain.loadData('poses.json',dataReady);
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

function brainLoaded() {
  console.log("pose classification ready!");
  classifyPose();
}



/*function gotResult(error, results){
  poseLabel = results[0].label;
  console.log(results);
  console.log(results[0].label);
  //console.log(results[0].confidence);
  classifyPose();
}*/

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
  }
  
}


