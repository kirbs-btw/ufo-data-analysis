{ // scoping var in the file 

csvUrl = "https://raw.githubusercontent.com/kirbs-btw/ufo-data-analysis/main/data/clean_ufo_data.csv";

d3.csv(csvUrl).then(function(data) {
    // counting the num of entrys per year
    let yearCounts = {};
    data.forEach(function(d) {
      const year = +d.year;
      if (yearCounts[year]) {
        yearCounts[year]++;
      } else {
        yearCounts[year] = 1;
      }
    });

    // Chart dimensions
    var width = 600;
    var height = 400;
    var margin = {top: 20, right: 20, bottom: 30, left: 40};

    // SVG element
    var svg = d3.select("#bar-chart-test")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // X scale
    var x = d3.scaleBand()
    .domain(Object.keys(yearCounts))
    .range([0, width])
    .padding(0.1);

    // Y scale
    var y = d3.scaleLinear()
    .domain([0, d3.max(Object.values(yearCounts))])
    .nice()
    .range([height, 0]);

    // Bars
    svg.selectAll(".bar")
    .data(Object.entries(yearCounts))
    .enter().append("rect")
    .attr("class", "bar")
    .attr("x", d => x(d[0]))
    .attr("width", x.bandwidth())
    .attr("y", d => y(d[1]))
    .attr("height", d => height - y(d[1]));

    // X axis
    svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

    // Y axis
    svg.append("g")
    .call(d3.axisLeft(y));


})
.catch(function(error) {
  console.error("Error loading the CSV file:", error);
});

} // scoping