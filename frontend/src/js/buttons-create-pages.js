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
                    {key: 'cancel', color: 'secondary', variant: 'outlined'},
                    'Abbrechen & zurück'
                ),
                React.createElement(
                    Button,
                    {key: 'save', color: 'success', variant: 'outlined'},
                    'Speichern & zurück'
                ),
                React.createElement(
                    Button,
                    {key: 'delete', color: 'warning', variant: 'outlined'},
                    'Löschen & zurück'
                ),
            ]
        )
    )
}