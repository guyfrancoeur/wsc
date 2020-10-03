var CLIPBOARD = new CLIPBOARD_CLASS("#preview", true);

/**
 * image pasting into canvas virtual canvas then <img>.
 * 
 * @param {string} elem - canvas id
 * @param {boolean} autoresize - if canvas will be resized (not used)
 */
function CLIPBOARD_CLASS(elem, autoresize) {
	var _self = this;
  //create canvas ici
  //var canvas = document.createElement('canvas');
  //var ctx = canvas.getContext('2d');
	//var canvas = document.getElementById(elem);
	//var ctx = document.getElementById(elem).getContext("2d");

	//handlers
	document.addEventListener('paste', function (e) { _self.paste_auto(e); }, false);

	//on paste
	this.paste_auto = function (e) {
		if (e.clipboardData) {
			var items = e.clipboardData.items;
			if (!items) return;
			
			//access data directly
			var is_image = false;
			for (var i = 0; i < items.length; i++) {
				if (items[i].type.indexOf("image") !== -1) {
					//image
					var blob = items[i].getAsFile();
					var URLObj = window.URL || window.webkitURL;
					var source = URLObj.createObjectURL(blob);
          $(elem).attr('src', source); // GF
					//this.paste_createImage(source);
					is_image = true;
				}
			}
			if(is_image == true){
				e.preventDefault();
			}
		}
	};
  
	//draw pasted image to canvas
  /*
	this.paste_createImage = function (source) {
		var pastedImage = new Image();
		pastedImage.onload = function () {
			if(autoresize == true){
				//resize
				canvas.width = pastedImage.width;
				canvas.height = pastedImage.height;
			}
			else{
				//clear canvas
				ctx.clearRect(0, 0, canvas.width, canvas.height);
			}
			ctx.drawImage(pastedImage, 0, 0);
		};
		pastedImage.src = source;
	};
  */
}

$('#bmSubmit').on('click', function(){
  ws.send(JSON.stringify({
    type: 'img',
    name: $('#name').val(),
    message: $('#preview').attr('src')
  }));
  $("#m_i").modal('hide');
});
