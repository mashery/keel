// Default Layout
keel.header('navUser', 'logo', 'navMain');
keel.ready(function () {
	let dom = keel.getDOM();
	let wrap = keel.wrap(dom.logo, dom.navMain);
	wrap.className = 'logo-nav-wrapper';
});


// Combo Nav Layout
keel.header('logo', 'navMain', 'navUser');


// Big Nav Layout
keel.header('logo', 'navUser', 'navMain');
keel.ready(function () {
	let dom = keel.getDOM();
	let wrap = keel.wrap(dom.logo, dom.navUser);
	wrap.className = 'logo-nav-wrapper';
});


// Simple Layout - Logo, User, Main
keel.header('logo', 'navUser', 'navMain');

// Simple Layout - Logo, Main, User
keel.header('logo', 'navMain', 'navUser');

// Simple Layout - User, Logo, Main
keel.header('navUser', 'logo', 'navMain');