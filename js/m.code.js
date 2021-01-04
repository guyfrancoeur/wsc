$('#closeCode').on('click', function(){
  $('#m_code').hide();
});

$('#m_code .modal-content').resizable({minHeight: 380, minWidth: 400}); //ceci resize modal-content
$('#m_code .md').draggable(); //modal-dialog