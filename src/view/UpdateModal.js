import React, { useRef, useState } from 'react';
import jQuery from 'jquery';
import { Modal, Button } from 'react-bootstrap';
import { getTextTime } from '../components/Utility.js';

export function UpdateModal(props) {
	// properties
	const history = {...props.history};
	const onClickButtonClose = props.onClickButtonClose;
	const onUpdated = props.onUpdated;
	const onDeleted = props.onDeleted;

	const rendered = useRef(0);
	const [start, setStart] = useState(getTextTime(history.start));
	const [end, setEnd] = useState(getTextTime(history.end));

	let title = (history.start === history.end) ? start : start + ' ~ ' + end;

	function onChangeStart(e) {
		const text = jQuery(e.target).val();
		setStart(text);
	}
	function onChangeEnd(e) {
		const text = jQuery(e.target).val();
		setEnd(text);
	}
	function onChangeDecriptionText(e) {
		jQuery('form textarea[name=description').val(jQuery(e.target).val());
	}
	function onPasteDescription(e) {
		var pastedDataHtml = e.clipboardData.getData('text/html');

		if (window.clipboardData && window.clipboardData.getData) { // IE
			pastedDataHtml = window.clipboardData.getData('text/html');
		}

		if (pastedDataHtml) {
			jQuery('#html-description').html(pastedDataHtml);
			jQuery('form textarea[name=description').val(pastedDataHtml);
		} else {
			jQuery('#html-description').html(jQuery(e.target).val());
			jQuery('form textarea[name=description').val(jQuery(e.target).val());
		}
	}
	function onUpdate() {
		fetch('./api/big-history/' + history.id, {
		        method: 'PUT',
		        headers: { 'Content-Type': 'application/json' },
		        body: JSON.stringify({...history,
		        	parentId: jQuery("form input[name=parentId]").val(),
		        	start: jQuery("form input[name=start]").val(),
		        	end: jQuery("form input[name=end]").val(),
		        	title: jQuery("form input[name=title]").val(),
		        	description: jQuery("form textarea[name=description]").val(),
		        }),
	        })
	        .then((response) => {
	            return response.json();
	        })
	        .then(function (result) {
				console.log(history, result);
				onUpdated(result);
	        });
	}
	function onDelete() {
		fetch('./api/big-history/' + history.id, {
		        method: 'DELETE',
	        })
	        .then((response) => {
	            return response.json();
	        })
	        .then(function (result) {
				console.log(history, result);
				onDeleted(result);
	        });
	}

	rendered.current++;

	return (
		<Modal
			{...props}
			size="lg"
			aria-labelledby="contained-modal-title-vcenter"
			centered
		>
			<Modal.Header closeButton>
				<Modal.Title id="contained-modal-title-vcenter">
					수정 화면: {history.title}
					<small className="p-4">{title}</small>
					<small className="p-4">{history.parentId}</small>
					<small className="p-4">{rendered.current}</small>
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<form name="form-update" className="border border-secondary rounded m-3 py-3" method="post">
					<div className="form-group row my-1">
						<label for="id" className="col-2 col-form-label text-end">id</label>
						<div className="col-9">
							<input type="number" className="form-control" name="id" placeholder="id" defaultValue={history.id} readOnly/>
						</div>
					</div>
					<div className="form-group row my-1">
						<label for="parentId" className="col-2 col-form-label text-end">parent</label>
						<div className="col-9">
							<input type="number" className="form-control" name="parentId" placeholder="parentId" defaultValue={history.parentId}
								onChange = { function(e) { history.parentId = e.target.value; }} />
						</div>
					</div>
					
					<div class="form-group row my-1">
						<label for="start-text" className="col-2 col-form-label text-end">start</label>
						<div className="col-5">
							<input type="text" className="form-control" name="start-text" placeholder="start-text" defaultValue={start} onChange={onChangeStart} />
						</div>
						<div className="col-4">
							<input type="text" className="form-control" name="start" placeholder="start" readOnly />
						</div>
					</div>
					<div class="form-group row my-1">
						<label for="end-text" className="col-2 col-form-label text-end">end</label>
						<div className="col-5">
							<input type="text" className="form-control" name="end-text" placeholder="end-text" defaultValue={end} onChange={onChangeEnd} />
						</div>
						<div className="col-4">
							<input type="text" className="form-control" name="end" placeholder="end" readOnly />
						</div>
					</div>

					<div className="form-group row my-1">
						<label for="title" className="col-2 col-form-label text-end">title</label>
						<div className="col-9">
							<input type="text" className="form-control" name="title" placeholder="title" defaultValue={history.title}
								onChange = { function(e) { history.title = e.target.value; }} />
						</div>
					</div>
					<div className="form-group row my-1">
						<label for="description" className="col-2 col-form-label text-end">description</label>
						<div className="col-4">
							<textarea rows="8"
								className="form-control"
								name="description-text"
								placeholder="description"
								defaultValue={history.description}
								onPaste={onPasteDescription}
								onChange={onChangeDecriptionText}
							></textarea>
						</div>
						<div className="col-5">
							<textarea rows="8"
								className="form-control"
								name="description"
								placeholder="description"
								defaultValue={history.description}
								readOnly
							></textarea>
						</div>
					</div>
					<div className="form-group row m-1">
						<label for="html-description" className="col-2 col-form-label text-end">html</label>
						<div className="col-9 overflow-auto p-1 border" id="html-description"
								style={{ height: '12rem' }} dangerouslySetInnerHTML={{ __html: history.description }}></div>
					</div>
					<div className="form-group row my-1">
						<label for="create" className="col-2 col-form-label text-end">created</label>
						<div className="col-9">
							<input type="datetime" className="form-control" name="created" placeholder="created" defaultValue={history.created} readOnly/>
						</div>
					</div>
					<div className="form-group row my-1">
						<label for="update" className="col-2 col-form-label text-end">updated</label>
						<div className="col-9">
							<input type="datetime" className="form-control" name="updated" placeholder="updated" defaultValue={history.updated} readOnly/>
						</div>
					</div>
				</form>
			</Modal.Body>
			<Modal.Footer>
				<Button variant="primary" onClick={onUpdate}>Update</Button>
				<Button variant="secondary" onClick={onClickButtonClose}>Close</Button>
				<Button variant="secondary" onClick={onDelete}>Delete</Button>
			</Modal.Footer>
		</Modal>
	);

}
