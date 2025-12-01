import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { Accordion, Button, CloseButton, Col, Form, InputGroup, Modal, Row } from "react-bootstrap";
import { Container, Dropdown, NavDropdown, Navbar, Offcanvas, Spinner, } from "react-bootstrap";

// domain
import SolarMpptModel from "../model/SolarMpptModel";

// store
import store from "../store/SolarMpptStore";

// view
import Legend from "../view/Legend";
import MultilineChart from "../view/MultilineChart";
import HighchartsView from "../view/HighchartsView";
import UploadButtonView from "../view/UploadButtonView";

const HOURS = [
	{hours: 1, title: "1 시간"},
	{hours: 2, title: "2 시간"},
	{hours: 3, title: "3 시간"},
	{hours: 6, title: "6 시간"},
	{hours: 12, title: "12 시간"},
	{hours: 24, title: "하루"},
	{hours: 24 * 2, title: "이틀"},
	{hours: 24 * 7 * 1, title: "1 주일"},
	{hours: 24 * 7 * 2, title: "2 주일"},
	{hours: 24 * 7 * 5, title: "한달"},
	{hours: 24 * 7 * 9, title: "두달"},
	{hours: 24 * 7 * 26, title: "6 개월"},
	{hours: 24 * 366, title: "1 년"},
	{hours: 24 * 366 * 2, title: "2 년"},
];

// SolarMpptContainer.tsx
export default ((props: any) => {
	const [form, setForm] = useState({
		datetime: moment().startOf("hour").subtract(7, "days"),
		group: "",
		mode: 1,
	});
	const dimensions = {
		width: 128 * 6,
		height: 512,
		margin: {
			top: 16,
			left: 64,
			bottom: 32,
			right: 64,
		}
	};
	const names = {
		temperature: { color: "LightSalmon", unit: "℃", },
		discharge: { color: "BlueViolet", unit: "A", },
		charge: { color: "CadetBlue", unit: "A", },
		voltage: { color: "#808080", unit: "V", },
	};

	const [models, setModels] = useState<SolarMpptModel[]>([]);
	const [selectedItems, setSelectedItems] = React.useState(["charge", "voltage",]);

	const onChangeSelection = (name) => {
		const newSelectedItems = selectedItems.includes(name)
			? selectedItems.filter((item) => item !== name)
			: [...selectedItems, name];
		setSelectedItems(newSelectedItems);
	};
	function handleOnClickLabel(label: string) {
		setSelectedItems([label]);
	}

	useEffect(() => {
		const request = {
			start: form.datetime.format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
			pageNumber: 0,
			page: 0,
			pageSize: 1024 * 1024,
			size: 1024 * 1024,
		};
/*
		store.search(request, (_: any, result: any) => {
			const searched: SolarMpptModel[] = result?.crud?.duplicates;

			searched.map((model: any) => {
				const date = new Date(model.base);
				model.custom = {
					...model.custom,
					date: date,
				};
			});
			
			setModels(searched);
		});
*/
	}, [form]);

	return (<>
		<Header
			form={form}
			onChange={(params: any) => setForm({ ...form, ...params, })}
		/>
		<HighchartsView
			show={form.mode % 2 == 1}
			form={form}
		/>
		<Legend
			show={form.mode % 2 == 0}
			names={names}
			selectedItems={selectedItems}
			onClickLabel={handleOnClickLabel}
			onChange={onChangeSelection}
		/>
		<MultilineChart
			show={form.mode % 2 == 0}
			names={names}
			selectedItems={selectedItems}
			dimensions={dimensions}
			models={models}
		/>
	</>);
});

function Header(props: any) {
	const { form, onChange } = props;

	const inputRef = useRef(null);
	
	function handleOnClickBackup() {
		store.backup({ });
	}
	function handleOnClickDownload() {
		store.download({filename: `solar-mppt-${moment().format("YYYYMMDD")}.json`, });
	}

	return (<>
		<Row className="mx-0 py-1 bg-dark border-top border-secondary">
			<Col xs="auto" className="px-1">
				<InputGroup size="sm">
					<Form.Select className="border-secondary bg-dark text-white" value={Math.floor(moment.duration(moment().diff(form.datetime)).asHours())}
						onChange={(event: any) => onChange && onChange({ datetime: moment().subtract(Number(event.target.value), "hours"), })}
					>
						{HOURS.map((p: any) => (
							<option key={Math.random()} value={p.hours}>{p.title}</option>
						))}
					</Form.Select>
					<Form.Select className="border-secondary bg-dark text-white" value={form.group}
						onChange={(event: any) => onChange && onChange({ group: event.target.value })}
					>
						<option key={Math.random()} value={""}>자동</option>
						<option disabled>──</option>
						<option key={Math.random()} value={"mppt-controller"}>5분</option>
						<option key={Math.random()} value={"mppt-controller.1hour"}>1시간</option>
						<option key={Math.random()} value={"mppt-controller.1day"}>1일</option>
					</Form.Select>
				</InputGroup>
			</Col>
			<Col xs="auto" className="px-1 me-auto">
			</Col>
			<Col xs="auto" className="px-1">
				<InputGroup size="sm">
					<Dropdown>
						<Dropdown.Toggle id="dropdown-menu" size="sm" variant="secondary">메뉴</Dropdown.Toggle>
						<Dropdown.Menu>
							<Dropdown.Item onClick={handleOnClickBackup}>Backup</Dropdown.Item>
							<Dropdown.Item onClick={handleOnClickDownload}>Download</Dropdown.Item>

							<Dropdown.Divider />

							<Dropdown.Item onClick={(param: any) => store.crawlDetail({})}>지금</Dropdown.Item>
							<Dropdown.Item onClick={(param: any) => store.crawlClean({})}>브라우져 리셋</Dropdown.Item>
							<Dropdown.Item onClick={(param: any) => store.test(1)}>한달 통계 재집계</Dropdown.Item>
							<Dropdown.Item
								onClick={(param: any) => store.aggregate({
									start: moment().subtract(1, "years").format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
									end: moment().format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
								})}
							>1년 통계 재집계</Dropdown.Item>

							<Dropdown.Divider />
	
							{HOURS.map((p: any) => (
								<Dropdown.Item key={Math.random()}
									onClick={(param: any) => store.crawl({
										start: moment().subtract(p.hours, "hours").format("YYYY-MM-DDTHH:mm:ss.SSSZ")
									})}
								>수집: {p.title}</Dropdown.Item>
							))}
						</Dropdown.Menu>
					</Dropdown>
					<UploadButtonView />
					<Button size="sm" variant="secondary" className="ms-1" title={form.mode.toString()} onClick={(_: any) => onChange && onChange({ mode: form.mode + 1 })}>모드</Button>
				</InputGroup>
			</Col>
		</Row>
	</>);
}
