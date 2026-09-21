import {React, theme, ThemeProvider} from "../imports/create-edit-forms-imports.js";
import {Box} from "@mui/material";
import {MenuComponent} from "./menu-component.js";
import {FooterComponent} from "./footer-component.js";
import ReactDOM from "react-dom/client";
import {MenuComponentLogin} from "./menu-component-login.js";


export function pageBuilder(user, pageComponents, loggedInPage = true) {
    return React.createElement(ThemeProvider, { key: 'theme-provider', theme },
        React.createElement(Box, {key: 'page-container', className: 'page-container'}, [
            // Menu
            loggedInPage ? React.createElement(MenuComponent, { key: 'menu', user }) : React.createElement(MenuComponentLogin, {key: "menu-component-login"}),
            // Page content
            React.createElement(Box, {key: 'page-content', component: 'main', className: 'page-content'},
                pageComponents // Individual page content
            ),
            // Footer
            React.createElement(FooterComponent, { key: 'footer' })
        ])
    );
}

// Render components in DOM
export function renderInDOM(Page) {
    const container = document.getElementById('root');
    const root = ReactDOM.createRoot(container);

    return root.render(React.createElement(Page));
}