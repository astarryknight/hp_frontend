import React, { useState, useEffect } from 'react';
import { Typography, LinearProgress, Stack, Sheet, Button, IconButton, Input, Select, Option } from '@mui/joy'
import { CssVarsProvider, useColorScheme } from '@mui/joy/styles';
import MapPicker from 'react-google-map-picker'
import Moon from '@mui/icons-material/DarkMode';
import Sun from '@mui/icons-material/LightMode';
import '@fontsource/inter';
import './App.css';


//Map
const DefaultLocation = { lat: 10, lng: 106 };
const DefaultZoom = 10;

/*TODO - FadeIn */

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

function LabeledInput({ placeholder, label, margin, width, required, id }) {
  return (
    <Sheet sx={{ backgroundColor: "inherit", display: "flex", flexDirection: "column", alignItems: "flex-start", marginTop: "1rem", width: "100%" }}>
      <Typography fontSize="sm" sx={{ marginTop: ".25rem" }}>{label}<Typography sx={{ color: "red" }}> *</Typography></Typography>
      <Input id={id} placeholder={placeholder} sx={{ width: width }} />
    </Sheet>
  );
}

function PersonalInfo() {
  return (
    <Sheet className="survey" sx={{ backgroundColor: 'background.level1', height: "fit-content", display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
      <Typography fontSize="lg" fontWeight="lg" sx={{ marginTop: ".5rem" }}>1. Personal Information</Typography>
      <Sheet sx={{ display: "flex", flexDirection: "row", backgroundColor: "inherit" }}>
        <LabeledInput id="fname" width="95%" label="First name" placeholder="John" />
        <LabeledInput id="lname" width="100%" label="Last name" placeholder="Doe" />
      </Sheet>
      <LabeledInput id="email" width="100%" label="Email" placeholder="example@domain.com" />
      <LabeledInput id="password" width="100%" label="Password" placeholder="********" />
      <LabeledInput width="100%" label="Password Confirmation" placeholder="********" />
    </Sheet>
  );
}

function Budget() {
  return (
    <Sheet className="survey" sx={{ backgroundColor: 'background.level1', height: "fit-content", display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
      <Typography fontSize="lg" fontWeight="lg" sx={{ marginTop: ".5rem" }}>2. What is your Budget?</Typography>
      <Sheet sx={{ display: "flex", flexDirection: "row", backgroundColor: "inherit", alignItems: "flex-end" }}>
        <LabeledInput id="budget" width="95%" label="Approximate Budget" placeholder="100" />
        <Select id="currency" sx={{ height: "50%", minWidth: "fit-content" }}>
          <Option value="dog">$ USD</Option>
          <Option value="cat">€ Euro</Option>
          <Option value="cat">¥ Yen</Option>
          <Option value="cat">a</Option>
        </Select>
      </Sheet>
    </Sheet>
  );
}

function Timeline() {
  return (
    <Sheet className="survey" sx={{ backgroundColor: 'background.level1', height: "fit-content", display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
      <Typography fontSize="lg" fontWeight="lg" sx={{ marginTop: ".5rem" }}>3. How long will you be studying?</Typography>
      <Sheet sx={{ display: "flex", flexDirection: "row", backgroundColor: "inherit", alignItems: "center" }}>
        <LabeledInput id="time" width="100%" label="Number of Months" placeholder="6" />
      </Sheet>
    </Sheet>
  );
}

function Location() {

  //map
  const [defaultLocation, setDefaultLocation] = useState(DefaultLocation);
  const [location, setLocation] = useState(defaultLocation);
  const [zoom, setZoom] = useState(DefaultZoom);

  function handleChangeLocation(lat, lng) {
    setLocation({ lat: lat, lng: lng });
  }

  function handleChangeZoom(newZoom) {
    setZoom(newZoom);
  }

  function handleResetLocation() {
    setDefaultLocation({ ...DefaultLocation });
    setZoom(DefaultZoom);
  }

  return (
    <Sheet className="survey" sx={{ backgroundColor: 'background.level1', height: "fit-content", display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
      <Typography fontSize="lg" fontWeight="lg" sx={{ marginTop: ".5rem" }}>4. Where are you studying?</Typography>
      <>
        <button onClick={handleResetLocation}>Reset Location</button>
        <label>Latitute:</label><input type='text' value={location.lat} disabled />
        <label>Longitute:</label><input type='text' value={location.lng} disabled />
        <label>Zoom:</label><input type='text' value={zoom} disabled />

        <MapPicker defaultLocation={defaultLocation}
          zoom={zoom}
          mapTypeId="roadmap"
          style={{ height: '30vh', width: "40vw" }}
          onChangeLocation={handleChangeLocation}
          onChangeZoom={handleChangeZoom}
          apiKey='' />
      </>
    </Sheet>
  );
}

function QuestionBody({ progress, fname, setFName, lname, setLName, email, setEmail, password, setPassword, budget, setBudget, months, setMonths, location, setLocation }) {
  var p = [<PersonalInfo />, <Budget />, <Timeline />, <Location />]
  progress = progress / 33.33
  // if (progress == 0) {
  //   // setFName(document.getElementById("fname").value)
  //   // setLName(document.getElementById("lname").value)
  //   // setEmail(document.getElementById("email").value)
  //   // setPassword(document.getElementById("password").value)
  //   return (
  //     <PersonalInfo />
  //   )
  // } else if (progress > 0 && progress < 34) {
  //   // setBudget(document.getElementById("budget").value)
  //   return (
  //     <Budget />
  //   )
  // } else if (progress > 34 && progress < 67) {
  //   // setMonths(document.getElementById("time").value)
  //   return (
  //     <Timeline />
  //   )
  // } else {
  //   // setLocation([0, 0]) //give valid location value to server//give valid location value to server//give valid location value to server//give valid location value to server
  //   return (
  //     < Location />
  //   )
  // }
  return (
    p[progress]
  )
}

async function getResponse(fname, lname, email, password, budget, months, location) {

  var data_object = {
    "info": {
      "f_name": fname,
      "l_name": lname,
      "email": email,
      "password": password
    },
    "resources": {
      "budget": budget,
      "time": months,
      "location": location //give valid location value to server
    }
  }

  console.log(data_object)

  //LOCAL: http://localhost:3000/send_data
  //PROD: https://hackprincetonserver.vercel.app/send_data
  var response = await fetch('http://localhost:3000/send_data', {
    method: "POST",
    body: JSON.stringify(data_object),
    headers: {
      "Content-Type": "application/json",
    }
  }) //.then(res => {
  //   return res
  // })
  if (response.ok) {
    console.log("server got it")
    var res = await fetch('http://localhost:3000/get_data/' + email).then(res => res.json()).then(data => {
      alert(data);
    });
  }
  //return response;
}

async function gemini() {
  //LOCAL: http://localhost:3000/send_data
  //PROD: https://hackprincetonserver.vercel.app/send_data
  // if (response.ok) {
  //   fetch('https://hackprincetonserver.vercel.app/time').then(res => res.json()).then(data => {
  //     console.log(data.time)
  //   });
  // }
  //return response;
}

//AIzaSyABJnAuGl1Q3avq9 - bPQo3FGdNNPRN140Y

function App() {

  const [progress, setProgress] = useState(0);

  // //information variables - REDUX
  const [fname, setFName] = useState("");
  const [lname, setLName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [budget, setBudget] = useState(0);
  const [months, setMonths] = useState(0);
  const [location, setLocation] = useState([0, 0]);

  return (
    <CssVarsProvider>
      <Sheet className="main" sx={{ width: "100vw", height: "100vh", backgroundColor: 'background.body', padding: "0px", margin: "0px", display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
        <ThemeToggle />
        <Sheet className="container" sx={{ width: "fit-content", maxWidth: "500px", height: "fit-content", display: "flex", flexDirection: "column", justifyContent: "flex-start", paddingTop: "2rem", backgroundColor: 'background.level1', borderRadius: "0.5rem", marginTop: "3rem", padding: "1rem" }}>
          <LinearProgress determinate value={progress} sx={{ size: "1rem", maxHeight: "fit-content", marginTop: "0" }} />
          <QuestionBody progress={progress} fname={fname} setFName={setFName} lname={lname} setLName={setLName} email={email} setEmail={setEmail} password={password} setPassword={setPassword} budget={budget} setBudget={setBudget} months={months} setMonths={setMonths} location={location} setLocation={setLocation} />
          <Sheet sx={{ backgroundColor: "inherit", display: "flex", width: "100%" }}>
            <Button sx={{ marginTop: "1rem", width: "49%", marginRight: "2%" }} disabled={progress <= 0 ? true : false} onClick={() => {
              setProgress(progress - 33.33);
            }}>Back</Button>
            <Button sx={{ width: "49%", marginTop: "1rem" }} onClick={() => {
              if (progress >= 99.99) {
                //submit data
                //gemini();
                console.log("hi")
                getResponse({ fname, lname, email, password, budget, months, location });
              } else {
                //next
                if (progress == 0) {
                  setFName(document.getElementById("fname").value);
                  setLName(document.getElementById("lname").value);
                  setEmail(document.getElementById("email").value);
                  setPassword(document.getElementById("password").value);
                } else if (progress > 0 && progress < 34) {
                  setFName(document.getElementById("budget").value);
                } else if (progress > 34 && progress < 67) {
                  setFName(document.getElementById("time").value);
                } else {
                  setLocation([0, 0]) //fix this for prod
                }
                setProgress(progress + 33.33);
              }
              { progress >= 99.99 ? "Submit" : "Next" }
            }}>{progress >= 99.99 ? "Submit" : "Next"}</Button>
          </Sheet>
        </Sheet>
        <ThemeToggle />
      </Sheet>
    </CssVarsProvider>

  );
}

export default App;
