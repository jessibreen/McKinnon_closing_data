/* // create map with Mapbox Streets tilelayer
L.mapbox.accessToken = 'pk.eyJ1IjoidG9kZGdsZWFua3kiLCJhIjoiY2ltcW16OXdzMDBqb3Vwa2toNm9pb200NiJ9.hwTEGkXsOWDrBgFO8jzQfQ';
// Replace 'mapbox.streets' with your map id.
var mapboxTiles = L.tileLayer('https://api.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token=' + L.mapbox.accessToken, {
    attribution: '© <a href="https://www.mapbox.com/map-feedback/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}); */

//Create the baselayer and add it to the map
/* var baselayer = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.{ext}', {
attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
subdomains: 'abcd',
minZoom: 0,
maxZoom: 20,
ext: 'png'
}); */

var baselayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
	maxZoom: 19
});

//Add empty variable for data 
var sitePoints = null;

//Sets the color for each Program Type
//more Program Types can be added by following the pattern below
//the last color without a type label is the color that anything with a type that isn't listed will be colored 
function setColor(type) {
	return type == 'Private not-for-profit, 4-year or above' ? "#a6cee3" : 
	       type == 'Public, 4-year or above' ? "#1f78b4" :
	       type == 'Private for-profit, 4-year or above' ? "#b2df8a" :
	       type == 'Source' ? "#33a02c" : 
	                     "white";
}

function style(feature) {
    return {
        fillColor: setColor(feature.properties.Sector),
        color: "white",
        fillOpacity: 0.9,
        width: 0.2
    };
}

var activePoint;

function highlightFeature(e) {
	if (activePoint) {
		activePoint.setStyle(style(activePoint.feature));
	};
	
	var layer = e.target;
	activePoint = e.target;
	
	
	activePoint.setStyle({
		fillColor: '#f6630f',
	});
}


//get geoJSON and put it on the map
$.getJSON("data/data.geojson",function(data){
	// Create data layer
	sitePoints = L.geoJson(data, {
		pointToLayer: function (feature, latlng) {
        return L.circleMarker (latlng, style(feature));
		},
		
		
	 onEachFeature: function(feature, layer) {            
        var props = layer.feature.properties;
        
        layer.bindPopup("<h2>"+props.Institution+"</h2>"+
		        "<dl>"+
			props.City+", "+props.State+        
		
			        // "<dt>"+"Contact: "+"</dt><dd>"+props.contact+"<br>"+props.email+"<br>"+props.phone+"</dd>"+
			        // "<dt>"+"Hours of Operation: "+"</dt><dd>"+props.hours+"</dd>"+
			        // "<dt>"+"Storage Capacity: "+"</dt><dd>"+props.storage_cap+"</dd>"+
			        // "<dt>"+"Type of Program: "+"</dt><dd>"+props.program_type+"</dd>"+
			        // "<dt>"+"Food Education Offered: "+"</dt><dd>"+props.food_ed+"</dd>"+
			        // "<dt>"+"Regular Gleaning Donation: "+"</dt><dd>"+props.reg_donation+"</dd>"+
			        // "<dt>"+"Produce Restrictions: "+"</dt><dd>"+props.produce_restrictions + "</dd>"+
		        "</dl>");
	
	    layer.on({
	        click: highlightFeature
	    });
	    
    }
	
		// onEachFeature: function(feature, layer) {
		//     var props = layer.feature.properties;
		//     layer.on({
		//         click: function populate(e) {
		//         document.getElementById('poptext').innerHTML = "<h2>"+props.organization+"</h2>"+
		//         "<dl>"+
		// 	        "<dt>"+"Address: "+"</dt><dd>"+props.address+"<br>"+ props.website+"</dd>"+
		// 	        "<dt>"+"Contact: "+"</dt><dd>"+props.contact+"<br>"+props.email+"<br>"+props.phone+"</dd>"+
		// 	        "<dt>"+"Hours of Operation: "+"</dt><dd>"+props.hours+"</dd>"+
		// 	        "<dt>"+"Storage Capacity: "+"</dt><dd>"+props.storage_cap+"</dd>"+
		// 	        "<dt>"+"Type of Program: "+"</dt><dd>"+props.program_type+"</dd>"+
		// 	        "<dt>"+"Food Education Offered: "+"</dt><dd>"+props.food_ed+"</dd>"+
		// 	        "<dt>"+"Regular Gleaning Donation: "+"</dt><dd>"+props.reg_donation+"</dd>"+
		// 	        "<dt>"+"Produce Restrictions: "+"</dt><dd>"+props.produce_restrictions + "</dd>"+
		//         "</dl>";
		//         highlightFeature(e)
		        	
		//         },
		        
		//     });
	 //   }
});

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend');
    //this is the title for the legend
    div.innerHTML += "<b>"+ 'Sector'+ "</b>"+ "<br>";
    
    //type is the content of the Sector field, labels is what you want the label on the legend to actually say
    //there need to be the same number of types as labels and listed in the same order
    type = ['Private for-profit, 4-year or above', 'Private not-for-profit, 4-year or above', 'Public, 4-year or above'];
    labels = ['Private for-profit, 4-year or above', 'Private not-for-profit, 4-year or above', 'Public, 4-year or above'];
    
    for (var i = 0; i < type.length; i++) {
        div.innerHTML +=
            '<i class="circle" style="background:' + setColor(type[i]) + '"></i> ' +
             (type[i] ? labels[i] + '<br>' : '+');
    }
    
    return div;
};

var map = L.map('map', {maxZoom: 17}).fitBounds(sitePoints.getBounds());
	baselayer.addTo(map);
	sitePoints.addTo(map);
	legend.addTo(map);

}); 