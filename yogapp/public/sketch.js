let video;
let poseNet;
let pose;
let skeleton; 
let brain;
let state = 'waiting';
let targetLabel;

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
    outputs: 12,
    task: 'classification',
    debug: true
  };
  brain = ml5.neuralNetwork(options);
}
function gotPoses(poses){
  //console.log(poses);
  if(postMessage.length >0) {
    pose = poses[0].pose;
    skeleton = poses[0].skeleton;
    if(state == 'collecting') {
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
  
}
