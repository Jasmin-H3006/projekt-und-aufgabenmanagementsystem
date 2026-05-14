import React from "react";
import {AppBar, Button, Typography, Toolbar, IconButton, Box, Tooltip, MenuItem, ListItemIcon, Menu} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import AdminPanelSettings from '@mui/icons-material/AdminPanelSettings';
import Logout from '@mui/icons-material/Logout';

export function MenuComponent() {

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const goToAdminArea = () => {
        window.location.href="../admin-area/admin-area.html"
    };

    const logoutAndGoToLoginPage = () => {

        // Session beenden



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
                { key: "admin-area", onClick: goToAdminArea },
                [
                    React.createElement(
                        ListItemIcon,
                        { key: "admin-area-icon" },
                        React.createElement(AdminPanelSettings, { fontSize: "small" })
                    ),
                    "Zum Admin-Bereich",
                ]
            ),
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

    /*const appBarContent = React.createElement(
        Toolbar,
        null,
        [
            // Admin-Bereich Button
            React.createElement(
                Button,
                {className: 'menu-btn', size: 'large', color: 'secondary', variant: 'contained'},
                'Zum Admin-Bereich'
            ),
            // Brand
            React.createElement(
                Typography,
                {variant: 'h1', className: 'menu-title'},
                'Mane'
            ),
            // Log-out Button
            React.createElement(
                Button,
                {className: 'menu-btn', size: 'medium', color: 'secondary', variant: 'contained'},
                'Log-out'
            ),
            // Benutzername
            React.createElement(
                Typography,
                {className: 'menu-user', variant: 'h6', color: 'text'},
                '{Benutzername}'
            ),
        ]
    );

    return (React.createElement(
        AppBar,
        {position: 'static'},
        appBarContent
    ));
     */
}