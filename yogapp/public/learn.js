let video;
let poseNet;
let pose;
let skeleton;
let thirtysecs;
let posesArray = ['Pranamasana (Prayer pose)', 'Hastauttanasana (Raised arms pose)', 'Hastapadasana (Standing forward bend)', 'Ashwa Sanchalanasana (Equestrian pose)', 'Dandasana (Stick pose)', 'Ashtanga Namaskara (Salute with eight parts or points)', 'Bhujangasana (Cobra pose)', 'Adho Mukha Svanasana (Downward facing dog pose)', 'Ashwa Sanchalanasana (Equestrian pose)', 'Hastapadasana (Standing forward bend)', 'Hastauttanasana (Raised arms pose)', 'Tadasana (Mountain Pose)'];
var imgArray = new Array();
let labelArray = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'v', 'w', 'k'];

var poseImage;

let yogi;
let poseLabel;

var labelIndex;
var errorCounter;
var iterationCounter;
var poseCounter;
var target;

var timeLeft;

function setup() {
    var canvas = createCanvas(640, 480);
    canvas.position(50, 50);
    video = createCapture(VIDEO);
    video.hide();
    poseNet = ml5.poseNet(video, modelLoaded);
    poseNet.on('pose', gotPoses);

    imgArray[0] = new Image();
    imgArray[0].src = 'assets/img/postures/1.svg';
    imgArray[1] = new Image();
    imgArray[1].src = 'assets/img/postures/2.svg';
    imgArray[2] = new Image();
    imgArray[2].src = 'assets/img/postures/3.svg';
    imgArray[3] = new Image();
    imgArray[3].src = 'assets/img/postures/4.svg';
    imgArray[4] = new Image();
    imgArray[4].src = 'assets/img/postures/5.svg';
    imgArray[5] = new Image();
    imgArray[5].src = 'assets/img/postures/6.svg';
    imgArray[6] = new Image();
    imgArray[6].src = 'assets/img/postures/7.svg';
    imgArray[7] = new Image();
    imgArray[7].src = 'assets/img/postures/8.svg';
    imgArray[8] = new Image();
    imgArray[8].src = 'assets/img/postures/9.svg';
    imgArray[9] = new Image();
    imgArray[9].src = 'assets/img/postures/10.svg';
    imgArray[10] = new Image();
    imgArray[10].src = 'assets/img/postures/11.svg';
    imgArray[11] = new Image();
    imgArray[11].src = 'assets/img/postures/12.svg';

    poseCounter = 0;
    labelIndex = 0;
    target = posesArray[poseCounter];
    document.getElementById("poseName").textContent = target;
    timeLeft = 10;
    document.getElementById("time").textContent = "00:" + timeLeft;
    errorCounter = 0;
    iterationCounter = 0;
    document.getElementById("poseImg").src = imgArray[poseCounter].src;

    let options = {
        inputs: 34,
        outputs: 12,
        task: 'classification',
        debug: true
    }

    yogi = ml5.neuralNetwork(options);
    const modelInfo = {
        model: 'modelSuryaFront/model.json',
        metadata: 'modelSuryaFront/model_meta.json',
        weights: 'modelSuryaFront/model.weights.bin',
    };
    yogi.load(modelInfo, yogiLoaded);
}

function yogiLoaded() {
    console.log("Model ready!");
    classifyPose();
}

function classifyPose() {
    if (pose) {
        let inputs = [];
        for (let i = 0; i < pose.keypoints.length; i++) {
            let x = pose.keypoints[i].position.x;
            let y = pose.keypoints[i].position.y;
            inputs.push(x);
            inputs.push(y);
        }
        yogi.classify(inputs, gotResult);
    } else {
        console.log("Pose not found");
        setTimeout(classifyPose, 100);
    }
}

function gotResult(error, results) {
    document.getElementById("welldone").textContent = "";
    document.getElementById("sparkles").style.display = "none";
    if (results[0].confidence > 0.80) {
        poseLabel = results[0].label;
        console.log("Confidence");
        if (results[0].label == labelArray[labelIndex].toString()) {
            console.log(labelArray[labelIndex]);
            iterationCounter = iterationCounter + 1;
            console.log(iterationCounter)
            if (iterationCounter == 10) {
                console.log("30!")
                iterationCounter = 0;
                nextPose();
            }
            else {
                console.log("doin this")
                timeLeft = timeLeft - 1;
                if (timeLeft < 10) {
                    document.getElementById("time").textContent = "00:0" + timeLeft;
                } else {
                    document.getElementById("time").textContent = "00:" + timeLeft;
                }
                setTimeout(classifyPose, 1000);
            }
        }
        else {
            errorCounter = errorCounter + 1;
            console.log("error");
            if (errorCounter >= 4) {
                console.log("four errors");
                iterationCounter = 0;
                timeLeft = 10;
                if (timeLeft < 10) {
                    document.getElementById("time").textContent = "00:0" + timeLeft;
                } else {
                    document.getElementById("time").textContent = "00:" + timeLeft;
                }
                errorCounter = 0;
                setTimeout(classifyPose, 100);
            } else {
                setTimeout(classifyPose, 100);
            }
        }
    }
    else {
        console.log("whatwe really dont want")
        setTimeout(classifyPose, 100);
    }
}


function gotPoses(poses) {
    if (poses.length > 0) {
        pose = poses[0].pose;
        skeleton = poses[0].skeleton;
    }
}

function modelLoaded() {
    document.getElementById("rectangle").style.display = "none";
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
  
  
  
function nextPose() {
    if (poseCounter >= 5) {
        console.log("Well done, you have learnt all poses!");
        document.getElementById("finish").textContent = "Amazing!";
        document.getElementById("welldone").textContent = "All poses done.";
        document.getElementById("sparkles").style.display = 'block';
    } else {
        console.log("Well done, you all poses!");
        errorCounter = 0;
        iterationCounter = 0;
        poseCounter = poseCounter + 1;
        labelIndex = poseCounter + 1;
        console.log("next pose target label" + labelArray[labelIndex])
        target = posesArray[poseCounter];
        document.getElementById("poseName").textContent = target;
        document.getElementById("welldone").textContent = "Well done, next pose!";
        document.getElementById("sparkles").style.display = 'block';
        document.getElementById("poseImg").src = imgArray[poseCounter].src;
        console.log("classifying again");
        timeLeft = 10;
        document.getElementById("time").textContent = "00:" + timeLeft;
        setTimeout(classifyPose, 4000)
    }
}