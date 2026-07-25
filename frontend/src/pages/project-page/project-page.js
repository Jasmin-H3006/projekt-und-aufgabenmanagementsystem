import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom/client';
import {
    Button,
    Container,
    Toolbar
} from "@mui/material";
import {ThemeProvider} from "@mui/material/styles";
import {MenuComponent} from '../../js/menu-component.js';
import theme from "../../css/theme-provider.js";
import {requireLogin} from "../../js/session-handling.js";
import {BackButton} from "../../js/back-button.js";

const urlParams = new URLSearchParams(window.location.search);
const projectIdInUrl = urlParams.get("projectId");

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
        React.createElement(BackButton, { pageLink: backLink }),
        React.createElement(ProjectOverview),
        React.createElement(ProjectTasks)
    );
}

function ProjectOverview() {
    const [title, setTitle] = useState("");
    const [customer, setCustomer] = useState("");
    const [contactPersons, setContactPersons] = useState([]);
    const [projectManager, setProjectManager] = useState("");
    const [users, setUsers] = useState([]);
    const [deadline, setDeadline] = useState("");
    const [description, setDescription] = useState("");

    useEffect(() => {
        if (!projectIdInUrl) return;
        fetch(`http://localhost:8080/api/projects/${projectIdInUrl}`)
            .then(r => r.json())
            .then(project => {
                setTitle(project.title)
                setCustomer(project.customer)
                setContactPersons(project.contactPersons)
                setProjectManager(project.projectManager)
                setUsers(project.users)
                setDeadline(project.deadline)
                setDescription(project.description)
            });
    }, [projectIdInUrl]);

    const introduction = React.createElement(
        Toolbar,
        {key: 'project-introduction', className: 'introduction pl-0 pt-3'},
        React.createElement('h3', {key: 'introduction-header', className: 'pl-2'}, "Projekt '" + title + "' ( ID: " + projectIdInUrl + " )")

    );

    const infos = React.createElement('div', {key: 'project-infos', className: 'pl-2'}, [
        React.createElement('div', {key: 'customer-container'}, [
            React.createElement('p', {key: 'customer-intro', className: 'project-info intro'}, "Kunde:"),
            React.createElement('p', {key: 'customer', className: 'project-info info'}, customer.name + " ( " + customer.website + " ) "),
        ]),
        React.createElement('div', {key: 'customer-contact-persons-container'}, [
            React.createElement('p', {key: 'customer-contact-persons-intro', className: 'project-info intro'}, "Ansprechpartner: "),
            contactPersons.length > 0 ? React.createElement('p', {key: 'customer-contact-persons', className: 'project-info info'},
                contactPersons.map(contactPerson => contactPerson.name + " ( " + contactPerson.email + (contactPerson.telefone ? ", " + contactPerson.telefone : " test ") + " ) <br>") //.join(", ")
            ) : React.createElement('p', {key: 'no-customer-contact-persons', className: 'project-info info'}, "Dem Projekt wurden keine Ansprechpartner zugewiesen.")
        ]),
        React.createElement('div', {key: 'project-manager-container'}, [
            React.createElement('p', {key: 'project-manager-intro', className: 'project-info intro'}, "Projektleiter:"),
            React.createElement('p', {key: 'project-manager', className: 'project-info info'}, projectManager.username),
        ]),
        React.createElement('div', {key: 'users-container'}, [
            React.createElement('p', {key: 'users-intro', className: 'project-info intro'}, "Beteiligte Mitarbeiter: "),
            users.length > 0 ? React.createElement('p', {key: 'users', className: 'project-info info'},
                users.map(user => user.name + "<br>") //.join(", ")
            ) : React.createElement('p', {key: 'no-users', className: 'project-info info'}, "Dem Projekt wurden keine Mitarbeiter zugewiesen.")
        ]),
        React.createElement('div', {key: 'deadline-container'}, [
            React.createElement('p', {key: 'deadline-intro', className: 'project-info intro'}, "Frist zur Fertigstellung:"),
            React.createElement('p', {key: 'deadline', className: 'project-info info'}, deadline ? deadline : "-"),
        ]),
        React.createElement('div', {key: 'description-container'}, [
            React.createElement('p', {key: 'description-intro', className: 'project-info intro'}, "Beschreibung:"),
            React.createElement('p', {key: 'description', className: 'project-info info'}, description),
        ])
    ])

    return [introduction, infos]
}

function ProjectTasks() {

    const introduction = React.createElement(
        Toolbar,
        {key: 'project-tasks-introduction', className: 'introduction-with-btn pl-0 pt-3'}, [
            React.createElement('h3', {key: 'tasks-introduction-header', className: 'pl-2'}, "Aufgaben"),
            React.createElement(Button, {key: 'btn-new-task', className: 'btn-new-task', color: 'primary', variant: 'contained', href: '../create-edit-task/create-edit-task.html'}, "Neue Aufgabe anlegen")
        ]
    );

    const tasks = React.createElement(
        Container, {key: 'tasks-container'}, "test"
    );

    return [introduction, tasks]
}

// Komponente in den DOM rendern
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(React.createElement(Page));