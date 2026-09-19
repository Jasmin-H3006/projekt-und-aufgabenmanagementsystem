import {React, theme, ThemeProvider} from "../imports/create-edit-forms-imports.js";
import {Box} from "@mui/material";
import {MenuComponent} from "./menu-component.js";
import {FooterComponent} from "./footer-component.js";

export function pageBuilder(user, pageComponents) {
    return React.createElement(
        ThemeProvider, { key: 'theme-provider', theme },
        React.createElement(
            Box, {key: 'page-container', className: 'page-container'},
            [
                // Menu
                React.createElement(MenuComponent, { key: 'menu', user }),
                // Page content
                React.createElement(Box,
                    {key: 'page-content', component: 'main', className: 'page-content'},
                    // Individual page content
                    pageComponents
                ),
                // Footer
                React.createElement(FooterComponent, { key: 'footer' })
            ]
        )
    );
}