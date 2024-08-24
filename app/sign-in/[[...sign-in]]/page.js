import { SignIn } from '@clerk/nextjs'
import {Box, 
        Container, 
        Typography, 
        AppBar, 
        Toolbar, 
        Button, 
        Link} from '@mui/material'

export default function SignUpPage() {
    return <Container maxWidth= "false" disableGutters>
        <AppBar position="static">
            <Toolbar>
                <Typography variant='h6' sx={{
                    flexGrow: 1
                }}>
                Rate My Professor Chat Assistant
                </Typography>
                <Button color="inherit">
                    <Link color="#FFFF" href = "/sign-in" passHref>
                        Login
                    </Link>
                </Button>
                <Button color="inherit">
                    <Link color="#FFFF" href= "/sign-up" passHref>
                        Sign Up
                    </Link>
                </Button>
            </Toolbar>
        </AppBar>
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
        >
            <Typography variant="h4" gutterBottom>
                Sign In
            </Typography>
            <SignIn />
        </Box>
    </Container> 
}