{ // scoping var in the file 

csvUrl = "https://raw.githubusercontent.com/kirbs-btw/ufo-data-analysis/main/data/clean_ufo_data.csv";

d3.csv(csvUrl).then(function(data) {
    // counting the num of entrys per year
    let yearCounts = [];
    data.forEach(function(d) {
      const year = +d.year;
      if (yearCounts[year]) {
        yearCounts[year]++;
      } else {
        yearCounts[year] = 1;
      }
    });
    
    data = yearCounts;
    

    // Extracting labels and values from data object
    const years = Object.keys(data);
    const values = Object.values(data);

    // Drawing the chart
    const ctx = document.getElementById('chart-years').getContext('2d');

    // Creating a gradient for the fill
    const gradient = ctx.createLinearGradient(0, 0, 0, 400); // Adjust the gradient direction and size as needed
    gradient.addColorStop(0, 'rgba(112, 158, 34, 0.2)'); // Start color
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)'); // End color

    const myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: years,
            datasets: [{
                label: 'Years Count',
                data: values,
                backgroundColor: gradient,
                borderColor: '#afca3090',
                borderWidth: 1,
                fill: 'origin'
            }]
        },
        options: {
            scales: {
                y: {
                    ticks: {
                        beginAtZero: true
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