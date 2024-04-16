{ // scoping the variables only in the file

mapboxgl.accessToken = 'pk.eyJ1Ijoia2lyYnMtYnR3IiwiYSI6ImNsdTJxMmhtcTA0aXIya254YWR6Zm5jZXgifQ.5zXGQGfgr5GD_aM_KvswSw';
// ufo data
data_url = 'https://raw.githubusercontent.com/kirbs-btw/ufo-data-analysis/main/data/clean_ufo_data.csv';
// airports
data_url_airports = 'https://raw.githubusercontent.com/kirbs-btw/ufo-data-analysis/main/data/top_10_airports_usa.csv';

// colors for drawing the UFO points
ufo_colors = ["#afca30", "#709e22", "#527514"];

data_length = 0;

data_save = [];

air_port_data_save = [];

var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/dark-v10',
  center: [-98.583333, 39.833333], // Zentrum der USA
  zoom: 3 // Zoomstufe, um die USA anzuzeigen
});

function display_map(year){
    console.log("loading new map");
    map.on('load', function() {

        // Linie um die USA zeichnen
        map.addSource('usa', {
          'type': 'geojson',
          'data': 'https://raw.githubusercontent.com/johan/world.geo.json/master/countries/USA.geo.json'
        });
        
        map.addLayer({
          'id': 'usa-border',
          'type': 'line',
          'source': 'usa',
          'layout': {},
          'paint': {
            'line-color': '#709e22',
            'line-width': 2
          }
        });
        
        // getting data 
        d3.csv(data_url).then(function(data_load) {
            data_save = data_load
            add_ufo_points(data_save, map, year);

        }).catch(function(error) {
        console.error("Error loading the CSV file:", error);
        });
    });
}

function add_ufo_points(data_load, map, year){
    // filter data
    data = data_load.filter(function(data){
        return data['year'] == year;
    });

    data = data.slice(0,1000);
    console.log(data.length);
    
    data_length = data.length;

    for (let index = 0; index < data.length; index++) {
        map.addLayer({
            'id': 'point-' + index,
            'type': 'circle',
            'source': {
                'type': 'geojson',
                'data': {
                'type': 'FeatureCollection',
                'features': [
                    {
                    'type': 'Feature',
                    'properties': {},
                    'geometry': {
                        'type': 'Point',
                        'coordinates': [data[index]["longitude"], data[index]["latitude"]]
                    }
                    }
                ]
                }
            },
            'paint': {
                'circle-radius': 4, // Durchmesser des Punktes in Pixeln
                'circle-color': ufo_colors[index%3]// Farbe des Punktes
            }
        });
    }
    console.log("added_points");
}

function get_airportData(){
    // getting data 

    d3.csv(data_url_airports).then(function(data_load) {
        air_port_data_save = data_load;

    }).catch(function(error) {
    console.error("Error loading the CSV file:", error);
    });
    console.log("airports_loaded");
}

function add_airport_points(data){
    for (let index = 0; index < data.length; index++) {
        map.addLayer({
            'id': 'point-' + data[index]['IATA'],
            'type': 'circle',
            'source': {
                'type': 'geojson',
                'data': {
                'type': 'FeatureCollection',
                'features': [
                    {
                    'type': 'Feature',
                    'properties': {},
                    'geometry': {
                        'type': 'Point',
                        'coordinates': [data[index]["longitude"], data[index]["latitude"]]
                    }
                    }
                ]
                }
            },
            'paint': {
                'circle-radius': 15, // Durchmesser des Punktes in Pixeln
                'circle-color': '#ea61ff',// Farbe des Punktes
                'circle-opacity': 0.8
            }
        });

        map.addLayer({
            'id': 'text-' + data[index]['IATA'],
            'type': 'symbol',
            'source': 'point-' + data[index]['IATA'], // Use the same source as the point layer
            'layout': {
                'text-field': data[index]['IATA'], // Customize text field as per your requirement
                'text-font': ['Open Sans Regular'], // Font family
                'text-size': 15 // Font size
            },
            'paint': {
                'text-color': '#000000' // Text color
            }
        });

    }
}

function clear_map_airports(){
    for (let index = 0; index < air_port_data_save.length; index++) {
        map.removeLayer('text-' + air_port_data_save[index].IATA);
        map.removeLayer('point-' + air_port_data_save[index].IATA);
        map.removeSource('point-' + air_port_data_save[index].IATA);

    }
}

function clear_map(){
    // Entferne alle Datenpunkte
    for (let index = 0; index < data_length; index++) {
        map.removeLayer('point-' + index);
        map.removeSource('point-' + index);
    }
}



// slider function
var slider = document.getElementById("yearSlider");
var map_title = document.getElementById("map-chart-title");

slider.onmouseup = function() {
    map_title.innerHTML = `UFO Sightings: ${this.value}`;
    clear_map();
    add_ufo_points(data_save, map, this.value);
    console.log(this.value);
}

display_map(1990);

// show airports 
get_airportData();

var airport_toggel = document.getElementById('airportCheckbox');

airport_toggel.addEventListener('change', function() {
    // Check if the checkbox is checked
    if (this.checked) {
        add_airport_points(air_port_data_save);
    } else {
        clear_map_airports();
    }
});

} // scoping 