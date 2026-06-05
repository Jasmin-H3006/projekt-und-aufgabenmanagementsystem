import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#843B6B',
        },
        background: {
            default: '#DFC3CE',
        },
        success: {
            main: '#6EC356'
        },
        info: {
            main: '#F5ED16'
        },
        warning: {
            main: '#CD0439'
        },
        error: {
            main: '#CD0439'
        }
        /*
        secondary
        mode
        tonalOffset
        contrastThreshold
        common
        grey
        text
        divider
        action
        getContrastText
        */
    },
});

export default theme;


