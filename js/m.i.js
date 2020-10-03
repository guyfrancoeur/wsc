var CLIPBOARD = new CLIPBOARD_CLASS("#preview", true);

/**
 * image pasting into canvas virtual canvas then <img>.
 *
 * @param {string} elem - canvas id
 * @param {boolean} autoresize - if canvas will be resized (not used)
 */
function CLIPBOARD_CLASS(elem, autoresize) {
  var _self = this;
  var canvas = document.createElement('canvas');

  document.addEventListener('paste', function (e) { _self.paste_auto(e); }, false);

  this.paste_auto = function (e) {
    if (e.clipboardData) {
      var items = e.clipboardData.items;
      if (!items) return;

      var is_image = false;
      for (var i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          var blob = items[i].getAsFile();
          var URLObj = window.URL || window.webkitURL;
          var url = URLObj.createObjectURL(blob);
          this.paste_createImage(url);
          is_image = true;
        }
      }
      if(is_image == true){
        e.preventDefault();
      }
    }
  };

  this.paste_createImage = function (source) {
    var pastedImage = new Image();
    pastedImage.onload = function () {
      if(autoresize == true){
        canvas.width = pastedImage.width;
        canvas.height = pastedImage.height;
      } else {
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height); //clear canvas
      }
      canvas.getContext('2d').drawImage(pastedImage, 0, 0);
      uri = canvas.toDataURL('image/jpeg', 1.0);
      $(elem).attr('src', uri);
    };
    pastedImage.src = source;
  };

}

$('#bmSubmit').on('click', function(){
  ws.send(JSON.stringify({
    type: 'img',
    name: $('#name').val(),
    message: $('#preview').attr('src')
  }));
  $("#m_i").modal('hide');
});
