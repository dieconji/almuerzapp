var Mapa = Backbone.View.extend({
	initialize : function() {
		var self = this;
		// crear el mapa la primera vez que se muestra la pagina
		$(document).one(
				'pageshow',
				'#' + this.$el.attr('id'),
				function(e, data) {
					// crear contenedor
					self.$('.ui-content').append('<div id="pnMapa"></div>');
					// obtener altura del contenedor
					var header = $.mobile.activePage
							.find("div[data-role='header']:visible");
					//console.log(header.outerHeight());
					var search = $.mobile.activePage
							.find("div.ui-content:visible");
					//console.log(search.outerHeight());
					var footer = $.mobile.activePage
							.find("div[data-role='footer']:visible");
					var content = $.mobile.activePage
							.find("div.ui-content:visible");
					var viewport_height = $(window).height();
					var content_height = viewport_height - search.outerHeight()
							- footer.outerHeight();
					if ((content.outerHeight() - search.outerHeight() - footer
							.outerHeight()) <= viewport_height) {
						content_height -= (content.outerHeight() - content
								.height());
					}
					self.$('#pnMapa').height(content_height - 12); //40 de los margenes ? 
					//self.$('#pnMapa').height(content_height); 
					
					// crear buscador
					self.$('.ui-content').append('<input id="pnSearch" class="controls" type="text" placeholder="Buscar un lugar">');			
					
					self.markers = new Array();
					
					// obtener nuestra posicion
					var startPos;
					
					var geoSuccess = function(position) {
						// crear mapa centrado en nuestra localizacion						
						startPos = position;
						
						var myOptions = {
								zoom : 15,
								center : new google.maps.LatLng(startPos.coords.latitude, startPos.coords.longitude),
								mapTypeId : google.maps.MapTypeId.ROADMAP,
								streetViewControl: false,
								mapTypeControl: false
							};
						
						//var addYourLocationButton = function(map, marker) {
						var addYourLocationButton = function(map) {
						    var controlDiv = document.createElement('div');

						    var firstChild = document.createElement('button');
						    firstChild.style.backgroundColor = '#fff';
						    firstChild.style.border = 'none';
						    firstChild.style.outline = 'none';
						    firstChild.style.width = '28px';
						    firstChild.style.height = '28px';
						    firstChild.style.borderRadius = '2px';
						    firstChild.style.boxShadow = '0 1px 4px rgba(0,0,0,0.3)';
						    firstChild.style.cursor = 'pointer';
						    firstChild.style.marginRight = '10px';
						    firstChild.style.padding = '0px';
						    firstChild.title = 'Your Location';
						    controlDiv.appendChild(firstChild);

						    var secondChild = document.createElement('div');
						    secondChild.style.margin = '5px';
						    secondChild.style.width = '18px';
						    secondChild.style.height = '18px';
						    secondChild.style.backgroundImage = 'url(https://maps.gstatic.com/tactile/mylocation/mylocation-sprite-1x.png)';
						    secondChild.style.backgroundSize = '180px 18px';
						    secondChild.style.backgroundPosition = '0px 0px';
						    secondChild.style.backgroundRepeat = 'no-repeat';
						    secondChild.id = 'you_location_img';
						    firstChild.appendChild(secondChild);
						    
						    google.maps.event.addListener(map, 'dragend', function() {
						        $('#you_location_img').css('background-position', '0px 0px');
						    });
						    
						    firstChild.addEventListener('click', function() {
						        var imgX = '0';
						        var animationInterval = setInterval(function(){
						            if(imgX == '-18') imgX = '0';
						            else imgX = '-18';
						            $('#you_location_img').css('background-position', imgX+'px 0px');
						        }, 500);
						        if(navigator.geolocation) {
						            navigator.geolocation.getCurrentPosition(function(position) {
						                var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
						                //marker.setPosition(latlng);
						                map.setCenter(latlng);
						                clearInterval(animationInterval);
						                $('#you_location_img').css('background-position', '-144px 0px');
						            });
						        }
						        else{
						            clearInterval(animationInterval);
						            $('#you_location_img').css('background-position', '0px 0px');
						        }
						    });
						    
						    controlDiv.index = 1;
						    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(controlDiv);
						}
						
						self.map = new google.maps.Map(self.$('#pnMapa')[0], myOptions);
						
						//addYourLocationButton(self.map, myMarker);
						addYourLocationButton(self.map);
						
						var GeoMarker = new GeolocationMarker(self.map);
						
						// poner buscador
						var input = document.getElementById('pnSearch');
						
						self.map.controls[google.maps.ControlPosition.TOP_CENTER].push(input);
						
						var autocomplete = new google.maps.places.Autocomplete(input);
						autocomplete.bindTo('bounds', self.map);
						
						var infowindow = new google.maps.InfoWindow();
						var marker = new google.maps.Marker({
						    map: self.map,
						    anchorPoint: new google.maps.Point(0, -29)
						  });
						
						autocomplete.addListener('place_changed', function() {
						    infowindow.close();
						    marker.setVisible(false);
						    var place = autocomplete.getPlace();
						    if (!place.geometry) {
						      window.alert("Autocomplete's returned place contains no geometry");
						      return;
						    }

						    // If the place has a geometry, then present it on a map.
						    if (place.geometry.viewport) {
						    	self.map.fitBounds(place.geometry.viewport);
						    } else {
						    	self.map.setCenter(place.geometry.location);
						    	self.map.setZoom(17);  // Why 17? Because it looks good.
						    }
						    
						    marker.setIcon(({
						      url: place.icon,
						      size: new google.maps.Size(71, 71),
						      origin: new google.maps.Point(0, 0),
						      anchor: new google.maps.Point(17, 34),
						      scaledSize: new google.maps.Size(35, 35)
						    }));
						    marker.setPosition(place.geometry.location);
						    marker.setVisible(true);						    
	
						    var address = '';
						    if (place.address_components) {
						      address = [
						        (place.address_components[0] && place.address_components[0].short_name || ''),
						        (place.address_components[1] && place.address_components[1].short_name || ''),
						        (place.address_components[2] && place.address_components[2].short_name || '')
						      ].join(' ');
						    }

						    infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
						    infowindow.open(self.map, marker);
						  });
						
						// pintar
						self.render();	
						
					};
					var geoError = function(error) {
						// crear mapa en posicion por defecto
						
					    console.log('Error occurred. Error code: ' + error.code);
					    // error.code can be:
					    //   0: unknown error
					    //   1: permission denied
					    //   2: position unavailable (error response from location provider)
					    //   3: timed out
			    
					    var myOptions = {
								zoom : 15,
								center : new google.maps.LatLng(39.46981860, -0.32571000),
								mapTypeId : google.maps.MapTypeId.ROADMAP,
								streetViewControl: false,
								mapTypeControl: false
							};
					    
					    self.map = new google.maps.Map(self.$('#pnMapa')[0], myOptions);
		
						// pintar
						self.render();	
					};
					
					navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
					
					// sidebar menu
					if(getCookie('id')){
						self.$('#imgProfile').attr('src','https://graph.facebook.com/' + getCookie('id') + '/picture?width=80&height=80');
						self.$('#profileName').append('<h4>' + decodeURI(getCookie('name')) + '</h4>');
					}

				});
		
		// controlar cambios en el modelo
		this.collection.on('remove', function() {
			self.render();
		});
		this.collection.on('sync', function() {
			self.render();
		});
	},
	render : function() {
		var self = this;

		// limpiar todas los markers pintados
		for (var i = 0; i < self.markers.length; i++)
			self.markers[i].setMap(null);
		self.markers = [];
		
		// pintar los bares
				
		// aplicar filtros
		var bares_filtrados = this.collection;
		// nombre
		//bares_filtrados = bares_filtrados.filtrarPorNombre('La Pascuala');
		// tipo, distancia, valoracion...
		
		
		bares_filtrados.forEach(function(bar) {
			// solo si son visibles
			if (bar.get('visible') == 'on') {
				var image = {
					    url: 'images/marker.png', // url
					    scaledSize: new google.maps.Size(50, 50), // scaled size
					    origin: new google.maps.Point(0, 0), // origin
					    anchor: new google.maps.Point(20, 20) // anchor
					};
				var marker = new google.maps.Marker({
					position : new google.maps.LatLng(bar.get('latitud'), bar.get('longitud')),
					map : self.map,
					title : bar.get('titulo'),
					icon: image
				});
				
				google.maps.event.addListener(marker, 'click', function() {
					self.$('#poppphoto').attr("src", bar.get('photoURL'));	
					self.$('#poptitulo').text(bar.get('titulo'));
					self.$('#popdescripcion').text(bar.get('descripcion'));
					self.$('#popmas').text(bar.get('id'));
					self.$('#popupRating').attr("data-score", bar.get('score'));
					self.$('#popupRating').raty(
							{ 
								score: function() {
								    return $(this).attr('data-score');
								  },
								number: 5,
								path : 'images/'
							});
					
					self.$('#popupPhoto').popup("open", {
						transition : 'fade'
					});
				});		

				// guardar informacion sobre los markers
				self.markers.push(marker);
			}
		});		
	},
	verBar : function(vistaVerBar) {
		this.vistaVerBar = vistaVerBar;
	}
});

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}