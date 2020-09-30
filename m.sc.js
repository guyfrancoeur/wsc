var master = 0;
var frameRate = 500;  // pour test
var imgQuality = 0.8;  // pour test

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
          if(master == 0){
            $("#divSlider").show();
            $("#bShare").hide();
          }
          //ouvrir la modale pour mettre le partage.
          break;

        case 'stop':
          console.log("case stop");
          $("#m_sc").modal('hide');
          $("#divmoy, #divSlider, #image").hide();
          $("#bShare").show();
          $("#modaleSC").width("43%");
          $("#modaleSC").height("48%");
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
  $("#divmoy").show();
  cpt = 0;

   //********  todo
  if (master == 1) {
    wsc.send(JSON.stringify({
      type: 'start',
      message: ''
    }));
     
    frameShare = setInterval(function(){
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
    }, frameRate);
  }
}

function stopShare(){
  streamVideo.getTracks().forEach(track => track.stop());
  clearInterval(frameShare);
  wsc.send(JSON.stringify({
    type: 'stop',
    message: ''
  }));
  master = 0;
}

var canvas = document.createElement('canvas');
//canvas.width = screen.width;
//canvas.height = screen.height;
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
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        video.play();
      };
      streamVideo.getVideoTracks()[0].addEventListener('ended', () => 
        stopShare()
      );
      $("#bShare, #divSlider").hide();
      master = 1;
      share();
    } catch(err) {
      console.log(err.name + ": " + err.message);
      $("#msgErrMedia").show();
    }

    //Resize de la fenêtre en train d'être partagée -> resize du canvas
    $(video).on('resize', function(){
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    });
  }
});

//Slider
$("#nsecure").slider({formatter: function(value) {return value + "%";}});
$("#nsecure").change(function(){
  $("#modaleSC").width(parseInt(this.value)-7 + "%");
  $("#modaleSC").height(parseInt(this.value)-2 + "%");
});

$(document).ready(function() {
  $("#divmoy, #divSlider").hide();
});
