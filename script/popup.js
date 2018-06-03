function pop_update(selection, data_id)
{
	var filtered;
	var xAxis;
	var yAxis;
	var x = d3.scaleBand();
	var y = d3.scaleLinear();
	var barWidth;
	var dataset;

	var width = 1000, height = 500;
	var svg = selection.select("svg")
		.attr("width", width)
		.attr("height", height);

	var delay = function(d, i) { return i * 50; };

	d3.csv("data/PovertyConsolidated.csv", function(data)
	{
		filtered = data.filter(function(row)
		{
			return row["Code"] == data_id;
		})

		if (typeof filtered[0] == 'undefined')
		{
			selection.select("h2")
				.text("No Data");
			selection.select("#detail")
				.text("No Data");

			var bars = svg.selectAll(".bar")
				.data([]);
			bars.exit()
				.transition()
				.duration(200)
				.remove();

			return 0;
		}
		// console.log(filtered);

		selection.select("h2")
			.text(filtered[0]["Country"]);
		selection.select("#detail")
			.text("Country in " + filtered[0]["Region"] + ", " + filtered[0]["IncomeGroup"] + " group.");

		selection.select("#pov").attr("disabled", true);
		selection.select("#gini").attr("disabled", null);
		selection.select("#gni").attr("disabled", null);

		plot(filtered, "Poverty");
	});

	selection.select("#pov")
	.on("click", function()
	{
		reset("#pov");
		plot(filtered, "Poverty");
	});
	selection.select("#gini")
	.on("click", function()
	{
		reset("#gini");
		plot(filtered, "GINI");
	});
	selection.select("#gni")
	.on("click", function()
	{
		reset("#gni");
		plot(filtered, "GNI");
	});

	function plot(data, index)
	{
		var max = d3.max(data, function(d) { return parseFloat(d[index]); });
		x.domain(data.map(function(d) { return d["Year"]; }))
			.rangeRound([75, width - 200]);
		y.domain([0, max])
			.range([height - 50, 60]);
		barWidth = (width - 275) / data.length;

		var bars = svg.selectAll(".bar")
			.data(data)
		bars.transition()
			.duration(750)
			.delay(delay)
			.attr("x", function(d) { return x(d["Year"]); })
			.attr("y", function(d) { return y(d[index]); })
			.attr("height", function(d) { return height - 50 - y(d[index]); })
			.attr("width", barWidth - 2)
			.style("fill", function() { return index == "Poverty" ? "#90c1dd" : (index == "GINI" ? "#ff8e85" : "#8ee0d4") });
		bars.enter()
			.append("rect")
			.attr("class", "bar")
			.attr("x", function(d) { return x(d["Year"]); })
			.attr("y", function(d) { return y(d[index]); })
			.attr("height", function(d) { return height - 50 - y(d[index]); })
			.attr("width", barWidth - 2)
			.style("fill", function() { return index == "Poverty" ? "#90c1dd" : (index == "GINI" ? "#ff8e85" : "#8ee0d4") });
		bars.exit()
			.transition()
			.duration(200)
			.remove();

		var labels = svg.selectAll(".label")
			.data(data);
		labels.transition()
			.duration(750)
			.delay(delay)
			.attr("x", function(d) { return x(d["Year"]) + (barWidth / 2) - 12; })
			.attr("y", function(d) { return y(d[index]) + 3; })
			.text(function(d) { return Number(d[index]).toFixed(1); });
		labels.enter()
			.append("text")
			.attr("class", "label")
			.attr("x", function(d) { return x(d["Year"]) + (barWidth / 2) - 12; })
			.attr("y", function(d) { return y(d[index]) + 3; })
			.attr("dy", ".75em")
			.text(function(d) { return Number(d[index]).toFixed(1); })
			.style("fill", "#ffffff");
		labels.exit()
			.transition()
			.duration(200)
			.remove();

		xAxis = d3.axisBottom()
			.scale(x);
		yAxis = d3.axisLeft()
			.scale(y);

		var x_axises = svg.selectAll(".x")
			.data([0]);
		x_axises.transition()
			.duration(750)
			.delay(delay)
			.attr("class", "x")
			.attr("transform", "translate(0," + (height - 50) + ")")
			.call(xAxis);
		x_axises.enter()
			.append("g")
			.attr("class", "x")
			.attr("transform", "translate(0," + (height - 50) + ")")
			.call(xAxis);
		x_axises.exit()
			.transition()
			.duration(200)
			.remove();

		var y_axises = svg.selectAll(".y")
			.data([0]);
		y_axises.transition()
			.duration(750)
			.delay(delay)
			.attr("class", "y")
			.attr("transform", "translate(75, 0)")
			.call(yAxis);
		y_axises.enter()
			.append("g")
			.attr("class", "y")
			.attr("transform", "translate(75, 0)")
			.call(yAxis);
		y_axises.exit()
			.transition()
			.duration(200)
			.remove();

		y_label_data = []

		if (index == "Poverty")
		{
			y_label_data[0] = "Poverty (%)"
		}
		else if (index == "GINI")
		{
			y_label_data[0] = "GINI (%)"
		}
		else if (index == "GNI")
		{
			y_label_data[0] = "Gross National Income ($)"
		}

		var y_label = svg.selectAll(".y_label")
			.data(y_label_data);
		y_label.transition()
			.duration(750)
			.delay(delay)
			.attr("class", "y_label")
			.attr("x", - height / 2)
			.attr("y", 20)
			.style("text-anchor", "middle")
			.style("transform", "rotate(-90deg)")
			.text(function(d) { return d; });
		y_label.enter()
			.append("text")
			.attr("class", "y_label")
			.attr("x", - height / 2)
			.attr("y", 20)
			.style("text-anchor", "middle")
			.style("transform", "rotate(-90deg)")
			.text(function(d) { return d; });
		y_label.exit()
			.transition()
			.duration(200)
			.remove();

		// svg.append("g")
		// 	.attr("class", "x")
		// 	.attr("transform", "translate(0," + (height - 50) + ")")
		// 	.call(xAxis);
		// svg.append("g")
		// 	.attr("class", "y")
		// 	.attr("transform", "translate(75, 0)")
		// 	.call(yAxis);
		// svg.append("text")
		// 	.attr("x", - height / 2)
		// 	.attr("y", 30)
		// 	.style("text-anchor", "middle")
		// 	.style("transform", "rotate(-90deg)")
		// 	.text("Poverty");
		// svg.append("text")
		// 	.attr("x", (width - 125) / 2)
		// 	.attr("y", 30)
		// 	.style("text-anchor", "middle")
		// 	.style("text-decoration", "underline") 
		// 	.text("Gross Domestic Product Growth in 2010");
	}

	function reset(id)
	{
		selection.select("#pov").attr("disabled", null);
		selection.select("#gini").attr("disabled", null);
		selection.select("#gni").attr("disabled", null);
		selection.select(id).attr("disabled", true);
	}
}