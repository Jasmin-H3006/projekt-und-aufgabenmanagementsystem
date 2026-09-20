import {React, useEffect, useState, FormButtons, TextField, MenuItem, requireLogin} from "../../imports/create-edit-forms-imports.js";
import {pageBuilder, renderInDOM} from "../../js/page-builder.js";
import {responseFunctionPutPost} from "../../js/create-edit-forms.js";

renderInDOM(Page); // DOM

function Page() {
    const [username, setUsername] = useState("");
    const [user, setUser] = useState("");
    useEffect(() => {
        requireLogin(setUsername, false, false, false, false, true)
            .then(setUser);
    }, []);

    return pageBuilder(user, [React.createElement(CreateEditTask, {key: 'create-edit-task'})])
}

function CreateEditTask() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [taskStates, setTaskStates] = useState([])
    const [taskStateId, setTaskStateId] = useState(null)
    const [projectTitle, setProjectTitle] = useState("");

    const [createNewTask, setCreateNewTask] = useState(false); // First, it's assumed that the user only wants to edit
    const [noEqualTaskInSystem, setNoEqualTaskInSystem] = useState(true);
    const [message, setMessage] = useState('');

    const urlParams = new URLSearchParams(window.location.search);
    const taskIdInUrl = urlParams.get("projectTaskId");
    const projectIdInUrl = urlParams.get("projectId");

    useEffect(() => {
        // Get all task states
        fetch("http://localhost:8080/api/task-states/get-all")
            .then(res => res.json())
            .then(data => setTaskStates(data));

        if (!projectIdInUrl) return;

        // Get project
        fetch(`http://localhost:8080/api/projects/${projectIdInUrl}`, {credentials: "include"})
            .then(r => {
                if (!r.ok) window.location.href = "../home/home.html";
                return r.json();
            })
            .then(project => setProjectTitle(project.title));

        if (!taskIdInUrl) {
            setCreateNewTask(true);
            return;
        }

        // Get task
        fetch(`http://localhost:8080/api/tasks/${taskIdInUrl}`, {credentials: "include"})
            .then(r => {
                if (!r.ok) window.location.href = "../home/home.html";
                return r.json();
            })
            .then(task => {
                setTitle(task.title)
                setDescription(task.description)
                setTaskStateId(task.taskState ? Number(task.taskState.id) : null);
            });
    }, [projectIdInUrl, taskIdInUrl]);

    const handleBack = (projectIdInUrl) => { window.location.href = '../project-page/project-page.html?projectId=' + projectIdInUrl };

    const handleCancel = async (e) => {
        e.preventDefault();
        handleBack(projectIdInUrl)
    }

    const handleSave = async (e) => {
        e.preventDefault();
        const payload = {
            title,
            taskStateId: Number(taskStateId),
            description,
            projectId: projectIdInUrl
        }

        // Reset Messages after a new click
        setMessage('');
        setNoEqualTaskInSystem(true);

        const editTask = taskIdInUrl;
        if(!editTask) {
            // Creating a new task (not edit an already existing one)
            const responseCheck = await fetch('http://localhost:8080/api/tasks/task-exists-in-project?title=' + encodeURIComponent(title) + '&projectId=' + projectIdInUrl);
            if (!responseCheck.ok) return;

            const exists = await responseCheck.json();
            if (exists) {
                setNoEqualTaskInSystem(false);
                return;
            }
        }

        // Check inputs
        if (title === "") {
            setMessage('Der Titel der Aufgabe darf nicht leer sein.');
            return;
        }
        if (taskStateId === null) {
            setMessage('Bitte einen Status für die Aufgabe wählen.');
            return;
        }
        if (description === "") {
            setMessage('Die Beschreibung darf nicht leer sein.');
            return;
        }

        const response = await responseFunctionPutPost(editTask, `http://localhost:8080/api/tasks/${taskIdInUrl}`, "http://localhost:8080/api/tasks/create", payload)

        if (response.ok) {
            setMessage('Die Aufgabe wurde erfolgreich angelegt/bearbeitet!');
            handleBack(projectIdInUrl)
        } else if (response.status === 409) {
            setMessage('In diesem Projekt gibt es bereits eine Aufgabe mit diesem Titel.');
        } else {
            setMessage('Aktion fehlgeschlagen.');
        }
    };

    const handleDelete = async (e) => {
        e.preventDefault();
        if (!taskIdInUrl) return;

        const confirmed = window.confirm(`Soll die Aufgabe mit der ID "${taskIdInUrl}" wirklich gelöscht werden? Diese Aktion kann nicht rückgängig gemacht werden.`);
        if (!confirmed) return; // Stop action

        // Delete process
        const response = await fetch(`http://localhost:8080/api/tasks/${taskIdInUrl}`, {method: "DELETE"});

        if (response.ok) {
            setMessage('Die Aufgabe wurde erfolgreich gelöscht!');
            handleBack(projectIdInUrl)
        } else {
            setMessage('Löschen fehlgeschlagen.');
        }
    };

    return [
        React.createElement("form", {key: 'create-element-form', className: "create-element-form"}, [
            React.createElement('h2', {key: 'headline'}, taskIdInUrl ? "Bestehende Aufgabe bearbeiten" : "Neue Aufgabe für das Projekt '" + projectTitle + "' anlegen"),
            React.createElement(TextField, {
                key: 'title', required: true, variant: "outlined", label: "Titel", value: title,
                onChange: (e) => setTitle(e.target.value)
            }),
            React.createElement(TextField,
                {key: 'task-state', required: true, select: true, value: taskStateId ?? "", variant: "outlined", label: "Status", onChange: (e) => setTaskStateId(Number(e.target.value))},
                taskStates.map(taskState =>
                    React.createElement(MenuItem, { key: taskState.id, value: taskState.id }, taskState.name)
                )
            ),
            React.createElement(TextField, {key: 'description', required: true, multiline: "true", rows: "4", variant: "outlined", value: description, label: "Beschreibung", className: "full-width description-field", onChange: (e) => setDescription(e.target.value)}),
            !noEqualTaskInSystem ? React.createElement('p', {key: "task-already-exists-error", className: "full-width"}, "In diesem Projekt gibt es bereits eine Aufgabe mit diesem Titel.") : null,
            message ? React.createElement('p', {key: "task-error", className: "full-width"}, message) : null,
            React.createElement(FormButtons, {key: 'form-buttons-container', onCancel: handleCancel, onSave: handleSave, onDelete: handleDelete, createNewElement: createNewTask})
        ])
    ]
}