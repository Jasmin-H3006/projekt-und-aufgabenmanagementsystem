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
import VisibilityIcon from '@mui/icons-material/Visibility';
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

    const backLink = '../home/home.html';

    return React.createElement(
        ThemeProvider,
        { theme },
        React.createElement(MenuComponent, { user }),
        React.createElement(BackButton,{ pageLink: backLink }),
        React.createElement(CustomerOverview)
    );
}

function CustomerOverview() {
    const [customers, setCustomers] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8080/api/customers/get-all")
            .then(res => res.json())
            .then(customers => setCustomers(customers));
    }, []);

    const editCustomer = (customerId) => {
        window.location.href='../create-edit-customer/create-edit-customer.html?id=' + customerId
    };

    const viewCustomerContactPersons = (customerId) => {
        window.location.href='../customer-contact-persons/customer-contact-persons.html?customerId=' + customerId
    }

    const tableIntroduction = (
        React.createElement(
            Toolbar,
            {key: 'customers-introduction', className: 'table-introduction pl-0 pt-3'},
            [
                React.createElement('h3', {key: 'introduction-header', className: 'pl-2'}, "Kunden"),
                React.createElement(Button, {key: 'btn-new-customer', className: 'btn-new-customer', color: 'primary', variant: 'contained', href: '../create-edit-customer/create-edit-customer.html'}, "Neuen Kunden anlegen")
            ]
        )
    );

    const table = (
        customers.length > 0 ? React.createElement(
            Table,
            {key: 'customer-table-container', className: 'table-container customer-table-container', size: 'small'},
            [
                React.createElement(
                    TableHead,
                    {key: 'customer-table-head', className: 'customer-table-head pl-2'},
                    [
                        React.createElement(
                            TableRow,
                            {key: 'customer-table-columns'},
                            [
                                React.createElement(TableCell, {key: 'customers-name'}, 'Kunde'),
                                React.createElement(TableCell, {key: 'customers-website'}, 'Website'),
                                React.createElement(TableCell, {key: 'customers-number-of-contact-persons'}, 'Anzahl Ansprechpartner'),
                                React.createElement(TableCell, {key: 'customers-number-of-active-projects'}, 'Anzahl aktiver Projekte'),
                                React.createElement(TableCell, {key: 'customers-edit'}, "Kunde bearbeiten"),
                                React.createElement(TableCell, {key: 'customers-contact-persons-view'}, "Ansprechpartner einsehen"),
                            ]
                        ),
                    ]
                ),
                React.createElement(
                    TableBody,
                    {key: 'customer-table-body'},
                    customers.map(customer =>
                        React.createElement(
                            TableRow,
                            { key: customer.id },
                            React.createElement(TableCell, {key: 'customer-name'}, customer.name),
                            React.createElement(TableCell, {key: 'customer-website'}, customer.website === "" ? "-" : customer.website),
                            React.createElement(
                                TableCell,
                                { key: "customer-edit" },
                                [
                                    React.createElement(
                                        IconButton,
                                        { key: "edit-customer-icon-btn", onClick: () => editCustomer(customer.id) },
                                        React.createElement(EditIcon, { fontSize: "small" })
                                    ),
                                    null,
                                ]
                            ),
                            React.createElement(
                                TableCell,
                                { key: "customer-contact-persons-view" },
                                [
                                    React.createElement(
                                        IconButton,
                                        { key: "view-customer-contact-persons", onClick: () => viewCustomerContactPersons(customer.id) },
                                        React.createElement(VisibilityIcon, { fontSize: "small" })
                                    ),
                                    null,
                                ]
                            )
                        )
                    )
                ),
            ]
        ) : React.createElement("p", {key: 'hint-no-customers', className: 'pl-2'}, "Aktuell sind keine Kunden vorhanden.")
    );

    return [tableIntroduction, table];
}

// Komponente in den DOM rendern
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(React.createElement(Page));