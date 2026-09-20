import React from "react";
import {IconButton} from "@mui/material";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

export function BackButton({pageLink}) {
    const backToPage = () => {window.location.href = pageLink}

    return React.createElement(
        IconButton, { key: "back-btn", className: 'back-btn ml-2 mt-3', color: 'primary', onClick: () => backToPage() },
        React.createElement(ChevronLeftIcon, { color: "primary", fontSize: "medium" })
    )
}