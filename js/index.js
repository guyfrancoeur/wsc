var a1 = new Audio('./consequence.mp3');
var a2 = new Audio('./inbox.mp3');
var connecte = 0;
var start = new Date().getTime();
var ws = new WebSocket("wss://echo.websocket.org");
ws.onopen = function() { console.log("onopen of", ws.url, "in", (new Date().getTime() - start), "ms"); ws.close(); $('#bName').attr('disabled', false); };
var elem = document.getElementById('messages'); //pour scroll-auto
var pseudo;

const ico = document.getElementById('favicon');

function newUpdate() {
  ico.href = './ico/favicon.ico';
}

$(window).on("blur focus", function(e) {
  ico.href = './favicon.ico';
});

//Fermeture en cliquant sur la croix
$('#closeToast').click(function() {
  $('#m_start').hide();
});

function fResize() {
  $('#bS, #bF, #bH').height($('#message').height());
  $('#message').css('width','100%');
  if (connecte == 0){
    $('#msgs, #messages').height($(window).height() - $('#name-div').height() - $('#input-div').height() - 40);
    if($(window).width() < 768) $('#m_start').css('top','17rem');
    else $('#m_start').css('top','6rem');
  }
  else{
    $('#msgs, #messages').height($(window).height() - $('#welcome').height() - $('#input-div').height() - 40);
    $('#m_start').css('top','6rem');
  }
  resizeMusagers();
}

function resizeMusagers(){
  topModaleUsers = $("#users").offset().top;
  dDessus = (topModaleUsers - $(window).scrollTop());
  if(($("#users > li").length * 18.18) > ($(window).height() - dDessus - $('#input-div').height() - 142 - 30)){ // 18.18 = hauteur d'un <li> dans liste usagers
    newSize = $(window).height() - dDessus - 142 - 30; // 142 = hauteur modale vide | 30 = distance entre fin bloc de la liste messages et textarea
    $("#users").height(newSize);
    $("#users").css("overflow-y","scroll");
  }
  else{
    $("#users").css("overflow-y","hidden");
    $("#m_start").height("");
  }
}

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
      name: $('#name').val(),
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
}

// Ouverture modal start
$("[data-toggle='popover']").on('shown.bs.popover', function(){
  $('#bmodaleusers').click(function() {
    $("#m_start").show();
  });
});

function init() {
  ws.onopen = function() {
    console.log("onopen of", ws.url, "in", (new Date().getTime() - startWs), "ms");
    ws.send(JSON.stringify({
      type: 'link',
      name: '',
      message: navigator.tell
    }));
    $('#name-div').hide();
    $('#welcome').show();
    $('#croom').text($('#room').val());
    ws.send(JSON.stringify({
      type: 'name',
      icon: '',
      name: $('#name').val(),
      pass: $('#pass').val(),
      message: navigator.tell
    }));
    connecte = 1;
    fResize();
    $("#message").attr("placeholder","Écrire votre message ici (room #" + $('#room').val()+")")
  }
  
  ws.onmessage = function(evt) {
    if (evt.data != "") {
      data = JSON.parse(evt.data);
      switch (data.type) {
        case 'lnk' : $('#count').text(data.count); $('#users').empty(); $('#users').append(data.message); $('#name').text(data.name); $('#welcometext').text('Bonjour ' + $('#name').val()); resizeMusagers(); break;
        case 'tlk' :
          if (!document.hasFocus()) { newUpdate(); a2.play(); }
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
      }
    }
  }

  ws.onerror = function(evt) {
    $('#messages').append($('<li>').html('<span style="color: red;">ERROR:</span> ' + evt.data));
  }
  
  ws.onclose = function () {
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

// Horloge Québec
function showDateQuebec() {
  var date = new Date(new Date().toLocaleString("en-US", {timeZone: "America/Montreal"}));
  var h = ('0' + date.getHours()).slice(-2);
  var m = ('0' + date.getMinutes()).slice(-2);
  $("#heureQuebec").html(h + ':' + m);
  refreshQuebec();
}
function refreshQuebec(){
  setTimeout('showDateQuebec()', 1000);
}

// Horloge France
function showDateFrance() {
  var date = new Date(new Date().toLocaleString("en-US", {timeZone: "Europe/Paris"}));
  var h = ('0' + date.getHours()).slice(-2);
  var m = ('0' + date.getMinutes()).slice(-2);
  $("#heureFrance").html(h + ':' + m);
  refreshFrance();
}
function refreshFrance(){
  setTimeout('showDateFrance()', 1000);
}

function checkBrowser(){
  var browser;
  var agent = navigator.userAgent.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
  if (navigator.userAgent.match(/Edge/i) || navigator.userAgent.match(/Trident.*rv[ :]*11\./i)) browser = "msie";
  else browser = agent[1].toLowerCase();
  return (browser.length > 0 && (browser == "opera" || browser == "chrome" || browser == "edge"));
}

// ************************************************  DOCUMENT READY   **************************************************
$(document).ready(function(){
  $('[data-toggle="tooltip"]').tooltip();
  $('#m_i').load('./m.i.html');
  $('#m_aye').load('./m.aye.html');
  $('#m_sc').load('./m.sc.html');
  $('#m_check').load('./m.check.html');
  $('#listeIcons').hide();

  showDateFrance();// Horloges
  showDateQuebec();

  if(!checkBrowser()) $('#m_check').modal({backdrop: 'static', keyboard: false}); // Check Browser
  
  //if (devtools.isOpen) $('#m_aye').modal({backdrop: 'static', keyboard: false});
  $('#name').focus();
  $('#welcome, #divGif, #bExitFullChat').hide();
  $('[data-toggle="popover"]').popover({html: true});
  $('#msgs, #messages').height($(window).height() - $('#name-div').height() - $('#input-div').height() - 40);
  $('#message').width($('#input-div').width() - $('#bMsg').width() - 100);
  fResize();

  console.log('event programming started!');
  $('#message').on('mouseup', fResize);
  
  $('#bName').on('click', function(e){
    e.preventDefault();
    $('#name').val($.trim($('#name').val()));
    if ($('#name').val().length > 0 && $('#room').val().length > 0 && $('#pass').val().length > 0) {
      $('#listeIcons').show();
      pseudo = $('#name').val();
      ws.onopen = null;
      startWs = new Date().getTime();
      ws = new WebSocket("wss://www.salutem.co:"+ $('#room').val() +"/");
      p = parseInt($('#room').val())+10000;
      init();
    }
  });

  $('#bS').on('click', function(){
    $('#name').val($.trim($('#name').val()));
    if ($('#name').val().length > 0) {
      ws.send(JSON.stringify({
        type: 'talk',
        name: $('#name').val(),
        message: $('#message').val()
      }));
      $('#message').focus();
      $('#message').val('');
      return false;
    }
  });

  $('#bF').on('click', function(){ $('#m_i').modal('show'); return false; });

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
  
  // Superposer plusieurs modales
  $(document).on('show.bs.modal', '.modal', function() {
    var zIndex = 1040 + (10 * $('.modal:visible').length);
    $(this).css('z-index', zIndex);
    setTimeout(function() {
      $('.modal-backdrop').not('.modal-stack').css('z-index', zIndex - 1).addClass('modal-stack');
    }, 0);
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
  
  console.log('event programming done!');
  console.log('ready!');
});
// DOCUMENT READY ---------------------------------
