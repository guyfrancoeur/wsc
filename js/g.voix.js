$(document).ready(function() {
  $("#divReception").hide();
});

wsaReady = 0, first = 0, timeslice = 20;
var stream, recorder;
const mime = "audio/webm;codecs=opus";
fc = []; // Sauvegarde des firstChunks reçus
nbCall = 0;

function eventOnUpdate(i) {
  window[i+"_audioReady"] = 1; 
  window[i+"_mediaSource"].sourceBuffers[0].removeEventListener('updateend',window[i+"_handler"]);
}

function createAudio(n){
  window[n+"_mediaSource"] = new MediaSource();
  window[n+"_audioReady"] = 0;
  window[n+"_audio"] = document.createElement('audio');
  window[n+"_audio"].autoplay = true;

  window[n+"_audio"].addEventListener('playing', function(){
    $("#divReception").show();
  });

  window[n+"_audio"].src = URL.createObjectURL(window[n+"_mediaSource"]);

  document.body.appendChild(window[n+"_audio"]);
  window[n+"_mediaSource"].addEventListener('sourceopen', function(){
    var sourceBuffer = window[n+"_mediaSource"].addSourceBuffer(mime);
    window[n+"_mediaSource"].sourceBuffers[0].mode = 'sequence';

    if(fc.length != 0){ // Ajout firstChunks
      window[n+"_mediaSource"].sourceBuffers[0].appendBuffer(fc);
      window[n+"_handler"] = eventOnUpdate.bind(null, n);
      window[n+"_mediaSource"].sourceBuffers[0].addEventListener('updateend',window[n+"_handler"]);
    }

    window[n+"_mediaSource"].sourceBuffers[0].addEventListener('error', function(e){
      console.warn('SourceBuffer : ' + e.type + " => Reset audio");
      window[n+"_audioReady"] = 0;
      createAudio(n);
    });
  });
}

async function startRecord() {
  try {
    if (!stream) stream = await navigator.mediaDevices.getUserMedia({ audio: { sampleRate: 8000, sampleSize: 8, channelCount: 1, echoCancellation: true,} });
    if (!recorder) recorder = new MediaRecorder(stream, { mimeType: mime });

    recorder.start(timeslice); // Timeslice de  20ms

    var cpt = 0;

    recorder.ondataavailable = async event => {
      if (event.data.size > 0) {
        var reader = new FileReader();
        reader.addEventListener("loadend", function (){
          var res = [...new Uint8Array(reader.result)];
          if(cpt > 2 && ws.bufferedAmount == 0){ // Ne pas envoyer les premiers paquets audio (à cause des firstChunks envoyés dès la connexion)
            wsa.send(JSON.stringify({
              type: "audio",
              data: res,
              name: pseudo
            }));
          }
          cpt ++;
        });

        // Si (event.data.size == 1), ça bloque le sourceBuffer de la personne qui reçoit les données. Alors on ne l'envoie pas et on redémarre l'enregistrement.
        if(event.data.size == 1 && cpt > 2){ // (cpt == 2) => pour laisser passer les deux premiers paquets de données (le premier paquet de l'enregistrement a une taille de 1 lui aussi)
          console.warn("Data size : " + event.data.size + " => restart record");
          wsa.send(JSON.stringify({ type: "stop", name:pseudo}));
          if (recorder.state == 'recording') recorder.stop();
          console.log("recorder stop");
          setTimeout(function(){
            ws.send(JSON.stringify({ type: "swsa", name:pseudo}));
            startRecord();
            console.log("recorder re-start");
          }, 500);
        }
        else reader.readAsArrayBuffer(event.data);
      }
    }

    recorder.onerror = function(event) { console.error(event.error); }

  } catch(err) {
    console.error(err.name + " : " + err.message);
  }
}

$("#bstart").click(function(){
  first = 1;
  ws.send(JSON.stringify({ type: "swsa", name:pseudo}));
  if(wsaReady) clickInitWsa();
  $('#bstart').tooltip('hide');
  $("#bstart").attr("disabled",true);
  $("#bstop, #bmuteRecord").attr("disabled",false);
});

$("#bstop").click(function(){
  first = 0;
  if(wsaReady){
    $('#bstop').tooltip('hide');
    console.log("button stop");
    wsa.send(JSON.stringify({ type: "stop", name:pseudo }));
    if (recorder.state == 'recording' || recorder.state == 'paused') recorder.stop();
    $("#bstart").attr("disabled",false);
    $("#bstop, #bmuteRecord").attr("disabled",true);
    $("#bmuteRecord").html('Mute');
  }
});

$("#bmuteRecord").click(function(){
 if(recorder.state == 'recording'){
   recorder.pause();
   $("#bmuteRecord").html('Unmute');
 }
 else if(recorder.state == 'paused'){
   recorder.resume();
   $("#bmuteRecord").html('Mute');
 }
});

allMute = false;
$("#bmuteAudio").click(function(){
  if(allMute){
    $('#bmuteAudio').attr('data-original-title',"Couper le son du (ou des) appel(s)");
    $("#bmuteAudio").html('<svg width="1.5em" height="1.5em" viewBox="0 0 16 16" class="bi bi-volume-down" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M8.717 3.55A.5.5 0 0 1 9 4v8a.5.5 0 0 1-.812.39L5.825 10.5H3.5A.5.5 0 0 1 3 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06zM8 5.04L6.312 6.39A.5.5 0 0 1 6 6.5H4v3h2a.5.5 0 0 1 .312.11L8 10.96V5.04z"/><path d="M10.707 11.182A4.486 4.486 0 0 0 12.025 8a4.486 4.486 0 0 0-1.318-3.182L10 5.525A3.489 3.489 0 0 1 11.025 8c0 .966-.392 1.841-1.025 2.475l.707.707z"/></svg>');
  }else{
    $('#bmuteAudio').attr('data-original-title',"Rétablir le son du (ou des) appel(s)");
    $("#bmuteAudio").html('<svg width="1.5em" height="1.5em" viewBox="0 0 16 16" class="bi bi-volume-mute" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06zM6 5.04L4.312 6.39A.5.5 0 0 1 4 6.5H2v3h2a.5.5 0 0 1 .312.11L6 10.96V5.04zm7.854.606a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708l4-4a.5.5 0 0 1 .708 0z"/><path fill-rule="evenodd" d="M9.146 5.646a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0z"/></svg>');
  }
  $('audio').each(function(){ this.muted = !allMute; });
  setTimeout(function(){ $('#bmuteAudio').tooltip('hide') },500);
  allMute = !allMute;
});

function clickInitWsa() {
  console.log("button start");
  startRecord();
}

function receiveInitWsa(n){
  console.log("case start");
  nbCall ++;
  createAudio(n);
}

function initWsa(f) {
  wsa.onopen = function() {
    console.log("onopen of", wsa.url, "in", (new Date().getTime() - start), "ms");
    wsaReady = 1;
    if(f) clickInitWsa();
  }
  
  wsa.onmessage = function(evt) {
    if (evt.data != "") {
      msg = JSON.parse(evt.data);
      switch(msg.type){
        case 'stop':
          console.log("case stop");
          nbCall --;
          if(!nbCall) $("#divReception").hide();
          var n = msg.name;
          window[n+"_audioReady"] = 0;
          delete window[n+"_audioReady"];
          delete window[n+"_mediaSource"];
          window[n+"_audio"].remove();
          delete window[n+"_audio"];
          break;

        case 'firstchunks':
          fc = Uint8Array.from(msg.data);
          var l = msg.calls.length;
          if(l != 0){
            nbCall += l;
            msg.calls.forEach(function(c) {
              createAudio(c);
            });
          }
          break;

        case 'audio': // Réception des données audio
          var n = msg.name;
          if(connecte == 1 && window[n+"_audioReady"] == 1 && window[n+"_mediaSource"].sourceBuffers[0].updating == false){
            if (window[n+"_mediaSource"].readyState === 'open'){
              window[n+"_mediaSource"].sourceBuffers[0].appendBuffer(Uint8Array.from(msg.data));
            }else{
              console.error("Ajout données audio au buffer impossible \n mediasource.readystate : " + window[n+"_mediaSource"].readyState + " | audioReady : " + window[n+"_audioReady"]);
            }
          }
          break;
      }
    }
  }

  wsa.onerror = function() {
    console.log("error wsa");
  }
}
