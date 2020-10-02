var a1 = new Audio('./consequence.mp3');
var a2 = new Audio('./inbox.mp3');
var connecte = 0;
var start = new Date().getTime();
var ws = new WebSocket("wss://echo.websocket.org");
ws.onopen = function() { console.log("onopen of", ws.url, "in", (new Date().getTime() - start), "ms"); ws.close(); $('#bName').attr('disabled', false); };
var elem = document.getElementById('messages'); //pour scroll-auto

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
    if($(window).width() < 625) $('#m_start').css('top','12rem');
    else $('#m_start').css('top','6rem');
  }

  // Scrollbar modale Usagers Connectés (-> si hauteur de la modale dépasse l'écran, ajout de scrollbar)
  if (connecte == 0) h  = $(window).height() - ($('#name-div').height() + $('#input-div').height() + 250);
  else h  = $(window).height() - ($('#welcome').height() + $('#input-div').height() + 250);
  if(($("#users > li").length * 18.5) > h){
    if (h < (18.5 * 2)) $("#users").height(18.5 * 2);
    else $("#users").height(h);
    $("#users").css("overflow-y","scroll");
  }
  else $("#users").css("overflow-y","hidden");
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
  if(e.keyCode == 123 || e.keyCode == 27 || e.keyCode == 122) return false;
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
    console.log("onopen of", ws.url, "in", (new Date().getTime() - start), "ms");
    ws.send(JSON.stringify({
      type: 'link',
      name: '',
      message: navigator.tell
    }));
    $('#name-div').hide();
    $('#welcome').show();
    //$('#welcometext').text('Bonjour ' + $('#name').val());
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
  }
  
  ws.onmessage = function(evt) {
    //console.log(evt);
    if (evt.data != "") {
      data = JSON.parse(evt.data);
      //console.log(data);
      switch (data.type) {
        case 'lnk' : $('#count').text(data.count); $('#users').empty(); $('#users').append(data.message); $('#name').text(data.name); $('#welcometext').text('Bonjour ' + $('#name').val()); break;
        case 'tlk' :
          if (!document.hasFocus()) { newUpdate(); a2.play(); }
          var text = data.message;
          text = text.replace(/\r?\n/g, '<br />');
          $('#messages').append($('<li>').html(text));
          elem.scrollTop = elem.scrollHeight;
          break;
        //case 'cln' : window.location.reload(true); break;
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

// ************************************************  DOCUMENT READY   **************************************************
$(document).ready(function(){
  $('[data-toggle="tooltip"]').tooltip();
  $('#m_aye').load('./m.aye.html');
  $('#m_sc').load('./m.sc.html');
  //if (devtools.isOpen) $('#m_aye').modal({backdrop: 'static', keyboard: false});
  $('#name').focus();
  $('#welcome, #divGif').hide();
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
      ws.onopen = null;
      start = new Date().getTime();
      ws = new WebSocket("wss://www.salutem.co:"+ $('#room').val() +"/");
      p = parseInt($('#room').val())+10000;
      wsc = new WebSocket("wss://www.salutem.co:"+ p +"/");
      p+=10000;
      wsa = new WebSocket("wss://www.salutem.co:"+ p +"/");
      init();
      initWsc();
      initWsa();
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
      str = $('#message').val();
      if (str.IndexOf('pre class="prettyprint') != -1) PR.prettyPrint();
      $('#message').focus();
      $('#message').val('');
      return false;
    }
  });

  $('#bF').on('click', function(){ $('#m_i').modal('show'); return false; });

  $('#bmSubmit').on('click', function(){
    ws.send(JSON.stringify({
      type: 'img',
      name: $('#name').val(),
      message: $('#preview').attr('src')
    }));
    $("#m_i").modal('hide');
  });

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
    window.location.reload(true);
  });
  
  console.log('event programming done!');
  console.log('ready!');
});
// DOCUMENT READY ---------------------------------
