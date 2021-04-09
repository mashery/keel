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

// /**
//  * Remove default Mashery styles from the UI
//  */
// function removeCSS () {
// 	let styles = document.querySelectorAll('[href$="/Mashery-base.css"],[href$="/mashery-blue.css"],[href$="/print-default.css"]');
// 	for (let style of styles) {
// 		style.remove();
// 	}
// }

// /**
//  * Add wrapper to the header
//  */
// function addHeaderWrapper (_dom) {
// 	let wrapper = document.createElement('div');
// 	wrapper.className = 'header-wrapper';
// 	let nav = document.createElement('nav');
// 	nav.className = 'header-nav';
// 	wrapper.append(nav);
// 	_dom.content.before(wrapper);
// 	_dom.header = nav;
// }

// /**
//  * Add wrapper to the footer
//  */
// function addFooterWrapper (_dom) {
// 	let wrap = document.createElement('div');
// 	wrap.className = 'footer-wrapper';
// 	_dom.footer.before(wrap);
// 	wrap.append(_dom.footer);
// }

// export {emit, warn, removeCSS, addHeaderWrapper, addFooterWrapper};
export {emit, warn};