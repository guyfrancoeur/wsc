$('#closeCode').on('click', function(){
  $('#m_code').hide();
});

$('#m_code .modal-content').resizable({
  minHeight: 380,
  minWidth: 400,
  resize: resizeDivCode,
  ghost: true
});
$('#m_code .modal-dialog').draggable({handle: $('#divHeader')});

$("#m_code .modal-content").on('click', function () {
  if($("#m_code").css("z-index") == 200){
    $("#m_code").css("z-index","201");
    $("#m_sc").css("z-index","200");
  }
});

$("#m_code").on('shown.bs.modal', function () {
  PR.prettyPrint();
  resizeDivCode();

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
});

function resizeDivCode(){
  h = $("#m_code .modal-content").height() - 146;
  if($('#share_code').css("display") == "none") $("#code-shared").css("height", h);
  else if($('#code-shared').css("display") == "none") $("#share_code").css("height", h);
  else $("#code-shared, #share_code").css("height", h/2);
}

$('#bHideCode').on('click', function(){
  if($('#code-shared').css("display") == "none"){
    $('#code-shared').show();
    $('#bHideCode').html('<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="angle-double-up" class="svg-inline--fa fa-angle-double-up fa-w-10" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M177 255.7l136 136c9.4 9.4 9.4 24.6 0 33.9l-22.6 22.6c-9.4 9.4-24.6 9.4-33.9 0L160 351.9l-96.4 96.4c-9.4 9.4-24.6 9.4-33.9 0L7 425.7c-9.4-9.4-9.4-24.6 0-33.9l136-136c9.4-9.5 24.6-9.5 34-.1zm-34-192L7 199.7c-9.4 9.4-9.4 24.6 0 33.9l22.6 22.6c9.4 9.4 24.6 9.4 33.9 0l96.4-96.4 96.4 96.4c9.4 9.4 24.6 9.4 33.9 0l22.6-22.6c9.4-9.4 9.4-24.6 0-33.9l-136-136c-9.2-9.4-24.4-9.4-33.8 0z"></path></svg>');
  }else{
    $('#code-shared').hide();
    $('#bHideCode').html('<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="angle-double-down" class="svg-inline--fa fa-angle-double-down fa-w-10" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M143 256.3L7 120.3c-9.4-9.4-9.4-24.6 0-33.9l22.6-22.6c9.4-9.4 24.6-9.4 33.9 0l96.4 96.4 96.4-96.4c9.4-9.4 24.6-9.4 33.9 0L313 86.3c9.4 9.4 9.4 24.6 0 33.9l-136 136c-9.4 9.5-24.6 9.5-34 .1zm34 192l136-136c9.4-9.4 9.4-24.6 0-33.9l-22.6-22.6c-9.4-9.4-24.6-9.4-33.9 0L160 352.1l-96.4-96.4c-9.4-9.4-24.6-9.4-33.9 0L7 278.3c-9.4 9.4-9.4 24.6 0 33.9l136 136c9.4 9.5 24.6 9.5 34 .1z"></path></svg>');
  }
  resizeDivCode();
});

function displayDivCode(){
  if($("#share_code").css("display") == "none"){
    $("#share_code, #bHideCode").show();
    $('#bHideCode').html('<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="angle-double-up" class="svg-inline--fa fa-angle-double-up fa-w-10" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M177 255.7l136 136c9.4 9.4 9.4 24.6 0 33.9l-22.6 22.6c-9.4 9.4-24.6 9.4-33.9 0L160 351.9l-96.4 96.4c-9.4 9.4-24.6 9.4-33.9 0L7 425.7c-9.4-9.4-9.4-24.6 0-33.9l136-136c9.4-9.5 24.6-9.5 34-.1zm-34-192L7 199.7c-9.4 9.4-9.4 24.6 0 33.9l22.6 22.6c9.4 9.4 24.6 9.4 33.9 0l96.4-96.4 96.4 96.4c9.4 9.4 24.6 9.4 33.9 0l22.6-22.6c9.4-9.4 9.4-24.6 0-33.9l-136-136c-9.2-9.4-24.4-9.4-33.8 0z"></path></svg>');
  }
  else {
    $("#share_code, #bHideCode").hide();
    $("#code-shared").show();
  }
}


$("#share_code").keyup(function() {
  ws.send(JSON.stringify({
    type: 'code',
    message: $("#share_code").val()
  }));
});