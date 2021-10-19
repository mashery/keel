/**
 * Get the URL parameters
 * @param  {String} url The URL
 * @return {Object}     The URL parameters
 */
function getParams (url = window.location) {
	let params = {};
	new URL(url).searchParams.forEach(function (val, key) {
		if (params[key] !== undefined) {
			if (!Array.isArray(params[key])) {
				params[key] = [params[key]];
			}
			params[key].push(val);
		} else {
			params[key] = val;
		}
	});
	return params;
}

function getThemeJS (theme) {

	// Use default theme by default
	if (!theme) {
		theme = 'default';
	}

	if (theme === 'default') {
return `// Default Layout
keel.header('navUser', 'logo', 'navMain');
keel.ready(function () {
let dom = keel.getDOM();
let wrap = keel.wrap(dom.logo, dom.navMain);
wrap.className = 'logo-nav-wrapper';
});`;
	}

	if (theme === 'combo') {
return `// Combo Nav Layout
keel.header('logo', 'navMain', 'navUser');`;
	}

	if (theme === 'big') {
return `// Big Nav Layout
keel.header('logo', 'navUser', 'navMain');
keel.ready(function () {
let dom = keel.getDOM();
let wrap = keel.wrap(dom.logo, dom.navUser);
wrap.className = 'logo-nav-wrapper';
});`;
	}

	if (theme === 'simple') {
return `// Simple Layout - User, Logo, Main
keel.header('navUser', 'logo', 'navMain');`;
	}

}

function getLogoJS (logo) {
	if (logo) {
return `

// Logo
keel.logo('${logo}');`;
	}
	return '';
}

function getThemeCSS (settings = []) {

	// Hold CSS props
	let css = [];

	// Create CSS props
	for (let type of settings) {

		if (!type) continue;

		let props = type.split(',').map(function (prop) {
		    return prop.split(':');
		});

		for (let [prop, value] of props) {
			css.push(`    --${prop}: ${value};`);
		}
	}

	if (!css.length) return '';
	return `:root {
${css.join("\n")}
}`;

}

function getThemeStylesheet (theme) {
	return `https://cdn.jsdelivr.net/gh/mashery/keel@0/dist/css/${theme ? theme : 'default'}.css`;
}

function loadCSS (css) {
	let style = document.createElement('style');
	style.setAttribute('type', 'text/css');
	style.innerHTML = css;
	document.head.append(style);
}

function loadJS (js) {
	let fn = new Function (js);
	fn();
}

function loadTheme () {

	// Get values
	let params = JSON.parse(sessionStorage.getItem('themeDemo'));
	if (!params) {
		params = getParams();
		if (Object.keys(params).length) {
			sessionStorage.setItem('themeDemo', JSON.stringify(params));
		}
	}
	let css = getThemeCSS([params.colors, params.fonts, params.spacing]);
	let js = getThemeJS(params.theme) + getLogoJS(params.logo);

	// Get DOM elements
	let cssLink = document.querySelector('[href^="https://cdn.jsdelivr.net/gh/mashery/keel@0/dist/css/"]');

	// Inject all the things
	cssLink.href = getThemeStylesheet(params.theme);
	loadJS(js);
	loadCSS(css);

}

loadTheme();