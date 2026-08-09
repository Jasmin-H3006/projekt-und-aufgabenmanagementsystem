import React, {useEffect, useState} from "react";
import ReactDOM from 'react-dom/client';
import {ThemeProvider} from "@mui/material/styles";
import theme from "../../css/theme-provider.js";
import {MenuComponent} from '../../js/menu-component.js';
import {FormButtons} from "../../js/form-buttons.js";
import {TextField, MenuItem, Box, Chip, Select, FormControl, InputLabel} from "@mui/material";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import {requireLogin} from "../../js/session-handling.js";
import {FooterComponent} from "../../js/footer-component.js";
import {pageBuilder} from "../../js/page-builder.js";

function Page() {
    const [username, setUsername] = useState("");
    const [user, setUser] = useState("");
    useEffect(() => {
        requireLogin(setUsername, false, false, false, true)
            .then(setUser);
    }, []);

    return pageBuilder(user, [React.createElement(CreateEditProject)])
}

function CreateEditProject() {
    const [customers, setCustomers] = useState([]);
    const [customerId, setCustomerId] = useState(null);
    const [contactPersons, setContactPersons] = useState([]);
    const [contactPersonIds, setContactPersonIds] = useState([]);
    const [projectManagers, setProjectManagers] = useState([]);
    const [projectManagerId, setProjectManagerId] = useState(null);
    const [users, setUsers] = useState([]);
    const [userIds, setUserIds] = useState([]);
    const [deadline, setDeadline] = useState(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const [projects, setProjects] = useState([])

    const [createNewProject, setCreateNewProject] = useState(false); // First, it's assumed that the user only wants to edit
    const [noEqualProjectInSystem, setNoEqualProjectInSystem] = useState(true);
    const [message, setMessage] = useState('');

    const urlParams = new URLSearchParams(window.location.search);
    const projectIdInUrl = urlParams.get("projectId");

    useEffect(() => {
        fetch("http://localhost:8080/api/projects/get-all")
            .then(res => res.json())
            .then(data => setProjects(data));

        fetch("http://localhost:8080/api/customers/get-all")
            .then(res => res.json())
            .then(customers => setCustomers(customers));

        fetch("http://localhost:8080/api/users/get-all")
            .then(res => res.json())
            .then(users => {
                setUsers(users)
                setProjectManagers(users.filter(user => user.role.createProjectsAccess));
            });
    }, []);

    useEffect(() => {
        if (customerId) {
            fetch(`http://localhost:8080/api/customer/contact-persons/customer/${customerId}`)
                .then(res => res.json())
                .then(contactPersons => setContactPersons(contactPersons));
        } else {
            fetch("http://localhost:8080/api/customer/contact-persons/get-all")
                .then(res => res.json())
                .then(contactPersons => setContactPersons(contactPersons));
        }
    }, [customerId]);

    useEffect(() => {
        if (!projectIdInUrl) {
            setCreateNewProject(true);
            return;
        }

        fetch(`http://localhost:8080/api/projects/${projectIdInUrl}`)
            .then(r => r.json())
            .then(project => {
                setTitle(project.title);
                setCustomerId(Number(project.customer.id));
                setProjectManagerId(Number(project.projectManager.id));
                setContactPersonIds(project.contactPersons ? project.contactPersons.map(cp => Number(cp.id)) : []);
                setUserIds(project.users ? project.users.map(u => Number(u.id)) : []);
                setDeadline(project.deadline ? dayjs(project.deadline) : null);
                setDescription(project.description);
            });
    }, [projectIdInUrl]);

    // Reset contactPersons when changing customer
    useEffect(() => {
        setContactPersonIds(prev =>
            prev.filter(id =>
                contactPersons.some(cp => Number(cp.id) === Number(id))
            )
        );
    }, [contactPersons]);

    const handleBack = () => {
        window.location.href = "../home/home.html";
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const payload = {
            title,
            description,
            deadline: deadline ? deadline.format('YYYY-MM-DD') : null,
            customerId: Number(customerId),
            projectManagerId: Number(projectManagerId),
            userIds: userIds.length > 0 ? userIds.map(Number) : null,
            contactPersonIds: contactPersonIds.length > 0 ? contactPersonIds.map(Number) : null
        }

        // Reset Messages after a new click
        setMessage('');
        setNoEqualProjectInSystem(true);

        const editProject = projectIdInUrl;

        if(title === "") {
            setMessage('Die Bezeichnung darf nicht leer sein.');
            return;
        }
        if(customerId === null) {
            setMessage('Bitte einen Kunden auswählen.');
            return;
        }
        if(projectManagerId === null) {
            setMessage('Bitte einen Projektleiter auswählen.');
            return;
        }
        if(contactPersonIds.length === 0) {
            setMessage('Bitte mindestens einen Ansprechpartner auswählen.');
            return;
        }
        if(description === "") {
            setMessage('Bitte eine Beschreibung für das Projekt hinterlegen.');
            return;
        }

        if(!editProject) {
            // Creating a new project (not edit an already existing one)
            const responseCheck = await fetch(
                'http://localhost:8080/api/projects/project-exists?title=' + encodeURIComponent(payload.title) + '&customerId=' + encodeURIComponent(payload.customerId) + '&deadline=' + encodeURIComponent(payload.deadline)
            );
            if (!responseCheck.ok) return;

            // If exists
            if (await responseCheck.json()) {
                setNoEqualProjectInSystem(false);
                return;
            }
        }

        const responseUrl = editProject ? `http://localhost:8080/api/projects/${projectIdInUrl}` : "http://localhost:8080/api/projects/create";
        const method = editProject ? "PUT" : "POST";

        // Save process
        const response = await fetch(responseUrl, {
            method: method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            setMessage('Das Projekt wurde erfolgreich angelegt/bearbeitet!');
            handleBack()
        } else if (response.status === 409) {
            setMessage('Es gibt bereits ein Projekt mit diesen Daten (Titel, Kunde und Deadline).');
        } else {
            setMessage('Aktion fehlgeschlagen.');
        }
    };

    const handleDelete = async (e) => {
        e.preventDefault();

        if (!projectIdInUrl) return;

        const confirmed = window.confirm(
            `Soll das Projekt mit der ID "${projectIdInUrl}" wirklich gelöscht werden? Diese Aktion kann nicht rückgängig gemacht werden.`
        );

        if (!confirmed) return; // Stop action

        // Delete process
        const response = await fetch(
            `http://localhost:8080/api/projects/${projectIdInUrl}`,
            {method: "DELETE"}
        );

        if (response.ok) {
            setMessage('Das Projekt wurde erfolgreich gelöscht!');
            handleBack()
        } else {
            setMessage('Löschen fehlgeschlagen. Bitte prüfen, ob es noch nicht gelöschte Aufgaben in diesem Projekt gibt.');
        }
    };

    return [
        React.createElement("form", {key: 'create-element-form', className: "create-element-form"}, [
            React.createElement('h2', {key: 'headline'}, projectIdInUrl ? "Bestehendes Projekt bearbeiten" : "Neues Projekt anlegen"),
            React.createElement(TextField, {key: 'title', required: true, variant: "outlined", value: title, label: "Bezeichnung", onChange: (e) => setTitle(e.target.value)}, null),
            React.createElement(TextField,
                {key: 'customer', required: true, select: true, value: customerId ?? "", variant: "outlined", label: "Kunde", onChange: (e) => setCustomerId(Number(e.target.value)),},
                customers.map(customer =>
                    React.createElement(MenuItem, { key: customer.id, value: customer.id }, customer.name)
                )
            ),
            React.createElement(TextField,
                {key: 'project-manager', required: true, select: true, value: projectManagerId ?? "", variant: "outlined", label: "Projektleiter",
                    onChange: (e) => {
                        const selectedProjectManagerId = Number(e.target.value);
                        setProjectManagerId(selectedProjectManagerId)
                        setUserIds(prev =>
                            prev.filter(
                                id => Number(id) !== selectedProjectManagerId
                            )
                        )
                    },
                },
                projectManagers.map(projectManager =>
                    React.createElement(MenuItem, { key: projectManager.id, value: projectManager.id }, projectManager.username)
                )
            ),
            React.createElement(FormControl, {key: "contact-person-select-field"},
                React.createElement(InputLabel,{key: "contact-person-select-label", id: "contact-person-select-label"}, "Ansprechpartner"),
                React.createElement(
                    Select,
                    {
                        key: "contact-person-select", multiple: true, required: true, value: contactPersonIds, variant: "outlined", labelId: "contact-person-select-label", label: "Ansprechpartner",
                        onChange: (e) =>
                            setContactPersonIds(Array.isArray(e.target.value) ? e.target.value.map(Number) : []),
                        renderValue: selected => React.createElement(Box,
                            {key: 'contact-person-select-box', className: 'select-box'},
                            selected.map(id => {
                                const numericId = Number(id);
                                const ccp = contactPersons.find(contactPerson => Number(contactPerson.id) === numericId);
                                return React.createElement(Chip, {key: id, label: ccp ? ccp.name : null})
                            })
                        )
                    },
                    contactPersons.map(contactPerson =>
                        React.createElement(MenuItem, { key: contactPerson.id, value: contactPerson.id }, contactPerson.name + ' (' + contactPerson.email + ')')
                    )
                ),
            ),
            React.createElement(FormControl, {key: "user-select-field"},
                React.createElement(InputLabel,{key: "user-select-label", id: "user-select-label"}, "Beteiligte Mitarbeiter"),
                React.createElement(
                    Select,
                    {
                        key: "user-select", multiple: true, value: userIds, variant: "outlined", labelId: "user-select-label", label: "Beteiligte Mitarbeiter",
                        onChange: (e) => setUserIds(Array.isArray(e.target.value) ? e.target.value.map(Number) : []),
                        renderValue: selected => React.createElement(Box,
                            {key: 'user-select-box', className: 'select-box'},
                            selected.map(id => {
                                const numericId = Number(id);
                                const u = users.find(user => Number(user.id) === numericId);
                                return React.createElement(Chip, {key: id, label: u ? u.username : null})
                            })
                        )
                    },
                    users
                        .filter(user =>
                            Number(user.id) !== Number(projectManagerId)
                        )
                        .map(user =>
                        React.createElement(MenuItem, { key: user.id, value: user.id }, user.username)
                    )
                ),
            ),
            React.createElement(LocalizationProvider, {key: 'date-picker', dateAdapter: AdapterDayjs},
                React.createElement(DatePicker, {
                    key: 'deadline',
                    value: deadline,
                    format: "DD.MM.YYYY",
                    variant: "outlined",
                    label: "Frist",
                    onChange: (newValue) => setDeadline(newValue),
                }, null)
            ),
            React.createElement(TextField, {key: 'description', required: true, multiline: "true", rows: "4", variant: "outlined", value: description, label: "Beschreibung", className: "full-width description-field", onChange: (e) => setDescription(e.target.value)}, null),
            !noEqualProjectInSystem ? React.createElement('p', {key: "project-already-exists-error", className: "full-width"}, "Dieses Projekt existiert bereits.") : null,
            message ? React.createElement('p', {key: "project-error", className: "full-width"}, message) : null,
            React.createElement(FormButtons, {key: 'form-buttons-container', onCancel: handleBack, onSave: handleSave, onDelete: handleDelete, createNewElement: createNewProject})
        ])
    ]
}

// Komponente in den DOM rendern
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(React.createElement(Page));