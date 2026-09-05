import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom/client';
import {Button, Toolbar, Typography, IconButton} from "@mui/material";
import {requireLogin} from "../../js/session-handling.js";
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import {pageBuilder} from "../../js/page-builder.js";

function Page() {
    const [username, setUsername] = useState("");
    const [user, setUser] = useState("");
    useEffect(() => {
        requireLogin(setUsername)
            .then(setUser);
    }, []);

    return pageBuilder(user, [React.createElement(Intro, {username}), React.createElement(ToCustomerPage, {user}), React.createElement(MyProjectsCards)])
}

function Intro({username}) {
    return React.createElement(
        Typography,
        {key: 'mane-intro', className: 'pl-2'},
        React.createElement(
            "h2",
            {key: 'welcome'},
            `Mane - Ihr Projekt- & Aufgabenmanagementsystem. Willkommen, ${username}!`
        )
    )
}

function ToCustomerPage({user}) {
    return (
        user.customerPageAccess ? React.createElement(
            Button,
            {key: 'btn-to-customer-page', className: 'btn-to-customer-page ml-2 mt-3', color: 'primary', variant: 'outlined', href: '../customer-page/customer-page.html'},
            "Zur Kunden-Übersicht"
        ) : null
    );
}

function MyProjectsCards() {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8080/api/projects/get-all")
            .then(res => res.json())
            .then(projects =>
                Promise.all(
                    projects.map(project =>
                        fetch(`http://localhost:8080/api/tasks/projects/${project.id}`)
                            .then(res => res.json())
                            .then(tasks => ({
                                ...project,
                                taskCounts: {
                                    total: tasks.length,
                                    done: tasks.filter(t => t?.taskState?.taskDoneState).length
                                }
                            }))
                    )
                )
            )
            .then(projects => setProjects(projects));
    }, []);

    const viewProject = (projectId) => {
        window.location.href='../project-page/project-page.html?projectId=' + projectId
    }

    const editProject = (projectId) => {
        window.location.href='../create-edit-project/create-edit-project.html?projectId=' + projectId
    };

    const projectCardsIntroduction = (
        React.createElement(
            Toolbar,
            {key: 'projects-introduction', className: 'introduction-with-btn pl-0 pt-3'},
            [
                React.createElement('h3', {key: 'introduction-header', className: 'pl-2'}, "Meine Projekte"),
                React.createElement(Button, {key: 'btn-new-project', className: 'btn-new-project', color: 'primary', variant: 'contained', href: '../create-edit-project/create-edit-project.html'}, "Neues Projekt anlegen")
            ]
        )
    );

    const projectCards =
        // Projekte-Container
        React.createElement(
            'div', {key: 'my-projects-container', className: 'cards-container pl-1 pr-1 pl-md-up-5 pr-md-up-5'},
            // Einzelnen Projekt-Container
            projects.length > 0 ? projects.map (project =>
                React.createElement(
                    'div', {key: 'my-project-container-' + project.id, className: 'card-container'},
                    React.createElement(
                        'div', {key: 'my-project-title-container', className: 'card-title-container'}, [
                            React.createElement('h3', {key: 'my-project-title', className: 'card-with-two-buttons'}, project.title),
                            React.createElement(
                                'div',
                                { key: 'edit-my-project', className: 'edit-card-element view-card-element'},
                                React.createElement(
                                    IconButton,
                                    { key: 'view-my-project-icon-btn', className: 'card-element-icon-btn mr-0-5', onClick: () => viewProject(project.id) },
                                    React.createElement(VisibilityIcon, { fontSize: "small" })
                                ),
                                React.createElement(
                                    IconButton,
                                    { key: 'edit-my-project-icon-btn', className: 'card-element-icon-btn', onClick: () => editProject(project.id) },
                                    React.createElement(EditIcon, { fontSize: "small" })
                                )
                            )
                        ]
                    ),
                    React.createElement('p', {key: 'my-project-description', className: 'card-description'}, project.description),
                    React.createElement(
                        'div', {key: 'my-project-infos-container'}, [
                            React.createElement('p', {key: 'my-project-info-id'}, `ID: ${project.id}`),
                            React.createElement('p', {key: 'my-project-info-customer'}, `Kunde: ${project.customer.name}`),
                            React.createElement('p', {key: 'my-project-info-project-manager'}, `Projektleiter: ${project.projectManager.username}`),
                            React.createElement('p', {key: 'my-project-info-project-user'},  project.users && project.users.length > 0
                                ? `Beteiligte Mitarbeiter: ${project.users.map(user => user.username).join(", ")}` : "Beteiligte Mitarbeiter: -"),
                            React.createElement('p', {key: 'my-project-info-project-deadline'}, project.deadline ? `Frist: ${project.deadline}` : "Frist: -"),
                            React.createElement('p', {key: 'my-project-info-project-progress'}, `Fortschritt: ${project.taskCounts.total > 0 ? Math.round((project.taskCounts.done / project.taskCounts.total) * 100) : "-"}%`)
                        ]
                    )
                )
            ) : React.createElement("p", {key: 'hint-no-my-projects', className: 'pl-2'}, "Aktuell sind keine Projekte für Sie vorhanden.")
        );

    return [projectCardsIntroduction, projectCards];
}

// Komponente in den DOM rendern
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(React.createElement(Page));