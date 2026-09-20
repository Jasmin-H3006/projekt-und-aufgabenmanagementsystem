import React, {useEffect, useState} from 'react';
import {Button, IconButton, Toolbar} from "@mui/material";
import {requireLogin} from "../../js/session-handling.js";
import {BackButton} from "../../js/back-button.js";
import {pageBuilder, renderInDOM} from "../../js/page-builder.js";
import EditIcon from '@mui/icons-material/Edit';

renderInDOM(Page); // DOM

function Page() {
    const [username, setUsername] = useState("");
    const [user, setUser] = useState("");

    useEffect(() => {
        requireLogin(setUsername)
            .then(setUser);
    }, []);

    const backLink = '../home/home.html';

    return pageBuilder(user, [React.createElement(BackButton, {key: 'back-button', pageLink: backLink}), React.createElement(ProjectOverview, {key: 'project-overview'}), React.createElement(ProjectTasks, {key: 'project-tasks-overview', user})])
}

const urlParams = new URLSearchParams(window.location.search);
const projectIdInUrl = urlParams.get("projectId");

function ProjectOverview() {
    const [title, setTitle] = useState("");
    const [customer, setCustomer] = useState("");
    const [contactPersons, setContactPersons] = useState([]);
    const [projectManager, setProjectManager] = useState("");
    const [users, setUsers] = useState([]);
    const [deadline, setDeadline] = useState("");
    const [description, setDescription] = useState("");
    const [taskCounts, setTaskCounts] = useState({ total: 0, done: 0 });

    useEffect(() => {
        if (!projectIdInUrl) return;

        // Get project
        fetch(`http://localhost:8080/api/projects/${projectIdInUrl}`, {credentials: "include"})
            .then(r => {
                if (!r.ok) window.location.href = "../home/home.html";
                return r.json();
            })
            .then(project => {
                setTitle(project.title)
                setCustomer(project.customer)
                setContactPersons(project.contactPersons)
                setProjectManager(project.projectManager)
                setUsers(project.users)
                setDeadline(project.deadline)
                setDescription(project.description)
            });

        // Get project tasks
        fetch(`http://localhost:8080/api/tasks/projects/${projectIdInUrl}`)
            .then(res => res.json())
            .then(tasks => {
                const total = Array.isArray(tasks) ? tasks.length : 0;
                const done = Array.isArray(tasks) ? tasks.filter(t => t?.taskState?.taskDoneState === true).length : 0;
                setTaskCounts({ total, done });
            })
    }, [projectIdInUrl]);

    const introduction = React.createElement(
        Toolbar, {key: 'project-introduction', className: 'introduction pl-0 pt-3'},
        React.createElement('h3', {key: 'introduction-header', className: 'pl-2'}, "Projekt '" + title + "' ( ID: " + projectIdInUrl + " )")
    );

    const infos = (
        React.createElement('div', {key: 'project-infos', className: 'pl-2'}, [
            React.createElement('div', {key: 'customer-container'}, [
                React.createElement('p', {key: 'customer-intro', className: 'project-info intro'}, "Kunde:"),
                React.createElement('p', {key: 'customer', className: 'project-info info'}, customer.name + " ( " + customer.website + " ) ")
            ]),
            React.createElement('div', {key: 'customer-contact-persons-container', className: 'customer-contact-persons-container'}, [
                React.createElement('p', {key: 'customer-contact-persons-intro', className: 'project-info intro'}, "Ansprechpartner: "),
                contactPersons.length > 0 ? React.createElement('div', {key: 'customer-contact-persons', className: 'project-info info'},
                    contactPersons.map(contactPerson =>
                        React.createElement(
                            'p', { key: contactPerson.id },
                            `${contactPerson.name} (${contactPerson.email}${contactPerson.telefone ? ", " + contactPerson.telefone : ""})`
                        )
                    )
                ) : React.createElement('p', {key: 'no-customer-contact-persons', className: 'project-info info'}, "Dem Projekt wurden keine Ansprechpartner zugewiesen.")
            ]),
            React.createElement('div', {key: 'project-manager-container'}, [
                React.createElement('p', {key: 'project-manager-intro', className: 'project-info intro'}, "Projektleiter:"),
                React.createElement('p', {key: 'project-manager', className: 'project-info info'}, projectManager.username)
            ]),
            React.createElement('div', {key: 'users-container', className: 'users-container'}, [
                React.createElement('p', {key: 'users-intro', className: 'project-info intro'}, "Beteiligte Mitarbeiter: "),
                users.length > 0 ? React.createElement('div', {key: 'users', className: 'project-info info'},
                    users.map(user =>React.createElement('p', { key: user.id }, `${user.username}`))
                ) : React.createElement('p', {key: 'no-users', className: 'project-info info'}, "Dem Projekt wurden keine Mitarbeiter zugewiesen.")
            ]),
            React.createElement('div', {key: 'deadline-container'}, [
                React.createElement('p', {key: 'deadline-intro', className: 'project-info intro'}, "Frist zur Fertigstellung:"),
                React.createElement('p', {key: 'deadline', className: 'project-info info'}, deadline ? deadline : "-")
            ]),
            React.createElement('div', {key: 'progress-container'}, [
                React.createElement('p', {key: 'progress-intro', className: 'project-info intro'}, "Fortschritt:"),
                React.createElement('p', {key: 'progress', className: 'project-info info'}, `${taskCounts.done}/${taskCounts.total} Aufgaben erledigt`)
            ]),
            React.createElement('div', {key: 'description-container'}, [
                React.createElement('p', {key: 'description-intro', className: 'project-info intro'}, "Beschreibung:"),
                React.createElement('p', {key: 'description', className: 'project-info info'}, description)
            ])
        ])
    );
    return [introduction, infos]
}

function ProjectTasks({user}) {
    const [projectTasks, setProjectTasks] = useState([])

    useEffect(() => {
        if (!user) return;

        // Get tasks
        fetch(`http://localhost:8080/api/tasks/projects/${projectIdInUrl}`)
            .then(res => res.json())
            .then(tasks => setProjectTasks(tasks));
    }, [projectIdInUrl, user]);

    const editProjectTask = (projectIdInUrl, projectTaskId) => { window.location.href='../create-edit-task/create-edit-task.html?projectId=' + projectIdInUrl + '&projectTaskId=' + projectTaskId};

    const introduction = React.createElement(
        Toolbar, {key: 'project-tasks-introduction', className: 'introduction-with-btn pl-0 pt-3'}, [
            React.createElement('h3', {key: 'tasks-introduction-header', className: 'pl-2'}, "Aufgaben"),
            user.createAndEditTasksAccess ? React.createElement(Button, {key: 'btn-new-task', className: 'btn-new-task', color: 'primary', variant: 'contained', href: '../create-edit-task/create-edit-task.html?projectId=' + projectIdInUrl}, "Neue Aufgabe anlegen") : null
        ]
    );

    const tasks = (
        // Tasks container
        React.createElement(
            'div', {key: 'tasks-container', className: 'cards-container pl-1 pr-1 pl-md-up-5 pr-md-up-5'},
            // Container of each task
            projectTasks.length > 0 ? projectTasks.map (projectTask =>
                React.createElement(
                    'div', {key: 'task-container-' + projectTask.id, className: 'card-container'},
                    React.createElement(
                        'div', {key: 'task-title-container', className: 'card-title-container'}, [
                        React.createElement('h3', {key: 'task-title'}, projectTask.title),
                        user.createAndEditTasksAccess ? React.createElement(
                            'div', { key: 'edit-task', className: 'edit-card-element'},
                            React.createElement(
                                IconButton, { key: 'edit-task-icon-btn', className: 'card-element-icon-btn', onClick: () => editProjectTask(projectIdInUrl, projectTask.id) },
                                React.createElement(EditIcon, { fontSize: "small" })
                            )
                        ): null
                    ]),
                    React.createElement('p', {key: 'task-description', className: 'card-description'}, projectTask.description),
                    React.createElement('div', {key: 'task-state', className: 'task-card-state', style: {backgroundColor: projectTask.taskState.color, color: projectTask.taskState.fontColorBlack ? 'black' : 'white'}}, 'Status: ' + projectTask.taskState.name)
                )
            ) : React.createElement("p", {key: 'hint-no-tasks', className: 'pl-2'}, "Aktuell sind keine Aufgaben vorhanden.")
        )
    );
    return [introduction, tasks]
}