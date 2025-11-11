import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-balham.css";
import "moment/locale/ko"

import React, { useLayoutEffect, useEffect, useState } from "react";
import { DndProvider, useDrop } from "react-dnd";
import { HTML5Backend, NativeTypes } from "react-dnd-html5-backend";
import { Button, Container, Modal, Nav, Navbar } from "react-bootstrap";
import moment from "moment-timezone";
import "moment/locale/ko";

// container
import SolarMpptContainer from "./container/SolarMpptContainer";

// store
import store from "./store/Store";

// App.tsx
export default function App() {
	const [container, setContainer] = useState("Solar Mppt");

	useLayoutEffect(() => {
		document.title = "exercise #pre-general #pseudo-test";
		moment.tz.setDefault("Asia/Seoul");
		moment.locale("ko");
	}, []);
	function onChange(params: string) {
		setContainer(params);
	}

	return (
		<div className="App container-full">
			<DndProvider backend={HTML5Backend}>
				<Navigator container={container} onChange={onChange} />
				<SolarMpptContainer />
			</DndProvider>
		</div>
	);
}

function Navigator(props: any) {
	const { container, onChange } = props;

	const [showAboutModal, setShowAboutModal] = useState(false);

	const menus = ["Solar Mppt", ];
	const filename = "list-big-history-" + moment().format("YYYYMMDD") + ".json";

	return (<>
		<Navbar bg="dark" variant="dark" className="mx-0 p-0">
			<Container className="mx-0">
				<Navbar.Brand href="/">exercise</Navbar.Brand>
				<Nav className="me-auto">
					{menus.map((menu: string) => (<Nav.Item key={menu}><Nav.Link
						active={container === menu} onClick={() => onChange(menu)}>{menu}</Nav.Link>
					</Nav.Item>))}
					<Nav.Item>
						<Nav.Link onClick={() => setShowAboutModal(true)}>About</Nav.Link>
					</Nav.Item>
				</Nav>
			</Container>
		</Navbar>
		<AboutModal
			show={showAboutModal}
			onClose={() => setShowAboutModal(false)}
		/>
	</>);
}

function AboutModal(props: any) {
	const onClose = props.onClose;

	const [properties, setProperties] = useState({});

	useEffect(() => {
		store.environment({}, (response) => setProperties(response.data));
	}, []);

	if (!properties || !properties["spring.datasource.url"]) {
		return (<></>);
	}

	return (
		<Modal
			{...props}
			size="lg"
			centered
		>
			<Modal.Header closeButton>
				<Modal.Title id="contained-modal-title-vcenter">
					Environment
				</Modal.Title>
				<Button variant="primary mx-4" onClick={onClose}>Close</Button>
			</Modal.Header>
			<Modal.Body>
				<div className="text-start p-4">
					<div className="form-group row my-1">
						<label className="col-4 col-form-label text-start">spring.datasource.url</label>
						<div className="col-8">
							<input type="text" className="form-control" value={properties["spring.datasource.url"]} readOnly />
						</div>
					</div>
					<div className="form-group row my-1 p-4">
					</div>
					{
						Object.keys(properties).sort().map(key => {
							return (
								<div className="form-group row my-1" key={key}>
									<label className="col-4 col-form-label text-start">{key}</label>
									<div className="col-8">
										<input type="text" className="form-control" value={properties[key]} readOnly />
									</div>
								</div>
							)
						})
					}
				</div>
			</Modal.Body>
			<Modal.Footer>
				<Button variant="primary" onClick={onClose}>Close</Button>
			</Modal.Footer>
		</Modal>
	);
}
