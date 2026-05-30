import {React, useEffect, useState, ReactDOM, ThemeProvider, theme, MenuComponent, FormButtons, TextField, MenuItem, requireLogin} from "../../imports/create-edit-forms-imports.js";

function Page() {
    const [username, setUsername] = useState("");
    useEffect(() => {
        requireLogin(setUsername);
    }, []);

    return React.createElement(
        ThemeProvider,
        { theme: theme },
        React.createElement(MenuComponent),
        React.createElement(CreateEditUser),
        React.createElement(FormButtons)
    );
}

function CreateEditUser() {
    const [users, setUsers] = useState([]);
    const [userId, setUserId] = useState("");

    const [roles, setRoles] = useState([]);
    const [proleId, setRoleId] = useState("");

    useEffect(() => {
        fetch("http://localhost:8080/api/users")
            .then(res => res.json())
            .then(data => setUsers(data));

        fetch("http://localhost:8080/api/roles/get-all")
            .then(res => res.json())
            .then(data => setRoles(data));
    }, []);

    return [
        React.createElement("form", {key: 'create-element-form', className: "create-element-form"}, [
            React.createElement('h2', {key: 'headline'}, "Nutzer anlegen/bearbeiten"),
            React.createElement(TextField, {key: 'username', variant: "outlined", label: "Benutzername"}, null),
            React.createElement(TextField,
                {key: 'role', select: true, value: proleId, variant: "outlined", label: "Rolle", onChange: (e) => setRoleId(e.target.value),},
                roles.map(role =>
                    React.createElement(MenuItem, { key: role.id, value: role.id }, role.name)
                )
            )
        ])
    ]
}

// Komponente in den DOM rendern
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(React.createElement(Page));