import {React, theme, ThemeProvider} from "../imports/create-edit-forms-imports.js";
import {Box} from "@mui/material";
import {MenuComponent} from "./menu-component.js";
import {FooterComponent} from "./footer-component.js";

export function pageBuilder(user, pageComponents) {
    return React.createElement(
        ThemeProvider, { theme },
        React.createElement(
            Box, {className: 'page-container'},
            [
                // Menu
                React.createElement(MenuComponent, { user }),
                // Page content
                React.createElement(Box,
                    {key: 'content', component: 'main', className: 'page-content'},
                    // Individual page content
                    pageComponents
                ),
                // Footer
                React.createElement(FooterComponent)
            ]
        )
    );
}