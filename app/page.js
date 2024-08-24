'use client'
//import getStripe from "../utils/get-stripe"
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs"
import {
    AppBar,
    Box,
    Button,
    Container,
    Grid,
    Toolbar,
    Typography,
    Paper
} from "@mui/material"
import Head from "next/head"
import Link from "next/link"

import theme from "../theme"
import { redirect } from "next/dist/server/api-utils"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Home() {
    const {isLoaded, isSignedIn, user} = useUser()
    const router = useRouter()

    const HandleSubmit = async () => {
        const checkoutSession = await fetch('/api/checkout_session', {
            method: 'POST',
            headers: {
                origin: 'http://localhost:3000',
          },
        })

        const checkoutSessionJson = await checkoutSession.json()

        if (checkoutSession.statusCode === 500) {
            console.error(session_Id)
            return
        }

        const stripe = await getStripe()

        const {error} = await stripe.redirectToCheckout({
            sessionId: checkoutSessionJson.id,
        })

        if (error) {
            console.warn(error.message)
        }
    }
    const checksignin=async()=> {
        if(!user){
            alert("Please sign in before continuing")
            return
        }
        router.push('/ratemyprofgpt')
        
    }
  return (
    <Container maxWidth="false" disableGutters>
        <Head>
            <title>Rate My Professor Chat Assistant</title>
            <meta name = 'description' content="Create flashcard from your text" />
        </Head>

        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" style={{flexGrow: 1}}>Rate My Professor Chat Assistant</Typography>
                <SignedOut>
                    <Button color="inherit" href="/sign-in">
                            Login
                    </Button>
                    <Button color="inherit" href="/sign-up">
                            Sign up
                    </Button>
                </SignedOut>
                <SignedIn>
                    <UserButton />
                </SignedIn>
            </Toolbar>
        </AppBar>

        <Container sx={{paddingTop: "30px"}}>

        <Box
            textAlign="center"
        >
            <Typography variant="h2">Welcome Rate My Professor Chat Assistant</Typography>
            <Typography variant="h5" gutterBottom>Get assistance signing up for your next classes</Typography>
            <Button 
            variant="contained" 
            //href="/ratemyprofgpt"
            onClick={checksignin} 
            color="primary" 
            sx={{mt: 2}}
            >Get Started</Button>
        </Box> 

        <Container>
                <Typography
                    variant="h4"
                    textAlign={"center"}
                    gutterBottom
                    color={"black"}
                    mt={10}
                >
                    Features
                </Typography>
                <Grid container spacing={4}>
                    <Grid item xs={4} style={{ width: "100%" }}>
                        <Paper
                            elevation={3}
                            style={{
                                height: "150px",
                                display: "flex",
                                flexDirection: "column",
                                textAlign: "center",
                                alignItems: "center",
                                padding: "10px",
                                backgroundColor: "#16a085",
                                color: "white",
                                borderRadius: "8px",
                            }}
                        >
                            <Typography
                                variant="h6"
                                textAlign={"center"}
                                my={2.5}
                            >
                                Easy Text Input
                            </Typography>
                            Simply input your text and let our software do the
                            rest. Its simple!
                        </Paper>
                    </Grid>
                    <Grid item xs={4} style={{ width: "100%" }}>
                        <Paper
                            elevation={3}
                            style={{
                                height: "150px",
                                display: "flex",
                                flexDirection: "column",
                                textAlign: "center",
                                alignItems: "center",
                                padding: "10px",
                                backgroundColor: "#16a085",
                                color: "white",
                                borderRadius: "8px",
                            }}
                        >
                            <Typography
                                variant="h6"
                                textAlign={"center"}
                                my={2.5}
                            >
                                Customizable
                            </Typography> 
                            The software can adapt to different difficulty levels or focus on specific topics.
                        </Paper>
                    </Grid>
                    <Grid item xs={4} style={{ width: "100%" }}>
                        <Paper
                            elevation={3}
                            style={{
                                height: "150px",
                                display: "flex",
                                flexDirection: "column",
                                textAlign: "center",
                                alignItems: "center",
                                padding: "10px",
                                backgroundColor: "#16a085",
                                color: "white",
                                borderRadius: "8px",
                            }}
                        >
                            <Typography
                                variant="h6"
                                textAlign={"center"}
                                my={2.5}
                            >
                                Accesible
                            </Typography>
                            The software can rephrase complex concepts into simpler terms.
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Container>

    </Container>

  )
}