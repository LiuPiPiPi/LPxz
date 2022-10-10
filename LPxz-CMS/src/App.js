import { useSelector } from 'react-redux'
import { Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import { CssBaseline, StyledEngineProvider } from '@mui/material'

// routing
import Routes from 'routes'
import themes from 'themes'

function App() {
    // const customization = useSelector((state) => state.customization);

    return (
        // <StyledEngineProvider injectFirst>
        //     <ThemeProvider theme={themes(customization)}>
        //         <CssBaseline />
        //         {/* <NavigationScroll> */}
        //         <Routes />
        //         {/* </NavigationScroll> */}
        //     </ThemeProvider>
        // </StyledEngineProvider>
        <>
            <Routes />
        </>
    )
}

export default App
