function scatterMultiAxis(xTipLabels,yTipLabels,xKeys,yKeys,dataPath,
                          xAxisLabels,yAxisLabels) {
    // params
    //// xTipLabels: array of x-axis tip popout labels
    //// yTipLabels: array of y-axis tip popout labels
    //// xKeys: keys to access data (match order of xTipLabels)
    //// yKeys: keys to access data (match order of ytipLabels)
    //// dataPath: relative path to csv file
    //// xAxisLabels: array of labels used on x-axis label(match order of xTipLabels,xKeys)
    //// yAxisLabels: array of labels used on y-axis label(match order of yTipLabels,yKeys)

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
    function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, axisKeysX, 
                            axisLabelsX, axisKeysY, axisLabelsY) {
    
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
        .html(function(d) {return `${d}`;
            // return (`<b>${labelx}</b>: ${d[chosenXAxis]}<br>`+
            //          `<b>${labely}</b>: ${d[chosenYAxis]}`)
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
    }// end of function updateToolTip

    // Now enter the csv file and generate graph
    d3.csv(dataPath).then(function (dataObject, err) {
        if (err) throw err;
        // Initial Params
        var chosenXAxis = xKeys[0];
        var chosenYAxis = yKeys[0];

        // convert string to numbers
        for (let i = 0; i < xKeys.length; i++) {
            dataObject[xKeys[i]] = +dataObject[xKeys[i]];//.map(d => +d);       
        }
        for (let j = 0; j < yKeys.length; j++) {
            dataObject[yKeys[j]] = +dataObject[yKeys[j]];//.map(d => +d);            
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
        var yAxis = chartGroup.append("g")
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

        // Create group for x-axis labels
        var labelsGroupX = chartGroup.append("g")
            .attr("transform", `translate(${width / 2}, ${height + 20})`);

        var allXLabels = {};
        for (let i = 0; i < xKeys.length; i++) {
            if (i == 0) {
               allXLabels[`${xKeys[i]}`] = labelsGroupX.append("text")
                    .attr("x", 0)
                    .attr("y", 20) 
                    .attr("value", `${xKeys[i]}`)
                    .classed("active",true)
                    .text(xAxisLabels[i]);
            }
            else {
                allXLabels[`${xKeys[i]}`] = labelsGroupX.append("text")
                    .attr("x", 0)
                    .attr("y", (i+1)*20) 
                    .attr("value", `${xKeys[i]}`)
                    .classed("inactive",true)
                    .text(xAxisLabels[i]);
            }
        }// end of for loop

        
        // Create group for y-axis labels
        var labelsGroupY = chartGroup.append("g")
            .attr("transform", "rotate(-90)");

        var allYLabels = [];
        for (let j = 0; j < yKeys.length; j++) {
            if (j == 0) {
                allYLabels[`${yKeys[j]}`] = chartGroup.append("text")
                    .attr("y", 0 - margin.left - 20*j)
                    .attr("x", 0 - (height / 2))
                    .attr("dy", "1em")
                    .classed("active",true)
                    .text(yAxisLabels[j]);
                    
            }
            else {
                allYLabels[`${yKeys[j]}`] = chartGroup.append("text")
                    .attr("y", 0 - margin.left - 20*j)
                    .attr("x", 0 - (height / 2))
                    .attr("dy", "1em")
                    .classed("inactive",true)
                    .text(yAxisLabels[j]);
            }
            
        }// end of for loop

        // update ToolTip
        console.log("chosenX:",chosenXAxis, "chosenY:", chosenYAxis, "circlesGroup:",circlesGroup, 
        "xkeys:", xKeys, "xTipLabels:", xTipLabels, "ykeys:", yKeys, "yTipLabels:", yTipLabels);
        var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, xKeys,
                                         xTipLabels, yKeys, yTipLabels);

        // Update graph if x axis label is clicked
        labelsGroupX.selectAll("text")
            .on("click",function () {
                
            // get value from user selection
            var value = d3.select(this).attr("value");

            if (value !== chosenXAxis) {

                // replaces chosenXAxis with value
                chosenXAxis = value;
        
                // console.log(chosenXAxis)
        
                // functions here found above csv import
                // updates x scale for new data
                xLinearScale = xScale(dataObject, chosenXAxis);
        
                // updates x axis with transition
                xAxis = renderXAxes(xLinearScale, xAxis);
        
                // updates circles with new x values
                circlesGroup = renderCirclesX(circlesGroup, xLinearScale, chosenXAxis);
        
                // updates tooltips with new info
                circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, xKeys, xTipLabels, yKeys, yTipLabels);
        
                // changes classes to change bold text
                for (let i = 0; i < xKeys.length; i++) {
                    if (xKeys[i] == chosenXAxis) {
                        allXLabels[i]
                            .classed("active",true)
                            .classed("inactive",false)
                    }
                    else {
                        allXLabels[i]
                            .classed("active",false)
                            .classed("inactive",true)
                    }                    
                }

            }
        })// end of labelsGroupX

        // Update graph if y axis label is clicked
        labelsGroupY.selectAll("text")
            .on("click",function () {
                
            // get value from user selection
            var value = d3.select(this).attr("value");

            if (value !== chosenYAxis) {

                // replaces chosenXAxis with value
                chosenYAxis = value;
        
                // console.log(chosenXAxis)
        
                // functions here found above csv import
                // updates x scale for new data
                yLinearScale = yScale(dataObject, chosenYAxis);
        
                // updates x axis with transition
                yAxis = renderYAxes(yLinearScale, yAxis);
        
                // updates circles with new x values
                circlesGroup = renderCirclesY(circlesGroup, yLinearScale, chosenYAxis);
        
                // updates tooltips with new info
                circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, xKeys, 
                                            xTipLabels, yKeys, yTipLabels);
        
                // changes classes to change bold text
                for (let j = 0; j < yKeys.length; j++) {
                    if (yKeys[j] == chosenYAxis) {
                        allYLabels[j]
                            .classed("active",true)
                            .classed("inactive",false)
                    }
                    else {
                        allYLabels[j]
                            .classed("active",false)
                            .classed("inactive",true)
                    }                    
                }

            }
        }) // end of labelsGroupY

    })// end of d3.csv().then()
    // .catch(function(error) {
    //     console.log(error);
    //   }); 

} // end of function scatterMultiAxis
// x: Poverty, Age, income
// y: Obese, Smokes, no Healthcare
var xKeyInput = ["poverty","age","income"];
var xAxisLabelsInput = ["Poverty (%)","Age","Household Income"];
var xTipLabelsInput = ["Povery (%)","Age","Income"];

var yKeyInput = ["obesity","smokes","healthcare"];
var yAxisLabelsInput = ["Obesity (%)","Smokes (%)","No Healthcare (%)"];
var yTipLabelsInput = ["Obesity (%)","Smokes (%)","No Healthcare (%)"];

scatterMultiAxis(xTipLabelsInput,yTipLabelsInput,xKeyInput,yKeyInput,"assets/data/data.csv",
    xAxisLabelsInput,yAxisLabelsInput);

// d3.csv("assets/data/data.csv").then(function (data) {
//     console.log(data)
// })
