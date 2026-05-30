import React from "react";
import {Button, Toolbar} from "@mui/material";

export function FormButtons({onSave, onDelete}) {
    const handleCancel = () => {
        window.history.back()
    };

    return (
        React.createElement(
            Toolbar,
            {key: 'form-buttons', className: 'full-width form-buttons'},
            [
                React.createElement(
                    Button,
                    {key: 'cancel', color: 'primary', variant: 'outlined', onClick: handleCancel},
                    'Abbrechen & zurück'
                ),
                React.createElement(
                    Button,
                    {key: 'save', type: 'submit', color: 'primary', variant: 'contained', onSubmit: onSave},
                    'Speichern & zurück'
                ),
                React.createElement(
                    Button,
                    {key: 'delete', type: 'submit', color: 'warning', variant: 'outlined', onSubmit: onDelete},
                    'Löschen & zurück'
                ),
            ]
        )
    )
}