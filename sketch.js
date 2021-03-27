// Denne første "prototype" forsøger at aflæse hvor "lukket" eller "åben" en pose er. 
// Dette vurderes efter hvor tæt henholdsvis hænder og fødder er på hinanden.
// Jo mere lukket posen er jo mere sort bliver det overlagte filer på video outputet
// samt hastigheden på lyd outputet bliver mere langsom.
// omvendt jo mere åben en pose er jo mere rødt bliver filteret og lyden afspilles hyrtigere.

let song;
let video; 
let poseNet; 
let pose;

function preload() {
 	song = loadSound("Delta Brain Waves 4 Hz Sleep Tone.mp3"); 
}

function setup() {
  createCanvas(1000,600);
  song.loop();
  video = createCapture(VIDEO);
  video.hide();
  poseNet = ml5.poseNet(video, modelReady);
  poseNet.on('pose', gotPoses);  
}

function modelReady() {
  console.log('model ready');
}


function gotPoses(poses) {
  console.log(poses);
  if (poses.length > 0) {
    pose = poses[0].pose;    
  }
}

function draw() {
  background(220);
// flipper billede så det ikke er spejlvendt:
  translate(video.width, 0);
  scale(-1, 1);
  image(video,0,0); 

  
  if (pose){ 
    let handR = pose.rightWrist;
    let handL = pose.leftWrist;
    let footR = pose.rightAnkle;
    let footL = pose.leftAnkle;
    
    let d = dist(handR.x, handR.y, handL.x, handL.y);
    let d2 = dist(footR.x, footR.y, footL.x, footL.y);
    let d3 = dist(footR.x, footR.y, handR.x, handR.y);
    let d4 = dist(footL.x, footL.y, handL.x, handL.y);
    
  // d5 representeret en samlet værdi 
  // for hvor 'åben' eller 'lukket' en pose er 
  // ift. distancen mellem fødder og hænder. 
    let d5 = (d+d2+d3+d4)/4;
    
    // tegner de 17 punkter  på kroppen
     for (let i = 0; i < pose.keypoints.length; i++) {
       let x = pose.keypoints[i].position.x;
       let y = pose.keypoints[i].position.y;
       fill(255);
       ellipse(x, y, 16, 16);

    // filter over video
    // mængde af rød i RGB-kode sættes efter d4 
       tint(d5,0,0);   

    // hastighed sættes efter d4
       var speed = map(d5, 0, width, 0, 4);
       song.rate(speed);
     }
   } 
}


