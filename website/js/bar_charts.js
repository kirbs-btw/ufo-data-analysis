// Data to be displayed
const data = [10, 20, 30, 40, 50];

// Set up dimensions for the chart
const width = 500;
const height = 300;
const margin = { top: 20, right: 20, bottom: 30, left: 40 };
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

// Create SVG element
const svg = d3.select("#bar-chart-test")
    .attr("width", width)
    .attr("height", height);

// Create scales for x and y axis
const x = d3.scaleBand()
    .domain(data.map((d, i) => i)) // Assuming data is an array, use index for x-axis
    .range([margin.left, innerWidth + margin.left])
    .padding(0.1);

const y = d3.scaleLinear()
    .domain([0, d3.max(data)])
    .nice()
    .range([innerHeight + margin.top, margin.top]);

// Create x axis
const xAxis = d3.axisBottom(x);

// Create y axis
const yAxis = d3.axisLeft(y);

// Append group elements for axes
svg.append("g")
    .attr("transform", `translate(0, ${innerHeight + margin.top})`)
    .call(xAxis);

svg.append("g")
    .attr("transform", `translate(${margin.left}, 0)`)
    .call(yAxis);

// Create bars
svg.selectAll("rect")
    .data(data)
    .join("rect")
    .attr("class", "bar")
    .attr("x", (d, i) => x(i))
    .attr("y", d => y(d))
    .attr("width", x.bandwidth())
    .attr("height", d => innerHeight + margin.top - y(d));
