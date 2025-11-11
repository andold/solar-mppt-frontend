import React, { useState, useEffect } from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { Modal, Button } from 'react-bootstrap';
import moment from 'moment';
import axios from 'axios';

import { AboutModal } from './AboutModal.js';
import { UploadModal } from './UploadModal.js';

export function MenuBar() {
	const [showAboutModal, setShowAboutModal] = useState(false);
	const [showDownloadedModal, setShowDownloadedModal] = useState(false);
	const [showDownloadingModal, setShowDownloadingModal] = useState(false);
	const [showUploadModal, setShowUploadModal] = useState(false);

	const [properties, setProperties] = useState({});
	const [blob, setBlob] = useState(null);

	const filename = 'list-big-history-' + moment().format('YYYYMMDD') + '.json';
	
	function onClickDownload() {
		setShowDownloadingModal(true);
		axios({
			url: './big-history/download',
			method: 'GET',
			responseType: 'blob',
		}).then(response => {
			setBlob(response.data);
			const url = window.URL.createObjectURL(new Blob([response.data]));
			const link = document.createElement('a');
			link.href = url;
			link.setAttribute('download', filename);
			document.body.appendChild(link);
			link.click();
			// Clean up and remove the link
			link.parentNode.removeChild(link);
			setShowDownloadingModal(false);
			setShowDownloadedModal(true);
		});
	}

	useEffect(() => {
		axios.get('./api/environment')
			.then(response => setProperties(response.data))
			.catch(error => console.log(error))
	}, []);

	return (
		<>
			<Navbar bg="dark" variant="dark">
				<Container>
					<Navbar.Brand href="/">exercise</Navbar.Brand>
					<Nav className="me-auto">
						<Nav.Link href="./">Big History</Nav.Link>
						<Nav.Link onClick={() => setShowUploadModal(true)}>Upload</Nav.Link>
						<Nav.Link onClick={() => onClickDownload()}>Download</Nav.Link>
						<Nav.Link href={properties["server.servlet.context-path"] + properties["spring.h2.console.path"]}>H2</Nav.Link>
						<Nav.Link onClick={() => setShowAboutModal(true)}>About</Nav.Link>
					</Nav>
				</Container>
			</Navbar>
			<AboutModal
				show={showAboutModal}
				properties={properties}
				onClose={() => setShowAboutModal(false)}
			/>
			<DownloadedModal
				show={showDownloadedModal}
				filename = { filename }
				blob = { blob }
				onClose={() => setShowDownloadedModal(false)}
			/>
			<DownloadingModal
				show={showDownloadingModal}
				onClose={() => setShowDownloadingModal(false)}
			/>
			<UploadModal
				show={showUploadModal}
				onClose={() => setShowUploadModal(false)}
			/>
		</>
	);
}

function DownloadingModal(props) {
	const onClose = props.onClose;

	function onClickButtonClose() {
		onClose();
	}

	return (
		<Modal
			{...props}
			size="lg"
			aria-labelledby="contained-modal-title-vcenter"
			centered
		>
			<Modal.Header closeButton>
				<Modal.Title id="contained-modal-title-vcenter">
					Loading...
				</Modal.Title>
				<Button variant="primary mx-4" onClick={onClose}>Close</Button>
			</Modal.Header>
			<Modal.Body>
				<div>
					<div className="text-center">
						<div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div>
						<div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div>
						<div className="spinner-border text-secondary" role="status"><span className="visually-hidden">Loading...</span></div>
						<div className="spinner-border text-success" role="status"><span className="visually-hidden">Loading...</span></div>
						<div className="spinner-border text-danger" role="status"><span className="visually-hidden">Loading...</span></div>
						<div className="spinner-border text-warning" role="status"><span className="visually-hidden">Loading...</span></div>
						<div className="spinner-border text-info" role="status"><span className="visually-hidden">Loading...</span></div>
						<div className="spinner-border text-light" role="status"><span className="visually-hidden">Loading...</span></div>
						<div className="spinner-border text-dark" role="status"><span className="visually-hidden">Loading...</span></div>
					</div>
					<div className="text-center">
						<div className="spinner-grow" role="status"><span className="visually-hidden">Loading...</span></div>
						<div className="spinner-grow text-primary" role="status"><span className="visually-hidden">Loading...</span></div>
						<div className="spinner-grow text-secondary" role="status"><span className="visually-hidden">Loading...</span></div>
						<div className="spinner-grow text-success" role="status"><span className="visually-hidden">Loading...</span></div>
						<div className="spinner-grow text-danger" role="status"><span className="visually-hidden">Loading...</span></div>
						<div className="spinner-grow text-warning" role="status"><span className="visually-hidden">Loading...</span></div>
						<div className="spinner-grow text-info" role="status"><span className="visually-hidden">Loading...</span></div>
						<div className="spinner-grow text-light" role="status"><span className="visually-hidden">Loading...</span></div>
						<div className="spinner-grow text-dark" role="status"><span className="visually-hidden">Loading...</span></div>
					</div>
				</div>
			</Modal.Body>
			<Modal.Footer>
				<Button variant="primary" onClick={onClickButtonClose}>Close</Button>
			</Modal.Footer>
		</Modal>
	);
}

function DownloadedModal(props) {
	const filename = props.filename;
	const blob = props.blob;
	const onClose = props.onClose;

	if (!blob) {
		return (
			<>
			</>
		);
	}

	return (
		<>
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
							<label className="col-4 col-form-label text-end">filename</label>
							<div className="col-8">
								<input type="text" className="form-control" value={filename} readOnly />
							</div>
						</div>
						<div className="form-group row my-1">
							<label className="col-4 col-form-label text-end">filesize</label>
							<div className="col-8">
								<input type="text" className="form-control" value={blob.size} readOnly />
							</div>
						</div>
						<div className="form-group row my-1">
							<label className="col-4 col-form-label text-end">filetype</label>
							<div className="col-8">
								<input type="text" className="form-control" value={blob.type} readOnly />
							</div>
						</div>
					</div>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="primary" onClick={onClose}>Close</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
}
