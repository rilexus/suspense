import React, {StrictMode} from 'react';
import ReactDOM from 'react-dom';
import App from './App';



window.onload = () => {
    const rootElement = document.getElementById('app')
    ReactDOM.render(
        <StrictMode>
            <App />
        </StrictMode>, rootElement)
}



