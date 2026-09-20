import React from "react";
import {AppBar, Typography, IconButton, Box, Tooltip, MenuItem, ListItemIcon, Menu} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import AdminPanelSettings from '@mui/icons-material/AdminPanelSettings';
import Logout from '@mui/icons-material/Logout';
import HomeIcon from '@mui/icons-material/Home';

export function MenuComponent({user}) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {setAnchorEl(event.currentTarget)};
    const handleClose = () => {setAnchorEl(null)};

    const goToStartingPage = () => {window.location.href="../home/home.html"};

    const goToAdminArea = () => {window.location.href="../admin-area/admin-area.html"};

    const logoutAndGoToLoginPage = async () => {
        // Session beenden
        await fetch("http://localhost:8080/api/auth/logout", {
            method: "POST",
            credentials: "include"
        });
        window.location.replace("../../../index.html") // Replace so that it is not possible to return to the logged-in state by using the browser's back Button
    };

    const topBar = React.createElement(
        Box, {key: 'menu-bar', className: 'menu-bar'}, [
            // Brand
            React.createElement(Typography, {key: 'brand', variant: 'h1', className: 'menu-title'}, 'Mane'),
            // Dropdown
            React.createElement(
                Tooltip, { key: "dropdown-container"},
                React.createElement(
                    IconButton, {key: "dropdown-btn", onClick: handleClick, color: 'inherit'},
                    React.createElement(MenuIcon, {key: 'dropdown-icon', className: 'menu-dropdown-icon'})
                )
            )
        ]
    );

    const menu = (
        React.createElement(
            Menu, {anchorEl, key: 'menu-dropdown-container', open, onClose: handleClose, onClick: handleClose,}, [
                React.createElement(
                    MenuItem, { key: "home", onClick: goToStartingPage }, [
                        React.createElement(
                            ListItemIcon, { key: "home-icon-container" },
                            React.createElement(HomeIcon, { key: "home-icon", fontSize: "small" })
                        ),
                        "Startseite"
                    ]
                ),
                user.adminAccess ? React.createElement(
                    MenuItem, { key: "admin-area", onClick: goToAdminArea }, [
                        React.createElement(
                            ListItemIcon, { key: "admin-area-icon-container" },
                            React.createElement(AdminPanelSettings, { key: "admin-area-icon", fontSize: "small" })
                        ),
                        "Admin-Bereich"
                    ]
                ) : null,
                React.createElement(
                    MenuItem, { key: "logout", onClick: logoutAndGoToLoginPage }, [
                        React.createElement(
                            ListItemIcon, { key: "logout-icon-container" },
                            React.createElement(Logout, { key: "logout-icon", fontSize: "small" })
                        ),
                        "Ausloggen"
                    ]
                )
            ]
        )
    );
    return React.createElement(AppBar, {key: "menu-app-bar", position: 'static'}, [topBar, menu]);
}