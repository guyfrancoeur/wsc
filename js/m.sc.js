var master = 0; // si master = 1 (-> celui qui partage)
var imgQuality = $("#npurete").val() / 100;
var scale = $('#nresizeCanvas').val() / 100;

$('#m_sc .modal-content').resizable({
  minHeight: 265,
  minWidth: 157,
  resize: resizeVideo
});
$('#m_sc .modal-dialog').draggable({ handle: $('#m_sc .head') });

function initWsc() {
  wsc.onopen = function() {
    console.log("onopen of", wsc.url, "in", (new Date().getTime() - startWsc), "ms");
    if(master) getMedia(constraints);
    else{
      console.log("case start wsc");
      $("#bShare,#sliderEmetteur, #divkbytes").hide();
      $("#video, #bFull").show();
      $("#m_sc").modal({backdrop: false, keyboard: false});
      if (!document.hasFocus()) newUpdate();
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
          $("#bFull, #video").show();
          $("#bShare, #sliderEmetteur, #divkbytes").hide();
          break;
      }
    }
  }

  wsc.onclose = function() { console.log("wsc closed"); }

  wsc.onerror = function() { console.log("error wsc"); }
}

function stopShare(){
  console.log("case stop wsc");
  $("#video, #bFull, #sliderEmetteur, #divkbytes").hide();
  $('#vdieo').removeAttr("poster");
  $("#bShare").show();
  $('#nresizeWindow').bootstrapSlider('refresh');
  var fullscreenElement = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;
  if (fullscreenElement != null) exitFunction();
  $("#m_sc").modal('hide'); // femeture du partage.
  wsc.close();
  $("#modaleSC > .modal-content").css({"width": "", "height": ""});
  $("#video").css({"maxWidth": "100%", "maxHeight": "50vh"});
}

function share() {
  frameShare = setInterval(interval, $('#nrefresh').val());
  $("#sliderEmetteur, #divkbytes, #video").show();
  $("#bShare").hide();
}

function interval(){
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  uri = canvas.toDataURL('image/jpeg', imgQuality);
  wsc.send(JSON.stringify({
    type: 'master',
    message: uri
  }));
  var kbytes = (uri.length * (1000 / $('#nrefresh').val()) / 1000)
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
    ws.send(JSON.stringify({ type: 'stop_sharing' }));
    master = 0;
  }

  //Resize de la fenêtre en train d'être partagée -> resize du canvas
  $(video).on('resize', function(){
    canvas.width = video.videoWidth * scale;
    canvas.height = video.videoHeight * scale;
  });
}

function resizeVideo(){
  if($("#video").css("width") != 0 && $("#video").css("height") != 0){
    w2 = $("#modaleSC > .modal-content").width() - 60;
    h2 = $("#modaleSC > .modal-content").height() - $("#modaleSC > .modal-content > .modal-header").height() - 60;
    if($("#video").css("width") > $("#video").css("height")){
      $("#video").css({"width" : w2 + "px", "maxHeight" : h2 + "px", "maxWidth" : "none", "height": "auto"});
    }
    else $("#video").css({"height" : h2 + "px", "maxWidth" : w2  + "px", "maxHeight" : "none", "width": "auto"});
  }
}

// Modale au premier plan au clic (par rapport à la modale m_code)
$("#m_sc .modal-content").on('click', function () {
  if($("#m_sc").css("z-index") == 200){
    $("#m_sc").css("z-index","201");
    $("#m_code").css("z-index","200");
  }
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
  //frameRate = parseInt(this.value);
  clearInterval(frameShare);
  frameShare = setInterval(interval, parseInt(this.value));
});

$('#bFull').on('click', function(){
  // FullScreen event
  document.documentElement.requestFullscreen().catch(function(error) {console.log(error.message);});
  $("#m_sc").addClass("modal-full");
  $("#m_sc, #modaleSC").css({"top": "", "left": ""});
  $(".close, #bFull").hide();
  $("#bExitFull").show();
  resizeVideo();
});

$('#bExitFull').on('click', function(){ exitFunction(); });

function exitFunction(){
  $("#m_sc").removeClass("modal-full");
  $("#modaleSC > .modal-content").css({"width": "", "height": "400px"});
  resizeVideo();
  $(".close, #bFull").show();
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
  $("#bFull, #sliderEmetteur, #divkbytes, #bExitFull").hide();  
});

$("#m_sc").on('shown.bs.modal', function () {
  if($("#m_sc").css("z-index") == 200){
    $("#m_sc").css("z-index","201");
    $("#m_code").css("z-index","200");
  }
});
