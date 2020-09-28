$(document).ready(function() {
  $('#bstopSC').hide();
});

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
  $('#bstopSC').show();

  const video = document.getElementById('video');
  //var constraints = { video: { width: 960, height: 520, frameRate: { ideal: 29, max: 30 }, facingMode: "user" } };
  var constraints = { video: { frameRate: { min: 5, ideal: 10, max: 15 } } };

  getMedia(constraints);

  var frameShare = setInterval(function(){
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    uri = canvas.toDataURL('image/jpeg', 1.0);
    wsc.send(JSON.stringify({
      type: 'share',
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
      streamVideo.getTracks().forEach(track => track.stop())
      clearInterval(frameShare);
      // Je crois pas besoin de faire le send après stop. (pas vraiment utile)
      //ws.send(JSON.stringify({
      //  type: 'stopShare',
      //  image: uri
      //}));
    });
  }
});
