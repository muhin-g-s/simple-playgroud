const _externals = {};

_externals['react'] = window.React;
_externals[`react-dom`] = window.ReactDOM;
_externals['react-router-dom'] = window.ReactRouterDOM;
_externals['styled-components'] = window.styled;

window['_externals'] = _externals;

window['resolver'] = (val) => window.parent.parent.postMessage(val, '*');

const listener = (e) => {
		if (e.key === 'script') {
				try {
						fetch(e.newValue)
								.then(response => response.text())
								.then(code => (eval(code), true))
								.catch(console.log);
				}
				catch { }
		}
}
listener({
		key: 'script', newValue: localStorage.getItem('script')
});

const updateNavigationText = () => window.top.postMessage(JSON.stringify(location));
updateNavigationText();

const pushState = history.pushState;
history.pushState = (...args) => {
		pushState.apply(history, args);
		updateNavigationText();
};

window.addEventListener('storage', listener);
window.addEventListener('popstate', updateNavigationText);


