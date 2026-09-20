import React from "react";
import {AppBar, Typography} from "@mui/material";

export function MenuComponentLogin() {
    return React.createElement(
        AppBar, {
            key: 'menu-bar-login',
            position: 'static',
            className: 'menu-bar menu-bar-login'
        },
        React.createElement(Typography, {key: 'brand', variant: 'h1', className: 'menu-title'}, 'Mane')
    );
}