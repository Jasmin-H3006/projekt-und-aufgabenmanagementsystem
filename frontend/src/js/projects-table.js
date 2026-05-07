import React from "react";
import {TableCell, TableHead, TableRow} from "@mui/material";

export function ProjectsTableHeader() {
    return (
        React.createElement(
            TableHead,
            {className: 'projects-table-head'},
            [
                React.createElement(
                    TableRow,
                    null,
                    [
                        React.createElement(TableCell, null, 'ID'),
                        React.createElement(TableCell, null, 'Projektname'),
                        React.createElement(TableCell, null, 'Kunde'),
                        React.createElement(TableCell, null, 'Fortschritt'),
                        React.createElement(TableCell, null, 'Projektleiter'),
                        React.createElement(TableCell, null, 'Beteiligte Mitarbeiter'),
                        React.createElement(TableCell, null, 'Frist zur Fertigstellung'),
                        React.createElement(TableCell, null, 'Status'),
                        React.createElement(TableCell, null, 'Projekt ansehen')
                    ]
                ),
            ]
        )
    )
}