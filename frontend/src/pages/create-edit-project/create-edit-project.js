import React, {useEffect, useState} from "react";
import ReactDOM from 'react-dom/client';
import {ThemeProvider} from "@mui/material/styles";
import theme from "../../css/theme-provider.js";
import {MenuComponent} from '../../js/menu-component.js';
import {ButtonsCreatePages} from "../../js/buttons-create-pages.js";
import {TextField, MenuItem} from "@mui/material";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import {requireLogin} from "../../js/session-handling.js";

function Page() {
    const [username, setUsername] = useState("");
    useEffect(() => {
        requireLogin(setUsername);
    }, []);

    return React.createElement(
        ThemeProvider,
        { theme: theme },
        React.createElement(MenuComponent),
        React.createElement(CreateEditProject),
        React.createElement(ButtonsCreatePages)
    );
}

function CreateEditProject() {
    const [customers, setCustomers] = useState([]);
    const [customerId, setCustomerId] = useState("");

    const [customerContactPersons, setCustomerContactPersons] = useState([]);
    const [customerContactPersonId, setCustomerContactPersonId] = useState("");

    const [projectManagers, setProjectManagers] = useState([]);
    const [projectManagerId, setProjectManagerId] = useState("");

    const [users, setUsers] = useState([]);
    const [userId, setUserId] = useState("");

    const [deadline, setDeadline] = useState(dayjs());

    useEffect(() => {
        fetch("http://localhost:8080/api/customers")
            .then(res => res.json())
            .then(data => setCustomers(data));

        fetch("http://localhost:8080/api/customerContactPersons")
            .then(res => res.json())
            .then(data => setCustomerContactPersons(data));

        fetch("http://localhost:8080/api/users?role=Projektleiter")
            .then(res => res.json())
            .then(data => setProjectManagers(data));

        fetch("http://localhost:8080/api/users")
            .then(res => res.json())
            .then(data => setUsers(data));
    }, []);



    return [
        React.createElement("form", {key: 'create-element-form', className: "create-element-form"}, [
            React.createElement('h2', {key: 'headline'}, "Projekt anlegen/bearbeiten"),
            React.createElement(TextField, {key: 'title', variant: "outlined", label: "Bezeichnung"}, null),
            React.createElement(TextField,
                {key: 'customer', select: true, value: customerId, variant: "outlined", label: "Kunde", onChange: (e) => setCustomerId(e.target.value),},
                customers.map(customer =>
                    React.createElement(MenuItem, { key: customer.id, value: customer.id }, customer.name)
                )
            ),
            React.createElement(TextField,
                {key: 'project-manager', select: true, value: projectManagerId, variant: "outlined", label: "Projektleiter", onChange: (e) => setProjectManagerId(e.target.value),},
                projectManagers.map(projectManager =>
                    React.createElement(MenuItem, { key: projectManager.id, value: projectManager.id }, projectManager.name)
                )
            ),
            React.createElement(
                TextField,
                {key: 'contact-person', select: true, value: customerContactPersonId, variant: "outlined", label: "Ansprechpartner", onChange: (e) => setCustomerContactPersonId(e.target.value),},
                customerContactPersons.map(contactPerson =>
                    React.createElement(MenuItem, { key: contactPerson.id, value: contactPerson.id }, contactPerson.name)
                )
            ),
            React.createElement(
                TextField,
                {key: 'user', select: true, value: userId, variant: "outlined", label: "Beteiligte Mitarbeiter", onChange: (e) => setUserId(e.target.value),},
                users.map(user =>
                    React.createElement(MenuItem, { key: user.id, value: user.id }, user.name)
                )
            ),
            React.createElement(LocalizationProvider, {dateAdapter: AdapterDayjs},
                React.createElement(DatePicker, {
                    key: 'deadline',
                    value: deadline,
                    format: "DD.MM.YYYY",
                    variant: "outlined",
                    label: "Frist",
                    onChange: (newValue) => setDeadline(newValue),
                }, null)
            ),
            React.createElement(TextField, {key: 'description', multiline: "true", rows: "4", variant: "outlined", label: "Beschreibung", className: "full-width description-field"}, null),
        ])
    ]
}

// Komponente in den DOM rendern
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(React.createElement(Page));