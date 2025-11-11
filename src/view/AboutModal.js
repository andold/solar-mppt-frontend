import React from 'react';
import { Modal, Button } from 'react-bootstrap';

export function AboutModal(props) {
	const onClose = props.onClose;
	const properties = props.properties;

	return (
		<Modal
			{...props}
			size="lg"
			aria-labelledby="contained-modal-title-vcenter"
			centered
		>
			<Modal.Header closeButton>
				<Modal.Title id="contained-modal-title-vcenter">
					Environment
				</Modal.Title>
				<Button variant="primary mx-4" onClick={onClose}>Close</Button>
			</Modal.Header>
			<Modal.Body>
				<div className='text-start p-4'>
					<div className="form-group row my-1">
						<label className="col-4 col-form-label text-start">spring.datasource.url</label>
						<div className="col-8">
							<input type="text" className="form-control" value={properties['spring.datasource.url']} readOnly />
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
