var master = 0; // si master = 1 (-> celui qui partage)
var frameRate = 500;
var imgQuality = 0.8;
var scale = .8;

$('#m_sc .modal-content').resizable({minHeight: 157, minWidth: 498});
$('#m_sc .modal-dialog').draggable({handle: $('#div-move')});

$("#m_sc .modal-content").on('click', function () {
  if($("#m_sc").css("z-index") == 200){
    $("#m_sc").css("z-index","201");
    $("#m_code").css("z-index","200");
  }
});

function initWsc() {
  wsc.onopen = function() {
    console.log("onopen of", wsc.url, "in", (new Date().getTime() - startWsc), "ms");
    if(master) getMedia(constraints);
    else{
      console.log("case start wsc");
      $("#bShare,#sliderEmetteur, #divkbytes").hide();
      $("#modaleSC").css({"width": "50%", "height": "50vh", "max-width": "50%", "max-height": "50vh"});
      $("#video, #sliderReceveur").show();
      $("#m_sc").modal({backdrop: false, keyboard: false});
    }
  }
  
  wsc.onmessage = function(evt) {
    if (evt.data != "") {
      msg = JSON.parse(evt.data);
      switch(msg.type){
        case 'share': //rafraichir le partage video. dans la modale.
          $('#video').attr('poster', msg.message);
          break;

        case 'start':
          console.log("case start wsc");
          $("#m_sc").modal({backdrop: false, keyboard: false}); //ouvrir la modale pour mettre le partage.
          $("#sliderReceveur, #video").show();
          $("#bShare, #sliderEmetteur, #divkbytes").hide();
          $("#video").css({"max-height": "50vh","height": "50vh"});
          $("#modaleSC").css({"width": "50%", "height": "50vh", "max-width": "50%", "max-height": "50vh"});
          break;
      }
    }
  }

  wsc.onclose = function() {
    console.log("wsc closed");
  }

  wsc.onerror = function() {
    console.log("error wsc");
  }
}

function stopShare(){
  console.log("case stop wsc");
  $("#video, #sliderReceveur, #sliderEmetteur, #divkbytes").hide();
  $('#vdieo').removeAttr("poster");
  $("#bShare").show();
  $("#modaleSC").css({"width": "", "height": "", "max-width": "", "max-height": ""});
  $("#video").css({"max-height": "50vh","height": ""});
  $('#nresizeWindow').bootstrapSlider('refresh');
  var fullscreenElement = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;
  if (fullscreenElement != null) exitFunction();
  $("#m_sc").modal('hide'); // femeture du partage.
  wsc.close();
}

function share() {
  frameShare = setInterval(interval, 1000);
  $("#sliderEmetteur, #divkbytes, #video").show();
  $("#video").css({"max-height": "50vh","height": "50vh"});
  $("#bShare").hide();
  $("#modaleSC").css({"width": "50%", "height": "50vh", "max-width": "50%", "max-height": "50vh"});
}

function interval(){
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  uri = canvas.toDataURL('image/jpeg', imgQuality);
  wsc.send(JSON.stringify({
    type: 'master',
    message: uri
  }));
  var kbytes = (uri.length * (1000 / frameRate) / 1000)
  $("#kbytes").html(kbytes.toFixed(2));
  $('#video').attr('poster', uri);
  
}

function onstopShare(){
  streamVideo.getTracks().forEach(track => track.stop());
  clearInterval(frameShare);
  ws.send(JSON.stringify({ type: 'stop_sharing' }));
  master = 0;
}

var canvas = document.createElement('canvas');
var context = canvas.getContext('2d');
var streamVideo;
const video = document.getElementById('video');
var constraints = { video: { frameRate: { ideal: 8, max: 12 } } };

$('#bshareScreen').on('click', function(){
  $('#m_sc').modal({backdrop: false, keyboard: false}); return false;
});

$('#bShare').on('click', function(){
  master = 1;
  ws.send(JSON.stringify({ type: "swsc"}));
});

async function getMedia(constraints){
  try {
    streamVideo = await navigator.mediaDevices.getDisplayMedia(constraints);
    if ("srcObject" in video) video.srcObject = streamVideo
    else video.src = window.URL.createObjectURL(streamVideo); // Avoid using this in new browsers.
    video.onloadedmetadata = function() {
      canvas.width = video.videoWidth * scale;
      canvas.height = video.videoHeight * scale;
      video.play();
    };
    streamVideo.getVideoTracks()[0].addEventListener('ended', () => onstopShare());
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

// Resize window
$("#nresizeWindow").bootstrapSlider({formatter: function(value) {return value + "%";}});
$("#nresizeWindow").change(function(){
  switch(parseInt(this.value)){
    case 50:
      $("#modaleSC").css({"width": "50%", "height": "50vh", "max-width": "50%", "max-height": "50vh"});
      $("#video").css({"max-height": "50vh","height": "50vh"});
      break;
    case 75:
      $("#modaleSC").css({"width": "75%", "height": "75vh", "max-width": "75%", "max-height": "75vh"});
      $("#video").css({"max-height": "75vh","height": "75vh"});
      break;
    case 100:
      $("#modaleSC").css({"width": "98%", "height": "85vh", "max-width": "98%", "max-height": "85vh"});
      $("#video").css({"max-height": "85vh","height": "85vh"});
      break;
  }
  $("#divResizeWindow > div").tooltip('hide');
});

//Scale du canvas en fonction de la capture 50% 75% 100% ; default 75%
$("#nresizeCanvas").bootstrapSlider({formatter: function(value) {return value + "%";}});
$("#nresizeCanvas").change(function(){
  scale = parseInt(this.value) / 100;
  canvas.width = video.videoWidth * scale;
  canvas.height = video.videoHeight * scale;
});

//pureté image (cmpression jpg) 20% @ 100% step 20% :default 80%
$("#npurete").bootstrapSlider({formatter: function(value) {return value + "%";}});
$("#npurete").change(function(){
  imgQuality = parseInt(this.value) / 100;
});

//refresh rate en ms, 200ms @ 2000ms step 50ms : default 500ms
$("#nrefresh").bootstrapSlider({formatter: function(value) {return value + "ms";}});
$("#nrefresh").change(function(){
  frameRate = parseInt(this.value);
  clearInterval(frameShare);
  frameShare = setInterval(interval, frameRate);
});

$('#bFull').on('click', function(){
  // FullScreen event
  document.documentElement.requestFullscreen().catch(function(error) {console.log(error.message);});
  $("#m_sc").addClass("modal-full");
  $("#modaleSC").css({"min-width": "", "min-height": "", "margin":"0px"});
  $("#video").css({"max-height": "95vh","height": "95vh"});
  $(".close, #sliderReceveur").hide();
  $("#bExitFull").show();
});

$('#bExitFull').on('click', function(){
  exitFunction();
});

function exitFunction(){
  $("#m_sc").removeClass("modal-full");
  $("#modaleSC").css({"width": "50%", "height": "50vh", "max-width": "50%", "max-height": "50vh", "margin":"10px auto"});
  $("#video").css({"max-height": "50vh","height": ""});
  $(".close, #sliderReceveur").show();
  $("#bExitFull").hide();
  $('#nresizeWindow').bootstrapSlider('refresh');
  document.exitFullscreen().catch(function(error) {console.log(error.message);}); // Exit fullScreen
}

// Si exit fullScreen déclenché par le navigateur
$(document).on('webkitfullscreenchange mozfullscreenchange fullscreenchange', function(){
  var fullscreenElement = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;
  if (fullscreenElement == null){
    if ($('#m_sc').hasClass('in')) exitFunction(); // Pour l'event du mode plein écran de la modale de partage (= si la modale est ouverte)
    else{ // Sinon c'est l'event pour le plein écran du chat entier
      $("#bExitFullChat").hide();
      $("#bFullChat").show();
    }
  }
});

$(document).ready(function() {
  $('[data-toggle="tooltip"]').tooltip();
  $("#sliderReceveur, #sliderEmetteur, #divkbytes, #bExitFull").hide();  
});