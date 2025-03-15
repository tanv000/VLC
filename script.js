const videoBtn = document.querySelector("#videoBtn");
const videoInput = document.querySelector("#videoInput");
const videoPlayer = document.querySelector("#main");

const currentTimeElem = document.querySelector("#currentTime") ;
const totalTimeElem = document.querySelector("#totalTime") ;
const sliderElem = document.querySelector("#slider");


let video = "";
let isPlaying = false;
let currentPlayTime = 0;
let duration;
let timerObj;

const handleInput = () => {
  console.log("Input is selected");
  videoInput.click();
};

const acceptInputHandler = (obj) => {
  let selectedVideo;
  if(obj.type == "drop"){
    selectedVideo = obj.dataTransfer.files[0];
  }
  else{
    selectedVideo=obj.target.files[0];
  }
  // src -> base64
  const link = URL.createObjectURL(selectedVideo);
  //Creating the Video Element
  const videoElement = document.createElement("video");
  videoPlayer.innerHTML = ""; //removes all exixting children
  // Setting Video Source and Attributes
  videoElement.src = link;
  videoElement.setAttribute("class", "video");
  // adding the element
  videoPlayer.appendChild(videoElement);
  video = videoElement;
  isPlaying = true;
  setPlayPause();
  videoElement.play();
  videoElement.volume = 0.3;
  // videoElement.defaultplaybackRate = 1;
  videoElement.addEventListener("loadedmetadata", function(){
    duration = Math.round(videoElement.duration);
    // console.log(duration);
    //convert sec into hrs:mins:secs
    let time = timeFormat(duration);
    totalTimeElem.innerHTML = time;
    sliderElem.setAttribute("max", duration);
    startTimer();
  })

};

videoBtn.addEventListener("click", handleInput);
videoInput.addEventListener("change", acceptInputHandler);

/*************Speed and volume handler*****************/

const speedup = document.querySelector("#speedup");
const speeddown = document.querySelector("#speeddown");
const volumeup = document.querySelector("#volumeup");
const volumedown = document.querySelector("#volumedown");
const toast = document.querySelector(".toast");

const speedUpHandler = () => {
  // alert("speed up was clicked");
  const videoElement = document.querySelector("#main .video");
  // console.log(videoElement)
  if (videoElement == null) {
    return;
  }
  if(videoElement.playbackRate >= 3){
    return;
  }
  const increasedSpeed = videoElement.playbackRate + 0.5;
  videoElement.playbackRate = increasedSpeed;
  console.log("increased speed:", increasedSpeed);
  showToast(increasedSpeed+"X")
  
};

const speedDownHandler = () => {
  // alert("speed up was clicked");
  const videoElement = document.querySelector("#main .video");
  // console.log(videoElement)
  if (videoElement == null) {
    return;
  }
  if (videoElement.playbackRate > 0) {
    const decreasedSpeed = videoElement.playbackRate - 0.5;
    videoElement.playbackRate = decreasedSpeed;
    console.log("decreased speed: ", decreasedSpeed);
    showToast(decreasedSpeed+"X");
  }
};

const volumeUpHandler = () => {
  const videoElement = document.querySelector("#main .video");
  console.log(videoElement);
  if (videoElement == null) {
    return;
  }
  // volume range [0, 1] 0.0 -> silent, 0.5 -> 50% volume, 1.0 -> max volume (100%)
  if(videoElement.volume >= 0.99){
    return;
  }
  increasedVolume = videoElement.volume + 0.1;
  videoElement.volume = increasedVolume;
  const percentage = (increasedVolume.toFixed(2)*100) + "%";
  console.log("Increased volume: ", increasedVolume);
  showToast(percentage)
  
};

const volumeDownHandler = () => {
  const videoElement = document.querySelector("#main .video");
  console.log(videoElement);
  if (videoElement == null) {
    return;
  }
  // volume range [0, 1] 0.0 -> silent, 0.5 -> 50% volume, 1.0 -> max volume (100%)
  if(videoElement.volume <= 0.1){
    return;
  }
  decreasedVolume = videoElement.volume - 0.1;
  videoElement.volume = decreasedVolume
  const percentage = (decreasedVolume.toFixed(2)*100) + "%";
  console.log("Decreased volume: ", decreasedVolume);
  showToast(percentage)
};

function showToast(message) {
    toast.textContent = message;
    toast.style.display = "block";
    setTimeout(() => {
      toast.style.display = "none";
    }, 2000)
}

speedup.addEventListener("click", speedUpHandler);
speeddown.addEventListener("click", speedDownHandler);

volumeup.addEventListener("click", volumeUpHandler);
volumedown.addEventListener("click", volumeDownHandler);

/********************controls****************************/

/***Full Screen***/
const fullScreenElem = document.querySelector("#fullScreen");

const handleFullScreen = () =>{
  videoPlayer.requestFullscreen();
}

fullScreenElem.addEventListener("click", handleFullScreen);

/***********play pause*********/
const playPauseContainer = document.querySelector("#playPause");

function setPlayPause(){
  if(isPlaying === true){
    playPauseContainer.innerHTML = `<i class="fas fa-pause state"></i>`;
    video.play();
  }
  else{
    playPauseContainer.innerHTML = `<i class="fas fa-play state"></i>`;
    video.pause();
  }
}

playPauseContainer.addEventListener("click", function(e){
  if(video){
    isPlaying = !isPlaying;
    setPlayPause();
  }
})

/**************stop btn************* */
const stopBtn = document.querySelector("#stopBtn");

stopHandler = () =>{
  if(video)
  {
    video.remove();
    isPlaying = false;
    video = "";
    setPlayPause();
  }
}
stopBtn.addEventListener("click", stopHandler);

/**********forward and backward*****************/
function forward() {
  currentPlayTime = Math.round(video.currentTime) + 5;
  video.currentTime = currentPlayTime;
  sliderElem.setAttribute("value", currentPlayTime);
  showToast("Forward by 5 sec")
  let time = timeFormat(currentPlayTime);
  currentTimeElem.innerText = time;
}

function backward() {
  currentPlayTime = Math.round(video.currentTime) - 5;
  video.currentTime = currentPlayTime;
  sliderElem.setAttribute("value", currentPlayTime);
  showToast("Backward by 5 sec")
  let time = timeFormat(currentPlayTime);
  currentTimeElem.innerText = time;
}


const forwardBtn = document.querySelector('#forwardBtn');
const backBtn = document.querySelector("#backBtn");
forwardBtn.addEventListener("click", forward);
backBtn.addEventListener("click", backward);

// adding seek behaviour in slider
sliderElem.addEventListener("change", function(e) {
  let value = e.target.value;
  video.currentTime = value;
})


/*********seconds to hrs:mins:secs********* */
function timeFormat(timeCount){
  let time = '';
  const sec = parseInt(timeCount, 10);
  let hrs = Math.floor(sec/3600);
  let mins = Math.floor((sec - (hrs * 3600))/60);
  let secs = sec - (hrs * 3600) - (mins * 60);
  if(hrs < 10)
    hrs = "0"+hrs;
  if(mins < 10)
    mins = "0" + mins;
  if(secs < 10)
    secs = "0" + secs;
  time = `${hrs}:${mins}:${secs}`;
  return time;
}
// function that runs the timer and slider
function startTimer(){
  timerObj = setInterval(function () {
      currentPlayTime = Math.round(video.currentTime);
      sliderElem.value = currentPlayTime;
      const time = timeFormat(currentPlayTime);
      currentTimeElem.innerHTML = time;
      if(currentTimeElem == duration){
        state = "pause";
        stopTimer();
        setPlayPause();
        video.remove();
        sliderElem.value = 0;
        currentTimeElem.innerText = "00:00:00";
        totalTimeElem.innerText = '--/--/--';
      }
  })
}

function stopTimer(){
  clearInterval(timerObj);
}

/**********************enable drag and drop******************* */
// prevent dragover and dragleave events
videoPlayer.addEventListener('dragenter', (e) => {
  e.preventDefault();
})

videoPlayer.addEventListener('dragover', (e) => {
  e.preventDefault();
})

videoPlayer.addEventListener('dragleave', (e) => {
  e.preventDefault();
})

videoPlayer.addEventListener('drop', (e) => {
  e.preventDefault();
  acceptInputHandler(e);
})

/*********************keyboard support************************** */
const body = document.querySelector("body");
body.addEventListener("keyup", function(e){
  console.log(e.key);
  if(!video)  return;
  if(e.code == "Space"){
    isPlaying = !isPlaying;
    setPlayPause();
  }
  else if(e.key == "ArrowUp"){
    volumeUpHandler();
  }
  else if(e.key == "ArrowDown")
  {
    volumeDownHandler;
  }
  else if(e.key == "+"){
    speedUpHandler;
  }
  else if(e.kay == "-"){
    speedDownHandler;
  }
  else if(e.key == "ArrowRight"){
    forward();
  }
  else if(e.key == "ArrowLeft"){
    backward();
  }
})