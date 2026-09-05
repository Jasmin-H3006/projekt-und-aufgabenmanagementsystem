import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom/client';
import {
    Button,
    Toolbar,
    IconButton
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {requireLogin} from "../../js/session-handling.js";
import {BackButton} from "../../js/back-button.js";
import {pageBuilder} from "../../js/page-builder.js";

function Page() {
    const [username, setUsername] = useState("");
    const [user, setUser] = useState("");
    useEffect(() => {
        requireLogin(setUsername, false, false, false, false, false, true)
            .then(setUser);
    }, []);

    const backLink = '../home/home.html';

    return pageBuilder(user, [React.createElement(BackButton, {pageLink: backLink}), React.createElement(CustomerOverview)])
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

    const customerCardsIntroduction = (
        React.createElement(
            Toolbar,
            {key: 'customers-introduction', className: 'introduction-with-btn pl-0 pt-3'},
            [
                React.createElement('h3', {key: 'introduction-header', className: 'pl-2'}, "Kunden"),
                React.createElement(Button, {key: 'btn-new-customer', className: 'btn-new-customer', color: 'primary', variant: 'contained', href: '../create-edit-customer/create-edit-customer.html'}, "Neuen Kunden anlegen")
            ]
        )
    );

    const customerCards =
        // Kunden-Container
        React.createElement(
            'div', {key: 'customers-container', className: 'cards-container pl-1 pr-1 pl-md-up-5 pr-md-up-5'},
            // Einzelnen Kunden-Container
            customers.length > 0 ? customers.map (customer =>
                React.createElement(
                    'div', {key: 'customer-container-' + customer.id, className: 'card-container'},
                    React.createElement(
                        'div', {key: 'customer-title-container', className: 'card-title-container'}, [
                            React.createElement('h3', {key: 'customer-name', className: 'card-with-two-buttons'}, customer.name),
                            React.createElement(
                                'div',
                                { key: 'edit-customer', className: 'edit-card-element view-card-element'},
                                React.createElement(
                                    IconButton,
                                    { key: 'view-customer-icon-btn', className: 'card-element-icon-btn mr-0-5', onClick: () => viewCustomerContactPersons(customer.id) },
                                    React.createElement(VisibilityIcon, { fontSize: "small" })
                                ),
                                React.createElement(
                                    IconButton,
                                    { key: 'edit-customer-icon-btn', className: 'card-element-icon-btn', onClick: () => editCustomer(customer.id) },
                                    React.createElement(EditIcon, { fontSize: "small" })
                                )
                            )
                        ]
                    ),
                    React.createElement('p', {key: 'customer-website'}, customer.website ? `Website: ${customer.website}` : `Website: -`)
                )
            ) : React.createElement("p", {key: 'hint-no-customers', className: 'pl-2'}, "Aktuell sind keine Kunden vorhanden.")
        );

    return [customerCardsIntroduction, customerCards];
}

// Komponente in den DOM rendern
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(React.createElement(Page));