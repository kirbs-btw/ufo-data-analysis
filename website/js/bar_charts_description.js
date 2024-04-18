{ // scoping var in the file 

csvUrl = "https://raw.githubusercontent.com/kirbs-btw/ufo-data-analysis/main/data/clean_ufo_data.csv";


function countUFODescriptions(data) {
    const ufoCounts = {}; // Object to store counts
    
    // Loop through each description in the data
    data.forEach(description => {
      // If the description is already in the counts object, increment its count
      if (ufoCounts[description.shape]) {
        ufoCounts[description.shape]++;
      } else {
        // If not, initialize its count to 1
        ufoCounts[description.shape] = 1;
      }
    });
    
    return ufoCounts; // Return the counts object
  }


d3.csv(csvUrl).then(function(data) {
    // counting the num of entrys per year
    data = countUFODescriptions(data);
    

    // Convert dictionary to array of objects
    let items = Object.keys(data).map(key => {
        return { key: key, value: data[key] };
    });

    // Sort the array based on the values
    items.sort((a, b) => a.value - b.value);

    // Separate the sorted keys and values
    let shape = items.map(item => item.key);
    let values = items.map(item => item.value);

    // Drawing the chart
    const ctx = document.getElementById('chart-description').getContext('2d');
    const myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: shape,
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