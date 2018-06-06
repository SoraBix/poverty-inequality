var svg = d3.select("#yearfilter")
    .append("svg")
        .attr("width", 2000)
        .attr("height", 550);
             d3.csv("PovertyConsolidated.csv", function (data) {
            data = data.filter(function(d){return d.Poverty >0;})
            data = data.filter(function(d){return d.GNI >0;})
            data = data.filter(function(d){return d.GINI >0;})
          ;

          // Create the indicator chart on the right of the main chart
          var indicator = new dimple.chart(svg, data);

          // Pick blue as the default and orange for the selected month
          var defaultColor = indicator.defaultColors[0];
          var indicatorColor = indicator.defaultColors[2];

          // The frame duration for the animation in milliseconds
          var frame = 1000;

          var firstTick = true;

          // Place the indicator bar chart to the right
          indicator.setBounds(950, 115, 153, 311);

          // Add dates along the y axis
          var y = indicator.addCategoryAxis("y", "Year");
          y.addOrderRule("Year", "Desc");

          // Use sales for bar size and hide the axis
          var x = indicator.addMeasureAxis("x", "GNI");
          x.hidden = true;

          // Add the bars to the indicator and add event handlers
          var s = indicator.addSeries(null, dimple.plot.bar);
          s.addEventHandler("click", onClick);
          // Draw the side chart
          indicator.draw();

          // Remove the title from the y axis
          y.titleShape.remove();

          // Remove the lines from the y axis
          y.shapes.selectAll("line,path").remove();

          // Move the y axis text inside the plot area
          y.shapes.selectAll("text")
                  .style("text-anchor", "start")
                  .style("font-size", "11px")
                  .attr("transform", "translate(18, 0.5)");

          // This block simply adds the legend title. I put it into a d3 data
          // object to split it onto 2 lines.  This technique works with any
          // number of lines, it isn't dimple specific.
          svg.selectAll("title_text")
                  .data(["Click bar to select",
                      "and pause. Click again",
                      "to resume animation"])
                  .enter()
                  .append("text")
                  .attr("x", 950)
                  .attr("y", function (d, i) { return 80 + i * 12; })
                  .style("font-family", "sans-serif")
                  .style("font-size", "10px")
                  .style("color", "Black")
                  .text(function (d) { return d; });

          // Manually set the bar colors
          s.shapes
                  .attr("rx", 10)
                  .attr("ry", 10)
                  .style("fill", function (d) { return (d.y === '2002' ? indicatorColor.fill : defaultColor.fill) })
                  .style("stroke", function (d) { return (d.y === '2002' ? indicatorColor.stroke : defaultColor.stroke) })
                  .style("opacity", 0.4);

          // Draw the main chart
          var bubbles = new dimple.chart(svg, data);
          bubbles.setBounds(320, 70, 600, 400)
          bubbles.addMeasureAxis("x", "GNI");
          bubbles.addMeasureAxis("y", "GINI");
          bubbles.addSeries(["Country", "Poverty", "Region"], dimple.plot.bubble)
          bubbles.addLegend(950, 430, 410, 60);

          // Add a storyboard to the main chart and set the tick event
          var story = bubbles.setStoryboard("Year", onTick);
          // Change the frame duration
          story.frameDuration = 3000;
          // Order the storyboard by date
          story.addOrderRule("Year");
        
          // Draw the bubble chart
          bubbles.draw();

          // Orphan the legends as they are consistent but by default they
          // will refresh on tick
          bubbles.legends = [];
          // Remove the storyboard label because the chart will indicate the
          // current month instead of the label
          story.storyLabel.remove();

          // On click of the side chart
          function onClick(e) {
              // Pause the animation
              story.pauseAnimation();
              // If it is already selected resume the animation
              // otherwise pause and move to the selected month
              if (e.yValue === story.getFrameValue()) {
                  story.startAnimation();
              } else {
                  story.goToFrame(e.yValue);
                  story.pauseAnimation();
              }
          }

          // On tick of the main charts storyboard
          function onTick(e) {
              if (!firstTick) {
                  // Color all shapes the same
                  s.shapes
                          .transition()
                          .duration(frame / 2)
                          .style("fill", function (d) { return (d.y === e ? indicatorColor.fill : defaultColor.fill) })
                          .style("stroke", function (d) { return (d.y === e ? indicatorColor.stroke : defaultColor.stroke) });
              }
              firstTick = false;
          }
      });