import * as _ from './components/utilities.js';
import * as $ from './components/dom.js';
let {wrap} = $;


/**
 * https://stagingcs17.mashery.com/
 */

// If true, the DOM is ready
let isReady = false;

// DOM elements
let dom = {};
let _dom = {};

/**
 * Run a callback function when Keel is ready
 */
function ready (fn) {

	// Make sure there's a valid function to run
	if (!fn || typeof fn !== 'function') {
		return _.warn('No function provided');
	}

	// If Keel is ready, run immediately
	if (isReady) {
		fn();
		return;
	}

	// Otherwise, run when Keel is ready
	document.addEventListener('keel:ready', fn, {once: true});

}

/**
 * Get a DOM element
 * @param  {String}  elem The DOM element to get
 * @return {Element}      The DOM element (or an object with all of them)
 */
function getDOM (elem) {
	if (elem) return dom[elem];
	return Object.assign({}, dom);
}

/**
 * Get the current user's username
 * @return {String} The username
 */
function getUsername () {
	if (!mashery_info || !mashery_info.username) return;
	return mashery_info.username;
}

/**
 * Check if the DOM is ready
 */
function init () {

	// If the document isn't ready yet, try again
	if (!document.body) {
		document.addEventListener('DOMContentLoaded', init, {once: true});
		return;
	}

	// Otherwise, initialize app
	$.setDOM(dom, _dom);
	$.addHeaderWrapper(_dom);
	$.addFooterWrapper(_dom);
	$.addSkipNav(_dom);
	$.prepCodeSnippets();
	$.cleanIODocs();
	isReady = true;
	_.emit('keel:ready');

}

/**
 * Set the template
 * @param {String} type  The template type
 * @param {Array}  order The template order
 */
function template (type, order) {

	// Make sure order is a valid array
	if (!Array.isArray(order)) {
		return _.warn('Provide a comma-separated list of items.');
	}

	// Update the UI
	ready(function () {
		for (let item of order) {
			if (!dom[item]) continue;
			_dom[type].append(dom[item]);
		}
	});

}

/**
 * Update the header template
 * @param {Array} order The template order
 */
function header (...order) {
	template('header', order);
}

/**
 * Update the footer template
 * @param {Array} order The template order
 */
function footer (...order) {
	template('footer', order);
}

/**
 * Add a custom logo
 * @param  {String} src     The logo src
 * @param  {Object} options Logo options (height, width, class, id)
 */
function logo (src, options = {}) {

	// Make sure a valid href is provided
	if (!src || typeof src !== 'string') {
		return _.warn('Logo source must be a string.');
	}

	// Create logo
	let img = document.createElement('img');
	img.src = src;
	if (options.height) { img.height = options.height || ''; }
	if (options.width) { img.width = options.width || ''; }
	if (options.class) { img.className = options.class || ''; }
	if (options.id) { img.id = options.id || ''; }

	// Inject logo
	ready(function () {
		dom.logo.innerHTML = '';
		dom.logo.append(img);
	});

}

// Initialize app
$.removeCSS();
$.addClassHooks();
init();

export {ready, header, footer, logo, wrap, getDOM, getUsername};