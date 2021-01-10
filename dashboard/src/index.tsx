import React from 'react';
import ReactDOM from 'react-dom';

// import * as serviceWorkerRegistration from './utils/serviceWorkerRegistration';

import App from './components/App';

ReactDOM.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
	document.getElementById('root')
);

// serviceWorkerRegistration.unregister();
