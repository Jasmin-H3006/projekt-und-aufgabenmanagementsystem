import React from "react";
import {TableCell, TableHead, TableRow} from "@mui/material";

export function ProjectsTableHeader() {
    return (
        React.createElement(
            TableHead,
            {key: 'projects-table-head', className: 'projects-table-head pl-2'},
            [
                React.createElement(
                    TableRow,
                    {key: 'projects-table-columns'},
                    [
                        React.createElement(TableCell, {key: 'projects-id'}, 'ID'),
                        React.createElement(TableCell, {key: 'projects-name'}, 'Projektname'),
                        React.createElement(TableCell, {key: 'projects-customer'}, 'Kunde'),
                        React.createElement(TableCell, {key: 'projects-progress'}, 'Fortschritt'),
                        React.createElement(TableCell, {key: 'projects-manager'}, 'Projektleiter'),
                        React.createElement(TableCell, {key: 'projects-user'}, 'Beteiligte Mitarbeiter'),
                        React.createElement(TableCell, {key: 'projects-deadline'}, 'Frist zur Fertigstellung'),
                        React.createElement(TableCell, {key: 'projects-show'}, 'Projekt ansehen'),
                        React.createElement(TableCell, {key: 'projects-edit'}, "Projekt bearbeiten")
                    ]
                ),
            ]
        )
    )
}