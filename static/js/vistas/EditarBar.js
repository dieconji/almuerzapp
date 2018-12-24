var EditarBar = Backbone.View.extend({
	initialize: function() {
		this.$('#btBorrar').prop("disabled", true);
		this.$('#btImage').prop("disabled", true);
		this.$('#txtEditarFecha').prop("type", "hidden");
		
		this.$('#btRating').raty(
				{ 
					number: 5,
					path: 'images/'
				});
	},
	sync: function(method, model, options) {
        _.defaults(options || (options = {}), {
            crossDomain: true
        });

        return Backbone.sync.call(this, method, model, options);
    },
	render : function() {
		this.$('#txtEditarTitulo').val(this.model.get('titulo')).textinput('refresh');
		this.$('#txtEditarDescripcion').val(this.model.get('descripcion')).textinput('refresh');
		this.$('#txtEditarDireccion').val(this.model.get('direccion')).textinput('refresh');
		this.$('#txtEditarPosicionLat').val(this.model.get('latitud')).textinput('refresh');
		this.$('#txtEditarPosicionLon').val(this.model.get('longitud')).textinput('refresh');
		this.$('#btRating').raty('score',this.model.get('score'));
		this.$('#txtEditarModificar').val('off').flipswitch('refresh');		
		this.$('#uploadedImage').attr("src", this.model.get('photoURL'));
	},
	events : {
		'change #txtEditarModificar' : function() {
			if(this.$('#txtEditarModificar').val() == "on"){
				this.$('#txtEditarTitulo').prop("readonly", false);
				this.$('#txtEditarDescripcion').prop("readonly", false);
				this.$('#txtEditarDireccion').prop("readonly", false);
				this.$('#txtEditarPosicionLat').prop("readonly", false);
				this.$('#txtEditarPosicionLon').prop("readonly", false);
				this.$('#txtEditarVisualizar').prop("disabled", "false");
				this.$('#btBorrar').prop("disabled", false).button('refresh');
				this.$('#btImage').prop("disabled", false).button('refresh');;
			}
			else{
				this.$('#txtEditarTitulo').prop("readonly", true);
				this.$('#txtEditarDescripcion').prop("readonly", true);
				this.$('#txtEditarDireccion').prop("readonly", true);
				this.$('#txtEditarPosicionLat').prop("readonly", true);
				this.$('#txtEditarPosicionLon').prop("readonly", true);
				this.$('#txtEditarVisualizar').prop("disabled", "true");
				this.$('#btBorrar').prop("disabled", true).button('refresh');
				this.$('#btImage').prop("disabled", true).button('refresh');;
			}
		},
		'change #txtEditarTitulo' : function() 
		{
			this.model.set('titulo', this.$('#txtEditarTitulo').val());
		},
		'change #txtEditarDescripcion' : function() 
		{
			this.model.set('descripcion', this.$('#txtEditarDescripcion').val());
		},
		'change #txtEditarDireccion' : function() 
		{
			this.model.set('direccion', this.$('#txtEditarDireccion').val());
		},
		'change #txtEditarPosicionLat' : function() 
		{
			this.model.set('latitud', this.$('#txtEditarPosicionLat').val());
		},
		'change #txtEditarPosicionLon' : function() 
		{
			this.model.set('longitud', this.$('#txtEditarPosicionLon').val());
		},
		'click #btRating' : function() {
			if(this.$('#txtEditarModificar').val() == "on") {
				this.model.set('score', this.$('#btRating').raty('score'));
			}
			else {
				this.$('#btRating').raty('score',this.model.get('score'));
			}
			
		},
		'click #btBorrar' : function() {
			this.collection.remove(this.model);
			$(':mobile-pagecontainer').pagecontainer('change', '#pgListado');
		},
		'change #fileImage': function () {
			var input = this.$('#fileImage');
		    var img = this.$('#uploadedImage')[0];
		    if(input.val() !== '') {
		    	var selected_file = input[0].files[0];
		    	var reader = new FileReader();
		    	reader.onload = (function(aImg) { return function(e) { aImg.src = e.target.result; }; })(img);
		    	reader.readAsDataURL(selected_file);
		    	
		    	if (this.model.get('photoURL') == null || this.model.get('photoURL') == 'images/blank.jpg') {
					this.model.set('photoURL', 'https://almuerzapp.s3-eu-west-1.amazonaws.com/' + this.model.id + '.jpg');
				}
		    }

		},
		'click #btImage' : function () {		  
			  var field = this.$('#fileImage');
			  var file = field[0].files[0];
			  url = this.model.get('photoURL');
			  console.log("EditarBar: " + url);
			  console.log(file);
			  $.ajax({
				  type : 'PUT',
				  url : url,
				  data : file,
				  processData: false,  // tell jQuery not to convert to form data
				  contentType: file.type,
				  xhrFields: {
					    withCredentials: false
				  },
				  success: function(json) { 
					  alert("Foto subida correctamente!");
					  },
				  error: function (XMLHttpRequest, textStatus, errorThrown) {
					  alert("Error al subir la foto");
				  }
			  });
	
			  return false;
		  }
	}
});