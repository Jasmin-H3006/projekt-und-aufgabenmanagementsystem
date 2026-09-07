import {React, useEffect, useState, ReactDOM, TextField, requireLogin, FormButtons} from "../../imports/create-edit-forms-imports.js";
import {FormGroup, FormControlLabel, Checkbox} from "@mui/material";
import {pageBuilder} from "../../js/page-builder.js";
function Page() {
    const [username, setUsername] = useState("");
    const [user, setUser] = useState("");
    useEffect(() => {
        requireLogin(setUsername, true)
            .then(setUser);
    }, []);

    return pageBuilder(user, [React.createElement(CreateEditRole)])
}

function CreateEditRole() {
    const [noEqualRoleInSystem, setNoEqualRoleInSystem] = useState(true);
    const [name, setName] = useState(""); // Role name
    const [message, setMessage] = useState('');
    const [createNewRole, setCreateNewRole] = useState(false); // First, it's assumed that the user only wants to edit

    // Uncheck at first
    const [rights, setRights] = useState({
        adminAccess: false,
        allProjectsAccess: false,
        createProjectsAccess: false,
        editAvailableProjectsAccess: false,
        createAndEditTasksAccess: false,
        customerPageAccess: false
    });

    const urlParams = new URLSearchParams(window.location.search);
    const roleIdInUrl = urlParams.get("id");


    useEffect(() => {
        if (!roleIdInUrl) {
            setCreateNewRole(true);
            return;
        }

        fetch(`http://localhost:8080/api/roles/${roleIdInUrl}`)
            .then(r => r.json())
            .then(role => {
                setName(role.name);
                setRights({
                    adminAccess: role.adminAccess,
                    allProjectsAccess: role.allProjectsAccess,
                    createProjectsAccess: role.createProjectsAccess,
                    editAvailableProjectsAccess: role.editAvailableProjectsAccess,
                    createAndEditTasksAccess: role.createAndEditTasksAccess,
                    customerPageAccess: role.customerPageAccess
                })
            });
    }, [roleIdInUrl]);

    const handleBack = () => {
        window.location.href = "../admin-area/admin-area.html";
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const payload = {
            name,
            adminAccess: rights.adminAccess,
            allProjectsAccess: rights.allProjectsAccess,
            createProjectsAccess: rights.createProjectsAccess,
            editAvailableProjectsAccess: rights.editAvailableProjectsAccess,
            createAndEditTasksAccess: rights.createAndEditTasksAccess,
            customerPageAccess: rights.customerPageAccess
        }

        // Reset Messages after a new click
        setMessage('');
        setNoEqualRoleInSystem(true);

        const editRole = roleIdInUrl;

        if(!editRole) {
            // User wants to create a new role (not edit an already existing one)
            const responseCheck = await fetch(
                'http://localhost:8080/api/roles/role-exists?name=' + encodeURIComponent(name)
            );
            const exists = await responseCheck.json();

            if (exists) {
                setNoEqualRoleInSystem(false);
                return;
            }
        }

        if(name === "") {
            setMessage('Die Rollen-Bezeichnung darf nicht leer sein.');
            return;
        }

        const responseUrl = editRole ? `http://localhost:8080/api/roles/${roleIdInUrl}` : "http://localhost:8080/api/roles/create";
        const method = editRole ? "PUT" : "POST";

        // Save process
        const response = await fetch(responseUrl, {
            method: method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            setMessage('Die Rolle wurde erfolgreich angelegt/bearbeitet!');
            handleBack()
        } else if (response.status === 409) {
            setMessage('Es gibt bereits eine Rolle mit dieser Bezeichnung.');
        } else {
            setMessage('Aktion fehlgeschlagen.');
        }
    };

    const handleDelete = async (e) => {
        e.preventDefault();

        if (!roleIdInUrl) return;

        const confirmed = window.confirm(
            `Soll die Rolle mit der ID "${roleIdInUrl}" wirklich gelöscht werden? Diese Aktion kann nicht rückgängig gemacht werden.`
        );

        if (!confirmed) return; // Stop action


        // Delete process
        const response = await fetch(
            `http://localhost:8080/api/roles/${roleIdInUrl}`,
            {method: "DELETE"}
        );

        if (response.ok) {
            setMessage('Die Rolle wurde erfolgreich gelöscht!');
            handleBack()
        } else {
            setMessage('Löschen fehlgeschlagen. Es kann sein, dass es noch Benutzer mit dieser Rolle gibt.');
        }
    };

    const handleChange = (key) => (e) => {
        setRights(prev => ({
            ...prev,
            [key]: e.target.checked
        }));
    };

    const handleAdminChange = (e) => {
        const checked = e.target.checked;

        // Enable all rights
        setRights(prev => ({
            ...prev,
            adminAccess: checked,
            allProjectsAccess: checked,
            createProjectsAccess: checked,
            editAvailableProjectsAccess: checked,
            createAndEditTasksAccess: checked,
            customerPageAccess: checked
        }));
    };

    const handleAllProjectsAccessChange = (e) => {
        const checked = e.target.checked;

        setRights(prev => ({
            ...prev,
            adminAccess: prev.adminAccess, // No change to Admin-Access
            allProjectsAccess: checked,
            createProjectsAccess: checked,
            editAvailableProjectsAccess: checked,
            createAndEditTasksAccess: checked,
            customerPageAccess: prev.customerPageAccess
        }));
    };

    const handleCreateProjectsAccessChange = (e) => {
        const checked = e.target.checked;

        setRights(prev => ({
            ...prev,
            adminAccess: prev.adminAccess,
            allProjectsAccess: prev.allProjectsAccess,
            createProjectsAccess: checked,
            editAvailableProjectsAccess: prev.editAvailableProjectsAccess,
            createAndEditTasksAccess: checked,
            customerPageAccess: prev.customerPageAccess
        }));
    };

    const isAdmin = rights.adminAccess; // To disable other rights when the Admin-Access is enabled
    const isAllProjectsAccess = rights.allProjectsAccess;
    const isCreateProjectsAccess = rights.createProjectsAccess;

    return (
        React.createElement("form", {key: 'create-element-form', className: "create-element-form"}, [
            React.createElement('h2', {key: 'headline'}, roleIdInUrl ? "Bestehende Rolle bearbeiten" : "Neue Rolle anlegen"),
            React.createElement(TextField, {key: 'name', required: true, variant: "outlined", label: "Bezeichnung",  value: name,
                onChange: (e) => setName(e.target.value)
            }, null),
            React.createElement('h3', {key: 'headline-role-rights', className: "full-width"}, "Berechtigungen für diese Rolle"),
            React.createElement(FormGroup, {key: "role-rights", className: "full-width"}, [
                React.createElement(FormControlLabel, {
                    key: "admin-access",
                    control: React.createElement(Checkbox, {
                        checked: rights.adminAccess,
                        onChange: handleAdminChange
                    }),
                    label: "Admin-Zugriff"}
                ),
                React.createElement(FormControlLabel, {
                    key: "customer-page-access",
                    control: React.createElement(Checkbox, {
                        checked: rights.customerPageAccess,
                        onChange: handleChange("customerPageAccess"),
                        disabled: isAdmin
                    }),
                    label: "Zugang zur Kunden-Übersicht"}
                ),
                React.createElement(FormControlLabel, {
                    key: "all-projects-access",
                    control: React.createElement(Checkbox, {
                        checked: rights.allProjectsAccess,
                        onChange: handleAllProjectsAccessChange,
                        disabled: isAdmin
                    }),
                    label: "Alle Projekte einsehen und verwalten (wenn deaktiviert nur die zugewiesenen)"}
                ),
                React.createElement(FormControlLabel, {
                    key: "create-projects-access",
                    control: React.createElement(Checkbox, {
                        checked: rights.createProjectsAccess,
                        onChange: handleCreateProjectsAccessChange,
                        disabled: isAdmin || isAllProjectsAccess
                    }),
                    label: "Neue Projekte anlegen (Benötigt, um als Projektleiter zu fungieren)"}
                ),
                React.createElement(FormControlLabel, {
                    key: "edit-available-projects-access",
                    control: React.createElement(Checkbox, {
                        checked: rights.editAvailableProjectsAccess,
                        onChange: handleChange("editAvailableProjectsAccess"),
                        disabled: isAdmin || isAllProjectsAccess
                    }),
                    label: "Einsehbare Projekte bearbeiten"}
                ),
                React.createElement(FormControlLabel, {
                    key: "create-and-edit-tasks-access",
                    control: React.createElement(Checkbox, {
                        checked: rights.createAndEditTasksAccess,
                        onChange: handleChange("createAndEditTasksAccess"),
                        disabled: isAdmin || isAllProjectsAccess || isCreateProjectsAccess
                    }),
                    label: "Neue Aufgaben anlegen und bestehende bearbeiten"}
                )
            ]),
            !noEqualRoleInSystem ? React.createElement('p', {key: "role-already-exists-error", className: "full-width"}, "Diese Rolle existiert bereits.") : null,
            message ? React.createElement('p', {key: "role-error", className: "full-width"}, message) : null,
            React.createElement(FormButtons, {key: 'form-buttons-container', onCancel: handleBack, onSave: handleSave, onDelete: handleDelete, createNewElement: createNewRole})
        ])
    )
}

// Komponente in den DOM rendern
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(React.createElement(Page));