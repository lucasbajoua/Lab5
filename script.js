// script.js

let img = new Image(); // used to load image from <input> and draw to canvas
img.src = 'favicon.ico';
let c = document.getElementById('user-image');
let ctx = c.getContext('2d');
ctx.font = "30px Arial";
let resetButton = document.querySelector("[type='reset']");
let voiceButton = document.querySelector("[type='button']");
let voiceDropdown = document.getElementById("voice-selection");
toggle(voiceDropdown);
voiceDropdown.remove(0);
var synth = window.speechSynthesis;


// Fires whenever the img object loads a new image (such as with img.src =)
img.addEventListener('load', () => {

  let imageLoader = document.getElementById('image-input');
  imageLoader.addEventListener('change', handleImage, false);


function handleImage(e){
  ctx.clearRect(0,0, c.width, c.height);
  ctx.beginPath();
  ctx.rect(0,0,c.width,c.height);
  ctx.fillStyle = "black";
  ctx.fill();
  let reader = new FileReader();
  reader.onload = function(event){
      img = new Image();
      img.onload = function(){
          let dimensions = getDimmensions(c.width, c.height, img.width, img.height);
          ctx.drawImage(img, dimensions.startX, dimensions.startY, dimensions.width, dimensions.height);
      }
      img.src = event.target.result;
  }
  reader.readAsDataURL(e.target.files[0]);     
}

  // Some helpful tips:
  // - Fill the whole Canvas with black first to add borders on non-square images, then draw on top
  // - Clear the form when a new image is selected
  // - If you draw the image to canvas here, it will update as soon as a new image is selected
});



let generate = document.getElementById('generate-meme');
generate.addEventListener('submit', e => {
  e.preventDefault();
  let topText = document.getElementById('text-top').value;
  let bottomText = document.getElementById('text-bottom').value;
  ctx.textAlign = "center";
  ctx.fillText(topText, c.width/2, 30);
  ctx.fillText(bottomText, c.width/2, c.height-10);
  toggle(voiceButton);
  toggle(resetButton);
});

function toggle(button)
{
  if(button.disabled==true){
   button.disabled = false;}

  else {
   button.disabled=true;}
}

resetButton.addEventListener('click', () => {
  ctx.clearRect(0,0, c.width, c.height);
  toggle(resetButton);
  toggle(voiceButton);
  
}); 

voiceButton.addEventListener('click', () => {
  
  let voices = speechSynthesis.getVoices();
  let utterThis = new SpeechSynthesisUtterance(document.getElementById('text-top').value + ' ' + document.getElementById('text-bottom').value);
  let selectedOption = voiceDropdown.selectedOptions[0].getAttribute('data-name');
  for(let i = 0; i < voices.length ; i++) {
    if(voices[i].name === selectedOption) {
      utterThis.voice = voices[i];
    }
  }
  utterThis.volume = volumeSlider.value/100;
  synth.speak(utterThis);
});

var volumeSlider = document.querySelector("[type='range']");
volumeSlider.addEventListener('change', () => {
  let icon = document.querySelector("img");
  if (vol >= 67 && vol <=100) {
    icon.src = "icons/volume-level-3.svg";
  }
  else if (vol >= 34 && vol <=66) {
    icon.src = "icons/volume-level-2.svg";
  }
  else if (vol >= 1 && vol <=33) {
    icon.src = "icons/volume-level-1.svg";
  }
  else if (vol == 0) {
    icon.src = "icons/volume-level-0.svg"
  }
});


function populateVoiceList() {
  if(typeof speechSynthesis === 'undefined') {
    return;
  }

  var voices = speechSynthesis.getVoices();

  for(var i = 0; i < voices.length; i++) {
    var option = document.createElement('option');
    option.textContent = voices[i].name + ' (' + voices[i].lang + ')';

    if(voices[i].default) {
      option.textContent += ' -- DEFAULT';
    }

    option.setAttribute('data-lang', voices[i].lang);
    option.setAttribute('data-name', voices[i].name);
    document.getElementById("voice-selection").appendChild(option);
  }
}

populateVoiceList();
if (typeof speechSynthesis !== 'undefined' && speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = populateVoiceList;
}

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
