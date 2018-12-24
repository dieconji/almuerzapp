/**
 * Define una coleccion de bares
 */

function isNumber(n) {
	return !isNaN(parseInt(n)) && isFinite(n);
}

var Bares = Backbone.Collection.extend({
	url : '/misbares/bares',
	model : Bar,
	initialize : function() {
		this.on("add", function(model, col, opt) {
			console.log('Bares:add ' + model.id);			
			model.save();
		});
		this.on("remove", function(model, col, opt) {
			console.log('Bares:remove ' + model.id);
			model.destroy({silent: true});
		});
		this.on("change", function(model, opt) {
			console.log('Bares:change ' + model.id);
			if (model.get('photoURL') == null || model.get('photoURL') == 'images/blank.jpg') {
				model.set('photoURL', 'https://almuerzapp.s3-eu-west-1.amazonaws.com/' + model.id + '.jpg');
			}
			else {
				if (model.changedAttributes().id) {
					return;
				}
			}
			model.save();
		});
		this.fetch({ reset: true });
	},
	filtrarPorNombre: function (nombre) {
		if(nombre == "") 
			return this;

	    var pattern = new RegExp(nombre,"gi");	    
	    
        filtered = this.filter(function (bar) {
            return pattern.test(bar.get("titulo"));
        });
        
        return new Bares(filtered);
    }
});

