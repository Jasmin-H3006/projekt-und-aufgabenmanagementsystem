import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#3F40A6',
        },
        secondary: {
            main: '#A4C9FF',
        },
        background: {
            default: '#EBEBEB',
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


