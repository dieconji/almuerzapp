var VerBar = Backbone.View.extend({
	render : function() {
		this.$('#txtVerTitulo').val(this.model.get('titulo')).textinput('refresh');
		this.$('#txtVerFecha').val(this.model.get('fecha')).textinput('refresh');
		this.$('#txtVerDescripcion').val(this.model.get('descripcion')).textinput('refresh');
		this.$('#txtVerDireccion').val(this.model.get('direccion')).textinput('refresh');
		this.$('#txtVerPosicionLat').val(this.model.get('latitud')).textinput('refresh');
		this.$('#txtVerPosicionLon').val(this.model.get('longitud')).textinput('refresh');
		this.$('#txtVerVisualizar').val(this.model.get('visible')).flipswitch('refresh');
	},
	events : {
		'click #btEditar' : function() {
			this.$('#txtVerTitulo').prop("readonly", false);
			console.log(this.$('#txtVerTitulo').prop("readonly"));
	
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
		'change #txtEditarVisualizar' : function() {
			this.model.set('visible', this.$('#txtEditarVisualizar').val());
			console.log(this.$('#txtEditarVisualizar').val());
			console.log(this.model.get('titulo'));
			this.$('#txtEditarDescripcion').readOnly = true;
		},
	},
	editarBar : function(vistaEditarBar) {
		this.vistaEditarBar = vistaEditarBar;
	}
});