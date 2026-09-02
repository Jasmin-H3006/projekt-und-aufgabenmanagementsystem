import {React, useEffect, useState, ReactDOM, TextField, requireLogin, FormButtons} from "../../imports/create-edit-forms-imports.js";
import { HexColorPicker } from "react-colorful";
import {pageBuilder} from "../../js/page-builder.js";
import {FormControl, FormLabel, RadioGroup, FormControlLabel, Radio} from "@mui/material";
function Page() {
    const [username, setUsername] = useState("");
    const [user, setUser] = useState("");
    useEffect(() => {
        requireLogin(setUsername, true)
            .then(setUser);
    }, []);

    return pageBuilder(user, [React.createElement(CreateEditTaskState)])
}

function CreateEditTaskState() {
    const [name, setName] = useState("");
    const [color, setColor] = useState("");
    const [fontColorBlack, setFontColorBlack] = useState(true);
    const [taskDoneState, setTaskDoneState] = useState(false);

    const [noEqualTaskStateInSystem, setNoEqualTaskStateInSystem] = useState(true);
    const [message, setMessage] = useState('');
    const [createNewTaskState, setCreateNewTaskState] = useState(false); // First, it's assumed that the user only wants to edit

    const urlParams = new URLSearchParams(window.location.search);
    const taskStateIdInUrl = urlParams.get("id");

    useEffect(() => {
        if (!taskStateIdInUrl) {
            setCreateNewTaskState(true);
            return;
        }

        fetch(`http://localhost:8080/api/task-states/${taskStateIdInUrl}`)
            .then(r => r.json())
            .then(taskState => {
                setName(taskState.name);
                setColor(taskState.color);
                setFontColorBlack(taskState.fontColorBlack);
                setTaskDoneState(taskState.taskDoneState);
            });
    }, [taskStateIdInUrl]);

    const handleBack = () => {
        window.location.href = "../admin-area/admin-area.html";
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const payload = {
            name,
            color,
            fontColorBlack,
            taskDoneState
        }

        // Reset Messages after a new click
        setMessage('');
        setNoEqualTaskStateInSystem(true);

        const editTaskState = taskStateIdInUrl;

        if(!editTaskState) {
            // User wants to create a new task state (not edit an already existing one)
            const responseCheck = await fetch(
                'http://localhost:8080/api/task-states/task-state-exists?name=' + encodeURIComponent(name)
            );
            const exists = await responseCheck.json();

            if (exists) {
                setNoEqualTaskStateInSystem(false);
                return;
            }
        }

        if (name === "") {
            setMessage('Die Status-Bezeichnung darf nicht leer sein.');
            return;
        }
        if (color === "") {
            setMessage('Bitte eine Farbe angeben.');
            return;
        }
        if (taskDoneState === null || taskDoneState === undefined) {
            setMessage('Bitte angeben, ob es sich um einen Erledigt-Status handelt.');
            return;
        }
        if (fontColorBlack === null || fontColorBlack === undefined) {
            setMessage('Bitte eine Schriftfarbe angeben.');
            return;
        }

        const responseUrl = editTaskState ? `http://localhost:8080/api/task-states/${taskStateIdInUrl}` : "http://localhost:8080/api/task-states/create";
        const method = editTaskState ? "PUT" : "POST";

        // Save process
        const response = await fetch(responseUrl, {
            method: method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            setMessage('Der Status wurde erfolgreich angelegt/bearbeitet!');
            handleBack()
        } else if (response.status === 409) {
            setMessage('Es gibt bereits einen Status mit dieser Bezeichnung.');
        } else {
            setMessage('Aktion fehlgeschlagen.');
        }
    };

    const handleDelete = async (e) => {
        e.preventDefault();

        if (!taskStateIdInUrl) return;

        const confirmed = window.confirm(
            `Soll der Status mit der ID "${taskStateIdInUrl}" wirklich gelöscht werden? Diese Aktion kann nicht rückgängig gemacht werden.`
        );

        if (!confirmed) return; // Stop action

        // Delete process
        const response = await fetch(
            `http://localhost:8080/api/task-states/${taskStateIdInUrl}`,
            {method: "DELETE"}
        );

        if (response.ok) {
            setMessage('Der Status wurde erfolgreich gelöscht!');
            handleBack()
        } else {
            setMessage('Löschen fehlgeschlagen. Es kann sein, dass es noch Aufgaben mit diesem Status gibt.');
        }
    };

    return (
        React.createElement("form", {key: 'create-element-form', className: "create-element-form"}, [
            React.createElement('h2', {key: 'headline'}, taskStateIdInUrl ? "Bestehenden Aufgaben-Status bearbeiten" : "Neuen Aufgaben-Status anlegen"),
            React.createElement(TextField, {key: 'name', required: true, variant: "outlined", label: "Bezeichnung",  value: name,
                onChange: (e) => setName(e.target.value)
            }, null),
            React.createElement(FormControl, {key: 'task-done-state-control'},
                React.createElement(FormLabel, {key: 'task-done-state-label'}, "Handelt es sich um einen Erledigt-Status?"),
                React.createElement(RadioGroup, {key: 'task-done-state-group', value: taskDoneState ? 'task-done-state' : 'task-not-done-state', onChange: (e) => setTaskDoneState(e.target.value === 'task-done-state')},
                    React.createElement(FormControlLabel, {key: 'task-done-state', value: 'task-done-state', control: React.createElement(Radio), label: 'Ja'}),
                    React.createElement(FormControlLabel, {key: 'task-not-done-state', value: 'task-not-done-state', control: React.createElement(Radio), label: 'Nein'})
                )
            ),
            React.createElement(TextField, {key: 'color', required: true, variant: "outlined", label: "Hintergrundfarbe in Hexa (#XXXXXX)",  value: color,
                onChange: (e) => setColor(e.target.value)
            }, null),
            React.createElement(FormControl, {key: 'font-color-control'},
                React.createElement(FormLabel, {key: 'font-color-label'}, "Schriftfarbe (Bitte die Lesbarkeit auf der Hintergrundfarbe prüfen)"),
                React.createElement(RadioGroup, {key: 'font-color-group', value: fontColorBlack ? 'black' : 'white', onChange: (e) => setFontColorBlack(e.target.value === 'black')},
                    React.createElement(FormControlLabel, {key: 'black', value: 'black', control: React.createElement(Radio), label: 'Schwarz'}),
                    React.createElement(FormControlLabel, {key: 'white', value: 'white', control: React.createElement(Radio), label: 'Weiß'})
                )
            ),
            React.createElement("div", {key: 'color-wheel-container'},[
                React.createElement("strong", {key: 'color-wheel-headline'}, `Gewählte Farbe: ${color}`),

                React.createElement("div", {key: 'color-wheel', className: 'color-wheel pt-1'}, [
                    React.createElement(HexColorPicker, {key: 'color-wheel-picker', className: 'color-wheel-picker', color: color, onChange: setColor}),
                    React.createElement("div", {key: "color-wheel-preview", style: {backgroundColor: color}, className: 'color-wheel-preview'},
                        React.createElement("p", {key: "color-wheel-text", style: {color: fontColorBlack ? 'black' : 'white'}, className: 'color-wheel-text'}, 'Schriftfarbe')
                    )
                ])
            ]),


            !noEqualTaskStateInSystem ? React.createElement('p', {key: "task-state-already-exists-error", className: "full-width"}, "Dieser Status existiert bereits.") : null,
            message ? React.createElement('p', {key: "task-state-error", className: "full-width"}, message) : null,
            React.createElement(FormButtons, {key: 'form-buttons-container', onCancel: handleBack, onSave: handleSave, onDelete: handleDelete, createNewElement: createNewTaskState})
        ])
    )
}

// Komponente in den DOM rendern
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(React.createElement(Page));