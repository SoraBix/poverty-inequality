var radar_w = 500,
	radar_h = 500;

// var radar_colorscale = d3.scaleOrdinal(d3.schemaSet1);
var radar_colorscale = d3.scaleOrdinal().domain(["North America", "East Asia & Pacific", "Europe & Central Asia", "Latin America & Caribbean", "Middle East & North Africa", "South Asia", "Sub-Saharan Africa"])
           .range(["#8ee0d4", "#ffc276", "#b2ec85", "#ff8e85", "#d58fca", "#fef584", "#90c1dd"]);

//Legend titles
var radar_LegendOptions = ['North America','East Asia & Pacific','Europe & Central Asia','Latin America & Caribbean','Middle East & North Africa','South Asia','Sub-Saharan Africa'];

//Data
var radar_d = [
		[ // North America
			{axis:"Poverty",value:0.021},
			{axis:"Inequality",value:0.355},
			{axis:"College",value:0.71},
			{axis:"Rural Sanitation",value:0.98},
			{axis:"Clean Water Access",value:0.959},
			{axis:"Health Care",value:0.99},
			{axis:"Unemployment",value:0.062},
			{axis:"Rural Poverty Gap",value:0.02}
		],[	// East Asia & Pacific
			{axis:"Poverty",value:0.044},
			{axis:"Inequality",value:0.28},
			{axis:"College",value:0.595},
			{axis:"Rural Sanitation",value:0.87},
			{axis:"Clean Water Access",value:0.916},
			{axis:"Health Care",value:0.863},
			{axis:"Unemployment",value:0.092},
			{axis:"Rural Poverty Gap",value:0.058}
		],[ // Europe & Central Asia
			{axis:"Poverty",value:0.149},
			{axis:"Inequality",value:0.353},
			{axis:"College",value:0.37},
			{axis:"Rural Sanitation",value:0.86},
			{axis:"Clean Water Access",value:0.746},
			{axis:"Health Care",value:0.863},
			{axis:"Unemployment",value:0.146},
			{axis:"Rural Poverty Gap",value:0.055}
		],[ // Latin America & Caribbean
			{axis:"Poverty",value:0.115},
			{axis:"Inequality",value:0.452},
			{axis:"College",value:0.39},
			{axis:"Rural Sanitation",value:0.547},
			{axis:"Clean Water Access",value:0.75},
			{axis:"Health Care",value:0.893},
			{axis:"Unemployment",value:0.179},
			{axis:"Rural Poverty Gap",value:0.147}
		],[ // Middle East & North Africa
			{axis:"Poverty",value:0.038},
			{axis:"Inequality",value:0.326},
			{axis:"College",value:0.353},
			{axis:"Rural Sanitation",value:0.72},
			{axis:"Clean Water Access",value:0.82},
			{axis:"Health Care",value:0.869},
			{axis:"Unemployment",value:0.204},
			{axis:"Rural Poverty Gap",value:0.076}
		],[ // South Asia
			{axis:"Poverty",value:0.073},
			{axis:"Inequality",value:0.241},
			{axis:"College",value:0.216},
			{axis:"Rural Sanitation",value:0.257},
			{axis:"Clean Water Access",value:0.8},
			{axis:"Health Care",value:0.705},
			{axis:"Unemployment",value:0.047},
			{axis:"Rural Poverty Gap",value:0.072}
		],[ // Sub-Saharan Africa
			{axis:"Poverty",value:0.482},
			{axis:"Inequality",value:0.28},
			{axis:"College",value:0.099},
			{axis:"Rural Sanitation",value:0.205},
			{axis:"Clean Water Access",value:0.469},
			{axis:"Health Care",value:0.84},
			{axis:"Unemployment",value:0.261},
			{axis:"Rural Poverty Gap",value:0.29}
		  ]
		];

//Options for the Radar chart, other than default
var radar_mycfg = {
  w: radar_w,
  h: radar_h,
  maxValue: 1,
  levels: 6,
  ExtraWidthX: 300
}

//Call function to draw the Radar chart
//Will expect that data is in %'s
RadarChart.draw("#radar_plot", radar_d, radar_mycfg);

////////////////////////////////////////////
/////////// Initiate legend ////////////////
////////////////////////////////////////////

var radar_svg = d3.select('#radar')
	.select('#radar_body')
	.selectAll('svg')
	.append('svg')
	.attr("width", radar_w+300)
	.attr("height", radar_h)

//Create the title for the legend
// var radar_text = radar_svg.append("text")
// 	.attr("class", "title")
// 	.attr('transform', 'translate(90,0)') 
// 	.attr("x", radar_w - 70)
// 	.attr("y", 10)
// 	.attr("font-size", "12px")
// 	.attr("fill", "#404040")
// 	.text("What % of owners use a specific service in a week");
		
//Initiate Legend	
var radar_legend = radar_svg.append("g")
	.attr("class", "legend")
	.attr("height", 100)
	.attr("width", 200)
	.attr('transform', 'translate(90,20)') 
	;
	//Create colour squares
	radar_legend.selectAll('rect')
	  .data(radar_LegendOptions)
	  .enter()
	  .append("rect")
	  .attr("x", radar_w + 50)
	  .attr("y", function(d, i){ return i * 40 + 125;})
	  .attr("width", 20)
	  .attr("height", 20)
	  .style("fill", function(d, i){ return radar_colorscale(i);})
	  ;
	//Create text next to squares
	radar_legend.selectAll('text')
	  .data(radar_LegendOptions)
	  .enter()
	  .append("text")
	  .attr("x", radar_w + 75)
	  .attr("y", function(d, i){ return i * 40 + 140;})
	  .attr("font-size", "20px")
	  .attr("fill", "#737373")
	  .text(function(d) { return d; })
	  ;	