import {React, useEffect, useState, ReactDOM, ThemeProvider, theme, MenuComponent, FormButtons, TextField, MenuItem, requireLogin} from "../../imports/create-edit-forms-imports.js";
import {FooterComponent} from "../../js/footer-component.js";
import {Box} from "@mui/material";
import {pageBuilder} from "../../js/page-builder.js";

function Page() {
    const [username, setUsername] = useState("");
    const [user, setUser] = useState("");
    useEffect(() => {
        requireLogin(setUsername, false, false, false, false, true, false)
            .then(setUser);
    }, []);

    return pageBuilder(user, [React.createElement(CreateEditTask)])
}

function CreateEditTask() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [projectTitle, setProjectTitle] = useState("");

    const [tasks, setTasks] = useState([]);
    const [createNewTask, setCreateNewTask] = useState(false); // First, it's assumed that the user only wants to edit
    const [noEqualTaskInSystem, setNoEqualTaskInSystem] = useState(true);
    const [message, setMessage] = useState('');

    const urlParams = new URLSearchParams(window.location.search);
    const taskIdInUrl = urlParams.get("id");
    const projectIdInUrl = urlParams.get("projectId");

    useEffect(() => {
        fetch("http://localhost:8080/api/tasks/get-all")
            .then(res => res.json())
            .then(data => setTasks(data));

        if (!projectIdInUrl) return;

        fetch(`http://localhost:8080/api/projects/${projectIdInUrl}`)
            .then(r => r.json())
            .then(project => setProjectTitle(project.title));

        if (!taskIdInUrl) {
            setCreateNewTask(true);
            return;
        }

        fetch(`http://localhost:8080/api/project/tasks/${taskIdInUrl}`)
            .then(r => r.json())
            .then(task => {
                setTitle(task.title)
                setDescription(task.description)
            });
    }, [projectIdInUrl, taskIdInUrl]);

    const handleBack = (projectIdInUrl) => {
        window.location.href = '../project-page/project-page.html?projectId=' + projectIdInUrl;
    };

    const handleCancel = async (e) => {
        e.preventDefault();
        handleBack(projectIdInUrl)
    }

    const handleSave = async (e) => {
        e.preventDefault();
        const payload = {
            title,
            description,
            projectId: projectIdInUrl
        }

        // Reset Messages after a new click
        setMessage('');
        setNoEqualTaskInSystem(true);

        const editTask = taskIdInUrl;

        if(!editTask) {
            // Creating a new task (not edit an already existing one)
            const responseCheck = await fetch(
                'http://localhost:8080/api/project/tasks/task-exists?title=' + encodeURIComponent(title)
            );
            if (!responseCheck.ok) return;
            const exists = await responseCheck.json();

            if (exists) {
                setNoEqualTaskInSystem(false);
                return;
            }
        }

        if(title === "") {
            setMessage('Der Titel der Aufgabe darf nicht leer sein.');
            return;
        }

        if(description === "") {
            setMessage('Die Beschreibung darf nicht leer sein.');
            return;
        }

        const responseUrl = editTask ? `http://localhost:8080/api/project/tasks/${taskIdInUrl}` : "http://localhost:8080/api/project/tasks/create";
        const method = editTask ? "PUT" : "POST";

        // Save process
        const response = await fetch(responseUrl, {
            method: method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            setMessage('Die Aufgabe wurde erfolgreich angelegt/bearbeitet!');
            handleBack(projectIdInUrl)
        } else if (response.status === 409) {
            setMessage('Es gibt bereits eine Aufgabe mit diesem Titel.');
        } else {
            setMessage('Aktion fehlgeschlagen.');
        }
    };

    const handleDelete = async (e) => {
        e.preventDefault();

        if (!taskIdInUrl) return;

        const confirmed = window.confirm(
            `Soll die Aufgabe mit der ID "${taskIdInUrl}" wirklich gelöscht werden? Diese Aktion kann nicht rückgängig gemacht werden.`
        );

        if (!confirmed) return; // Stop action

        // Delete process
        const response = await fetch(
            `http://localhost:8080/api/project/tasks/${taskIdInUrl}`,
            {method: "DELETE"}
        );

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
                key: 'title', required: true, variant: "outlined", className: "full-width", label: "Titel", value: title,
                onChange: (e) => setTitle(e.target.value)
            }, null),
            React.createElement(TextField, {key: 'description', required: true, multiline: "true", rows: "4", variant: "outlined", value: description, label: "Beschreibung", className: "full-width description-field", onChange: (e) => setDescription(e.target.value)}, null),
            !noEqualTaskInSystem ? React.createElement('p', {key: "task-already-exists-error", className: "full-width"}, "Eine Aufgabe mit diesem Titel existiert bereits.") : null,
            message ? React.createElement('p', {key: "task-error", className: "full-width"}, message) : null,
            React.createElement(FormButtons, {key: 'form-buttons-container', onCancel: handleCancel, onSave: handleSave, onDelete: handleDelete, createNewElement: createNewTask})
        ])
    ]
}

// Komponente in den DOM rendern
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(React.createElement(Page));