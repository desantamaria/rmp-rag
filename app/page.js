'use client'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Stack, TextField } from "@mui/material";
import { useState } from "react";
import SendIcon from '@mui/icons-material/Send';
import TuneIcon from '@mui/icons-material/Tune';

export default function Home() {
    const [messages, setMessages] = useState([
        {
            role: "assistant",
            content: "Hi! I'm the Rate My Professor support assistant. How can I help you today?"
        }
    ])
    const [message, setMessage] = useState('')
    const [rmplink, setRMPLink] = useState('https://www.ratemyprofessors.com/professor/1486169')
    const [open, setOpen] = useState(false)



    const handleOpen = () => {
        setOpen(true)
    }
    const handleClose = () => {
        setOpen(false)
    }

    const sendMessage = async () => {
        setMessages((messages)=>[
            ...messages,
            {role: "user", content: message},
            {role: "assistant", content: ''}
        ])
        
        setMessage('')
        const response = fetch('/api/chat', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify([...messages, {role: "user", content: message}])
        }).then(async(res)=>{
            const reader = res.body.getReader()
            const decoder = new TextDecoder()

            let result = ''
            return reader.read().then(function processText({done, value}){
                if (done){
                    return result
                }
                const text = decoder.decode(value || new Uint8Array(), {stream: true})
                setMessages((messages)=>{
                    let lastMessage = messages[messages.length - 1]
                    let otherMessages = messages.slice(0, messages.length - 1)
                    return [
                        ...otherMessages,
                        {...lastMessage, content: lastMessage.content + text},
                    ]
                })
                return reader.read().then(processText)
            })
        })
    }

    const scrape = async () => {
        const response = fetch('/api/scrape', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: rmplink
        }).then((res) => res.json())
          .then((data) => {
            console.log(data)
            setMessages((messages)=>[
                ...messages,
                {role: "assistant", content: `Added professor information about ${data.name}`},
            ])
            handleClose()
        })
    }

  return(
    <Box
        width="100vw"
        height="100vh"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        sx={{
            background: "rgb(244,208,63)",
            background: "linear-gradient(339deg, rgba(244,208,63,1) 0%, rgba(22,160,133,1) 100%)",
        }}
    >
        <Stack
            direction="column"
            width="500px"
            height="700px"
            border="1px solid #f4d03f"
            p={2}
            spacing={3}
            sx={{
                background: "rgba(255, 255, 255, .5)",
            }}
        >
            <Stack
                direction="column"
                spacing={2}
                flexGrow={1}
                overflow='auto'
                maxHeight='100%'
            >
            {messages.map((message, index)=>(
                <Box
                    key={index}
                    display="flex"
                    justifyContent="center"
                    alignItems={message.role === "assistant" ? 'flex-start' : 'flex-end'}
                >
                    <Box
                        bgcolor={message.role === 'assistant' ? 'secondary.main' : 'primary.main'}
                        color="white"
                        borderRadius={16}
                        p={3}
                    >
                        {message.content}
                    </Box>
                </Box>
            ))}
            </Stack>
            <Stack
                direction="row"
                spacing={2}
            >
                <TextField
                    label="Message"
                    fullWidth
                    value={message}
                    onChange={(e)=>{
                        setMessage(e.target.value)
                    }}
                />
                <Button variant="contained" onClick={sendMessage}><SendIcon/></Button>
                <Button variant="contained" onClick={handleOpen}><TuneIcon/></Button>
            </Stack>
        </Stack>
        


        <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Enter a Professor's RMP Profile Link</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please enter a link to add to the AI's knowledge
                    </DialogContentText>
                    <TextField 
                        autoFocus
                        margin="dense"
                        label="Collection Name"
                        type="text"
                        fullWidth
                        value={rmplink}
                        onChange={(e) => {setRMPLink(e.target.value)}}
                        variant="outlined"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={scrape}>Save</Button>
                </DialogActions>
            </Dialog>
    </Box>
  )
}
