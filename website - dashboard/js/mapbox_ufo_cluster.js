{ // scoping the variables only in the file

    mapboxgl.accessToken = 'pk.eyJ1Ijoia2lyYnMtYnR3IiwiYSI6ImNsdTJxMmhtcTA0aXIya254YWR6Zm5jZXgifQ.5zXGQGfgr5GD_aM_KvswSw';
    // ufo data
    data_url_clustering = 'https://raw.githubusercontent.com/wintersolijer/ds-data/main/ufo_data_cluster.csv';
    
    data_length_clusters = 0;

    line_length_clusters = 0;
    
    data_save_clusters = [];
    
    var map_clustering = new mapboxgl.Map({
      container: 'map-clusters',
      style: 'mapbox://styles/mapbox/dark-v10',
      center: [-98.583333, 39.833333], // Zentrum der USA
      zoom: 3 // Zoomstufe, um die USA anzuzeigen
    });
    
    function generateUniqueColors(numColors) {
        const colors = new Set();  // Using a Set to avoid duplicates
    
        // These prime numbers help ensure that we cycle through RGB values more evenly
        const primeR = 241;
        const primeG = 191;
        const primeB = 239;
    
        let r = 0, g = 0, b = 0;
        for (let i = 0; i < numColors; i++) {
            r = (r + primeR) % 256;
            g = (g + primeG) % 256;
            b = (b + primeB) % 256;
            colors.add(`#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`);
        }
    
        return Array.from(colors);
    }

    // colors for drawing the UFO points
    ufo_colors_clustering = generateUniqueColors(256);

    function display_map_clustering(km_dist, day_dist){
        // console.log("loading new map");
        map_clustering.on('load', function() {
    
            // Linie um die USA zeichnen
            map_clustering.addSource('usa', {
              'type': 'geojson',
              'data': 'https://raw.githubusercontent.com/johan/world.geo.json/master/countries/USA.geo.json'
            });
            
            map_clustering.addLayer({
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
            d3.csv(data_url_clustering).then(function(data_load_clustering) {
                console.log(data_load_clustering);
                data_save_clusters = data_load_clustering
                add_ufo_points_cluster(data_save_clusters, map_clustering, km_dist, day_dist);
    
            }).catch(function(error) {
            console.error("Error loading the CSV file:", error);
            });
        });
    }
    
    function add_ufo_points_cluster(data_load_clustering, map_clustering, km_dist, day_dist){

        // filter data
        km_data = data_load_clustering.filter(function(data){
            return data['km_delta'] == km_dist;
        });

        data = km_data.filter(function(data){
            return parseInt(data['day_delta']) <= parseInt(day_dist);
        });
        
        console.log(data);
        
        res = get_cluster_map(data);

        mapped_data = res[0];
        indexed_num = 0;
        
        line_indexed_num = 0;

        for (let [key, value] of mapped_data) {
            for (let index = 0; index < value.length; index++){
                map_clustering.addLayer({
                    'id': 'cluster-point-' + indexed_num,
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
                                'coordinates': [value[index]["longitude"], value[index]["latitude"]]
                            }
                            }
                        ]
                        }
                    },
                    'paint': {
                        'circle-radius': 6, // Durchmesser des Punktes in Pixeln
                        //'circle-color': "#ee24dd"// Farbe des Punktes
                        'circle-color': ufo_colors_clustering[parseInt(value[index]['cluster_key'])%256]// Farbe des Punktes
                    }
                });
                indexed_num = indexed_num + 1;
                
            }


            for (let index = 0; index < value.length-1; index++){
                try {
                    
                
                map_clustering.addSource('route-source-' + line_indexed_num, {
                    type: 'geojson',
                    data: {
                        type: 'Feature',
                        properties: {},
                        geometry: {
                            type: 'LineString',
                            coordinates: [
                                [value[index]["longitude"], value[index]["latitude"]], // Start point coordinates [lng, lat]
                                [value[index+1]["longitude"], value[index+1]["latitude"]], // End point coordinates [lng, lat]
                            ]
                        }
                    }
                });
                map_clustering.addLayer({
                    id: 'route-' + line_indexed_num,
                    type: 'line',
                    source: 'route-source-' + line_indexed_num,
                    layout: {
                        'line-join': 'round',
                        'line-cap': 'round'
                    },
                    paint: {
                        'line-color': ufo_colors_clustering[parseInt(value[index]['cluster_key'])%256], // Line color
                        'line-width': 4 // Line width
                    }
                });

                line_indexed_num = line_indexed_num + 1;


                } catch (error) {
                    console.log(error);
                }
            }

            line_length_clusters = line_indexed_num;

        }
        
        data_length_clusters = indexed_num; 

    
        // for (let index = 0; index < data.length; index++) {
        //     map_clustering.addLayer({
        //         'id': 'cluster-point-' + index,
        //         'type': 'circle',
        //         'source': {
        //             'type': 'geojson',
        //             'data': {
        //             'type': 'FeatureCollection',
        //             'features': [
        //                 {
        //                 'type': 'Feature',
        //                 'properties': {},
        //                 'geometry': {
        //                     'type': 'Point',
        //                     'coordinates': [data[index]["longitude"], data[index]["latitude"]]
        //                 }
        //                 }
        //             ]
        //             }
        //         },
        //         'paint': {
        //             'circle-radius': 4, // Durchmesser des Punktes in Pixeln
        //             'circle-color': ufo_colors_clustering[parseInt(data[index]['cluster_key'])%256]// Farbe des Punktes
        //         }
        //     });
        // }

        drawPointConnection(data, map_clustering);
        // console.log("added_points");
    }
    
    function get_cluster_map(data){
        let key_set = new Set();
        let sighting_cluster_key_map = new Map();

        for (let index = 0; index < data.length; index++) {
            key_set.add(data[index]['cluster_key']);
        }
        
        key_set.forEach(key => {
            sighting_cluster_key_map.set(key, []); // Each key now maps to an empty array
        });

        data.forEach(row => {
            sighting_cluster_key_map.get(row['cluster_key']).push(row);
        });
        
        row_count = 0;

        for (let [key, value] of sighting_cluster_key_map) {
            if (value.length === 1) {
                sighting_cluster_key_map.delete(key); // Delete the key if its array has length 1
            }else{
                row_count = row_count + value.length;
            }
        }

        return [sighting_cluster_key_map, row_count];
    }

    function drawPointConnection(data, map_clustering){



    }


    function clear_map_clusters(){
        console.log("data_length_clusters");
        console.log(data_length_clusters);
        // Entferne alle Datenpunkte
        for (let index = 0; index < data_length_clusters; index++) {
            map_clustering.removeLayer('cluster-point-' + index);
            map_clustering.removeSource('cluster-point-' + index);
        }

        for (let index = 0; index < line_indexed_num; index++) {
            map_clustering.removeLayer('route-' + index);
            map_clustering.removeSource('route-source-' + index);
        }
    }
    
    
    
    // slider function
    var slider = document.getElementById("yearSlider");
    var map_title = document.getElementById("map-chart-title");
    
    var day_delta_var = 1;
    var km_delta_var = 5;

    function set_day(day_delta_value){
        day_delta_var = day_delta_value;
    }

    function set_km(km_delta_value){
        km_delta_var = km_delta_value;
    }

    function init_map_cluster(){
        clear_map_clusters();
        add_ufo_points_cluster(data_save_clusters, map_clustering, km_delta_var, day_delta_var);
    }
    
    display_map_clustering(km_delta_var, day_delta_var);
    
} // scoping 