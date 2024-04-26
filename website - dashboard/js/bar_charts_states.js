{ // scoping var in the file 

  csvUrl = "https://raw.githubusercontent.com/kirbs-btw/ufo-data-analysis/main/data/clean_ufo_data.csv";
  
  d3.csv(csvUrl).then(function(data) {
      // counting the num of entrys per year
      let stateCounts = {};

      data.forEach(function(entry) {
          const state = entry.state;
          if (stateCounts[state]) {
              stateCounts[state]++;
          } else {
              stateCounts[state] = 1;
          }
      });


      const stateCountsArray = Object.keys(stateCounts).map(state => ({ state, count: stateCounts[state] }));

      // Sort the array based on counts in descending order
      stateCountsArray.sort((a, b) => b.count - a.count);

      // Extracting sorted states and counts from the sorted array
      const states = stateCountsArray.map(item => item.state).slice(0, 15);
      const values = stateCountsArray.map(item => item.count).slice(0, 15);

      const ctx = document.getElementById('chart-states').getContext('2d');
      // Extracting labels and values from data object
      // const states = Object.keys(stateCounts).reverse();
      // const values = Object.values(stateCounts).reverse();
  
      // Creating a gradient for the fill
      const gradient = ctx.createLinearGradient(200, 0, 0, 0); // Adjust the gradient direction and size as needed
      gradient.addColorStop(0, 'rgba(112, 158, 34, 0.2)'); // Start color
      gradient.addColorStop(1, 'rgba(112, 158, 34, 0)'); // End color
  
        // Set up Chart.js configuration
        const myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: states,
            datasets: [{
                label: 'State Count',
                backgroundColor: gradient,
                borderColor: '#afca3090',
                borderWidth: 1,
                data: values,
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
