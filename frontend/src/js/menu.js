import React from "react";
import {AppBar, Button, Typography, Toolbar} from "@mui/material";

export function Menu() {

    const appBarContent = React.createElement(
        Toolbar,
        null,
        [
            // Admin-Bereich Button
            React.createElement(
                Button,
                {className: 'menu-btn', size: 'large', color: 'secondary', variant: 'contained'},
                'Zum Admin-Bereich'
            ),
            // Brand
            React.createElement(
                Typography,
                {variant: 'h1', className: 'menu-title'},
                'Mane'
            ),
            // Log-out Button
            React.createElement(
                Button,
                {className: 'menu-btn', size: 'medium', color: 'secondary', variant: 'contained'},
                'Log-out'
            ),
            // Benutzername
            React.createElement(
                Typography,
                {className: 'menu-user', variant: 'h6', color: 'text'},
                '{Benutzername}'
            ),
        ]
    );

    return (React.createElement(
        AppBar,
        {position: 'static'},
        appBarContent
    ));
}