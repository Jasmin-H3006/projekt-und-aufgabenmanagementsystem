import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom/client';
import {
    Button,
    Table,
    TableBody,
    TableRow,
    TableCell,
    Toolbar,
    TableHead,
    IconButton
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import {ThemeProvider} from "@mui/material/styles";
import {MenuComponent} from '../../js/menu-component.js';
import theme from "../../css/theme-provider.js";
import {requireLogin} from "../../js/session-handling.js";
import {BackButton} from "../../js/back-button.js";

function Page() {
    const [username, setUsername] = useState("");
    const [user, setUser] = useState("");
    useEffect(() => {
        requireLogin(setUsername, false, false, false, false, false, true)
            .then(setUser);
    }, []);

    const backLink = '../customer-page/customer-page.html'

    return React.createElement(
        ThemeProvider,
        { theme },
        React.createElement(MenuComponent, { user }),
        React.createElement(BackButton, { pageLink: backLink }),
        React.createElement(CustomerContactPersonsOverview)
    );
}

function CustomerContactPersonsOverview() {
    const [contactPersons, setContactPersons] = useState([]);
    const [name, setName] = useState("");

    const urlParams = new URLSearchParams(window.location.search);
    const customerIdInUrl = urlParams.get("customerId");

    useEffect(() => {
        fetch(`http://localhost:8080/api/customer/contact-persons/customer/${customerIdInUrl}`)
            .then(res => res.json())
            .then(contactPersons => setContactPersons(contactPersons));

        if (!customerIdInUrl) return;

        fetch(`http://localhost:8080/api/customers/${customerIdInUrl}`)
            .then(r => r.json())
            .then(customer => setName(customer.name));
    }, [customerIdInUrl]);

    const editContactPerson = (contactPersonId) => {
        window.location.href='../create-edit-contact-person/create-edit-contact-person.html?id=' + contactPersonId + '&customerId=' + customerIdInUrl
    };

    const tableIntroduction = (
        React.createElement(
            Toolbar,
            {key: 'contact-persons-introduction', className: 'introduction-with-btn pl-0 pt-3'},
            [
                React.createElement('h3', {key: 'introduction-header', className: 'pl-2'}, "Ansprechpartner des Kunden '" + name + "'"),
                React.createElement(Button, {key: 'btn-new-contact-person', className: 'btn-new-contact-person', color: 'primary', variant: 'contained', href: '../create-edit-contact-person/create-edit-contact-person.html?customerId=' + customerIdInUrl}, "Neuen Ansprechpartner anlegen")
            ]
        )
    );

    const table = (
        contactPersons.length > 0 ? React.createElement(
            Table,
            {key: 'contact-person-table-container', className: 'table-container contact-person-table-container', size: 'small'},
            [
                React.createElement(
                    TableHead,
                    {key: 'contact-person-table-head', className: 'contact-person-table-head pl-2'},
                    [
                        React.createElement(
                            TableRow,
                            {key: 'contact-person-table-columns'},
                            [
                                React.createElement(TableCell, {key: 'contact-persons-name'}, 'Ansprechpartner'),
                                React.createElement(TableCell, {key: 'contact-persons-email'}, 'E-Mail'),
                                React.createElement(TableCell, {key: 'contact-persons-tel'}, 'Telefonnummer'),
                                React.createElement(TableCell, {key: 'contact-persons-edit'}, "Ansprechpartner bearbeiten")
                            ]
                        ),
                    ]
                ),
                React.createElement(
                    TableBody,
                    {key: 'contact-person-table-body'},
                    contactPersons.map(contactPerson =>
                        React.createElement(
                            TableRow,
                            { key: contactPerson.id },
                            React.createElement(TableCell, {key: 'contact-person-name'}, contactPerson.name),
                            React.createElement(TableCell, {key: 'contact-person-email'}, contactPerson.email),
                            React.createElement(TableCell, {key: 'contact-person-tel'}, contactPerson.telefone === "" ? "-" : contactPerson.telefone),
                            React.createElement(
                                TableCell,
                                { key: "contact-person-edit" },
                                [
                                    React.createElement(
                                        IconButton,
                                        { key: "edit-contact-person-icon-btn", onClick: () => editContactPerson(contactPerson.id) },
                                        React.createElement(EditIcon, { fontSize: "small" })
                                    )
                                ]
                            )
                        )
                    )
                ),
            ]
        ) : React.createElement("p", {key: 'hint-no-contact-person', className: 'pl-2'}, "Aktuell sind keine Ansprechpartner für diesen Kunden vorhanden.")
    );

    return [tableIntroduction, table];
}

// Komponente in den DOM rendern
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(React.createElement(Page));