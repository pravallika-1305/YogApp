let video;
let poseNet;
let pose;
let skeleton;
let thirtysecs;
let posesArray = ['Mountain Pose','Chair Pose', 'Downward dog','Triangle Pose','Tree Pose'];
var imgArray = new Array();
let labelArray = ['m','c','d','t','r'];
var playlist = new Array();
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
    imgArray[0].src = '../assets/img/warmup/1.png';
    imgArray[1] = new Image();
    imgArray[1].src = '../assets/img/warmup/2.png';
    imgArray[2] = new Image();
    imgArray[2].src = '../assets/img/warmup/4.png';
    imgArray[3] = new Image();
    imgArray[3].src = '../assets/img/warmup/5.png';
    imgArray[4] = new Image();
    imgArray[4].src = '../assets/img/warmup/6.png';
  
    


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
        outputs: 6,
        task: 'classification',
        debug: true
    }

    yogi = ml5.neuralNetwork(options);
    const modelInfo = {
        model: '../models/odelBasic/model.json',
        metadata: '../models/odelBasic/model_meta.json',
        weights: '../models/odelBasic/model.weights.bin',
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
   
    if (results[0].confidence > 0.70) {
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
    //document.getElementById("rectangle").style.display = "none";
    console.log('poseNet ready');
}

function draw() {
    push();
    translate(video.width, 0);
    scale(-1, 1);
    image(video, 0, 0, video.width, video.height)
    image(video, 0, 0);
    if (pose) {
        for (let i = 0; i < pose.keypoints.length; i++) {
            let x = pose.keypoints[i].position.x;
            let y = pose.keypoints[i].position.y;
            fill(0, 255, 0);
            ellipse(x, y, 16, 16);
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
    //textSize(256);
    //textAlign(CENTER, CENTER);
    //text(poseLabel, width / 2, height / 2);
}



function nextPose() {

    if (labelIndex == 4) {
        console.log("Well done, you have learnt all poses!");
       document.getElementById("finish").style.display = 'block';
        document.getElementById("time").style.display = 'none';
        document.getElementById("seconds").style.display = 'none';
        document.getElementById("poseName").style.display = 'none';
        document.getElementById("poseImg").style.display = 'none';
        document.getElementById("sparkles").style.display = 'block';
        canvas.style.visibility = "hidden";
        var x = document.getElementById("player");
        x.pause();

    } else {
        console.log("Well done, you all poses!");
       
        errorCounter = 0;
        iterationCounter = 0;
        poseCounter = poseCounter + 1;
        labelIndex = labelIndex + 1;
      
        console.log("next pose target label" + labelArray[labelIndex])
        target = posesArray[poseCounter];
        document.getElementById("poseName").textContent = target;
        document.getElementById("welldone").style.display = 'block';
        //document.getElementById("welldone").style.display = 'none';
 
        document.getElementById("poseImg").src = imgArray[poseCounter].src;
        console.log("classifying again");
        timeLeft = 10;
        document.getElementById("time").textContent = "00:" + timeLeft;
        setTimeout(classifyPose, 100)
    }
}