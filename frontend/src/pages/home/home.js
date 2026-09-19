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

    return pageBuilder(user, [React.createElement(Intro, {username}), React.createElement(ToCustomerPage, {user}), React.createElement(ProjectsCards, {user})])
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

function ProjectsCards({user}) {
    const [projects, setProjects] = useState([]);
    const [otherProjects, setOtherProjects] = useState([]);

    const loadProjectsWithTaskCount = (url, myProjects = true) => {
         fetch(url)
            .then(res => res.json())
            .then(data =>
                Promise.all(
                    myProjects ? data.map(project => loadTaskCount(project)) : data.map(otherProject => loadTaskCount(otherProject))
                )
            )
            .then(myProjects ? (projects => setProjects(projects)) : (otherProjects => setOtherProjects(otherProjects)));
    }

    const loadTaskCount = (project) => {
         return fetch(`http://localhost:8080/api/tasks/projects/${project.id}`)
            .then(res => res.json())
            .then(tasks => ({
                ...project,
                taskCounts: {
                    total: tasks.length,
                    done: tasks.filter(t => t?.taskState?.taskDoneState).length
                }
            }))
    }

    useEffect(() => {
        if (!user || !user.id) return;

        loadProjectsWithTaskCount(`http://localhost:8080/api/projects/get-my-projects?userId=${user.id}`);

        if (user.allProjectsAccess) loadProjectsWithTaskCount(`http://localhost:8080/api/projects/get-other-projects?userId=${user.id}`, false);

    }, [user]);

    const myProjectCardsIntroduction = ProjectCardsIntroduction(user, true)
    const myProjectCards = ProjectCardElements(projects, user, true)

    const otherProjectCardsIntroduction = ProjectCardsIntroduction(user, false)
    const otherProjectCards = ProjectCardElements(otherProjects, user, false)

    return [myProjectCardsIntroduction, myProjectCards, otherProjectCardsIntroduction, otherProjectCards];
}

function ProjectCardsIntroduction(user, myProjects = true) {
    // Other-Projects-Section is not available for those without allProjectsAccess
    if (!myProjects && !user.allProjectsAccess) return;
    return React.createElement(
        Toolbar,
        {key: myProjects ? 'my-projects-introduction' : 'other-projects-introduction', className: 'introduction-with-btn pl-0 pt-3'},
        [
            React.createElement('h3', {key: myProjects ? 'my-projects-introduction-header' : 'other-projects-introduction-header', className: 'pl-2'}, myProjects ? "Meine Projekte" : "Weitere Projekte"),
            (user.createProjectsAccess && myProjects) ? React.createElement(Button, {key: 'btn-new-project', className: 'btn-new-project', color: 'primary', variant: 'contained', href: '../create-edit-project/create-edit-project.html'}, "Neues Projekt anlegen") : null
        ]
    )
}
function ProjectCardElements(projects, user, myProjects = true) {
    // Other-Projects-Section is not available for those without allProjectsAccess
    if (!myProjects && !user.allProjectsAccess) return;

    const viewProject = (projectId) => {
        window.location.href='../project-page/project-page.html?projectId=' + projectId
    }

    const editProject = (projectId) => {
        window.location.href='../create-edit-project/create-edit-project.html?projectId=' + projectId
    };

    return (
        // Projekte-Container
        React.createElement(
            'div', {key: myProjects ? 'my-projects-container' : 'other-projects-container', className: 'cards-container pl-1 pr-1 pl-md-up-5 pr-md-up-5'},
            // Einzelnen Projekt-Container
            projects.length > 0 ? projects.map (project =>
                React.createElement(
                    'div', {key: myProjects ? 'my-project-container-' + project.id : 'other-project-container-' + project.id, className: 'card-container'},
                    React.createElement(
                        'div', {key: myProjects ? 'my-project-title-container' : 'other-project-title-container', className: 'card-title-container'}, [
                            React.createElement('h3', {key: myProjects ? 'my-project-title' : 'other-project-title', className: user.editAvailableProjectsAccess ? 'card-with-two-buttons' : 'card-with-one-button'}, project.title),
                            React.createElement(
                                'div',
                                { key: myProjects ? 'edit-my-project' : 'edit-other-project', className: 'edit-card-element view-card-element'},
                                React.createElement(
                                    IconButton,
                                    { key: myProjects ? 'view-my-project-icon-btn' : 'view-other-project-icon-btn', className: 'card-element-icon-btn mr-0-5', onClick: () => viewProject(project.id) },
                                    React.createElement(VisibilityIcon, { fontSize: "small" })
                                ),
                                user.editAvailableProjectsAccess ? React.createElement(
                                    IconButton,
                                    { key: myProjects ? 'edit-my-project-icon-btn' : 'edit-other-project-icon-btn', className: 'card-element-icon-btn', onClick: () => editProject(project.id) },
                                    React.createElement(EditIcon, { fontSize: "small" })
                                ) : null
                            )
                        ]
                    ),
                    React.createElement('p', {key: myProjects ? 'my-project-description' : 'other-project-description', className: 'card-description'}, project.description),
                    React.createElement(
                        'div', {key: myProjects ? 'my-project-infos-container' : 'other-project-infos-container'}, [
                            React.createElement('p', {key: myProjects ? 'my-project-info-id' : 'other-project-info-id'}, `ID: ${project.id}`),
                            React.createElement('p', {key: myProjects ? 'my-project-info-customer' : 'other-project-info-customer'}, `Kunde: ${project.customer.name}`),
                            React.createElement('p', {key: myProjects ? 'my-project-info-project-manager' : 'other-project-info-project-manager'}, `Projektleiter: ${project.projectManager.username}`),
                            React.createElement('p', {key: myProjects ? 'my-project-info-project-user' : 'other-project-info-project-user'},  project.users && project.users.length > 0
                                ? `Beteiligte Mitarbeiter: ${project.users.map(user => user.username).join(", ")}` : "Beteiligte Mitarbeiter: -"),
                            React.createElement('p', {key: myProjects ? 'my-project-info-project-deadline' : 'other-project-info-project-deadline'}, project.deadline ? `Frist: ${project.deadline}` : "Frist: -"),
                            React.createElement('p', {key: myProjects ? 'my-project-info-project-progress' : 'other-project-info-project-progress'}, `Fortschritt: ${project.taskCounts.total > 0 ? Math.round((project.taskCounts.done / project.taskCounts.total) * 100) : "-"}%`)
                        ]
                    )
                )
            ) : React.createElement("p", {key: myProjects ? 'hint-no-my-projects' : 'hint-no-other-projects', className: 'pl-2'}, myProjects ? "Aktuell sind keine Projekte für Sie vorhanden." : "Aktuell gibt es keine weiteren Projekte.")
        )
    );
}

// Komponente in den DOM rendern
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(React.createElement(Page));