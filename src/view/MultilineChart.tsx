import React from "react";
import moment from "moment";
import * as d3 from "d3";

// domain
import SolarMpptModel from "../model/SolarMpptModel";

//	MultilineChart.tsx
const MultilineChart = ({ show, models, selectedItems, names, dimensions }) => {
	const svgRef = React.useRef(null);
	const { width, height, margin } = dimensions;
	const svgWidth = width + margin.left + margin.right;
	const svgHeight = height + margin.top + margin.bottom;

	React.useEffect(() => {
		const format = {
		  "decimal": ".",
		  "thousands": ",",
		  "grouping": [3],
		  "currency": ["$", "\\"],
		  "dateTime": "%Y-%m-%d %H:%M:%S",
		  "date": "%Y-%m-%d",
		  "time": "%H:%M:%S",
		  "periods": ["오전", "오후"],
		  "days": ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "Saturday"],
		  "shortDays": ["일", "월", "화", "수", "목", "금", "토"],
		  "months": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
		  "shortMonths": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
		};
		d3.formatDefaultLocale(format);
		const xScale = d3
			.scaleTime(d3.extent(models, (model: SolarMpptModel) => model.custom.date, [margin.left, width - margin.right]))
			.domain(d3.extent(models, (model: SolarMpptModel) => model.custom.date))
			.range([margin.left, width]);
		// Create root container where we will append all other chart elements
		const svgEl = d3.select(svgRef.current);
		svgEl.selectAll("*").remove();
		const svg = svgEl
			.append("g")
			.attr("transform", `translate(${margin.left * 1},${margin.top})`);
		// Add X grid lines with labels
		const xAxis = d3
			.axisBottom(xScale)
			.ticks(7)
			.tickFormat((d, i) => moment(d).hour() ? moment(d).format("HH:mm") : moment(d).format("DD(ddd)"))
			.tickSize(-height + margin.bottom)
			;
		const xAxisGroup = svg
			.append("g")
			.attr("transform", `translate(0, ${height})`)
			.call(xAxis);
		xAxisGroup.select(".domain").remove();
		xAxisGroup.selectAll("line").attr("stroke", "rgba(128, 128, 128, 0.2)");
		xAxisGroup
			.selectAll("text")
			.attr("opacity", 0.5)
			.attr("color", "gray")
			.attr("font-size", "0.75rem");
		var index = 0;
		var yaxises = {};
		Object.keys(names).map((name: string) => {
			if (!selectedItems.includes(name)) {
				return;
			}
			yaxises[names[name].unit] = {
				...yaxises[names[name].unit],
			};
			const min = d3.min(models, (model: SolarMpptModel) => model[name] < 0 ? Number.MAX_VALUE : model[name]);
			const max = d3.max(models, (model: SolarMpptModel) => model[name] < 0 ? Number.MIN_VALUE : model[name]);
			yaxises[names[name].unit] = {
				...yaxises[names[name].unit],
				min: yaxises[names[name].unit].min ? Math.min(yaxises[names[name].unit].min, min) : min,
				max: yaxises[names[name].unit].max ? Math.max(yaxises[names[name].unit].max, max) : max,
			};
			const delta = yaxises[names[name].unit].max - yaxises[names[name].unit].min;
			yaxises[names[name].unit] = {
				...yaxises[names[name].unit],
				yscale: d3.scaleLinear()
					.domain([yaxises[names[name].unit].min - delta * 0.1, yaxises[names[name].unit].max + delta * 0.1])
					.range([height, margin.bottom]),
				color: names[name].color,
			};
		});
		Object.keys(yaxises).map((unit: string, index: number) => {
			const yaxisLeftOrRight = (index % 2 == 0) ? d3.axisLeft(yaxises[unit].yscale) : d3.axisRight(yaxises[unit].yscale) ;
			const yaxis = yaxisLeftOrRight
				.ticks(4)
				.tickSize(-width)
				.tickFormat((value: number) => `${d3.format(",.1f")(value)} ${unit}`)
				;
			const x = (index % 2 == 0)
						? -16 + index++ * margin.left / 4
						: width + margin.right - 32 - margin.left / 4;
			const yaxisGroup = svg.append("g").attr("transform", `translate(${x}, 0)`).call(yaxis);
			yaxisGroup.select(".domain").remove();
			yaxisGroup.selectAll("line").attr("stroke", yaxises[unit].color).attr("opacity", 0.1);
			yaxisGroup
				.selectAll("text")
				.attr("opacity", 0.8)
				.attr("color", yaxises[unit].color)
				.attr("font-size", "0.75rem");
		});
		Object.keys(names).map((name: string) => {
			if (!selectedItems.includes(name)) {
				return;
			}
			const lineName = d3
				.line()
				.defined((model: SolarMpptModel) => model[name] >= 0)
				.x((model: SolarMpptModel) => xScale(model.custom.date))
				.y((model: SolarMpptModel) => yaxises[names[name].unit].yscale(model[name]))
				.curve(d3.curveBumpX)
				;
			svg.append("path")
				.style("stroke", names[name].color)
				.attr("opacity", 0.1)
				.attr("fill", "none")
				.attr("stroke-width", 1)
			    .attr("d", lineName(models.filter((model: SolarMpptModel) => model[name] >= 0)))
				;
			svg.append("path")
			    .style("stroke", names[name].color)
				.attr("fill", "none")
				.attr("stroke-width", 1)
				.attr("d", lineName(models))
				;
		});
	}, [models, selectedItems, names]);

	if (!show) {
		return (<></>);
	}

	return <svg ref={svgRef} width={svgWidth} height={svgHeight} className="border" />;
};

export default MultilineChart;
