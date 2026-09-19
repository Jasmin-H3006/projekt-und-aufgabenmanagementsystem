import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom/client';
import { Button, Toolbar, IconButton } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
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

    const backLink = '../customer-page/customer-page.html'

    return pageBuilder(user, [React.createElement(BackButton, {key: 'back-button', pageLink: backLink}), React.createElement(CustomerContactPersonsOverview, {key: 'customer-contact-persons-overview'})])
}

function CustomerContactPersonsOverview() {
    const [contactPersons, setContactPersons] = useState([]);
    const [name, setName] = useState("");

    const urlParams = new URLSearchParams(window.location.search);
    const customerIdInUrl = urlParams.get("customerId");

    useEffect(() => {
        if (!customerIdInUrl) return;

        fetch(`http://localhost:8080/api/customer/contact-persons/customer/${customerIdInUrl}`)
            .then(res => res.json())
            .then(contactPersons => setContactPersons(contactPersons));

        fetch(`http://localhost:8080/api/customers/${customerIdInUrl}`)
            .then(r => r.json())
            .then(customer => setName(customer.name));
    }, [customerIdInUrl]);

    const editContactPerson = (contactPersonId) => {
        window.location.href='../create-edit-contact-person/create-edit-contact-person.html?id=' + contactPersonId + '&customerId=' + customerIdInUrl
    };

    const customerContactPersonCardsIntroduction = (
        React.createElement(
            Toolbar,
            {key: 'contact-persons-introduction', className: 'introduction-with-btn pl-0 pt-3'},
            [
                React.createElement('h3', {key: 'introduction-header', className: 'pl-2'}, "Ansprechpartner des Kunden '" + name + "'"),
                React.createElement(Button, {key: 'btn-new-contact-person', className: 'btn-new-contact-person', color: 'primary', variant: 'contained', href: '../create-edit-contact-person/create-edit-contact-person.html?customerId=' + customerIdInUrl}, "Neuen Ansprechpartner anlegen")
            ]
        )
    );

    const customerContactPersonCards =
        // Ansprechpartner-Container
        React.createElement(
            'div', {key: 'customer-contact-persons-container', className: 'cards-container pl-1 pr-1 pl-md-up-5 pr-md-up-5'},
            // Einzelnen Ansprechpartner-Container
            contactPersons.length > 0 ? contactPersons.map (contactPerson =>
                React.createElement(
                    'div', {key: 'customer-contact-person-container-' + contactPerson.id, className: 'card-container'},
                    React.createElement(
                        'div', {key: 'customer-contact-person-title-container', className: 'card-title-container'}, [
                            React.createElement('h3', {key: 'customer-contact-person-name'}, contactPerson.name),
                            React.createElement(
                                'div',
                                { key: 'edit-customer-contact-person', className: 'edit-card-element'},
                                React.createElement(
                                    IconButton,
                                    { key: 'edit-customer-contact-person-icon-btn', className: 'card-element-icon-btn', onClick: () => editContactPerson(contactPerson.id) },
                                    React.createElement(EditIcon, { fontSize: "small" })
                                )
                            )
                        ]
                    ),
                    React.createElement(
                        'div', {key: 'customer-contact-person-infos-container'}, [
                            React.createElement('p', {key: 'customer-contact-person-info-email'}, contactPerson.email ? `E-Mail: ${contactPerson.email}` : `E-Mail: -`),
                            React.createElement('p', {key: 'customer-contact-person-info-telefone'}, contactPerson.telefone ? `Tel.: ${contactPerson.telefone}` : `Tel.: -`)
                        ]
                    )
                )
            ) : React.createElement("p", {key: 'hint-no-customer-contact-persons', className: 'pl-2'}, "Aktuell sind keine Ansprechpartner für diesen Kunden vorhanden.")
        );

    return [customerContactPersonCardsIntroduction, customerContactPersonCards];
}

// Komponente in den DOM rendern
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(React.createElement(Page));