var a1 = new Audio('./consequence.mp3');
var a2 = new Audio('./harp.mp3');
var start = new Date().getTime();
var ws = new WebSocket("wss://echo.websocket.org");
ws.onopen = function() { $('#cLatence1').text( (new Date().getTime() - start) +"ms"); ws.close(); $('#bName').attr('disabled', false); };
var elem = document.getElementById('messages'); //pour scroll-auto
var pseudo; // TODO (a faire disparaitre)

const ico = document.getElementById('favicon');

function newUpdate() {
  ico.href = './ico/favicon.ico';
  a2.play();
}

$(window).on("blur focus", function(e) {
  ico.href = './favicon.ico';
});


function fResize() {
  //$('#bS, #bF, #bH').height($('#message').height());
  $('#bS').height($('#message').height());
  $('#message').css('width','100%');
  $('#msgs, #messages').height($(window).height() - $('#welcome').height() - $('#input-div').height() - 40);
  $('#m_user').css('top','4rem');
  resizeModaleUsagers();
}

//revoir ce code pour le ctrl-+ (gerer plus de cas de resize)
function resizeModaleUsagers(){
  topModaleUsers = $("#users").offset().top;
  dDessus = (topModaleUsers - $(window).scrollTop());
  if($("#users > li").length > 1 && ($("#users > li").length * 18.18) > ($(window).height() - dDessus - $('#input-div').height() - 142 - 30)){ // 18.18 = hauteur d'un <li> dans liste usagers
    newSize = $(window).height() - dDessus - 142 - 30; // 142 = hauteur modale vide
    $("#users").height(newSize);
    $("#users").css("overflow-y","scroll");
  }
  else{
    $("#users").css("overflow-y","hidden");
    $("#users").height("");
  }
}

window.onresize = resizeModaleUsagers;
$('#message').on('focus blur', function(){ resizeModaleUsagers(); }); // Pour permettre le resize modale usager quand clavier du mobile est déployé

$(window).on('resize', function(){
  var win = $(this); //this = window
  $('#msgs, #messages').height(win.height() - $('#name-div').height() - $('#input-div').height() - 40);
  $('#message').width($('#input-div').width() - $('#bMsg').width() - 100);
  fResize();
});

navigator.tell = (function(){
var ua = navigator.userAgent, tem, M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
if(/trident/i.test(M[1])){
  tem =  /\brv[ :]+(\d+)/g.exec(ua) || [];
  return 'IE '+(tem[1] || '');
}
if(M[1] === 'Chrome'){
    tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
    if(tem != null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
}
M = M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
if((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
return M.join(' ');
})();

function readURL(input) {
  var reader = new FileReader();
  reader.onloadend = function () {
    $('#preview').attr('src', this.result);
  };

  if (input.files && input.files[0]) {
    reader.readAsDataURL(input.files[0]);
  } else {
    $('#preview').attr('src', "");
  }
}

function KeyPress(e) {
  if(e.keyCode == 123 || e.keyCode == 27) return false;
  if(e.metaKey && e.altKey && e.keyCode == 74) { return false; }
  if(e.ctrlKey && e.shiftKey && e.keyCode == 73) { return false; }
  if(e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0)) { return false; }
  if(e.ctrlKey && e.shiftKey && e.keyCode == 'C'.charCodeAt(0)) { return false; }
  if(e.ctrlKey && e.shiftKey && e.keyCode == 'J'.charCodeAt(0)) { return false; }
  if(e.ctrlKey && e.keyCode == 'U'.charCodeAt(0) || e.keyCode == 'u'.charCodeAt(0)) { return false; }
  if(e.ctrlKey && e.keyCode == 'S'.charCodeAt(0) || e.keyCode == 's'.charCodeAt(0)) { return false; }
  var evtobj = window.event ? event : e
  if (evtobj.keyCode == 13 && evtobj.shiftKey) {
    e.preventDefault();
    if ($("#message").val().length > 0) {
      $('#bS').click();
    }
    return true;
  }
  if (evtobj.ctrlKey && evtobj.keyCode == '1'.charCodeAt(0)) {
    ws.send(JSON.stringify({
      type: 'clean',
      message: $('#message').val()
    }));
    $('#message').val('');
    return false;
  }
  if (evtobj.ctrlKey && evtobj.keyCode == '8'.charCodeAt(0)) {
    var text = $("#message").val();
    var text = '<pre class="prettyprint linenums">'+ $("#message").val() +'</pre>';
    $("#message").val(text);
    return false;
  }
  if (evtobj.ctrlKey && evtobj.keyCode == '9'.charCodeAt(0)) {
    var text = $("#message").val();
    var text = '<pre>'+ $("#message").val() +'</pre>';
    $("#message").val(text);
    return false;
  }
  if (evtobj.ctrlKey && evtobj.keyCode == '0'.charCodeAt(0)) {
    var text = $("#message").val();
    text = text.replace(/\</g, '&#60;');
    $("#message").val(text);
    return false;
  }
  if (evtobj.ctrlKey && evtobj.keyCode == 67 && evtobj.altKey) {
    displayDivCode();
    resizeDivCode();
    return false;
  }
}

$('#bmodaleusers').click(function() {
  $("#m_user").modal({backdrop: false, keyboard: true});
  $('#bmodaleusers').tooltip('hide');
});

//automatic pong by specification.

function init() {
  ws.onopen = function() {
    console.log("onopen of", ws.url, "in", (new Date().getTime() - startWs), "ms");
    $('#cLatence2').text( (new Date().getTime() - startWs) +"ms" );
    ws.send(JSON.stringify({
      type: 'link',
      message: navigator.tell
    }));
    $('#croom').text($('#room').val());
    ws.send(JSON.stringify({
      type: 'login',
      room: $('#room').val(),
      icon: '',
      pass: $('#pass').val(),
      message: navigator.tell
    }));
  }
  
  ws.onmessage = function(evt) {
    if (evt.data != "") {
      data = JSON.parse(evt.data);
      switch (data.type) {
        case 'gr8' :
          $('#m_i').load('./m.i.html');
          $('#m_aye').load('./m.aye.html');
          $('#m_sc').load('./m.sc.html');
          $('#m_code').load('./m.code.html');
          $("#message").attr("placeholder","Écrire votre message ici  (room #" + $('#room').val()+") \t[Shift + Enter pour envoyer le message]");
          $('[data-toggle="popover"]').popover({html: true});
          $('#msgs, #messages').height($(window).height() - $('#name-div').height() - $('#input-div').height() - 40);
          $('#message').width($('#input-div').width() - $('#bMsg').width() - 100);
          $('#content').show();
          PR.prettyPrint();
          $('#m_login').modal('hide');
          $('#m_user').modal({backdrop: false, keyboard: true});
          $('body').removeClass("grey");
          fResize();
          window.addEventListener('beforeunload', function (e) {
            if (ws.readyState == ws.OPEN) {
              e.preventDefault(); // If you prevent default behavior in Mozilla Firefox prompt will always be shown
              // Chromium requires returnValue to be set
              e.returnValue = "Voulez-vous vraiment quitter l'application?";
              return e.returnValue;
            } else {
              return;
            }
          });
          ws.send(JSON.stringify({
            type: 'name',
            room: $('#room').val(),
            icon: '',
            pass: $('#pass').val(),
            message: navigator.tell
          }));
          break;
        case 'lnk' : $('#count').text(data.count); $('#users').empty(); $('#users').append(data.message); $('#welcometext').text('Bonjour'); resizeModaleUsagers(); break;
        case 'tlk' :
          if (!document.hasFocus()) newUpdate();
          var text = data.message;
          text = text.replace(/\r?\n/g, '<br />');
          $('#messages').append($('<li>').html(text));
          elem.scrollTop = elem.scrollHeight;
          if (text.indexOf('pre class="prettyprint') != -1) PR.prettyPrint();
          break;
        case 'swsa':
          if(!wsaReady){
            startWsa = new Date().getTime();
            wsa = new WebSocket("wss://www.salutem.co:"+ (p+10000) +"/");
            initWsa(data.pseudo, data.calls);
          }
          else {
            if(data.pseudo != pseudo) receiveCall(data.pseudo);
          }
          break;
        case 'stop_audio':
          if(data.pseudo != pseudo) stopAudio(data.pseudo);
          break;
        case 'swsc':
          startWsc = new Date().getTime();
          wsc = new WebSocket("wss://www.salutem.co:"+ p +"/");
          initWsc();
          break;
        case 'stop_sharing':
          stopShare();
          break;
        case 'close_audio':
          if (wsa.readyState == wsa.OPEN) { wsa.close(); console.log('wsa.close() from index.js');}
          break;
        case 'code':
          $("#code-shared").html((data.message).replace(/\</g, '&#60;'));
          $("#code-shared").removeClass("prettyprinted");
          PR.prettyPrint();
      }
    }
  }

  ws.onerror = function(evt) {
    $('#messages').append($('<li>').html('<span style="color: red;">ERROR:</span> ' + evt.data));
  }
  
  ws.onclose = function () {
    console.log(ws.readyState, ws.CLOSE);
    window.location.reload(true);
  };
}

// Disable print screen
function copyToClipboard() {
  var aux = document.createElement("input");
  aux.setAttribute("value", "print screen disabled!");      
  document.body.appendChild(aux);
  aux.select();
  document.execCommand("copy");
  document.body.removeChild(aux);
}

function horloges() {
  // Heure Québec
  var dateQC = new Date(new Date().toLocaleString("en-US", {timeZone: "America/Montreal"}));
  var hQC = ('0' + dateQC.getHours()).slice(-2);
  var mQC = ('0' + dateQC.getMinutes()).slice(-2);
  $("#heureQuebec").html(hQC + ':' + mQC);

  // Heure France
  var dateFR = new Date(new Date().toLocaleString("en-US", {timeZone: "Europe/Paris"}));
  var hFR = ('0' + dateFR.getHours()).slice(-2);
  var mFR = ('0' + dateFR.getMinutes()).slice(-2);
  $("#heureFrance").html(hFR + ':' + mFR);
}

function login(){
  if ($('#room').val().length > 0 && $('#pass').val().length > 0) {
    ws.onopen = null;
    startWs = new Date().getTime();
    ws = new WebSocket("wss://www.salutem.co:"+ $('#room').val() +"/");
    p = parseInt($('#room').val())+10000;
    init();
  }
}

// ************************************************  DOCUMENT READY   **************************************************
$(document).ready(function(){
  $('[data-toggle="tooltip"]').tooltip();
  $('#content').hide();
  
  // Laisser modale apparente et rendre background utilisable
  $(".enable-back, #m_user").on('shown.bs.modal', function () {
    $("body").removeClass("modal-open");			
    $(this).removeClass("modal");
    $(document).off('focusin.modal');
  });

  $('#m_login').load('./m.login.html');
  $('#m_login').modal({backdrop: false, keyboard: false});
  
  horloges();
  setInterval('horloges()', 60000);
  
  //if (devtools.isOpen) $('#m_aye').modal({backdrop: 'static', keyboard: false});
  console.log('*** event programming started! ***');

  $('#message').on('mouseup', fResize);
  
  $('#bS').on('click', function(){
    if ($('#room').val().length > 0) {
      ws.send(JSON.stringify({
        type: 'chat',
        message: $('#message').val()
      }));
      ws.send(JSON.stringify({
        type: 'typing',
        action: 0,
        room: $('#room').val(),
        icon: '',
        pass: $('#pass').val(),
        message: navigator.tell
      }));
      $('#message').focus();
      $('#message').val('');
      return false;
    }
  });

  $('#bF').on('click', function(){ $('#m_i').modal({backdrop: true}); return false; });  

  $('#message').on('keypress', function(){
    var action = 0;
    if ($('#message').length == 0) action = 0; else action = 1;
    ws.send(JSON.stringify({
      type: 'typing',
      action: action,
      room: $('#room').val(),
      icon: '',
      pass: $('#pass').val(),
      message: navigator.tell
    }));
  });
  
  var timer = null;
  $('#message').on('keydown', function(){
    clearTimeout(timer); 
    timer = setTimeout(doStuff, 2000);
  });

  function doStuff() {
    ws.send(JSON.stringify({
      type: 'typing',
      action: 0,
      room: $('#room').val(),
      icon: '',
      pass: $('#pass').val(),
      message: navigator.tell
    }));
  }
  
  window.addEventListener('devtoolschange', event => {
    if (event.detail.isOpen) {
      console.log('Devtools');
      $('#m_aye').modal({backdrop: 'static', keyboard: false});
    }
  });
  
  document.onkeydown = KeyPress;
  
  $(window).keyup(function(e) {
    if(e.keyCode == 44) copyToClipboard();
  });

  
  $('#bdeconnexion').on('click', function(){
    ws.close();
    window.location.reload(true);
  });

  // Chat en mode fullscreen
  $('#bFullChat').on('click', function(){
    document.documentElement.requestFullscreen().catch(function(error){console.log(error.message);});
    $("#bExitFullChat").show();
    $("#bFullChat").hide();
  });
  $('#bExitFullChat').on('click', function(){
    document.exitFullscreen().catch(function(error){console.log(error.message);});
    $("#bExitFullChat").hide();
    $("#bFullChat").show();
  });

  $('#bCode').on('click', function(){ $('#m_code').modal({backdrop: false, keyboard: true})});  
  
  // Tab dans le textarea
  $("textarea").keydown(function(e) {
    var keyCode = e.keyCode || e.which;
    if(keyCode === 9) {
      var start = this.selectionStart;
      var end = this.selectionEnd;
      var $this = $(this);
      var value = $this.val();
      $this.val(value.substring(0, start) + "\t" + value.substring(end));
      this.selectionStart = this.selectionEnd = start + 1;
      e.preventDefault();
    }
  });

  $('#room').focus();

  console.log('event programming done!');
  console.log('ready!');
});
