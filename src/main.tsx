import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// import { ESService } from './preview/services/esbuild1';

import { Buffer } from 'buffer'

window.Buffer = Buffer;

(async () => {
	// const esService = new ESService();

	// esService.addFile('./main.tsx', `
	// 	import { App } from './App';
	// 	ReactDOM.render(<App />, document.getElementById('app'));
	// `);

	// esService.addFile('./App.tsx', `
	// 	import { Test } from './Test';
	// 	export const App = () => <div><Test/></div>;
	// `);

	// esService.addFile('./Test.tsx', `
	// 	export const Test = () => <div>Hello World</div>;
	// `);

	// await esService.build('./main.tsx');
})();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)