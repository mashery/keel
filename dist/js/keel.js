/*! keel v1.0.0 | (c) 2021 TIBCO | MIT License | http://github.com/mashery/keel */
var keel = (function (exports) {
	'use strict';

	/**
	 * Emit a custom event
	 * @param  {String} type   The event type
	 * @param  {Object} detail Any details to pass along with the event
	 * @param  {Node}   elem   The element to attach the event to
	 */
	function emit (type, detail = {}, elem = document) {

		// Make sure there's an event type
		if (!type) return;

		// Create a new event
		let event = new CustomEvent(type, {
			bubbles: true,
			cancelable: true,
			detail: detail
		});

		// Dispatch the event
		return elem.dispatchEvent(event);

	}

	/**
	 * Warn a message into the console
	 * @param  {String} msg The message to warn
	 */
	function warn (msg) {
		console.warn(msg);
	}

	/**
	 * Wrap one or more elements in a div
	 * @param  {...Nodes} elems The elements to wrap
	 * @return {Node}           The wrapper element
	 */
	function wrap (...elems) {
		if (!elems.length) return;
		let wrapper = document.createElement('div');
		elems[0].before(wrapper);
		wrapper.append(...elems);
		return wrapper;
	}

	/**
	 * Remove default Mashery styles from the UI
	 */
	function removeCSS () {
		let styles = document.querySelectorAll('[href$="/Mashery-base.css"],[href$="/mashery-blue.css"],[href$="/print-default.css"],[href$="/styles/IE6.css"],[href$="/styles/IE7.css"],[href$="/styles/IE8.css"],[href$="/Iodocs/style.css"]');
		for (let style of styles) {
			style.remove();
		}
	}

	/**
	 * Get the language class for the code snippet
	 * @param  {String} className The current className
	 * @return {String}           The correct language class
	 */
	function getLang (className) {
		let langData = /brush: (.*?);/.exec(className);
		let lang = !langData || !Array.isArray(langData) || langData.length < 2 ? null : langData[1];
		if (!lang) return;
		let langClass = '';
		if ( lang === 'bash' ) { langClass = 'lang-bash'; }
		else if ( lang === 'csharp' ) { langClass = 'lang-clike'; }
		else if ( lang === 'cpp' ) { langClass = 'lang-clike'; }
		else if ( lang === 'css' ) { langClass = 'lang-css'; }
		else if ( lang === 'java' ) { langClass = 'lang-java'; }
		else if ( lang === 'jscript' ) { langClass = 'lang-javascript'; }
		else if ( lang === 'php' ) { langClass = 'lang-php'; }
		else if ( lang === 'python' ) { langClass = 'lang-python'; }
		else if ( lang === 'ruby' ) { langClass = 'lang-ruby'; }
		else if ( lang === 'xml' ) { langClass = 'lang-markup'; }
		return langClass;
	}

	/**
	 * Prep code snippets with proper syntax
	 */
	function prepCodeSnippets () {

		// Remove default syntax highlighter
		SyntaxHighlighter = {};
		SyntaxHighlighter.all = function () {};

		// Add lang class to code snippets
		let pre = document.querySelectorAll('pre');
		for (let code of pre) {
			code.className = getLang(code.className);
		}

	}

	/**
	 * Remove expand/collapse toggles from IO-Docs page
	 */
	function cleanIODocs () {
		let controls = document.querySelector('.page-ioDocs #controls');
		if (!controls) return;
		controls.remove();
	}

	/**
	 * Sanitize a string for use as a class
	 * Regex pattern: http://stackoverflow.com/a/9635698/1293256
	 * @param {String} id      The string to convert into a class
	 * @param {String} prefix  A prefix to use before the class [optionals]
	 */
	function sanitizeClass (id, prefix) {
		if (!id) return '';
		prefix = prefix ? prefix + '-' : '';
		return prefix + id.toLowerCase().replace(/^[^a-z]+|[^\w:.-]+/g, '-').replace('read-', '').replace('home-', 'home').replace('-home', '');
	}

	/**
	 * Check if the user is logged in or not
	 * @return {Boolean} If true, user is logged in
	 */
	function isLoggedIn () {
		return mashery_info && mashery_info.username;
	}

	/**
	 * Add class hooks for styling to the DOM, and a global JS variable for conditional functions
	 * @private
	 */
	function addClassHooks () {

		// Remove "/page" from pathname
		let path = window.location.pathname.toLowerCase();
		if (path.slice(0, 5) === '/page') {
			path = path.slice(5);
			if (path.slice(0, 2) === '//') {
				path = path.slice(1);
			}
		}

		// Get the current pathname (or 'home' if one doesn't exist)
		path = ['', '/', '/home'].indexOf(path) === -1 ? path.slice(1) : 'home';

		// Add a class hook for the content type and current page
		document.documentElement.classList.add(sanitizeClass(path, 'page'));
		document.documentElement.classList.add(isLoggedIn() ? 'is-logged-in' : 'is-logged-out');

	}

	/**
	 * Fix the search button
	 * @param  {Node} search The search form
	 */
	function fixSearch (search) {
		if (!search) return;
		let submit = search.querySelector('[type="submit"]');
		let btn = document.createElement('button');
		btn.className = 'btn-nav-search';
		btn.setAttribute('aria-label', 'Search');
		btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 32 32" aria-hidden="true"><path fill="currentColor" d="M31.008 27.231l-7.58-6.447c-.784-.705-1.622-1.029-2.299-.998a11.954 11.954 0 0 0 2.87-7.787c0-6.627-5.373-12-12-12s-12 5.373-12 12 5.373 12 12 12c2.972 0 5.691-1.081 7.787-2.87-.031.677.293 1.515.998 2.299l6.447 7.58c1.104 1.226 2.907 1.33 4.007.23s.997-2.903-.23-4.007zM12 20a8 8 0 1 1 0-16 8 8 0 0 1 0 16z"></path></svg>';
		submit.replaceWith(btn);
	}

	/**
	 * Replace on-page search with clone of header search
	 * @param  {Node} search The header search form
	 */
	function replaceSearch (search) {
		if (!search) return;
		let current = document.querySelector('.search-form');
		if (!current) {
			search.remove();
			return;
		}
		fixSearch(search);
		current.replaceWith(search);
	}

	/**
	 * Remove junk elements from the DOM
	 */
	function removeJunk () {
		let junk = document.querySelectorAll('#user-nav .status, #user-menu');
		for (let elem of junk) {
			elem.remove();
		}
	}

	/**
	 * Add proper link to the logo
	 * @param  {Node} brand The logo container
	 */
	function fixLogo (brand) {
		let matches = brand.onclick.toString().match(/"(.*?)"/);
		let link = document.createElement('a');
		link.href = matches ? matches[1] : '/';
		link.textContent = brand.innerText.trim();
		brand.replaceWith(link);
		return link;
	}

	/**
	 * Add a conditional class if sidebar content is present
	 */
	function addSidebarClass () {
		let sidebar = document.querySelector('#sub');
		let className = !sidebar || !sidebar.innerText.length ? 'has-no-sidebar' : 'has-sidebar';
		document.documentElement.classList.add(className);
	}

	/**
	 * Store the DOM elements
	 */
	function setDOM (dom, _dom) {

		// Public nodes
		Object.assign(dom, {
			logo: document.querySelector('#branding-logo'),
			navUser: document.querySelector('#user-nav'),
			navMain: document.querySelector('#local'),
			navSecondary: document.querySelector('#footer > ul'),
			navDocs: document.querySelector('#sub'),
			info: document.querySelector('#siteinfo')
		});

		// Private nodes
		Object.assign(_dom, {
			content: document.querySelector('#content') || document.querySelector('#main'),
			footer: document.querySelector('#footer'),
			search: document.querySelector('#header #search')
		});

		// Fix dom elements
		dom.logo = fixLogo(dom.logo);
		replaceSearch(_dom.search);
		removeJunk();
		addSidebarClass();

		// Add classes and IDs
		if (dom.logo) { dom.logo.classList.add('nav-logo'); }
		if (dom.navUser) {
			dom.navUser.id = 'nav-user-wrapper';
			dom.navUser.className = 'nav-user-wrapper';
			dom.navUser.firstElementChild.classList.add('nav-user-list');
			let userWrap = wrap(dom.navUser.firstElementChild);
			userWrap.className = 'nav-user';
		}
		if (dom.navMain ) {
			dom.navMain.id = 'nav-main-wrapper';
			dom.navMain.className = 'nav-main-wrapper';
			dom.navMain.firstElementChild.classList.add('nav-main-list');
			let mainWrap = wrap(dom.navMain.firstElementChild);
			mainWrap.className = 'nav-main';
		}
		if (dom.navSecondary) {
			dom.navSecondary.classList.add('nav-secondary-list');
			let secondaryWrap = wrap(dom.navSecondary);
			secondaryWrap.className = 'nav-secondary';
		}
		if (_dom.search) {
			_dom.search.classList.add('form-search');
			_dom.search.id = 'form-search';
		}

	}

	/**
	 * Add wrapper to the header
	 */
	function addHeaderWrapper (_dom) {
		let wrapper = document.createElement('div');
		wrapper.className = 'header-wrapper';
		let nav = document.createElement('nav');
		nav.className = 'header-nav';
		wrapper.append(nav);
		_dom.content.before(wrapper);
		_dom.header = nav;
	}

	/**
	 * Inject a skip-nav link into the DOM
	 * @param {Object} _dom The DOM elements
	 */
	function addSkipNav (_dom) {
		let skip = document.createElement('a');
		skip.className = 'screen-reader screen-reader-focusable';
		skip.href = '#content';
		skip.textContent = 'Skip to main content';
		_dom.content.setAttribute('tabindex', -1);
		document.body.prepend(skip);
	}

	/**
	 * Add wrapper to the footer
	 */
	function addFooterWrapper (_dom) {
		let wrap = document.createElement('div');
		wrap.className = 'footer-wrapper';
		_dom.footer.before(wrap);
		wrap.append(_dom.footer);
	}

	var $ = /*#__PURE__*/Object.freeze({
		__proto__: null,
		wrap: wrap,
		removeCSS: removeCSS,
		addClassHooks: addClassHooks,
		prepCodeSnippets: prepCodeSnippets,
		cleanIODocs: cleanIODocs,
		setDOM: setDOM,
		addHeaderWrapper: addHeaderWrapper,
		addFooterWrapper: addFooterWrapper,
		addSkipNav: addSkipNav
	});

	let {wrap: wrap$1} = $;


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
			return warn('No function provided');
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
		setDOM(dom, _dom);
		addHeaderWrapper(_dom);
		addFooterWrapper(_dom);
		addSkipNav(_dom);
		prepCodeSnippets();
		cleanIODocs();
		isReady = true;
		emit('keel:ready');

	}

	/**
	 * Set the template
	 * @param {String} type  The template type
	 * @param {Array}  order The template order
	 */
	function template (type, order) {

		// Make sure order is a valid array
		if (!Array.isArray(order)) {
			return warn('Provide a comma-separated list of items.');
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
			return warn('Logo source must be a string.');
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
	removeCSS();
	addClassHooks();
	init();

	exports.footer = footer;
	exports.getDOM = getDOM;
	exports.getUsername = getUsername;
	exports.header = header;
	exports.logo = logo;
	exports.ready = ready;
	exports.wrap = wrap$1;

	return exports;

}({}));
