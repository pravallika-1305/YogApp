let video;
let poseNet;
let pose;
let skeleton;
let thirtysecs;
let posesArray = ['Pranamasana (Prayer pose)', 'Hastauttanasana (Raised arms pose)', 'Hastapadasana (Standing forward bend)', 'Ashwa Sanchalanasana (Equestrian pose)', 'Adho Mukha Svanasana (Downward facing dog pose)', 'Ashtanga Namaskara (Salute with eight parts or points)', 'Bhujangasana (Cobra pose)', 'Adho Mukha Svanasana (Downward facing dog pose)', 'Ashwa Sanchalanasana (Equestrian pose)', 'Hastapadasana (Standing forward bend)', 'Hastauttanasana (Raised arms pose)', 'Pranamasana (Prayer pose)'];
var imgArray = new Array();
let labelArray = ['1', '2', '3', '4', '5', '6', '7', '5', '4', '3', '2', '1'];
var audioIndex = 0;
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
    canvas.position(440, 60);
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
    imgArray[4].src = 'assets/img/postures/8.svg';
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
    imgArray[11].src = 'assets/img/postures/1.svg';

    playlist[0] = new Audio();
    playlist[0].src = 'assets/audio/1.mp3';
    playlist[1] = new Audio();
    playlist[1].src = 'assets/audio/2.mp3';
    playlist[2] = new Audio();
    playlist[2].src = 'assets/audio/3.mp3';
    playlist[3] = new Audio();
    playlist[3].src = 'assets/audio/4.mp3';
    playlist[4] = new Audio();
    playlist[4].src = 'assets/audio/5.mp3';
    playlist[5] = new Audio();
    playlist[5].src = 'assets/audio/6.mp3';
    playlist[6] = new Audio();
    playlist[6].src = 'assets/audio/7.mp3';
    playlist[7] = new Audio();
    playlist[7].src = 'assets/audio/8.mp3';
    playlist[8] = new Audio();
    playlist[8].src = 'assets/audio/9.mp3';
    playlist[9] = new Audio();
    playlist[9].src = 'assets/audio/10.mp3';
    playlist[10] = new Audio();
    playlist[10].src = 'assets/audio/11.mp3';
    playlist[11] = new Audio();
    playlist[11].src = 'assets/audio/12.mp3';


    poseCounter = 0;
    labelIndex = 0;
    target = posesArray[poseCounter];
    document.getElementById("poseName").textContent = target;
    timeLeft = 20;
    document.getElementById("time").textContent = "00:" + timeLeft;
    errorCounter = 0;
    iterationCounter = 0;
    document.getElementById("poseImg").src = imgArray[poseCounter].src;
    let options = {
        inputs: 34,
        outputs: 8,
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
   
    if (results[0].confidence > 0.70) {
        poseLabel = results[0].label;
        console.log("Confidence");
        if (results[0].label == labelArray[labelIndex].toString()) {
            console.log(labelArray[labelIndex]);
            iterationCounter = iterationCounter + 1;
            if(iterationCounter == 1){
            document.getElementById("player").src = playlist[audioIndex].src;
            }
            console.log(iterationCounter)
            if (iterationCounter == 20) {
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
                timeLeft = 20;
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

    if (labelIndex == 11) {
        console.log("Well done, you have learnt all poses!");
       document.getElementById("finish").style.display = 'block';
        document.getElementById("time").style.display = 'none';
        document.getElementById("seconds").style.display = 'none';
        document.getElementById("poseName").style.display = 'none';
        document.getElementById("poseImg").style.display = 'none';
        document.getElementById("sparkles").style.display = 'block';
        canvas.style.visibility = "hidden";
    } else {
        console.log("Well done, you all poses!");
       
        errorCounter = 0;
        iterationCounter = 0;
        poseCounter = poseCounter + 1;
        labelIndex = labelIndex + 1;
        audioIndex = audioIndex + 1;
        console.log("next pose target label" + labelArray[labelIndex])
        target = posesArray[poseCounter];
        document.getElementById("poseName").textContent = target;
        document.getElementById("welldone").style.display = 'block';
 
        document.getElementById("poseImg").src = imgArray[poseCounter].src;
        console.log("classifying again");
        timeLeft = 20;
        document.getElementById("time").textContent = "00:" + timeLeft;
        setTimeout(classifyPose, 100)
    }
}