{ // scoping var in the file 

  csvUrl = "https://raw.githubusercontent.com/kirbs-btw/ufo-data-analysis/main/data/clean_ufo_data.csv";
  
  d3.csv(csvUrl).then(function(data) {
      // counting the num of entrys per year
      let shapeCounts = {};

      data.forEach(function(entry) {
          const shape = entry.shape;
          if (shapeCounts[shape]) {
                shapeCounts[shape]++;
          } else {
                shapeCounts[shape] = 1;
          }
      });

      // console.log(shapeCounts);

      const shapeCountsArray = Object.keys(shapeCounts).map(shape => ({ shape, count: shapeCounts[shape] }));

      // Sort the array based on counts in descending order
      shapeCountsArray.sort((a, b) => b.count - a.count);

      // Extracting sorted states and counts from the sorted array
      const shapes = shapeCountsArray.map(item => item.shape).slice(0, 15);
      const values = shapeCountsArray.map(item => item.count).slice(0, 15);

      const ctx = document.getElementById('chart-shapes').getContext('2d');
  
      // Creating a gradient for the fill
      const gradient = ctx.createLinearGradient(200, 0, 0, 0); // Adjust the gradient direction and size as needed
      gradient.addColorStop(0, 'rgba(112, 158, 34, 0.2)'); // Start color
      gradient.addColorStop(1, 'rgba(112, 158, 34, 0)'); // End color
  
        // Set up Chart.js configuration
        const myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: shapes,
            datasets: [{
                label: 'UFO Shape Count',
                backgroundColor: gradient,
                borderColor: '#afca3090',
                borderWidth: 1,
                data: values,
                fill:'origin'
            }]
        },
        options: {
            indexAxis: 'y', // Horizontal bar chart
            scales: {
                x: {
                    beginAtZero: true,

                },
                y: {
                    position: 'left', // Align y-axis labels to the left
                    stacked: true,
                    grid: {
                        display: false
                    }
                }
            }
        }
      });

  
  })
  .catch(function(error) {
    console.error("Error loading the CSV file:", error);
  });
  
} // scoping
