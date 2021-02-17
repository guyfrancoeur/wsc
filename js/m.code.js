$('#closeCode').on('click', function(){
  $('#m_code').hide();
});

$('#m_code .modal-content').resizable({minHeight: 380, minWidth: 400});
$('#m_code .modal-dialog').draggable({handle: $('#divHeader')});
$("#m_code").on('shown.bs.modal', function () {
  PR.prettyPrint();
});
$("#m_code .modal-content").on('click', function () {
  if($("#m_code").css("z-index") == 200){
    $("#m_code").css("z-index","201");
    $("#m_sc").css("z-index","200");
  }
});