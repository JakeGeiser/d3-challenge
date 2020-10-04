function scatterMultiAxis(xLabels,yLabels,xKeys,yKeys,dataPath) {
    // params
    //// xLabels: array of x-axis labels
    //// yLabels: array of y-axis labels
    //// xKeys: keys to access data (match order of xLabels)
    //// yKeys: keys to access data (match order of yLabels)
    //// dataPath: relative path to csv file
    
    // function designed to be used with any data to make scatter plot
    // code largely adapted from 16:D3/Activities/3/12
    var svgWidth = 960;
    var svgHeight = 500;

    var margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 100
    };

    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;

    // Create an SVG wrapper, append an SVG group that will hold our chart,
    // and shift the latter by left and top margins.
    var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

    // Append an SVG group
    var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Initial Params
    var chosenXAxis = "poverty";
    var chosenXAxis = "poverty";
    var chosenXAxis = "poverty";
    var chosenXAxis = "poverty";
    var chosenXAxis = "poverty";

    // function used for updating x-scale var upon click on axis label
    function xScale(Data, chosenXAxis) {
        // create scales
        var xLinearScale = d3.scaleLinear()
        .domain([d3.min(Data, d => d[chosenXAxis]) * 0.8,
            d3.max(Data, d => d[chosenXAxis]) * 1.2
        ])
        .range([0, width]);
    
        return xLinearScale;
    
    }
  
    // function used for updating xAxis var upon click on axis label
    function renderXAxes(newXScale, xAxis) {
        var bottomAxis = d3.axisBottom(newXScale);
    
        xAxis.transition()
        .duration(1000)
        .call(bottomAxis);
    
        return xAxis;
    }

    // function used for updating y-scale var upon click on axis label
    function yScale(Data, chosenYAxis) {
        // create scales
        var yLinearScale = d3.scaleLinear()
        .domain([d3.min(Data, d => d[chosenYAxis]) * 0.8,
            d3.max(Data, d => d[chosenYAxis]) * 1.2
        ])
        .range([0, width]);
    
        return yLinearScale;
    
    }
    
    // function used for updating yAxis var upon click on axis label
    function renderYAxes(newYScale, yAxis) {
        var leftAxis = d3.axisBottom(newYScale);
    
        xAxis.transition()
        .duration(1000)
        .call(leftAxis);
    
        return yAxis;
    }


} 