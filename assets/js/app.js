function scatterMultiAxis(xLabels,yLabels,xKeys,yKeys,dataPath,
                          xAxisLabels,yAxisLabels) {
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
        .range([height, 0]);
    
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

    // function used for updating circles group with a transition to
    // new circles for both x and y axes
    function renderCirclesX(circlesGroup, newXScale, chosenXAxis) {

        circlesGroup.transition()
          .duration(1000)
          .attr("cx", d => newXScale(d[chosenXAxis]));
      
        return circlesGroup;
      }

    function renderCirclesY(circlesGroup, newYScale, chosenYAxis) {

        circlesGroup.transition()
          .duration(1000)
          .attr("cy", d => newYScale(d[chosenYAxis]));
      
        return circlesGroup;
      }
  
    // function used for updating circles group with new tooltip
    function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, axisKeysX, axisLabelsX, axisKeysY, axisLabelsY) {
    
        var labelx;
        var labely;
        // Find appropriate label for each x and y axis
        for (let i = 0; i < axisKeysX.length; i++) {
            if (chosenXAxis === axisKeysX[i]) {
                labelx = axisLabelsX[i];
            }            
            else {
                labelx = "Nan"
            }
        }
        for (let j = 0; j < axisKeysY.length; j++) {
            if (chosenYAxis === axisKeysY[j]) {
                labely = axisLabelsY[j];
            }   
            else {
                labely = "Nan"
            }         
        }

        var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([80, -60])
        .html(function(d) {
            return (`<b>${labelx}</b>: ${d[chosenXAxis]}<br>`+
                     `<b>${labely}</b>: ${d[chosenYAxis]}`)
        });
    
        circlesGroup.call(toolTip);
    
        circlesGroup.on("mouseover", function(data) {
        toolTip.show(data);
        })
        // onmouseout event
        .on("mouseout", function(data, index) {
            toolTip.hide(data);
        });
    
        return circlesGroup;
    }

    // Now enter the csv file and generate graph
    d3.csv(dataPath).then(function (dataObject, err) {
        if (err) throw err;

        // convert string to numbers
        for (let i = 0; i < xKeys.length; i++) {
            dataObject[xKeys[i]] = dataObject[xKeys[i]].map(d => +d);       
        }
        for (let j = 0; j < yKeys.length; j++) {
            dataObject[yKeys[j]] = dataObject[yKeys[j]].map(d => +d);            
        } 
        
        // xLinearScale function above csv import
        var xLinearScale = xScale(dataObject, chosenXAxis);
        var yLinearScale = yScale(dataObject, chosenYAxis);

        // Create initial axis functions
        var bottomAxis = d3.axisBottom(xLinearScale);
        var leftAxis = d3.axisLeft(yLinearScale);

        // append x axis
        var xAxis = chartGroup.append("g")
            .classed("x-axis", true)
            .attr("transform", `translate(0, ${height})`)
            .call(bottomAxis);

        // append y axis
        chartGroup.append("g")
            .call(leftAxis);

        // append initial circles
        var circlesGroup = chartGroup.selectAll("circle")
            .data(dataObject)
            .enter()
            .append("circle")
            .attr("cx", d => xLinearScale(d[chosenXAxis]))
            .attr("cy", d => yLinearScale(d[chosenYAxis]))
            .attr("r", 20)
            .attr("class", "stateCircle");
    })

} 