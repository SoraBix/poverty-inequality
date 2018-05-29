var NA;
var LA;
var EU;
var EA;
var SA;
var AF;
var ME;

var bar_xAxis;
var bar_yAxis;
var bar_x = d3.scaleBand();
var bar_y = d3.scaleLinear();
var barWidth;

var b_width = 1000, b_height = 500;
var bar_svg = d3.select("#bar_1").select("svg")
	.attr("width", b_width)
	.attr("height", b_height + 50);

var b_delay = function(d, i) { return i * 25; };
var b_delay2 = function(d, i) { return i * 2; };

d3.csv("data/PovertyConsolidated.csv", function(data)
{
	NA = data.filter(function(row)
	{
		return row["Region"] == "North America";
	});

	LA = data.filter(function(row)
	{
		return row["Region"] == "Latin America & Caribbean";
	});

	EU = data.filter(function(row)
	{
		return row["Region"] == "Europe & Central Asia";
	});

	EA = data.filter(function(row)
	{
		return row["Region"] == "East Asia & Pacific";
	});

	SA = data.filter(function(row)
	{
		return row["Region"] == "South Asia";
	});

	AF = data.filter(function(row)
	{
		return row["Region"] == "Sub-Saharan Africa";
	});

	ME = data.filter(function(row)
	{
		return row["Region"] == "Middle East & North Africa";
	});

	plot_bar(EA, "2002");

	bar_svg.append("rect")
		.attr("x", 850)
		.attr("y", 100)
		.attr("height", 20)
		.attr("width", 20)
		.style("fill", "#90c1dd");
	bar_svg.append("rect")
		.attr("x", 850)
		.attr("y", 150)
		.attr("height", 20)
		.attr("width", 20)
		.style("fill", "#ff8e85");

	bar_svg.append("text")
		.attr("x", 880)
		.attr("y", 112)
		.text("Poverty (%)")
		.style("font-size", 10);
	bar_svg.append("text")
		.attr("x", 880)
		.attr("y", 162)
		.text("Inequality (%)")
		.style("font-size", 10);

	bar_svg.append("text")
		.attr("x", - height + 20)
		.attr("y", 30)
		.style("text-anchor", "middle")
		.style("transform", "rotate(-90deg)")
		.text("Percentage (%)");
});

function plot_bar(pre_data, year)
{
	var data = pre_data.filter(function(row)
	{
		return row["Year"] == year;
	});

	var max = Math.max(d3.max(data, function(d) { return parseFloat(d["Poverty"]); }),
		d3.max(data, function(d) { return parseFloat(d["GINI"]); }));
	bar_x.domain(data.map(function(d) { return d["Country"]; }))
		.rangeRound([75, b_width - 200]);
	bar_y.domain([0, max])
		.range([b_height - 50, 60]);
	barWidth = (b_width - 275) / data.length / 2;

	var bars = bar_svg.selectAll(".bar")
		.data(data)
	bars.transition()
		.duration(750)
		.delay(b_delay)
		.attr("x", function(d) { return bar_x(d["Country"]); })
		.attr("y", function(d) { return bar_y(d["Poverty"]); })
		.attr("height", function(d) { return b_height - 50 - bar_y(d["Poverty"]); })
		.attr("width", barWidth - 2);
	bars.enter()
		.append("rect")
		.transition()
		.delay(b_delay2)
		.attr("class", "bar")
		.attr("x", function(d) { return bar_x(d["Country"]); })
		.attr("y", function(d) { return bar_y(d["Poverty"]); })
		.attr("height", function(d) { return b_height - 50 - bar_y(d["Poverty"]); })
		.attr("width", barWidth - 2)
		.style("fill", "#90c1dd");
	bars.exit()
		.transition()
		.duration(200)
		.remove();

	var bars2 = bar_svg.selectAll(".bar2")
		.data(data)
	bars2.transition()
		.duration(750)
		.delay(b_delay)
		.attr("x", function(d) { return bar_x(d["Country"]) + barWidth; })
		.attr("y", function(d) { return bar_y(d["GINI"]); })
		.attr("height", function(d) { return b_height - 50 - bar_y(d["GINI"]); })
		.attr("width", barWidth - 4);
	bars2.enter()
		.append("rect")
		.transition()
		.delay(b_delay2)
		.attr("class", "bar2")
		.attr("x", function(d) { return bar_x(d["Country"]) + barWidth; })
		.attr("y", function(d) { return bar_y(d["GINI"]); })
		.attr("height", function(d) { return b_height - 50 - bar_y(d["GINI"]); })
		.attr("width", barWidth - 4)
		.style("fill", "#ff8e85");
	bars2.exit()
		.transition()
		.duration(200)
		.remove();

	bar_xAxis = d3.axisBottom()
		.scale(bar_x);
	bar_yAxis = d3.axisLeft()
		.scale(bar_y);

	x_label = bar_svg.selectAll(".x");
	x_label.remove();
	y_label = bar_svg.selectAll(".y");
	y_label.remove();

	bar_svg.append("g")
		.attr("class", "x")
		.attr("transform", "translate(0," + (b_height - 50) + ")")
		.call(bar_xAxis)
		.selectAll("text")
		.attr("transform", "rotate(-45)")
		.style("text-anchor", "end");

	bar_svg.append("g")
		.attr("class", "y")
		.attr("transform", "translate(75, 0)")
		.call(bar_yAxis);
}

d3.select("#bar_1")
	.selectAll("select")
	.on("change", bar_dropdown);

function bar_dropdown()
{
	var region = d3.select("#bar_1").select("#select_region").node().value;
	var year = d3.select("#bar_1").select("#select_year").node().value;

	if (region == "East Asia & Pacific")
	{
		plot_bar(EA, year);
	}
	else if (region == "Europe & Central Asia")
	{
		plot_bar(EU, year);
	}
	else if (region == "Latin America & Caribbean")
	{
		plot_bar(LA, year);
	}
	else if (region == "Middle East & North Africa")
	{
		plot_bar(ME, year);
	}
	else if (region == "North America")
	{
		plot_bar(NA, year);
	}
	else if (region == "South Asia")
	{
		plot_bar(SA, year);
	}
	else if (region == "Sub-Saharan Africa")
	{
		plot_bar(AF, year);
	}
}

// d3.select("#EA")
// 	.on("click", function()
// 	{
// 		bar_resetFilter("#EA");
// 		plot_bar(EA, "2013");
// 	});
// d3.select("#EU")
// 	.on("click", function()
// 	{
// 		bar_resetFilter("#EU");
// 		plot_bar(EU, "2013");
// 	});
// d3.select("#LA")
// 	.on("click", function()
// 	{
// 		bar_resetFilter("#LA");
// 		plot_bar(LA, "2013");
// 	});
// d3.select("#ME")
// 	.on("click", function()
// 	{
// 		bar_resetFilter("#ME");
// 		plot_bar(ME, "2013");
// 	});
// d3.select("#NA")
// 	.on("click", function()
// 	{
// 		bar_resetFilter("#NA");
// 		plot_bar(NA, "2013");
// 	});
// d3.select("#SA")
// 	.on("click", function()
// 	{
// 		bar_resetFilter("#SA");
// 		plot_bar(SA, "2013");
// 	});
// d3.select("#AF")
// 	.on("click", function()
// 	{
// 		bar_resetFilter("#AF");
// 		plot_bar(AF, "2013");
// 	});

// function bar_resetFilter(id)
// {
// 	d3.select("#EA").attr("disabled", null);
// 	d3.select("#EU").attr("disabled", null);
// 	d3.select("#LA").attr("disabled", null);
// 	d3.select("#ME").attr("disabled", null);
// 	d3.select("#NA").attr("disabled", null);
// 	d3.select("#SA").attr("disabled", null);
// 	d3.select("#AF").attr("disabled", null);
// 	d3.select(id).attr("disabled", true);
// }