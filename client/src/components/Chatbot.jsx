import axios from "axios";
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
  CircularProgress,
} from "@mui/material";
import { Close, Send, Agriculture, Chat as ChatIcon } from "@mui/icons-material";
import { useState, useEffect } from "react";

const theme = createTheme({
  palette: {
    primary: {
      main: "#2E7D32",
      light: "#4CAF50",
    },
    secondary: {
      main: "#81C784",
    },
    background: {
      default: "#F1F8E9",
      paper: "#FFFFFF",
    },
  },
});

const DRAWER_WIDTH = 240;
const API_BASE_URL = "https://implementation-sufb.onrender.com/api/chats";
const API_MESSAGE_URL = "https://implementation-sufb.onrender.com/api/message";

function Chatbot() {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    try {
      const response = await axios.get(API_BASE_URL);
      setChats(response.data);
    } catch (error) {
      console.error("Error fetching chats:", error);
    }
  };

  const createNewChat = async () => {
    try {
      const response = await axios.post(API_BASE_URL, { title: "New Chat" });
      setChats([...chats, response.data]);
      setSelectedChat(response.data._id);
      setChatHistory([]);
    } catch (error) {
      console.error("Error creating new chat:", error);
    }
  };

  const handleSend = async () => {
    if (!message.trim()) return;

    const newMessage = { type: "user", content: message };
    setChatHistory([...chatHistory, newMessage]);
    setMessage("");

    setIsLoading(true);

    try {
      const response = await axios.post(API_MESSAGE_URL, {
        messages: [{ content: message }],
      });
      const data = response.data;
      setChatHistory([
        ...chatHistory,
        newMessage,
        { type: "bot", content: data.answer },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          display: "flex",
          height: "100vh",
          flexDirection: { xs: "column", sm: "row" },
        }}
      >
        {/* Drawer for chat list */}
        <Drawer
          variant="permanent"
          sx={{
            width: DRAWER_WIDTH,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: DRAWER_WIDTH,
              boxSizing: "border-box",
              backgroundColor: "background.default",
              borderRight: "1px solid",
              borderColor: "primary.light",
            },
          }}
        >
          <Box sx={{ p: 2, backgroundColor: "primary.main" }}>
            <Typography variant="h6" sx={{ color: "#fff" }}>
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

        {/* Main chat area */}
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <Box
            sx={{
              flex: 1,
              overflow: "auto",
              p: 2,
              backgroundColor: "background.default",
              maxHeight: "calc(100vh - 160px)",
            }}
          >
            {chatHistory.map((chat, index) => (
              <Stack
                key={index}
                direction="row"
                spacing={2}
                sx={{
                  mb: 2,
                  justifyContent:
                    chat.type === "user" ? "flex-end" : "flex-start",
                }}
              >
                {chat.type === "bot" && (
                  <Avatar
                    sx={{ bgcolor: "primary.main", width: 32, height: 32 }}
                  >
                    <Agriculture sx={{ fontSize: 20 }} />
                  </Avatar>
                )}
                <Paper
                  elevation={1}
                  sx={{
                    p: 2,
                    maxWidth: "70%",
                    backgroundColor:
                      chat.type === "user" ? "primary.main" : "#fff",
                    color: chat.type === "user" ? "white" : "text.primary",
                    borderRadius: "12px",
                    borderTopLeftRadius: chat.type === "bot" ? "0" : "12px",
                    borderTopRightRadius: chat.type === "user" ? "0" : "12px",
                  }}
                >
                  <Typography>{chat.content}</Typography>
                </Paper>
                {chat.type === "user" && (
                  <Avatar
                    sx={{ bgcolor: "secondary.main", width: 32, height: 32 }}
                  >
                    U
                  </Avatar>
                )}
              </Stack>
            ))}
            {isLoading && <CircularProgress />}
          </Box>
          {/* Message input */}
          <Box
            sx={{
              p: 2,
              borderTop: "1px solid",
              borderColor: "primary.light",
              backgroundColor: "#fff",
            }}
          >
            <Stack direction="row" spacing={1}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Start chatting ..."
                size="small"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
              />
              <IconButton
                onClick={handleSend}
                disabled={!message.trim()}
                sx={{
                  backgroundColor: "primary.main",
                  color: "#fff",
                  "&:hover": { backgroundColor: "primary.dark" },
                  "&.Mui-disabled": { backgroundColor: "#E0E0E0" },
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
