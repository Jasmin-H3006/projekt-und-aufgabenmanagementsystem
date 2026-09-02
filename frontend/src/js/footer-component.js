import React from "react";
import {Box, Typography} from "@mui/material";

export function FooterComponent() {
    return React.createElement (
        Box,
        {key: 'footer-bar', component: "footer", className: 'footer-bar mt-3'},
        // Developer
        React.createElement(Typography,{key: 'developer', className: 'developer'}, '© 2026 Developed by Jasmin Hausfeld')
    );
}