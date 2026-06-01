import React from "react";
import {Button, Toolbar} from "@mui/material";

export function FormButtons({onCancel, onSave, onDelete, createNewElement}) {
    return (
        React.createElement(
            Toolbar,
            {key: 'form-buttons', className: 'full-width form-buttons'},
            [
                React.createElement(
                    Button,
                    {key: 'cancel', type: 'button', color: 'primary', variant: 'outlined', onClick: onCancel},
                    'Abbrechen & zurück'
                ),
                React.createElement(
                    Button,
                    {key: 'save', type: 'button', color: 'primary', variant: 'contained', onClick: onSave},
                    'Speichern & zurück'
                ),
                !createNewElement ? React.createElement(
                    Button,
                    {key: 'delete', type: 'button', color: 'warning', variant: 'outlined', onClick: onDelete},
                    'Löschen & zurück'
                ) : null,
            ]
        )
    )
}