import React, { useRef } from 'react';
import jQuery from 'jquery';
import { Modal, Button } from 'react-bootstrap';

export function CreateModal(props) {
	// properties
	const onClickButtonClose = props.onClickButtonClose;
	const onCreated = props.onCreated;

	const rendered = useRef(0);

	function onPasteDescription(e) {
		console.log("onPasteDescription", e);
		var pastedData = e.clipboardData.getData('text');
		var pastedDataHtml = e.clipboardData.getData('text/html');

		if (window.clipboardData && window.clipboardData.getData) { // IE
			pastedData = window.clipboardData.getData('Text');
			pastedDataHtml = window.clipboardData.getData('text/html');
		}

		if (pastedDataHtml) {
			jQuery('#html-description').html(pastedDataHtml);
			jQuery('form textarea[name=description]').val(pastedDataHtml);
		} else {
			jQuery('#html-description').html(pastedData);
			jQuery('form textarea[name=description]').val(pastedData);
		}
	}
	function onChangeStart(e) {
		const text = jQuery(e.target).val();
		fetch('./api/big-history/parse-date-time?text=' + text, {
	        method: 'GET',
	    })
	    .then((response) => {
	        return response.json();
	    })
	    .then(function (result) {
			console.log(text, result);
			jQuery('form input[name="start"]').val(result.value);
			return result.value;
	    });
	}
	function onChangeEnd(e) {
		const text = jQuery(e.target).val();
		fetch('./api/big-history/parse-date-time?text=' + text, {
	        method: 'GET',
	    })
	    .then((response) => {
	        return response.json();
	    })
	    .then(function (result) {
			console.log(text, result);
			jQuery('form input[name="end"]').val(result.value);
			return result.value;
	    });
	}
	function onCreate() {
		fetch('./api/big-history', {
		        method: 'POST',
		        headers: { 'Content-Type': 'application/json' },
		        body: JSON.stringify({
					id: jQuery('form input[name="id"]').val(),
					parentId: jQuery('form input[name="parentId"]').val(),
					start: jQuery('form input[name="start"]').val(),
					end: jQuery('form input[name="end"]').val(),
					title: jQuery('form input[name="title"]').val(),
					description: jQuery('form textarea[name="description"]').val(),
					collapsed: !!jQuery('form input[name="collapsed"]').val(),
					created: jQuery('form input[name="created"]').val(),
					updated: jQuery('form input[name="updated"]').val(),
				}),
	        })
	        .then((response) => {
	            return response.json();
	        })
	        .then(function (result) {
				console.log(result);
				onCreated(result);
	        });
	}

	rendered.current++;

	// start
	return (
		<Modal
			{...props}
			size="lg"
			aria-labelledby="contained-modal-title-vcenter"
			centered
		>
			<Modal.Header closeButton>
				<Modal.Title id="contained-modal-title-vcenter">
					생성 화면
					<small className="p-4">{rendered.current}</small>
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<form name="form-update" className="border border-secondary rounded m-3 py-3" method="post">
					<div className="form-group row my-1">
						<label for="id" className="col-2 col-form-label text-end">id</label>
						<div className="col-9 d-none">
							<input type="number" className="form-control" name="id" placeholder="id" readOnly />
						</div>
					</div>
					<div className="form-group row my-1">
						<label for="parentId" className="col-2 col-form-label text-end">parent</label>
						<div className="col-9">
							<input type="number" className="form-control" name="parentId" placeholder="parentId" value={0} readOnly />
						</div>
					</div>
					
					<div className="form-group row my-1">
						<label for="title" className="col-2 col-form-label text-end">title</label>
						<div className="col-9">
							<input type="text" className="form-control" name="title" placeholder="title" />
						</div>
					</div>
					<div class="form-group row my-1">
						<label for="start-text" className="col-2 col-form-label text-end">start</label>
						<div className="col-5">
							<input type="text" className="form-control" name="start-text" placeholder="start-text" onChange={onChangeStart} />
						</div>
						<div className="col-4">
							<input type="text" className="form-control" name="start" placeholder="start" readOnly  />
						</div>
					</div>
					<div class="form-group row my-1">
						<label for="end-text" className="col-2 col-form-label text-end">end</label>
						<div className="col-5">
							<input type="text" className="form-control" name="end-text" placeholder="end-text" onChange={onChangeEnd} />
						</div>
						<div className="col-4">
							<input type="text" className="form-control" name="end" placeholder="end" readOnly  />
						</div>
					</div>
					<div className="form-group row my-1">
						<label for="description" className="col-2 col-form-label text-end">description</label>
						<div className="col-4">
							<textarea rows="8"
								className="form-control"
								name="input-description"
								placeholder="input-description"
								onPaste={onPasteDescription}
							></textarea>
						</div>
						<div className="col-5">
							<textarea rows="8"
								className="form-control"
								name="description"
								placeholder="description"
								readOnly 
							></textarea>
						</div>
					</div>
					<div className="form-group row m-1">
						<label for="html-description" className="col-2 col-form-label text-end">html</label>
						<div className="col-9 overflow-auto p-1 border" id="html-description"
								style={{ height: '12rem' }}></div>
					</div>
					<div className="form-group row m-1">
						<div className="form-check form-switch offset-2 col-9">
							<input className="form-check-input" type="checkbox" role="switch" id="collapsed" name="collapsed" />
							<label className="form-check-label" for="collapsed">collapsed</label>
						</div>
					</div>
					<div className="form-group row my-1 d-none">
						<label for="create" className="col-2 col-form-label text-end">created</label>
						<div className="col-9">
							<input type="datetime" className="form-control" name="created" placeholder="created" readOnly />
						</div>
					</div>
					<div className="form-group row my-1 d-none">
						<label for="update" className="col-2 col-form-label text-end">updated</label>
						<div className="col-9">
							<input type="datetime" className="form-control" name="updated" placeholder="updated" readOnly />
						</div>
					</div>
				</form>
			</Modal.Body>
			<Modal.Footer>
				<Button variant="primary" onClick={onCreate}>Create</Button>
				<Button variant="secondary" onClick={onClickButtonClose}>Close</Button>
			</Modal.Footer>
		</Modal>
	);
}
