// crear bd
var bares = new Bares();

$(document).on('pageinit', '#pgMapa', function() {
	// console.log('onPageInit: #pgMapa');

	var vistaMapa = new Mapa({collection: bares, el: '#pgMapa'});	
});

$(document).on('pageinit', '#pgListado', function() {
	// console.log('onPageInit: #pgListado');
	
	var vistaEditarBar = new EditarBar({collection: bares, el: '#pgEditarBar'});
	var vistaListaBares = new ListaBares({collection: bares, el: '#pgListado'});

	vistaListaBares.editarBar(vistaEditarBar);
});

$(document).on('pageinit', '#pgEditarBar', function() {
	// console.log('onPageInit: #pgEditarBar');
});
