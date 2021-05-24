let video;
let poseNet;
let pose;
let skeleton; 
let brain;
let state = 'waiting';
let targetLabel;
/*function keyPressed(){
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
}*/
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
  brain.loadData('ymca.json',dataReady);



}
function dataReady(){
    brain.normalizeData();
    brain.train({epochs:50},finished);




}
function finished(){
    console.log("Model Trained ");
    brain.save();
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

/*function draw(){
  translate(video.width, 0);
  scale(-1, 1);
  image(video,0,0,video.width, video.height)
  image(video,0,0);
  /*let eyeR = pose.rightEye;
    let eyeL = pose.leftEye;
    let d = dist(eyeR.x,eyeR.y,eyeL.x,eyeL.y);
  fill(255,0,0);
  ellipse(pose.nose.x,pose.nose.y,d);
  fill(0,0,255);
  ellipse(pose.rightWrist.x,pose.rightWrist.y,32);
  ellipse(pose.leftWrist.x,pose.leftWrist.y,32);
  if(pose){
  for(let i = 0; i < pose.keypoints.length;i++){
    let x = pose.keypoints[i].position.x;
    let y = pose.keypoints[i].position.y;
    fill(0,255,0);
    ellipse(x,y,16,16);
  }
  }

}*/


