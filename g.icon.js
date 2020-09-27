$(document).ready(function(){

/*
      <span id="icon1" data-toggle="tooltip" data-placement="bottom" title="Ça va">&#128077;</span>
      <span id="icon2" data-toggle="tooltip" data-placement="bottom" title="Ça ne va pas">&#128078;</span>
      <span id="icon3" data-toggle="tooltip" data-placement="bottom" title="Question">&#128587;&#8205;&#9794;&#65039;</span>
      <span id="icon4" data-toggle="tooltip" data-placement="bottom" title="Bon rythme de cours">&#127891;</span>
      <span id="icon5" data-toggle="tooltip" data-placement="bottom" title="Je veux tenter">&#9917;</span>
      <span id="icon6" data-toggle="tooltip" data-placement="bottom" title="Oui">&#128994;</span>
      <span id="icon7" data-toggle="tooltip" data-placement="bottom" title="Non">&#10060;</span>
      <span id="icon8" data-toggle="tooltip" data-placement="bottom" title="Je veux parler!">&#128172;</span>
*/

  $('#icon1').on('click', function(e){
    ws.send(JSON.stringify({
      type: 'name',
      name: '&#128077; ' + $('#name').val(),
      message: navigator.tell
    }));
    $('#message').focus();
    return false;
  });

  $('#icon2').on('click', function(e){
    ws.send(JSON.stringify({
      type: 'name',
      name: '&#128078; ' + $('#name').val(),
      message: navigator.tell
    }));
    $('#message').focus();
    return false;
  });

  $('#icon3').on('click', function(e){
    ws.send(JSON.stringify({
      type: 'name',
      name: '&#128587;&#8205;&#9794;&#65039; ' + $('#name').val(),
      message: navigator.tell
    }));
    $('#message').focus();
    return false;
  });

  $('#icon4').on('click', function(e){
    ws.send(JSON.stringify({
      type: 'name',
      name: '&#127891; ' + $('#name').val(),
      message: navigator.tell
    }));
    $('#message').focus();
    return false;
  });

  $('#icon5').on('click', function(e){
    ws.send(JSON.stringify({
      type: 'name',
      name: '&#9917; ' + $('#name').val(),
      message: navigator.tell
    }));
    $('#message').focus();
    return false;
  });

  $('#icon6').on('click', function(e){
    ws.send(JSON.stringify({
      type: 'name',
      name: '&#128994; ' + $('#name').val(),
      message: navigator.tell
    }));
    $('#message').focus();
    return false;
  });

  $('#icon7').on('click', function(e){

    ws.send(JSON.stringify({
      type: 'name',
      name: '&#10060; ' + $('#name').val(),
      message: navigator.tell
    }));
    $('#message').focus();
    return false;
  });

  $('#icon8').on('click', function(e){
    ws.send(JSON.stringify({
      type: 'name',
      name: '&#128172; ' + $('#name').val(),
      message: navigator.tell
    }));
    $('#message').focus();
    return false;
  });

});
