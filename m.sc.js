var master = 0;
var frameRate = 500;  // pour test
var imgQuality = 0.8;  // pour test
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
          //if (msg.zip == 1) v = LZString.decompressFromBase64(msg.message);
          //else v = msg.message;
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
          $("#modaleSC").css({"min-width": "37%", "min-height": "42%"});
          $('#nresizeWindow').slider('refresh');
          var fullscreenElement = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;
          if (fullscreenElement != null) exitFullScreen();
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
  //v = LZString.compressToBase64(uri);
  //a = v.length; b = uri.length;
  //c = 0;
  //s = "";
  //if (a < b) {
  //  s = v;
  //  moy = (moy + a) / 2;
  //  c = 1;
  //  cpt++; // Affichage de moy dans la modale 1 fois sur 4
  //  if(cpt == 3){
  //    $("#moy").html(moy.toFixed(2));
  //    cpt = 0;
  //  }
  //} else {
  //  s = uri;
  //}
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
  $("#modaleSC").css({"min-width": "37%", "min-height": "42%"});
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
  $("#modaleSC").css({
    "min-width": parseInt(this.value)-13 + "%", 
    "min-height": parseInt(this.value)-8 + "%"
  });
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
  $("#modaleSC").css({"min-width": "", "min-height": ""});
  $(".close, #sliderReceveur").hide();
  $("#bExitFull").show();
  var facteur = ($(window).height() - 35) / $("#image").height();
  $("#image").css({
    "max-width": facteur * $("#image").width(),
    "max-height": $(window).height() - 35
  });
});

$('#bExitFull').on('click', function(){
  exitFullScreen();
});

function exitFullScreen(){
  $("#modaleSC").removeClass("modal-full");
  $("#modaleSC").css({
    "min-width": parseInt($("#nresizeWindow").value)-13 + "%", 
    "min-height": parseInt($("#nresizeWindow").value)-8 + "%"
  });
  $(".close, #sliderReceveur").show();
  $("#bExitFull").hide();
  $('#nresizeWindow').slider('refresh');
  // Exit fullScreen
  document.exitFullscreen().catch(function(error) {console.log(error.message);});
}

// Si exit fullScreen déclenché par le navigateur
$(document).on('webkitfullscreenchange mozfullscreenchange fullscreenchange', function(){
  var fullscreenElement = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;
  if (fullscreenElement == null) exitFullScreen();
});

$(document).ready(function() {
  $('[data-toggle="tooltip"]').tooltip();
  $("#sliderReceveur, #sliderEmetteur, #divkbytes, #bExitFull").hide();
});