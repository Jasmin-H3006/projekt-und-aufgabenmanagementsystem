import React from 'react';
import ReactDOM from 'react-dom/client';

// Eine einfache Beispiel-Komponente
function App() {
    return <h1>Hallo Welt!</h1>;
}

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    React.createElement(React.Fragment, null,
        React.createElement(App)
    )
);