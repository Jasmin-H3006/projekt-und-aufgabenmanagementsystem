import React from 'react';
import ReactDOM from 'react-dom/client';
import Typography from '@mui/material/Typography';

function Home() {

    return React.createElement('h1', null, "Hallo Test")
}

function ProTip() {
    return React.createElement(
        Typography,
        null,
        'Test'
    );
}



// Komponente in den DOM rendern
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);

// Komponenten als Funktion aufrufen
root.render(
    React.createElement(React.Fragment, null,
        React.createElement(Home),
        React.createElement(ProTip)
    )
);