import React from "react";
import {AppBar, Typography, IconButton, Box, Tooltip, MenuItem, ListItemIcon, Menu} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import AdminPanelSettings from '@mui/icons-material/AdminPanelSettings';
import Logout from '@mui/icons-material/Logout';
import HomeIcon from '@mui/icons-material/Home';

export function MenuComponent({user}) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const goToStartingPage = () => {
        window.location.href="../home/home.html"
    };

    const goToAdminArea = () => {
        window.location.href="../admin-area/admin-area.html"
    };

    const logoutAndGoToLoginPage = async () => {
        // Session beenden
        await fetch("http://localhost:8080/api/auth/logout", {
            method: "POST",
            credentials: "include",
        });
        window.location.href="../../../index.html"
    };


    const topBar = React.createElement(
        Box,
        {key: 'menu-bar', className: 'menu-bar'},
        [
            // Brand
            React.createElement(
                Typography,
                {key: 'brand', variant: 'h1', className: 'menu-title'},
                'Mane'
            ),
            // Dropdown
            React.createElement(
                Tooltip,
                { key: "dropdown"},
                React.createElement(
                    IconButton,
                    {onClick: handleClick, color: 'inherit'},
                    React.createElement(MenuIcon, {className: 'menu-dropdown-icon'}, null)
                )
            ),
        ]
    );

    const menu = React.createElement(
        Menu,
        {
            anchorEl,
            key: 'menu-dropdown-menu',
            open,
            onClose: handleClose,
            onClick: handleClose,
        },
        [
            React.createElement(
                MenuItem,
                { key: "home", onClick: goToStartingPage },
                [
                    React.createElement(
                        ListItemIcon,
                        { key: "home-icon" },
                        React.createElement(HomeIcon, { fontSize: "small" })
                    ),
                    "Startseite",
                ]
            ),
            user.adminAccess ? React.createElement(
                MenuItem,
                { key: "admin-area", onClick: goToAdminArea },
                [
                    React.createElement(
                        ListItemIcon,
                        { key: "admin-area-icon" },
                        React.createElement(AdminPanelSettings, { fontSize: "small" })
                    ),
                    "Admin-Bereich",
                ]
            ) : null,
            React.createElement(
                MenuItem,
                { key: "logout", onClick: logoutAndGoToLoginPage },
                [
                    React.createElement(
                        ListItemIcon,
                        { key: "logout-icon" },
                        React.createElement(Logout, { fontSize: "small" })
                    ),
                    "Ausloggen",
                ]
            ),
        ]
    );

    return React.createElement(AppBar, {position: 'static'}, [topBar, menu]);
}