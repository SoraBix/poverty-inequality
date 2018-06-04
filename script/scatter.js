function scatter(){
var svg = dimple.newSvg("#chartplot", 1100, 500);
          d3.csv("data/PovertyConsolidated.csv", function (data) {
            // Latest period only

            data = data.filter(function(d){return d.Poverty >0;})
            data = data.filter(function(d){return d.GINI >0;})
            data = data.filter(function(d){return d.Year == 2013;})

            
          
            // Create the chart
            var myChart = new dimple.chart(svg, data);
            myChart.setBounds(620, 30, 450, 350)
            var x = myChart.addLogAxis("x", "Poverty", 5);
            x.hidden = true;
            var y = myChart.addMeasureAxis("y", "GINI");
            y.overrideMin = 20;
            y.title = "GINI Index (%)"  
               
            var v = myChart.addSeries(["Country", "IncomeGroup", "Region"], dimple.plot.bubble);
            var myLegend = myChart.addLegend(230, 460, 900, 30, "left");
            myLegend.horizontalPadding = 80;
            myLegend.verticalPadding = 15;
            myChart.draw();
            myLegend.shapes.selectAll("text").style("font-size", "14px");
            //myLegend.shapes.selectAll("rect").style("rx", "1").style("ry", "1");
      
            

            myChart.legends = [];

             // Create the chart
             var newChart = new dimple.chart(svg, data);
             newChart.setBounds(44, 30, 450, 350)
             newChart.addLogAxis("x", "Poverty", 5);
             newChart.addMeasureAxis("y", "GNI").title = "Per Capita GNI";
             newChart.addSeries(["Country", "IncomeGroup", "Region"], dimple.plot.bubble);
             
             newChart.draw();

             var goodChart = new dimple.chart(svg, data);
             goodChart.setBounds(620, 30, 450, 350)
             goodChart.addLogAxis("x", "Poverty", 5);
             var z = goodChart.addMeasureAxis("y", "GINI");
             z.overrideMin = 20;
             z.title = "GINI Index (%)"
             goodChart.addSeries(["Country", "IncomeGroup", "Region"], dimple.plot.bubble);
             goodChart.draw();
    
            
            svg.selectAll("title_text")
              .data(["Click legend to","SHOW/HIDE Regions:"])
              .enter()
              .append("text")
                .attr("x", 43)
                .attr("y", function (d, i) { return 470 + i * 25; })
                .style("font-family", "sans-serif")
                .style("font-size", "15px")
                .style("color", "Black")
                .text(function (d) { return d; });
    
            // Get a unique list of Owner values to use when filtering
            var filterValues = dimple.getUniqueValues(data, "Region");
            // Get all the rectangles from our now orphaned legend
            myLegend.shapes.selectAll("rect")
              // Add a click event to each rectangle
              .on("click", function (e) {
                // This indicates whether the item is already visible or not
                var hide = false;
                var newFilters = [];
                // If the filters contain the clicked shape hide it
                filterValues.forEach(function (f) {
                  if (f === e.aggField.slice(-1)[0]) {
                    hide = true;
                  } else {
                    newFilters.push(f);
                  }
                });
                // Hide the shape or show it
                if (hide) {
                  d3.select(this).style("opacity", 0.2);
                } else {
                  newFilters.push(e.aggField.slice(-1)[0]);
                  d3.select(this).style("opacity", 0.8);
                }
                // Update the filters
                filterValues = newFilters;
                // Filter the data
                myChart.data = dimple.filterData(data, "Region", filterValues);
                newChart.data = dimple.filterData(data, "Region", filterValues);
                goodChart.data = dimple.filterData(data, "Region", filterValues);
                myChart.draw(800);
                newChart.draw(800);
                goodChart.draw(800);

                
              });
          });
        }

scatter();