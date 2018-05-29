
function Trend_Poverty(){

  d3.select("#t1").select("svg").remove();
  d3.csv("data/4PovertyPopulation-Region.csv", function(error, data) 
  {
      if (error) throw error;
      data = data.filter(function(d) {
          return d.RegionCode == "WLD";})

      var width = 530,
          height = 400;



      var svg = d3.select("#t1").append("svg")
      .attr("width",width)
      .attr("height",height),
          margin = {
              top: 20,
              right: 50,
              bottom: 30,
              left: 50},
          width = +svg.attr("width") - margin.left - margin.right,
          height = +svg.attr("height") - margin.top - margin.bottom;

      var parseTime = d3.timeParse("%Y")
      bisectDate = d3.bisector(function(d) {
          return d.Year; }).left;

      var x = d3.scaleLinear().range([0, width - margin.right]);
      var y = d3.scaleLinear().range([height, 0]);
      var y2 = d3.scaleLinear().range([height, 0]).domain([0, 2500]);

      var line = d3.line()
          .x(function(d) {
              return x(d.Year);
          })
          .y(function(d) {
              return y(d.Poverty);
          });

      var g = svg.append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      x.domain(d3.extent(data, function(d) {
          return d.Year;
      }));
      y.domain([0, 100]);
      y2.domain([0, 2500]);

      g.append("g")
          .attr("class", "axis axis--x")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x).tickFormat(d3.format("d")));

      g.append("g")
          .attr("class", "axisPrimary")
          .call(d3.axisLeft(y).ticks(6).tickFormat(function(d) {
              return parseInt(d) + "%";
          }));

      g.append("g")
          .attr("class", "axisSecond")
          .attr("transform", "translate(" + (width - margin.right) + ",0)")
          .call(d3.axisRight(y2).ticks(6).tickFormat(function(d) {
              return parseInt(d) + "M";
          }));

      var lineGen = d3.line()
          .x(function(d) {
              return x(d.Year);
          })
          .y(function(d) {
              return y(d.Poverty);
          })
          .curve(d3.curveCardinal);


      var lineGen2 = d3.line()
          .x(function(d) {
              return x(d.Year);
          })
          .y(function(d) {
              return y2(d.Poverty * d.Population / 100);
          })
          .curve(d3.curveCardinal);

      var path = g.append("path")
          .datum(data)
          .attr("class", "line")
          .attr("d", lineGen(data))
          .style('stroke', '#90c1dd');



      var totalLength = path.node().getTotalLength();

      path
          .attr("stroke-dasharray", totalLength + " " + totalLength)
          .attr("stroke-dashoffset", totalLength)
          .transition()
          .duration(2000)
          .ease(d3.easeLinear)
          .attr("stroke-dashoffset", 0);


      var path2 = g.append("path")
          .datum(data)
          .attr("class", "line")
          .attr("d", lineGen2)
          .style('stroke', '#66c2a5');

      var totalLength2 = path2.node().getTotalLength();

      path2
          .attr("stroke-dasharray", totalLength2 + " " + totalLength2)
          .attr("stroke-dashoffset", totalLength2)
          .transition()
          .duration(2000)
          .ease(d3.easeLinear)
          .attr("stroke-dashoffset", 0);



      g.append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 0 - (margin.right))
          .attr("x", 0 - (height / 2))
          .attr("dy", "1em")
          .style("text-anchor", "middle")
          .style("font-size", 10)
          .style("fill", "steelblue")
          .text("Poverty Headcount (%)");

      g.append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", width - 5)
          .attr("x", 0 - (height / 2))
          .attr("dy", "1em")
          .style("text-anchor", "middle")
          .style("font-size", 10)
          .style("fill", "teal")
          .text("Total of Poors (Millions)");

      var focus = g.append("g")
          .attr("class", "focus")
          .style("display", "none");

      focus.append("line")
          .attr("class", "x-hover-line hover-line")
          .attr("y1", 0)
          .attr("y2", height);


      focus.append("circle")
          .attr("r", 10);

      focus.append("text")
          .attr("x", 15)
          .attr("y", -15)
          .attr("fill", "grey");

      svg.append("rect")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
          .attr("class", "overlay")
          .attr("width", width)
          .attr("height", height)
          .on("mouseover", function() {
              focus.style("display", null);
          })
          .on("mouseout", function() {
              focus.style("display", "none");
          })
          .on("mousemove", mousemove);

      function mousemove() {
          var x0 = x.invert(d3.mouse(this)[0]),
              i = bisectDate(data, x0, 1),
              d0 = data[i - 1],
              d1 = data[i],
              d = x0 - d0.Year > d1.Year - x0 ? d1 : d0;
          focus.attr("transform", "translate(" + x(d.Year) + "," + y(d.Poverty) + ")");
          focus.select("text").text(function() {
              return (+d.Poverty + "%" + " | " + Math.round(d.Population * d.Poverty / 100, 0)) + "M";
          });
          focus.select(".x-hover-line").attr("y2", height - y(d.Poverty));
          focus.select(".y-hover-line").attr("x2", width + width);
      }
  });
  }

function Trend_Inequality(){

  d3.csv("data/5HistoricalInequality.csv", function(error, d) {
      if (error) throw error;

      data = d;
      var width = 530,
          height = 400;


  var svg = d3.select("#t3").append("svg")
      .attr("width",width)
      .attr("height",height),
          margin = {
              top: 20,
              right: 30,
              bottom: 30,
              left: 50},
          width = +svg.attr("width") - margin.left - margin.right,
          height = +svg.attr("height") - margin.top - margin.bottom;

  var parseTime = d3.timeParse("%Y")
      bisectDate = d3.bisector(function(d) { return d.Year; }).left;

  var x = d3.scaleLinear().range([0, width-margin.right]);
  var y = d3.scaleLinear().range([height, 0]);

  var line = d3.line()
      .x(function(d) { return x(d.Year); })
      .y(function(d) { return y(d.GINI); });

  var g = svg.append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



      x.domain(d3.extent(data, function(d) { return d.Year; }));
      y.domain([45,80]);

      g.append("g")
          .attr("class", "axis axis--x")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x).tickFormat(d3.format("d")));

      g.append("g")
          .attr("class", "axis axis--y")
          .call(d3.axisLeft(y).ticks(6).tickFormat(function(d) { return parseInt(d) + "%"; }))


                          var lineGen = d3.line()
                          .x(function(d) {
                              return x(d.Year);
                          })
                          .y(function(d) {
                              return y(d.GINI);
                          })
                          .curve(d3.curveCardinal)


      var path = g.append("path")
          .datum(data)
          .attr("class", "line")
          .attr("d", lineGen(data))
          .style('stroke', '#ff8e85')

      var totalLength = path.node().getTotalLength();

                      path
                        .attr("stroke-dasharray", totalLength + " " + totalLength)
                        .attr("stroke-dashoffset", totalLength)
                        .transition()
                          .duration(2000)
                          .ease(d3.easeLinear)
                          .attr("stroke-dashoffset", 0); 

                      g.append("text")
                      .attr("transform", "rotate(-90)")
                      .attr("y", 0- (margin.left))
                      .attr("x",0-(height/2))
                      .attr("dy", "1em")
                      .style("text-anchor", "middle")
                      .style("font-size",10)
                      .text("GINI Index (%)");

      var focus = g.append("g")
          .attr("class", "focus")
          .style("display", "none");

      focus.append("line")
          .attr("class", "x-hover-line hover-line")
          .attr("y1", 0)
          .attr("y2", height);

      focus.append("circle")
          .attr("r", 10);

      focus.append("text")
          .attr("x", 15)
          .attr("y", -15)
          .attr("fill", "grey");

      svg.append("rect")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
          .attr("class", "overlay")
          .attr("width", width)
          .attr("height", height)
          .on("mouseover", function() { focus.style("display", null); })
          .on("mouseout", function() { focus.style("display", "none"); })
          .on("mousemove", mousemove);

      function mousemove() {
        var x0 = x.invert(d3.mouse(this)[0]),
            i = bisectDate(data, x0, 1),
            d0 = data[i - 1],
            d1 = data[i],
            d = x0 - d0.Year > d1.Year - x0 ? d1 : d0;
        focus.attr("transform", "translate(" + x(d.Year) + "," + y(d.GINI) + ")");
        focus.select("text").text(function() { return d.GINI +"%"; });
        focus.select(".x-hover-line").attr("y2", height - y(d.GINI));
        focus.select(".y-hover-line").attr("x2", width + width);
      }
  });

}

function Distr(){

  d3.select("#t1").select("svg").remove();

  d3.select("#drop").style("display","block");

  d3.csv("data/4PovertyPopulation-Region.csv", function(error, data) {

   var width = 500,
         height = 350,
         radius = Math.min(width, height) / 2;

     data= data.filter(function(d){ return d.Year >2000;})
     data= data.filter(function(d){ return d.RegionCode !="WLD";})
     
     var nested = d3.nest()
       .key(function(d) { return d["Year"]; })
       .entries(data);
     
     // var color = d3.scaleOrdinal(d3.schemeCategory10);
     
     var color = d3.scaleOrdinal()
           .domain(["East Asia and Pacific", "Europe and Central Asia", "Latin America and the Caribbean","Middle East and North Africa","Other high Income","South Asia","Sub-Saharan Africa"])
           .range(["#fcc287", "#c3e38d" , "#fa9a91","#c99bc9","#a5dcd2","#fef093","#9bc1da"]);
     
     var pie = d3.pie()
         .value(function(d) { return d.Distribution; })
         .sort(null);
     
     var arc = d3.arc()
         .innerRadius(radius - 70)
         .outerRadius(radius - 20)
         // .cornerRadius(20);

  ////
     var arcOver = d3.arc()
          .innerRadius(radius-70)
          .outerRadius(radius-10)
          // .cornerRadius(20);


  ////


     var svg = d3.select("#t1").append("svg")
         .attr("width", width)
         .attr("height", height)
         .append("g")
         .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
     
     var slice_group = svg.datum(nested[0].values).selectAll("path")
         .data(pie)
         .enter()
         .append("g");
     
     var slice_path = slice_group.append("path")
         .attr("fill", function(d, i) { return color(d.data.Region); })
         .attr("d", arc)
         // .each(function(d) { this._current = d; }) 
         //        .on("mouseover", function(d) {
         //            d3.select(this).transition()
         //               .duration(300)
         //               .attr("d", arcOver)
         //               .style('stroke', 'white')
         //               .style("stroke-width", 100);
         //              // .attr("fill", 'white');
         //           })
         //  .on("mouseout", function(d) {
         //            d3.select(this).transition()
         //               .duration(300)
         //               .attr("d", arc)
         //               .style('stroke', null)
         //               .style("stroke-width", 0)
         //               ;
         //           });
     
     // Make group to hold labels
     var label_group = slice_group.append("g")
       .attr("transform", function(d) {
         var c = arc.centroid(d);
         return "translate(" + c[0] +"," + c[1] + ")";
       })
     
     
     var line_2 = label_group.append("text") 
       .text(function(d) { return Math.round(d.data["Distribution"])+"%"; })
       .attr("text-anchor", "middle")
       .style("font-size",11)

     
     
     //Switch data
     d3.select("#drop").selectAll("select")
       .on("change", change);
     
     function change() {
       var value = this.value;
       svg.datum(nested[value].values);
     
       slice_path.data(pie) // 
         .transition().duration(750).attrTween("d", arcTween); 
     
       label_group.data(pie)
       .transition().duration(750)
         .attr("transform", function(d) {
           var c = arc.centroid(d);
           return "translate(" + c[0] +"," + c[1] + ")";
         })

     
       line_2.data(pie)
         .text(function(d) { return Math.round(d.data["Distribution"])+"%"; })
     


     }
     
     var legendRectSize = (radius * 0.05);
     var legendSpacing = radius * 0.02;
     
     var legend = svg.selectAll('.legend')
             .data(color.domain())
             .enter()
             .append('g')
             .attr('class', 'legend')
             .attr('transform', function(d, i) {
                 var height = legendRectSize + legendSpacing;
                 var offset =  height * color.domain().length / 2;
                 var horz = -9 * legendRectSize;
                 var vert = i * height - offset;
                 return 'translate(' + horz + ',' + vert + ')';
             });
     
         legend.append('rect')
             .attr('width', legendRectSize)
             .attr('height', legendRectSize)
             .style('fill', color)
             .style('stroke', color);
     
         legend.append('text')
             .attr('x', legendRectSize + legendSpacing)
             .attr('y', legendRectSize - legendSpacing)
             .text(function(d) { return d; });
     



     // Store the displayed angles in _current.
     // Then, interpolate from _current to the new angles.
     // During the transition, _current is updated in-place by d3.interpolate.
     function arcTween(a) {
       var i = d3.interpolate(this._current, a);
       this._current = i(0);
       return function(t) {
         return arc(i(t));
       };
     }
     });

  }


Trend_Poverty();
Trend_Inequality();

