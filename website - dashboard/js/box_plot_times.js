{ // scoping var in the file 

    csvUrl = "https://raw.githubusercontent.com/kirbs-btw/ufo-data-analysis/main/data/clean_seconds_data.csv";
    
    d3.csv(csvUrl).then(function(data) {
        seconds_column = data.map(item => item['duration (seconds)']);
        
        seconds_column_sorted = seconds_column.sort((a, b) => parseInt(a) - parseInt(b));

        // clearing out outliers to let the chart be good to look at
        // cutting the top 4.7% - so a bit more than the standart but the boxplot is not readable otherwise
        seconds_column_sorted = seconds_column_sorted.slice(0, 62000);
        // seconds_column_sorted = seconds_column_sorted.slice(0, 55000);
        // console.log(seconds_column);

        var box_plot_data = [{
            y: seconds_column_sorted, // Sample data
            type: 'box',
            line: { color: '#709e22' } // Color for the box edges and whiskers    
        }];

        var layout = {
            title: 'Sighting Time (in sec)',
            paper_bgcolor: '#00000000', // Background color of the entire plotting area
            plot_bgcolor: '#00000000', 
        };

        Plotly.newPlot('chart-states', box_plot_data, layout);
    
    })
    .catch(function(error) {
      console.error("Error loading the CSV file:", error);
    });
    
    } // scoping