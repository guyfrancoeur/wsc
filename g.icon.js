var gIcon = 0;

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
      
function fIcon(i) {
  var v = '';
  if (i == gIcon) { gIcon = 0; } else { gIcon = i; }
  switch(gIcon) {
    case 0: v = ''; break;
    case 1: v = '&#128077; '; break;
    case 2: v = '&#128078; '; break;
    case 3: v = '&#128587;&#8205;&#9794;&#65039; '; break;
    case 4: v = '&#127891; '; break;
    case 5: v = '&#9917; '; break;
    case 6: v = '&#128994; '; break;
    case 7: v = '&#10060; '; break;
    case 8: v = '&#128172; '; break;
    default : return;
  }          
  ws.send(JSON.stringify({
    type: 'name',
    name: v + $('#name').val(),
    pass: $('#pass').val(),
    message: navigator.tell
  }));
  $('#message').focus();
  return;
}

  $('#icon1').on('click', function(e){
    fIcon(1);
    return false;
  });

  $('#icon2').on('click', function(e){
    fIcon(2);
    return false;
  });

  $('#icon3').on('click', function(e){
    fIcon(3);
    return false;
  });

  $('#icon4').on('click', function(e){
    fIcon(4);
    return false;
  });

  $('#icon5').on('click', function(e){
    fIcon(5);
    return false;
  });

  $('#icon6').on('click', function(e){
    fIcon(6);
    return false;
  });

  $('#icon7').on('click', function(e){
    fIcon(7);
    return false;
  });

  $('#icon8').on('click', function(e){
    fIcon(8);
    return false;
  });

});
