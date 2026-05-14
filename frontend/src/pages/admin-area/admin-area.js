import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom/client';
import {Button, Table, TableBody, TableRow, TableCell, Toolbar, Typography} from "@mui/material";
import {ThemeProvider} from "@mui/material/styles";
import {MenuComponent} from '../../js/menu-component.js';
import theme from "../../css/theme-provider.js";
import {ProjectsTableHeader} from "../../js/projects-table.js";
import {requireLogin} from "../../js/session-handling.js";

function Page() {
    const [username, setUsername] = useState("");
    useEffect(() => {
        requireLogin(setUsername);
    }, []);

    return React.createElement(
        ThemeProvider,
        { theme },
        React.createElement(MenuComponent),
    );
}

// Komponente in den DOM rendern
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(React.createElement(Page));