import React, { useState, useEffect } from 'react';
import { Typography, LinearProgress, Stack, Sheet, Button, IconButton } from '@mui/joy'
import { CssVarsProvider, useColorScheme } from '@mui/joy/styles';
import Moon from '@mui/icons-material/DarkMode';
import Sun from '@mui/icons-material/LightMode';
import '@fontsource/inter';
import './App.css';


function ThemeToggle() {
  const { mode, setMode } = useColorScheme();
  return (
    <IconButton
      onClick={() => {
        setMode(mode === 'light' ? 'dark' : 'light');
      }}
      sx={{ backgroundColor: 'background.body', width: "2rem", height: "2rem" }}
    >
      {mode === 'light' ? <Sun /> : <Moon />}
    </IconButton>
  );
}

function App() {
  const [currentTime, setCurrentTime] = useState(0);
  const [progress, setProgress] = useState(20);

  useEffect(() => {
    fetch('https://hackprincetonserver.vercel.app/time').then(res => res.json()).then(data => {
      setCurrentTime(data.time);
    });
  }, []);

  return (
    <CssVarsProvider>
      <Sheet className="main" sx={{ width: "100vw", height: "100vh", backgroundColor: 'background.body', padding: "0px", margin: "0px", display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
        <ThemeToggle />
        <Sheet className="container" sx={{ width: "40%", maxWidth: "500px", display: "flex", flexDirection: "column", justifyContent: "flex-start", paddingTop: "2rem", height: "10rem", backgroundColor: 'background.level1' }}>
          <LinearProgress determinate value={progress} sx={{ size: "1rem", maxHeight: "fit-content", marginTop: "0", transition: "ease-in 2s" }} />
          <Sheet className="survey" sx={{ backgroundColor: 'background.level1', height: "fit-content", display: "flex", flexDirection: "column" }}>
            <Typography fontSize="lg" fontWeight="lg">Hi this is a test</Typography>
            <Button onClick={() => {
              setProgress(progress + 5);
            }}>Add progress</Button>
          </Sheet>
        </Sheet>
        <ThemeToggle />
      </Sheet>
    </CssVarsProvider>

  );
}

export default App;
