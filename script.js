// script.js
const img = new Image(); // used to load image from <input> and draw to canvas
const canvas = document.getElementById("user-image");
const ctx = canvas.getContext('2d');
//img.src = '//:0';
// Fires whenever the img object loads a new image (such as with img.src =)
const input_image = document.getElementById("image-input");
const sumbit_in = document.getElementById("generate-meme");
const clear = document.querySelector('button[type=reset]');
const read_text = document.querySelector('button[type=button]');
const top_text = document.getElementById("text-top");
const bottom_text = document.getElementById("text-bottom");
var synth = window.speechSynthesis;
var voiceSel = document.getElementById("voice-selection");
var voiceArr = [];
document.getElementById("voice-selection").disabled = false;
const volume_slider = document.getElementById('volume-group');
const volume_level = document.querySelector("[type='range']");
const Img = document.querySelector('img');
const Input =document.querySelector('input');
img.addEventListener('load', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  document.querySelector("[type='submit']").disabled = false;
  document.querySelector("[type='reset']").disabled = true;
  document.querySelector("[type='button']").disabled = true;
  document.getElementById("voice-selection").disabled = false;
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  var image_in = getDimmensions(canvas.width,canvas.height,img.width,img.height);
  ctx.drawImage(img,image_in.startX,image_in.startY,image_in.width,image_in.height);
  // Some helpful tips:
  // - Fill the whole Canvas with black first to add borders on non-square images, then draw on top
  // - Clear the form when a new image is selected
  // - If you draw the image to canvas here, it will update as soon as a new image is selected
});
function populateVoiceList(){
  voiceArr = synth.getVoices();
  voiceSel.removeChild(voiceSel.children[0]);
  for(var i = 0;i  < voiceArr.length; i++){
    var option = document.createElement('option');
    option.textContent = voiceArr[i].name + ' (' + voiceArr[i].lang + ')';
    if(voiceArr[i].default){
      option.textContent += ' -- DEFAULT';
    }
    option.setAttribute('data-lang',voiceArr[i].lang);
    option.setAttribute('data-name',voiceArr[i].name);
    voiceSel.appendChild(option);
  }
}
input_image.addEventListener('change', () => {
  img.src = window.URL.createObjectURL(input_image.files[0]);
  img.alt = input_image.files[0].name;
});
sumbit_in.addEventListener('submit',function(event) {
  event.preventDefault();
  populateVoiceList();
  ctx.font = "40px Arial";
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.fillText(top_text.value, canvas.width/2,40);
  ctx.fillText(bottom_text.value, canvas.width/2,canvas.height-20);
  document.querySelector("[type='submit']").disabled = true;
  document.querySelector("[type='reset']").disabled = false;
  document.querySelector("[type='button']").disabled = false;
});
clear.addEventListener('click',()=>{
  top_text.value="";
  bottom_text.value="";
  ctx.clearRect(0,0,canvas.width,canvas.height);
  document.querySelector("[type='submit']").disabled = false;
  document.querySelector("[type='reset']").disabled = true;
  document.querySelector("[type='button']").disabled = true;
});
read_text.addEventListener('click',() =>{
  const utterance = new SpeechSynthesisUtterance( top_text.value + "" + bottom_text.value);
  utterance.volume= volume_level.value / 100;
  const speechOption = window.speechSynthesis.getVoices();
  const langOption = speechOption.find((voice) => voiceSel.selectedOptions[0].getAttribute('data-name') === voice.name);
  utterance.voice = langOption;
  speechSynthesis.speak(utterance);
});
volume_slider.addEventListener('input',() =>{
  if(volume_level.value >= 67 && volume_level.value <= 100){
    Img.src = "icons/volume-level-3.svg";
    Img.alt = "Volume Level 3";
  }
  else if(volume_level.value >= 34 && volume_level.value <= 66){
    Img.src = "icons/volume-level-2.svg";
    Img.alt = "Volume Level 2";
  }
  else if(volume_level.value >= 1 && volume_level.value <= 33){
    Img.src = "icons/volume-level-1.svg";
    Img.alt = "Volume Level 1";
  }
  else{
    Img.src = "icons/volume-level-0.svg";
    Img.alt = "Volume Level 0";
  }
});
/**
 * Takes in the dimensions of the canvas and the new image, then calculates the new
 * dimensions of the image so that it fits perfectly into the Canvas and maintains aspect ratio
 * @param {number} canvasWidth Width of the canvas element to insert image into
 * @param {number} canvasHeight Height of the canvas element to insert image into
 * @param {number} imageWidth Width of the new user submitted image
 * @param {number} imageHeight Height of the new user submitted image
 * @returns {Object} An object containing four properties: The newly calculated width and height,
 * and also the starting X and starting Y coordinate to be used when you draw the new image to the
 * Canvas. These coordinates align with the top left of the image.
 */
function getDimmensions(canvasWidth, canvasHeight, imageWidth, imageHeight) {
  let aspectRatio, height, width, startX, startY;
  // Get the aspect ratio, used so the picture always fits inside the canvas
  aspectRatio = imageWidth / imageHeight;
  // If the apsect ratio is less than 1 it's a verical image
  if (aspectRatio < 1) {
    // Height is the max possible given the canvas
    height = canvasHeight;
    // Width is then proportional given the height and aspect ratio
    width = canvasHeight * aspectRatio;
    // Start the Y at the top since it's max height, but center the width
    startY = 0;
    startX = (canvasWidth - width) / 2;
    // This is for horizontal images now
  } else {
    // Width is the maximum width possible given the canvas
    width = canvasWidth;
    // Height is then proportional given the width and aspect ratio
    height = canvasWidth / aspectRatio;
    // Start the X at the very left since it's max width, but center the height
    startX = 0;
    startY = (canvasHeight - height) / 2;
  }
  return { 'width': width, 'height': height, 'startX': startX, 'startY': startY }
}