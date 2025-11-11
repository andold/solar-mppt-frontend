import React, { Component, useState, useEffect, useRef, useContext } from 'react';
import { Fab, Action } from 'react-tiny-fab';
import axios from 'axios';

import { One, calculateSize } from './One.js';
import { OneContext, initializeOneContext } from './OneContext.js';
import { CreateModal } from './CreateModal.js';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-tiny-fab/dist/styles.css';
import logo from '../logo.svg';
import '../App.css';

export function BigHistory() {
	const context = useContext(OneContext);
	const rendered = useRef(0);
	const [history, setHistory] = useState(null);
	const [modalShow, setModalShow] = useState(false);
	const [fontSize, setFontSize] = useState(12);
 
	function rerender() {
		setModalShow(false);
	}
	function onChangeSize() {
		rerender();
	}

    useEffect(() => {
		axios.get('./api/big-history/0?expandChildren=true')
	        .then(response => setHistory(response.data))
			.catch(error => console.log(error))
	}, []);

	if (!history) {
		return (
			<AppDefault />
		);
	}
	
	rendered.current++;

    context.font.size = fontSize;
	initializeOneContext(context, history);
	let rect = calculateSize(history, context);
	const rectangle = {...rect, position: {
		x: 0,
		y: 0,
	}};
	context.map.set(history, rectangle);

	return (
		<div className='position-static'>
			<div className='position-absolute m-0 p-0'>
				<One
					history={history}
					rectangle={rectangle}
					onChangeSize={onChangeSize}
				/>
			</div>

			<CreateModal
				show={modalShow}
				onClickButtonClose={() => setModalShow(false)}
				onCreated={rerender}
			/>

			<Fab icon="III" alwaysShowTitle={true}>
				<Action text="Create"
					onClick={() => setModalShow(true)}
				/>
				<Action text="Increase Font Size"
					onClick={() => setFontSize(context.font.size + 1)}
				/>
				<Action text="Decrease Font Size"
					onClick={() => setFontSize(context.font.size - 1)}
				/>
			</Fab>
		</div>
	);
}

class AppDefault extends Component {
	render() {
		return (
			<div className='App'>
				<header className='App-header'>
				<img src={logo} className='App-logo' alt='logo'/>
				<p>
					Edit <code>src/App.js</code> and save to reload.
				</p>
				<a
					className='App-link'
					href='https://reactjs.org'
					target='_blank'
					rel='noopener noreferrer'
				>
					Learn React
				</a>
				</header>
			</div>
		);
	}
}
