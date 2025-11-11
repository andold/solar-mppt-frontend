import React from "react";
import { Accordion, Button, CloseButton, Col, Form, InputGroup, Modal, Row } from "react-bootstrap";

const Legend = ({ show, names, selectedItems, onClickLabel, onChange }) => {
	if (!show) {
		return (<></>);
	}

	return (
		<Row className="mx-0 py-1 bg-dark border-top border-secondary legendContainer">
			<Col key={Math.random()} xs="auto" className="px-1">
				<InputGroup>
					{Object.keys(names).map((name: string) => (<>
						<Form.Check
							key={name}
							className="bg-dark mx-3 mt-1"
							style={{
								color: names[name].color,
							}}
						>
							<Form.Check.Input
								type="checkbox"
								checked={selectedItems.includes(name)}
								onChange={params => onChange && onChange(name)}
							/>
							<Form.Check.Label
								onClick={(params: any) => onClickLabel && onClickLabel(name)}
							>{name}</Form.Check.Label>
						</Form.Check>
					</>))}
				</InputGroup>
			</Col>
		</Row>
	)
};

export default Legend;
