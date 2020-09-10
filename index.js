var a1 = new Audio('./consequence.mp3');
var a2 = new Audio('./inbox.mp3');
var ws;
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
  $('#toast1').hide();
});

function fResize() {
  $('#bS').height($('#message').height());
  $('#bF').height($('#message').height());
  $('#bH').height($('#message').height());
  $('#message').css('width','100%');
  if (connecte == 0){
    $('#msgs').height($(window).height() - $('#name-div').height() - $('#input-div').height() - 40);
    $('#messages').height($(window).height() - $('#name-div').height() - $('#input-div').height() - 40);
  }
  else{
    $('#msgs').height($(window).height() - $('#welcome').height() - $('#input-div').height() - 40);
     $('#messages').height($(window).height() - $('#welcome').height() - $('#input-div').height() - 40);
  }
}

ws.onmessage = function(evt) {
  //console.log(evt);
  if (evt.data != "") {
    data = JSON.parse(evt.data);
    //console.log(data);
    switch (data.type) {
     case 'lnk' : $('#count').text(data.count); $('#users').empty(); $('#users').append(data.message); break;
     case 'tlk' :
       if (!document.hasFocus()) { newUpdate(); a2.play(); }
       var text = data.message;
       text = text.replace(/\r?\n/g, '<br />');
       $('#messages').append($('<li>').html(text));
       elem.scrollTop = elem.scrollHeight;
       break;
    }
  }
};

ws.onerror = function(evt) {
  $('#messages').append($('<li>').html('<span style="color: red;">ERROR:</span> ' + evt.data));
};

ws.onopen = function(evt) {
  ws.send(JSON.stringify({
     type: 'link',
     name: '',
     message: navigator.tell
   }));
};

var connecte = 0;
$('#bName').on('click', function(){
  ws = new WebSocket("wss://www.salutem.co:"+ $('#port').val() +"/");
  $('#name').val($.trim($('#name').val()));
  if ($('#name').val().length > 0 && $('#port').val().length > 0 && $('#motsecret').val().length > 0) {
    $('#name-div').hide();
    $('#welcome').show();
    $('#welcometext').text('Bonjour ' + $('#name').val() +' at '+ ws._socket.remoteAddress);
    ws.send(JSON.stringify({
     type: 'name',
     name: $('#name').val(),
     message: navigator.tell
    }));
    connecte = 1;
    fResize();
    $('#toast1').css('top','5rem');
    return false;
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

$('#bmSubmit').on('click', function(){
  ws.send(JSON.stringify({
     type: 'img',
     name: $('#name').val(),
     message: $('#preview').attr('src')
   }));
   $("#m_i").modal('hide');
});

$('#message').on('mouseup', fResize);

$(window).on('resize', function(){
  var win = $(this); //this = window
  $('#msgs').height(win.height() - $('#name-div').height() - $('#input-div').height() - 40);
  $('#messages').height(win.height() - $('#name-div').height() - $('#input-div').height() - 40);
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
  var evtobj = window.event ? event : e
  if (evtobj.keyCode == 13 && evtobj.shiftKey) {
    e.preventDefault();
    if ($("#message").val().length > 0) {
      $('#bS').click();
    }
    return true;
  }
  if (evtobj.ctrlKey && evtobj.keyCode == '0'.charCodeAt(0)) {
    var text = $("#message").val();
    text = text.replace(/\</g, '&#60;');
    $("#message").val(text);
    return true;
  }
  if (evtobj.ctrlKey && evtobj.keyCode == '9'.charCodeAt(0)) {
    var text = $("#message").val();
    var text = '<pre>'+ $("#message").val() +'</pre>';
    $("#message").val(text);
    return true;
  }
}
document.onkeydown = KeyPress;

// Ouverture modal start
$("[data-toggle='popover']").on('shown.bs.popover', function(){
  $('#bmodaleusers').click(function() {
    $("#toast1").show();
  });
});

$(document).ready(function(){
  //$('[data-toggle="tooltip"]').tooltip();
  $('#welcome').hide();
  $('[data-toggle="popover"]').popover({html: true});
  $('#msgs').height($(window).height() - $('#name-div').height() - $('#input-div').height() - 40);
  $('#messages').height($(window).height() - $('#name-div').height() - $('#input-div').height() - 40);
  $('#message').width($('#input-div').width() - $('#bMsg').width() - 100);
  a1.play();
  fResize();
  console.log('server 24');
});
