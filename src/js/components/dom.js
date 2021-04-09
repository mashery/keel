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
 * @param  {Node} headerSearch The header search form
 */
function replaceSearch (headerSearch) {
	let search = document.querySelector('.search-form');
	if (!search) return;
	let clone = headerSearch.cloneNode(true);
	clone.classList.add('main-search');
	clone.id = 'main-search';
	search.replaceWith(clone);
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
 * Store the DOM elements
 */
function setDOM (dom, _dom) {

	// Public nodes
	Object.assign(dom, {
		logo: document.querySelector('#branding-logo'),
		user: document.querySelector('#user ul'),
		navMain: document.querySelector('#local ul'),
		navSecondary: document.querySelector('#footer > ul'),
		navDocs: document.querySelector('#sub'),
		info: document.querySelector('#siteinfo'),
		search: document.querySelector('#header #search')
	});

	// Private nodes
	Object.assign(_dom, {
		content: document.querySelector('#content'),
		footer: document.querySelector('#footer')
	});

	// Fix dom elements
	dom.logo = fixLogo(dom.logo);
	fixSearch(dom.search);
	replaceSearch(dom.search);

	// Add classes
	if (dom.logo) { dom.logo.classList.add('nav-logo'); }
	if (dom.user) { dom.user.classList.add('nav-user'); }
	if (dom.navMain ) { dom.navMain.classList.add('nav-main'); }
	if (dom.search) {
		dom.search.classList.add('nav-search');
		dom.search.id = 'header-search';
	}
	if (dom.navSecondary) { dom.navSecondary.classList.add('nav-secondary'); }

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
 * Add wrapper to the footer
 */
function addFooterWrapper (_dom) {
	let wrap = document.createElement('div');
	wrap.className = 'footer-wrapper';
	_dom.footer.before(wrap);
	wrap.append(_dom.footer);
}

export {removeCSS, addClassHooks, prepCodeSnippets, setDOM, addHeaderWrapper, addFooterWrapper};