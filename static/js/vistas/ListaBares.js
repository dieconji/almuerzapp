var ListaBares = Backbone.View.extend({
	
	initialize : function() {
		var self = this;
		
		this.collection.on('remove', function() {
			self.render();
		});
		
		this.collection.on('sync', function() {
			self.render();
		});
		
		this.render();		
	},
	render : function() {
		// limpiar
		this.$('#pnBares').html('<ul datarole="listview" datafilter="true"></ul>');

		// obtener bares filtrados
		var bares_filtrados = this.collection.filtrarPorNombre(this.$('#searchListado').val());
		
		// pintar bares		
		for (var i = 0; i < bares_filtrados.size(); i++) {
			var m = bares_filtrados.at(i);
			var str = '<li><a id="' + m.id + '" href="#" class="elementobar">' + m.get('titulo') + '</a></li>';
			this.$el.find('[datarole="listview"]').append(str);
		}
		this.$el.find('[datarole="listview"]').listview();
	},
	events : {		
		'click #addbar' : 'nuevoBar',
		'click .elementobar' : 'abrirEditarBar',
        'keyup #searchListado': 'buscarBares',
        'click .ui-input-clear': 'buscarBares'
	    
	},
	editarBar : function(vistaEditarBar) {
		this.vistaEditarBar = vistaEditarBar;
	},
	abrirEditarBar : function(e) {		
		// recuperar id
		var id = $(e.target).attr('id');
		//console.log('abrirEditarBar (' + id + ')');
		this.vistaEditarBar.model = this.collection.get(id);
		$(':mobile-pagecontainer').pagecontainer('change', '#pgEditarBar');
		this.vistaEditarBar.render();
	},
	nuevoBar : function(e) {
		// creamos bar vacio
		this.model = new Bar();
		// anaydimos a la coleccion
		this.collection.add(this.model);
		//
		this.render;
	},
	buscarBares : function(e) {
		this.render();		
	}
	
});
