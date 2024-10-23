import * as ReactDOM from 'react-dom/client';
import * as React from 'react';

export default function Run(scripts) {
	for (const script of scripts) {
		for (const instance of script.instances) {
			/* This is a convention in this project. */
			let elId = `${script.id}-${instance.id}`;
			let el = document.getElementById(elId);
			if (!el) {
				console.warn(`Element with id ${elId} not found`);
				continue;
			}
			const root = ReactDOM.createRoot(el);
			console.log('create', elId, 'with', instance.params);
			const reactEl = React.createElement(script.binding, instance.params);
			root.render(reactEl);
		}
	}
}
