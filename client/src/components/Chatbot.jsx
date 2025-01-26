import axios from 'axios';
import {
    Box,
    Paper,
    Typography,
    IconButton,
    TextField,
    Container,
    Stack,
    Avatar,
    ThemeProvider,
    createTheme,
    Button,
    Drawer,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Divider,
    CircularProgress
} from '@mui/material';
import { Close, Send, Agriculture, Chat as ChatIcon } from '@mui/icons-material';
import { useState, useEffect } from 'react';

const theme = createTheme({
    palette: {
        primary: {
            main: '#2E7D32',
            light: '#4CAF50',
        },
        secondary: {
            main: '#81C784',
        },
        background: {
            default: '#F1F8E9',
            paper: '#FFFFFF',
        },
    },
});

const DRAWER_WIDTH = 240;
const API_BASE_URL = 'https://implementation-sufb.onrender.com/api/chats';

function Chatbot() {
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [isInitialQuestion, setIsInitialQuestion] = useState(true);
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(true);

    useEffect(() => {
        fetchChats();
    }, []);

    const fetchChats = async () => {
        try {
            const response = await axios.get(API_BASE_URL);
            setChats(response.data);
        } catch (error) {
            console.error('Error fetching chats:', error);
        }
    };

    const createNewChat = async () => {
        try {
            const response = await axios.post(API_BASE_URL, { title: 'New Chat' });
            setChats([...chats, response.data]);
            setSelectedChat(response.data._id);
            setChatHistory([]);
            setIsInitialQuestion(true);
        } catch (error) {
            console.error('Error creating new chat:', error);
        }
    };

    const API_MESSAGE_URL = 'https://implementation-sufb.onrender.com/api/message';

    const handleSend = async () => {
        if (!message.trim()) return;
        setIsLoading(true);

        const newMessage = { type: 'user', content: message };
        setChatHistory([...chatHistory, newMessage]);
        setMessage('');
        setIsLoading(false);

        try {
            console.log(chatHistory);

            const response = await fetch(API_MESSAGE_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    messages: [{ content: message }]
                }),
            });

            const data = await response.json();
            setChatHistory([...chatHistory, newMessage, { type: 'bot', content: data.answer }]);
        } catch (error) {
            console.error('Error sending message:', error.message);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ display: 'flex', height: '100vh', flexDirection: { xs: 'column', sm: 'row' } }}>
                <Drawer
                    variant="permanent"
                    sx={{
                        width: DRAWER_WIDTH,
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            width: DRAWER_WIDTH,
                            boxSizing: 'border-box',
                            backgroundColor: 'background.default',
                            borderRight: '1px solid',
                            borderColor: 'primary.light',
                        },
                        display: { xs: 'none', sm: 'block' }, // Hide on small screens
                    }}
                >
                    <Box sx={{ p: 2, backgroundColor: 'primary.main' }}>
                        <Typography variant="h6" sx={{ color: '#fff' }}>
                            FarmBot
                        </Typography>
                    </Box>
                    <Divider />
                    <List>
                        {chats.map((chat) => (
                            <ListItem
                                button
                                key={chat._id}
                                selected={selectedChat === chat._id}
                                onClick={() => setSelectedChat(chat._id)}
                            >
                                <ListItemIcon>
                                    <ChatIcon color="primary" />
                                </ListItemIcon>
                                <ListItemText primary={chat.title} />
                            </ListItem>
                        ))}
                    </List>
                </Drawer>

                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <Box
                        sx={{
                            flex: 1,
                            overflow: 'auto',
                            p: 2,
                            backgroundColor: 'background.default',
                            maxHeight: 'calc(100vh - 160px)', // Adjust height for chat box
                        }}
                    >
                        {chatHistory.map((chat, index) => (
                            <Stack
                                key={index}
                                direction="row"
                                spacing={2}
                                sx={{
                                    mb: 2,
                                    justifyContent: chat.type === 'user' ? 'flex-end' : 'flex-start'
                                }}
                            >
                                {chat.type === 'bot' && (
                                    <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                                        <Agriculture sx={{ fontSize: 20 }} />
                                    </Avatar>
                                )}
                                <Paper
                                    elevation={1}
                                    sx={{
                                        p: 2,
                                        maxWidth: '70%',
                                        backgroundColor: chat.type === 'user' ? 'primary.main' : '#fff',
                                        color: chat.type === 'user' ? 'white' : 'text.primary',
                                        borderRadius: '12px',
                                        borderTopLeftRadius: chat.type === 'bot' ? '0' : '12px',
                                        borderTopRightRadius: chat.type === 'user' ? '0' : '12px',
                                    }}
                                >
                                    <Typography>{chat.content}</Typography>
                                </Paper>
                                {chat.type === 'user' && (
                                    <Avatar sx={{ bgcolor: 'secondary.main', width: 32, height: 32 }}>U</Avatar>
                                )}
                                {isLoading && <CircularProgress />}
                            </Stack>
                        ))}
                    </Box>
                    <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'primary.light', backgroundColor: '#fff' }}>
                        <Stack direction="row" spacing={1}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                placeholder="Start chatting ..."
                                size="small"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            />
                            <IconButton
                                onClick={handleSend}
                                disabled={!message.trim()}
                                sx={{
                                    backgroundColor: 'primary.main',
                                    color: '#fff',
                                    '&:hover': { backgroundColor: 'primary.dark' },
                                    '&.Mui-disabled': { backgroundColor: '#E0E0E0' }
                                }}
                            >
                                <Send />
                            </IconButton>
                        </Stack>
                    </Box>
                </Box>
            </Box>
        </ThemeProvider>
    );
}

export default Chatbot;
