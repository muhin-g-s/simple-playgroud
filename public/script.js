// console.log('rrrr');

// const listener = (e) => {
//   const externals = JSON.parse(localStorage.getItem("externals") ?? "{}");
//   for (const lib in externals) {
//     if (!window[lib])
//       import(`https://cdn.jsdelivr.net/npm/${lib}@latest/+esm`)
//         .then((data) => {
//           console.log(lib, data);
// 					window[lib] = { ...data, __esModule: true };
//         }).catch(console.log);
//   }

//   if (e.key === "script") {
//     try {
//       fetch(e.newValue)
//         .then((response) => response.text())
//         .then(eval)
//         .catch(console.log);
//     } catch { }
//   }
// };
// listener({
//   key: "script",
//   newValue: localStorage.getItem("script"),
// });

// const updateNavigationText = () =>
//   window.top.postMessage(JSON.stringify(location));
// updateNavigationText();

// const pushState = history.pushState;
// history.pushState = (...args) => {
//   pushState.apply(history, args);
//   updateNavigationText();
// };

// window.addEventListener("storage", listener);
// window.addEventListener("popstate", updateNavigationText);


window['react'] = window.React;
window['react-dom'] = window.ReactDOM;
window['react-router-dom'] = window.ReactRouterDOM;
window['styled-components'] = window.styled;


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


