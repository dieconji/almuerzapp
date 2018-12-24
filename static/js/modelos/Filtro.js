/*
 * Define el filtro de busqueda
 */
var Filtro = Backbone.Model.extend({
    defaults: {
        what: ''
        //	, // the textual search
        //where: 'all' // I added a scope to the search
    },
    initialize: function(opts) {
        // the source collection
        this.collection = opts.collection; 
        // the filtered models
        this.filtered = new Backbone.Collection(opts.collection.models); 
        //listening to changes on the filter
        this.on('change:what', this.filter);
    },

    //recalculate the state of the filtered list
    filter: function() {
        var what = this.get('what').trim(),      
            where = this.get('where'),
            lookin = ['titulo', 'direccion'],
            models;

        if (what==='') {
            models = this.collection.models;            
        } else {
            models = this.collection.filter(function(model) {
                return _.some(_.values(model.pick(lookin)), function(value) {
                    return ~value.toLowerCase().indexOf(what);
                });
            });
        }

        // let's reset the filtered collection with the appropriate models
        this.filtered.reset(models); 
    }
});