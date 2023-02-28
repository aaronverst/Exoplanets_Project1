class DistanceHistogram {
    constructor(csvFile, id) {
        this.csvFile = csvFile;
        this.id = id;
        this.margin = { top: 10, right: 30, bottom: 30, left: 40 };
        this.width = 460 - this.margin.left - this.margin.right;
        this.height = 400 - this.margin.top - this.margin.bottom;
    }

    async createHistogram() {
        // Load the CSV file
        const data = await d3.csv(this.csvFile);


        // Convert distances to numbers
        const distances = data.map((d) => +d.sy_dist);

        // Create the SVG element
        const svg = d3
            .select(`#${this.id}`)
            .append("svg")
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom)
            .append("g")
            .attr("transform", `translate(${this.margin.left},${this.margin.top})`);

        // Create a histogram with 10 bins
        const bins = d3.histogram().value((d) => d).domain([0, d3.max(distances)]).thresholds(10)(distances);

        // Create the x-axis scale
        const x = d3.scaleLinear().domain([0, d3.max(distances)]).range([0, this.width]);
        svg
            .append("g")
            .attr("transform", `translate(0,${this.height})`)
            .call(d3.axisBottom(x));

        // Create the y-axis scale
        const y = d3.scaleLinear().range([this.height, 0]);
        y.domain([0, d3.max(bins, (d) => d.length)]);
        svg.append("g").call(d3.axisLeft(y));

        // Create the histogram bars
        svg
            .selectAll("rect")
            .data(bins)
            .enter()
            .append("rect")
            .attr("x", 1)
            .attr("transform", (d) => `translate(${x(d.x0)}, ${y(d.length)})`)
            .attr("width", (d) => x(d.x1) - x(d.x0) - 1)
            .attr("height", (d) => this.height - y(d.length))
            .style("fill", "#69b3a2");

        // Create the tooltip
        const tooltip = d3
            .select(`#${this.id}`)
            .append("div")
            .style("position", "absolute")
            .style("visibility", "hidden")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "1px")
            .style("border-radius", "5px")
            .style("padding", "10px");

        // Add mouseover and mouseout events to the bars to display the tooltip
        svg
            .selectAll("rect")
            .on("mouseover", function (d) {
                tooltip.style("visibility", "visible").text(`${d.length} distances`);
            })
            .on("mousemove", function (d) {
                tooltip.style("top", d3.event.pageY - 10 + "px").style("left", d3.event.pageX + 10 + "px");
            })
            .on("mouseout", function (d) {
                tooltip.style("visibility", "hidden");
            });
    }
}