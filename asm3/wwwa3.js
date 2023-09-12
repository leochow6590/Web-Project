var timeOut;
var rank = 0;
var status = "sliding";
var pausestatus = false;
var imglist = [];
var prev_dimensions = [0, 0, 0, 0];
var prev_rank = -1;

document.addEventListener("visibilitychange", function() {
  clearTimeout(timeOut);
  window.location.reload();
});

window.onload = function() {
  createImageList();
  checkLoaded();
}

function checkLoaded() {
  var loaded = 0;
  for (i = 0; i < images.length; i++) {
    var img = document.getElementById(i);
    img.onload = function() {
      loaded++;
      if (loaded == images.length) {
        drawLoop();
        mouseover();
      }
    }
  }
}

function drawLoop() {
  var ctx = document.getElementById('myCanvas').getContext('2d');
  var height = imglist[rank].naturalHeight;
  var width = imglist[rank].naturalWidth;
  var xValue, yValue;
  var dimensions = checksize(height, width, xValue, yValue);
  var position = 0;

  function slider() {
    ctx.clearRect(0, 0, 1280, 380);
    if (prev_rank != -1) {
      ctx.drawImage(imglist[prev_rank], prev_dimensions[2], prev_dimensions[3], prev_dimensions[1], prev_dimensions[0]);
    }
    ctx.fillStyle = "rgba(255,255,255," + position / 640 + ")";
    ctx.fillRect(640 - position, 0, 640, 380);
    ctx.drawImage(imglist[rank], dimensions[2] + 640 - position, dimensions[3], dimensions[1], dimensions[0]);
    if (position < 640) { // sliding
      position += 1;
      setTimeout(slider, 1);
    } else { //just done slide
      prev_dimensions = dimensions;
      prev_rank = rank;
      if (rank == images.length - 1) {
        rank = 0;
      } else {
        rank++;
      }
      if (status == "interrupt" && pausestatus == false) {
        setTimeout(drawLoop, 3000);
      } else {
        status = "waiting";
      }
    }
  }
  status = "sliding";
  setTimeout(slider, 1);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  timeOut = setTimeout(drawLoop, 6000);

}

function pause() {
  clearTimeout(timeOut);
  pausestatus = true;
}

function play() {
  if (pausestatus == true) {
    if (status == "waiting") {
      drawLoop();
    } else if (status == "sliding") {
      status = "interrupt";
    }
  }
  pausestatus = false;
}

function skip() {
  if (status == "waiting") {
    drawLoop();
    pause();
  }
}

function mouseover() {
  var img = document.getElementById("myCanvas");
  img.setAttribute("onmouseover", "pause()");
  img.setAttribute("onmouseout", "play()");
  img.setAttribute("onclick", "skip()");
}

function createImageList() {
  for (i = 0; i < images.length; i++) {
    var img = new Image();
    img.src = "images/" + images[i];
    img.setAttribute("id", i);
    img.setAttribute("height", img.naturalHeight);
    img.setAttribute("style", "display:none");
    document.body.appendChild(img);
    imglist.push(img);
  }
}

function checksize(height, width, xValue, yValue) {
  var ratio = width / height;
  if (height == 0) {
    height = 380;
    width = 640;
    return;
  }
  if (height > 380) {
    height = 380;
    width = height * ratio;
  }
  if (width > 640) {
    width = 640;
    height = width / ratio;
  }
  xValue = (640 - width) / 2;
  yValue = (380 - height) / 2;
  return [height, width, xValue, yValue];
}