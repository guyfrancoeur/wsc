var master = 0;
var frameRate = 500;
var imgQuality = 0.8;
var scale = .8;

function initWsc() {
  wsc.onopen = function() {
    console.log("onopen of", wsc.url, "in", (new Date().getTime() - start), "ms");
  }
  
  wsc.onmessage = function(evt) {
    if (evt.data != "") {
      msg = JSON.parse(evt.data);
      switch(msg.type){
        case 'share': //rafraichir le partage video. dans la modale.
          $('#image').attr('src', msg.message);
          break;

        case 'start':
          console.log("case start");
          $("#m_sc").modal();
          $("#image").show();
          $("#bShare").hide();
          if(master == 0){
            $("#sliderReceveur").show();
            $("#sliderEmetteur, #divkbytes").hide();
          }
          //ouvrir la modale pour mettre le partage.
          break;

        case 'stop':
          console.log("case stop");
          $("#image, #sliderReceveur, #sliderEmetteur, #divkbytes").hide();
          $('#image').removeAttr("src");
          $("#bShare").show();
          $("#modaleSC").css({"width": "50%", "height": "50vh", "max-width": "50%", "max-height": "50vh"});
          $("#image").css({"max-height": "50vh","height": ""});
          $('#nresizeWindow').slider('refresh');
          var fullscreenElement = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;
          if (fullscreenElement != null) exitFunction();
          $("#m_sc").modal('hide');
          // femeture du partage.
          break;
      }
    }
  }

  wsc.onerror = function() {
    console.log("error wsc");
  }
}

function share() {
   //********  todo
  if (master == 1) {
    wsc.send(JSON.stringify({
      type: 'start',
      message: ''
    }));
    frameShare = setInterval(interval, frameRate);
    $("#sliderEmetteur, #divkbytes, #image").show();
    $("#bShare").hide();
  }
}

function interval(){
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  uri = canvas.toDataURL('image/jpeg', imgQuality);
  wsc.send(JSON.stringify({
    type: 'master',
    message: uri,
    zip: 0
  }));
  var kbytes = (uri.length * (1000 / frameRate) / 1000)
  $("#kbytes").html(kbytes.toFixed(2));
  $('#image').attr('src', uri);
}

function stopShare(){
  streamVideo.getTracks().forEach(track => track.stop());
  clearInterval(frameShare);
  wsc.send(JSON.stringify({
    type: 'stop',
    message: ''
  }));
  master = 0;
  $("#bShare").show();
  $("#image, #sliderEmetteur, #divkbytes").hide();
  $('#image').removeAttr("src");
  $("#m_sc").modal('hide');
}

var canvas = document.createElement('canvas');
var context = canvas.getContext('2d');
var streamVideo;

$('#bshareScreen').on('click', function(){
  $('#m_sc').modal('show'); return false;
});

$('#bShare').on('click', function(){
  const video = document.getElementById('video');
  var constraints = { video: { frameRate: { ideal: 8, max: 12 } } };

  getMedia(constraints);

  async function getMedia(constraints){
    try {
      streamVideo = await navigator.mediaDevices.getDisplayMedia(constraints);
      if ("srcObject" in video) video.srcObject = streamVideo
      else video.src = window.URL.createObjectURL(streamVideo); // Avoid using this in new browsers.
      video.onloadedmetadata = function(e) {
        canvas.width = video.videoWidth * scale;
        canvas.height = video.videoHeight * scale;
        video.play();
      };
      streamVideo.getVideoTracks()[0].addEventListener('ended', () => 
        stopShare()
      );
      master = 1;
      share();
    } catch(err) {
      console.log(err.name + ": " + err.message);
      $("#msgErrMedia").show();
    }

    //Resize de la fenêtre en train d'être partagée -> resize du canvas
    $(video).on('resize', function(){
      canvas.width = video.videoWidth * scale;
      canvas.height = video.videoHeight * scale;
    });
  }
});

// Resize window
$("#nresizeWindow").slider({formatter: function(value) {return value + "%";}});
$("#nresizeWindow").change(function(){
  switch(parseInt(this.value)){
    case 50:
      $("#modaleSC").css({"width": "50%", "height": "50vh", "max-width": "50%", "max-height": "50vh"});
      $("#image").css({"max-height": "50vh","height": ""});
      break;
    case 75:
      $("#modaleSC").css({"width": "75%", "height": "75vh", "max-width": "75%", "max-height": "75vh"});
      $("#image").css({"max-height": "75vh","height": ""});
      break;
    case 100:
      $("#modaleSC").css({"width": "98%", "height": "85vh", "max-width": "98%", "max-height": "85vh"});
      $("#image").css({"max-height": "85vh","height": ""});
      break;
  }
  $("#divResizeWindow").tooltip('hide');
});

//Scale du canvas en fonction de la capture 50% 75% 100% ; default 75%
$("#nresizeCanvas").slider({formatter: function(value) {return value + "%";}});
$("#nresizeCanvas").change(function(){
  scale = parseInt(this.value) / 100;
  canvas.width = video.videoWidth * scale;
  canvas.height = video.videoHeight * scale;
});

//pureté image (cmpression jpg) 20% @ 100% step 20% :default 80%
$("#npurete").slider({formatter: function(value) {return value + "%";}});
$("#npurete").change(function(){
  imgQuality = parseInt(this.value) / 100;
});

//refresh rate en ms, 200ms @ 2000ms step 50ms : default 500ms
$("#nrefresh").slider({formatter: function(value) {return value + "ms";}});
$("#nrefresh").change(function(){
  frameRate = parseInt(this.value);
  clearInterval(frameShare);
  frameShare = setInterval(interval, frameRate);
});

$('#bFull').on('click', function(){
  // FullScreen event
  document.documentElement.requestFullscreen().catch(function(error) {console.log(error.message);});
  $("#modaleSC").addClass("modal-full");
  $("#modaleSC").css({"min-width": "", "min-height": "", "margin":"0px"});
  $("#image").css({"max-height": "95vh","height": "95vh"});
  $(".close, #sliderReceveur").hide();
  $("#bExitFull").show();
});

$('#bExitFull').on('click', function(){
  exitFunction();
});

function exitFunction(){
  $("#modaleSC").removeClass("modal-full");
  $("#modaleSC").css({"width": "50%", "height": "50vh", "max-width": "50%", "max-height": "50vh", "margin":"10px auto"});
  $("#image").css({"max-height": "50vh","height": ""});
  $(".close, #sliderReceveur").show();
  $("#bExitFull").hide();
  $('#nresizeWindow').slider('refresh');
  // Exit fullScreen
  document.exitFullscreen().catch(function(error) {console.log(error.message);});
}

// Si exit fullScreen déclenché par le navigateur
$(document).on('webkitfullscreenchange mozfullscreenchange fullscreenchange', function(){
  var fullscreenElement = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;
  if (fullscreenElement == null) exitFunction();
});

$(document).ready(function() {
  $('[data-toggle="tooltip"]').tooltip();
  $("#sliderReceveur, #sliderEmetteur, #divkbytes, #bExitFull").hide();
});