$(document).ready(function() {
  $("#divReception").hide();
});

audioReady = 0;
var stream, recorder;
const mime = "audio/webm;codecs=opus";
const audio = document.getElementById("audio");

audio.onplaying = (e) => {
  $("#divEmission").hide();
  $("#divReception").show();
}

fc = []; // Sauvegarde des firstChunks reçus

function createAudio(){
  mediaSource = new MediaSource();
  audio.src = URL.createObjectURL(mediaSource);
  mediaSource.addEventListener('sourceopen', function(){
    sourceBuffer = mediaSource.addSourceBuffer(mime);
    sourceBuffer.mode = 'sequence';
    console.log("audio créé");

    if(fc.length != 0){ // Ajout firstChunks
      sourceBuffer.appendBuffer(fc);
      sourceBuffer.onupdateend = (e) => { audioReady = 1; }
    }

    sourceBuffer.addEventListener('error', e => {
      console.error('SourceBuffer : ' + e.type);
    });
  });
}

async function startRecord() {
  try {
    if (!stream) stream = await navigator.mediaDevices.getUserMedia({ audio: { sampleSize: 8, echoCancellation: true } });
    if (!recorder) recorder = new MediaRecorder(stream, { mimeType: mime });

    recorder.start(20); // Timeslice de  20ms

    var cpt = 0;

    recorder.ondataavailable = async event => {
      if (event.data.size > 0) {
        var reader = new FileReader();
        reader.addEventListener("loadend", function () {
          var res = [...new Uint8Array(reader.result)];
          if(cpt > 2){ // Ne pas envoyer les premiers paquets audio (à cause des firstChunks envoyés dès la connexion)
            wsa.send(JSON.stringify({
              type: "audio",
              data: res
            }));
          }
          cpt ++;
        });

        // Si (event.data.size == 1), ça bloque le sourceBuffer de la personne qui reçoit les données. Alors on ne l'envoie pas et on redémarre l'enregistrement.
        if(event.data.size == 1 && cpt > 2){ // (cpt == 2) => pour laisser passer les deux premiers paquets de données (le premier paquet de l'enregistrement a une taille de 1 lui aussi)
          console.warn("Data size : " + event.data.size + " => restart record");
          wsa.send(JSON.stringify({ type: "stop" }));
          if (recorder.state == 'recording') recorder.stop();
          console.log("recorder stop");
          setTimeout(function(){
            wsa.send(JSON.stringify({ type: "start" }));
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
  console.log("button start");
  wsa.send(JSON.stringify({ type: "start" }));
  startRecord();
  $("#statutenvoi").html("Appel en cours ...");
  $("#bstart").attr("disabled",true);
  $("#bstop, #bmuteRecord").attr("disabled",false);
});

$("#bstop").click(function(){
  console.log("button stop");
  wsa.send(JSON.stringify({ type: "stop" }));
  if (recorder.state == 'recording') recorder.stop();
  $("#bstart").attr("disabled",false);
  $("#bstop, #bmuteRecord").attr("disabled",true);
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

$("#bmuteAudio").click(function(){
  if(audio.muted == true){
    audio.muted = false;
    $("#bmuteAudio").html('<svg width="1.5em" height="1.5em" viewBox="0 0 16 16" class="bi bi-volume-down" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M8.717 3.55A.5.5 0 0 1 9 4v8a.5.5 0 0 1-.812.39L5.825 10.5H3.5A.5.5 0 0 1 3 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06zM8 5.04L6.312 6.39A.5.5 0 0 1 6 6.5H4v3h2a.5.5 0 0 1 .312.11L8 10.96V5.04z"/><path d="M10.707 11.182A4.486 4.486 0 0 0 12.025 8a4.486 4.486 0 0 0-1.318-3.182L10 5.525A3.489 3.489 0 0 1 11.025 8c0 .966-.392 1.841-1.025 2.475l.707.707z"/></svg>');
  }
  else{
    audio.muted = true;
    $("#bmuteAudio").html('<svg width="1.5em" height="1.5em" viewBox="0 0 16 16" class="bi bi-volume-mute" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06zM6 5.04L4.312 6.39A.5.5 0 0 1 4 6.5H2v3h2a.5.5 0 0 1 .312.11L6 10.96V5.04zm7.854.606a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708l4-4a.5.5 0 0 1 .708 0z"/><path fill-rule="evenodd" d="M9.146 5.646a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0z"/></svg>');
  }
});