import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import Highcharts from "highcharts";
import "highcharts";
import 'highcharts/highcharts-more';
import HighchartsReact from "highcharts-react-official";
import moment from "moment";

// domain
import SolarMpptModel from "../model/SolarMpptModel";

// store
import store from "../store/TsdbStore";

const OPTIONS = {
	chart: {
		zooming: {
			type: "x",
		},
	},
	title: { text: null },
	subtitle: { text: null },
	xAxis: {
		type: "datetime",
		dateTimeLabelFormats: {
			millisecond: "%H:%M:%S.%L",
			second: "%H:%M:%S",
			minute: "%H:%M",
			hour: "%H:%M",
			day: "%m-%d(%a)",
			week: "%m-%d(%a)",
			month: "%Y-%m",
			year: "%Y-%m",
		},
		min: null,
	},
	legend: { enabled: true },
	series: [],
	tooltip: {
		shared: true,
		xDateFormat: "%Y-%m-%d(%a) %H:%M",
	},
	plotOptions: {
		series: {
			//stacking: "normal",
		},
	},
	accessibility: {
		enabled: false,
	},
	time: {
		timezone: "Asia/Seoul",
	},
};

function isValidNumber(value: number): boolean {
	if (typeof(value) === "undefined" || value === null || Number.isNaN(value)) {
		return false;
	}
	
	return true;
}
function yAxisMinMaxTickAmount(min: number, max: number, t: number): any {
	let tickAmount: number = (max - min) / 0.1 + 2;
	let result: any = {
		min: min - t,
		max: max + t,
		tickAmount: tickAmount,
	}
	if (tickAmount > 7) {
		tickAmount = Math.floor((max - min) / (t * 2)) + 2;
		result = {
			min: min - t * 2,
			max: max + t * 2,
			tickAmount: tickAmount,
		}
	}

	return result;
}
// HighchartsView.tsx
export default ((props: any) => {
	const { show, form } = props;
	const [options, setOptions] = useState<any>({ series: [], xAxis: { min: moment().valueOf() } });
	useEffect(() => {
		Highcharts.setOptions({
			lang: {
				weekdays: ["일", "월", "화", "수", "목", "금", "토", ],
				shortWeekdays: ["일", "월", "화", "수", "목", "금", "토", ],
				numericSymbolMagnitude: 10000,
				numericSymbols: ["만", "억", "조"],
				thousandsSep: ",",
			},
			time: {
				timezone: "Asia/Seoul",
				//useUTC: false,
			},
		});
		const group: string = (form.group !== "")
									? form.group
									: form.datetime.isBefore(moment().subtract(2, "months"))
										? "mppt-controller.1day"
										: form.datetime.isBefore(moment().subtract(5, "days"))
											? "mppt-controller.1hour"
											: "mppt-controller"
									;
		const request = {
			//group: form.datetime.isBefore(moment().subtract(5, "days")) ? "mppt-controller.1hour" : "mppt-controller",
			group: group,
			start: form.datetime.format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
			pageNumber: 0,
			page: 0,
			pageSize: 1024 * 1024,
			size: 1024 * 1024,
		};
		store.search(request, ( searched: SolarMpptModel[]) => {
			searched.map((model: SolarMpptModel) => {
				const date = new Date(model.base);
				model.custom = {
					...model.custom,
					date: date,
				};
			});
			
			const series: any[] = [];
			series.push({
				name: "temperature",
				type: group === "mppt-controller.1day" ? "arearange" : "spline",
				data: searched.map((p: SolarMpptModel) => group === "mppt-controller.1day"
																? [moment(p.custom.date).valueOf(), p.temperatureMin, p.temperature]
																: [moment(p.custom.date).valueOf(), p.temperature]),
				yAxis: "temperature",
				visible: false,
			});
			series.push({
				name: "discharge",
				type: "spline",
				data: searched.map((p: SolarMpptModel) => [moment(p.custom.date).valueOf(), p.discharge]),
				yAxis: "ampere",
				visible: true,
			});
			series.push({
				name: "charge",
				type: "spline",
				data: searched.map((p: SolarMpptModel) => [moment(p.custom.date).valueOf(), p.charge]),
				yAxis: "ampere",
				visible: true,
			});
			series.push({
				name: "voltage",
				type: group === "mppt-controller.1day" ? "arearange" : "spline",
				data: searched.map((p: SolarMpptModel) => group === "mppt-controller.1day"
																? [moment(p.custom.date).valueOf(), p.voltageMin, p.voltage]
																: [moment(p.custom.date).valueOf(), p.voltage]),
				yAxis: "voltage",
				visible: true,
			});
			const min: SolarMpptModel = {
				base: "",
				temperature: 100,
				discharge: 1,
				charge: 10,
				voltage: 24,
				created: "",
				updated: "",
			};
			const max: SolarMpptModel = {
				base: "",
				temperature: 0,
				discharge: 0,
				charge: 0,
				voltage: 0,
				created: "",
				updated: "",
			};
			searched.forEach((p: SolarMpptModel) => {
				if (isValidNumber(p.temperatureMin)) {
					min.temperature = Math.min(min.temperature, p.temperatureMin);
				}
				if (isValidNumber(p.temperature)) {
					min.temperature = Math.min(min.temperature, p.temperature);
					max.temperature = Math.max(max.temperature, p.temperature);
				}
				if (isValidNumber(p.discharge)) {
					min.discharge = Math.min(min.discharge, p.discharge);
					max.discharge = Math.max(max.discharge, p.discharge);
				}
				if (isValidNumber(p.charge)) {
					min.charge = Math.min(min.charge, p.charge);
					max.charge = Math.max(max.charge, p.charge);
				}
				if (isValidNumber(p.voltageMin)) {
					min.voltage = Math.min(min.voltage, p.voltageMin);
				}
				if (isValidNumber(p.voltage)) {
					min.voltage = Math.min(min.voltage, p.voltage);
					max.voltage = Math.max(max.voltage, p.voltage);
				}
				if (Number.isNaN(min.temperature)
					|| Number.isNaN(min.discharge)
					|| Number.isNaN(min.charge)
					|| Number.isNaN(min.voltage)
				) {
					console.log(p, min, max);
				}
			}),
			console.log(min, max);
			let tickAmount: number = (Math.max(max.charge, max.discharge) - Math.min(min.charge, min.discharge)) / 0.1 + 2;
			if (tickAmount > 7) {
				tickAmount = Math.floor((Math.max(max.charge, max.discharge) - Math.min(min.charge, min.discharge)) / 0.2) + 2;
			}
			setOptions({
				...OPTIONS,
				yAxis: [{
					//...yAxisMinMaxTickAmount(Math.min(min.charge, min.discharge), Math.max(max.charge, max.discharge), 0.1),
					format: "{value:.1f}",
					id: "ampere",
					opposite: false,
					title: null,
				}, {
					//...yAxisMinMaxTickAmount(Math.min(min.voltage, min.voltage), Math.max(max.voltage, max.voltage), 0.1),
					format: "{value:.1f}",
					id: "voltage",
					opposite: true,
					title: null,
				}, {
					//...yAxisMinMaxTickAmount(Math.min(min.temperature, min.temperature), Math.max(max.temperature, max.temperature), 0.1),
					format: "{value:.1f}",
					id: "temperature",
					opposite: true,
					title: null,
				}],
				series: series,
			});
		});
	}, [form]);

	if (!show) {
		return (<></>);
	}

	return (<>
		<Row className="mx-0">
			<Col xs={12}>
				<HighchartsReact
					highcharts={Highcharts}
					options={options}
				/>
			</Col>
		</Row>
	</>);
});

