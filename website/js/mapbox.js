mapboxgl.accessToken = 'pk.eyJ1Ijoia2lyYnMtYnR3IiwiYSI6ImNsdTJxMmhtcTA0aXIya254YWR6Zm5jZXgifQ.5zXGQGfgr5GD_aM_KvswSw';
data_url = 'https://raw.githubusercontent.com/kirbs-btw/ufo-data-analysis/main/data/clean_ufo_data.csv';

colors = ["#afca30", "#709e22", "#2b3d0b"];

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
        
        // datenpunkte malen
        d3.csv(data_url).then(function(data_load) {
            
            // filter data
            data = data_load.filter(function(data){
                return data['year'] == year;
            });

            // data = data.slice(0,1000);
            console.log(data.length);

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
                        'circle-color': colors[index%3]// Farbe des Punktes
                    }
                });
            }
            console.log("added_points");
        
            }).catch(function(error) {
            console.error("Error loading the CSV file:", error);
            });
    });
}

var slider = document.getElementById("yearSlider");
var map_title = document.getElementById("map-chart-title");

slider.oninput = function() {
    map_title.innerHTML = `UFO Sightings: ${this.value}`;
    display_map(this.value);
    console.log(this.value);
}

display_map(1990);

