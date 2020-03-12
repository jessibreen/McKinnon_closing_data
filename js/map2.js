//Create the baselayer and add it to the map
var baselayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
	maxZoom: 20
});

//Add empty variable for data 
var sitePoints = null;

//Sets the color for each Program Type
//more Program Types can be added by following the pattern below
//the last color without a type label is the color that anything with a type that isn't listed will be colored 
function setColor(type) {
	return type == 'Private not-for-profit, 4-year or above' ? "#a6cee3" : 
	       type == 'Public, 4-year or above' ? "#33a02c" :
           type == 'Private for-profit, 4-year or above' ? "#1f78b4" :
           type == 'Public, 2-year' ? '#b2df8a' :
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
		fillColor: '#ffffff',
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
        
        layer.bindPopup("<b>"+props.Institution+"</b>"+
		        "<dl>"+
            props.City+", "+props.State+
            "<br><a href="+props.Documentation+">Read More</a>"+      
		        "</dl>");
	
	    layer.on({
	        click: highlightFeature
	    });
	    
    }
	
});

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend');
    //this is the title for the legend
    div.innerHTML += "<b>"+ 'Sector'+ "</b>"+ "<br>";
    
    //type is the content of the Sector field, labels is what you want the label on the legend to actually say
    //there need to be the same number of types as labels and listed in the same order
    type = ['Private for-profit, 4-year or above', 'Private not-for-profit, 4-year or above', 'Public, 4-year or above', 'Public, 2-year'];
    labels = ['Private for-profit, 4-year or above', 'Private not-for-profit, 4-year or above', 'Public, 4-year or above', 'Public, 2-year'];
    
    for (var i = 0; i < type.length; i++) {
        div.innerHTML +=
            '<i class="circle" style="background:' + setColor(type[i]) + '"></i> ' +
             (type[i] ? labels[i] + '<br>' : '+');
    }
    
    return div;
};

var map = L.map('map', {maxZoom: 20}).fitBounds(sitePoints.getBounds());
	baselayer.addTo(map);
	sitePoints.addTo(map);
	legend.addTo(map);

}); 