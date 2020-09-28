wsc = null;

function initWSC() {
  wsc.onopen = function() {
    console.log("onopen of", wsa.url, "in", (new Date().getTime() - start), "ms");
  }
  
  wsc.onmessage = function(evt) {
    if (evt.data != "") {
      msg = JSON.parse(evt.data);
      switch(msg.type){
        case 'share':
          //rafraichir le partage video. dans la modale.
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

var canvas = document.createElement('canvas');
canvas.width = screen.width;
canvas.height = screen.height;
var context = canvas.getContext('2d');
var streamVideo;

$('#bshareScreen').on('click', function(){
  $('#m_sc').modal('show'); return false;
});

$('#bShare').on('click', function(){
  p = parseInt($('#room').val())+10000;
  wsc = new WebSocket("wss://www.salutem.co:"+ p +"/");
  initWSC();
  $('#bstopSC').show();
  wsc.send(JSON.stringify({
    type: 'start',
    message: ''
  }));

  const video = document.getElementById('video');
  //var constraints = { video: { width: 960, height: 520, frameRate: { ideal: 29, max: 30 }, facingMode: "user" } };
  var constraints = { video: { frameRate: { ideal: 8, max: 12 } } };

  getMedia(constraints);

  var frameShare = setInterval(function(){
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    uri = canvas.toDataURL('image/jpeg', 1.0);
    wsc.send(JSON.stringify({
      type: 'master',
      image: uri
    }));
  }, 200);

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

    $('#bstopSC').on('click', function(){
      streamVideo.getTracks().forEach(track => track.stop());
      clearInterval(frameShare);
      wsc.send(JSON.stringify({
        type: 'stop',
        message: ''
      }));
    });
  }
});

//ready
$(document).ready(function() {
  $('#bstopSC').hide();
});
