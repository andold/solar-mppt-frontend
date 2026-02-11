import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import Highcharts from "highcharts";
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
	accessibility: {
		enabled: false,
	},
	time: {
		timezone: "Asia/Seoul",
	},
};

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
	},
});

function isValidNumber(value: number): boolean {
	if (typeof(value) === "undefined" || value === null || Number.isNaN(value)) {
		return false;
	}
	
	return true;
}
// HighchartsView.tsx
export default ((props: any) => {
	const { show, form } = props;
	const [options, setOptions] = useState<any>({ series: [], xAxis: { min: moment().valueOf() } });
	useEffect(() => {
		const group: string = (form.group !== "")
									? form.group
									: form.datetime.isBefore(moment().subtract(2, "months"))
										? "mppt-controller.1day"
										: form.datetime.isBefore(moment().subtract(5, "days"))
											? "mppt-controller.1hour"
											: "mppt-controller"
									;
		const request = {
			group: group,
			start: form.datetime.format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
			pageNumber: 0,
			page: 0,
			pageSize: 1024 * 1024,
			size: 1024 * 1024,
		};
		store.search(request, ( searched: SolarMpptModel[]) => {
			searched.forEach((model: SolarMpptModel) => {
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
				min.temperature = Math.min(min.temperature,
					isValidNumber(p.temperature) ? p.temperature : min.temperature,
					isValidNumber(p.temperatureMin) ? p.temperatureMin : min.temperature,
				);
				max.temperature = Math.max(max.temperature,
					isValidNumber(p.temperature) ? p.temperature : max.temperature,
				);
				min.charge = Math.min(min.charge,
					isValidNumber(p.charge) ? p.charge : min.charge,
				);
				max.charge = Math.max(max.charge,
					isValidNumber(p.charge) ? p.charge : max.charge,
				);
				min.discharge = Math.min(min.discharge,
					isValidNumber(p.discharge) ? p.discharge : min.discharge,
				);
				max.discharge = Math.max(max.discharge,
					isValidNumber(p.discharge) ? p.discharge : max.discharge,
				);
				min.voltage = Math.min(min.voltage,
					isValidNumber(p.voltage) ? p.voltage : min.voltage,
					isValidNumber(p.voltageMin) ? p.voltageMin : min.voltage,
				);
				max.voltage = Math.max(max.voltage,
					isValidNumber(p.voltage) ? p.voltage : max.voltage,
				);
			});
			let deltaAmpere = (Math.max(max.charge, max.discharge) - Math.min(min.charge, min.discharge));
			let tickIntervalAmpere = Math.max(0.1, Math.round(deltaAmpere * 10 / 5) / 10);
			let tickIntervalVoltage = Math.max(0.1, Math.round((max.voltage - min.voltage) * 10 / 5) / 10);
			let tickIntervalTemperature = Math.max(0.1, Math.round((max.temperature - min.temperature) * 10 / 5) / 10);
			setOptions({
				...OPTIONS,
				yAxis: [{
					format: "{value:.1f}",
					id: "ampere",
					opposite: false,
					tickInterval: tickIntervalAmpere,
					title: null,
				}, {
					format: "{value:.1f}",
					id: "voltage",
					opposite: true,
					tickInterval: tickIntervalVoltage,
					title: null,
				}, {
					format: "{value:.1f}",
					id: "temperature",
					opposite: true,
					tickInterval: tickIntervalTemperature,
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

