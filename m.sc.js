master = 0;

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
          //ouvrir la modale pour mettre le partage.
          break;

        case 'stop':
          console.log("case stop");
          // femeture du partage.
          //$("#divEmission").show();
          //$("#divReception").hide();
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
     
    var frameShare = setInterval(function(){
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      uri = canvas.toDataURL('image/jpeg', 1.0);
      wsc.send(JSON.stringify({
        type: 'master',
        message: uri
      }));
    }, 200);
      
    $('#bstopSC').on('click', function(){
      streamVideo.getTracks().forEach(track => track.stop());
      clearInterval(frameShare);
      wsc.send(JSON.stringify({
        type: 'stop',
        message: ''
      }));
      $('#bstopSC').hide();
      master = 0;
    });
  }
}

var canvas = document.createElement('canvas');
canvas.width = screen.width;
canvas.height = screen.height;
var context = canvas.getContext('2d');
var streamVideo;

$('#bshareScreen').on('click', function(){
  $('#m_sc').modal('show'); return false;
});

$('#bShare').on('click', function(){
  master = 1;
  share();
  $('#bstopSC').show();
  
  const video = document.getElementById('video');
  //var constraints = { video: { width: 960, height: 520, frameRate: { ideal: 29, max: 30 }, facingMode: "user" } };
  var constraints = { video: { frameRate: { ideal: 8, max: 12 } } };

  getMedia(constraints);

  async function getMedia(constraints){
    var streamVideo;
    try {
      streamVideo = await navigator.mediaDevices.getDisplayMedia(constraints);
      if ("srcObject" in video) video.srcObject = streamVideo
      else video.src = window.URL.createObjectURL(streamVideo); // Avoid using this in new browsers.
      video.onloadedmetadata = function(e) { video.play(); };
    } catch(err) {
      console.log(err.name + ": " + err.message);
      $("#msgErrMedia").show();
    }
  }
});

//ready
$(document).ready(function() {
  $('#bstopSC').hide();
});
