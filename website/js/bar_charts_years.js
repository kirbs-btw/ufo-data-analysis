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
    const myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: years,
            datasets: [{
                label: 'Data',
                data: values,
                backgroundColor: '#709e2220',
                borderColor: '#afca3090',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });

})
.catch(function(error) {
  console.error("Error loading the CSV file:", error);
});

} // scoping