import React from "react";
import {Button, Toolbar} from "@mui/material";

export function ButtonsCreatePages() {
    return (
        React.createElement(
            Toolbar,
            null,
            [
                React.createElement(
                    Button,
                    {color: 'secondary', variant: 'outlined'},
                    'Abbrechen & zurück'
                ),
                React.createElement(
                    Button,
                    {color: 'success', variant: 'outlined'},
                    'Speichern & zurück'
                ),
                React.createElement(
                    Button,
                    {color: 'warning', variant: 'outlined'},
                    'Löschen & zurück'
                ),
            ]
        )
    )
}