import React from "react";
import ReactDOM from 'react-dom/client';
import {Toolbar} from "@mui/material";
import {ThemeProvider} from "@mui/material/styles";
import theme from "../../css/theme-provider.js";
import {ButtonsCreatePages} from "../../js/buttons-create-pages.js";

function Intro() {
    return React.createElement(
        Toolbar,
        null,
        [
            React.createElement('h3', null, "Projekt anlegen/bearbeiten")
        ]
    )
}

function CreateEditProject() {
    return React.createElement(
        Toolbar,
        null,
        [
            React.createElement('h3', null, "Meine Projekte")
        ]
    )
}


// Komponente in den DOM rendern
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);

// Komponenten als Funktion aufrufen
root.render(
    React.createElement(
        ThemeProvider,
        { theme: theme },
        React.createElement(Intro),
        React.createElement(CreateEditProject),
        React.createElement(ButtonsCreatePages)
    )
);