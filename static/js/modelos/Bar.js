var Bar = Backbone.Model.extend({
	urlRoot : '/misbares/bares/',
	initialize : function() {

	},
	defaults : {
		titulo : 'Nuevo Bar',
		fecha : Date(),
		visible : 'on',
		latitud : 0.0,
		longitud : 0.0,
		photoURL : 'images/blank.jpg'
	},
});
