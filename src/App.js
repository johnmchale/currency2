import "./App.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Grid,
  TextField,
  FormGroup,
  FormControlLabel,
  createTheme,
  ThemeProvider,
  styled,
  Switch,
} from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";

var gbp_zar = 0;
var zar_gbp = 0;

const currencyNames = {
  g: {
    name: "GBP",
    flag: "./united-32x32-33115.png",
  },
  z: {
    name: "ZAR",
    flag: "./south-32x32-33130.png",
  },
};

function toGBP(ZAR) {
  return ZAR * zar_gbp;
}

function toZAR(GBP) {
  return GBP * gbp_zar;
}

function tryConvert(currencyAmount, convertFunction) {
  const input = parseFloat(currencyAmount);
  if (Number.isNaN(input)) {
    return "";
  }
  const output = convertFunction(input);
  const rounded = (Math.round(output * 100) / 100).toFixed(2);
  return rounded.toString();
}

function CurrencyVerdict(props) {
  if (props.GBP >= 100) {
    return <p className="font-link">Amount entered is &#62;&#61; 100 GBP!</p>;
  }
  return <p className="font-link">Amount entered is less than 100 GBP</p>;
}

function CurrencyInput({ currency, currencyAmount, onCurrencyChange }) {
  function handleChange(e) {
    onCurrencyChange(currency, e.target.value);
  }

  return (
    <div>
      <Box
        component="form"
        sx={{
          "& > :not(style)": { m: 1, width: "25ch" },
        }}
        noValidate
        autoComplete="off"
      >
        <Grid container direction="row" spacing={1} alignItems="center">
          <Grid item>Enter value in {currencyNames[currency].name}</Grid>
          <Grid item>
            <img
              src={currencyNames[currency].flag}
              alt={currencyNames[currency].name}
            ></img>
          </Grid>
        </Grid>
        <TextField
          id="outlined-helperText"
          label={currency === "g" ? "£" : "R"}
          variant="outlined"
          value={currencyAmount}
          onChange={handleChange}
        />
      </Box>
    </div>
  );
}

function CurrencyCalculator() {
  const [GBP, setGBP] = useState(0);
  const [ZAR, setZAR] = useState(0);

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const axiosPosts = async () => {
      const response = await axios(
        "https://free.currconv.com/api/v7/convert?q=GBP_ZAR,ZAR_GBP&compact=ultra&apiKey=56860b096bf50b37a3b3"
      );
      setPosts(response.data);
    };
    axiosPosts();
  }, []);

  gbp_zar = posts.GBP_ZAR;
  zar_gbp = posts.ZAR_GBP;

  function handleCurrencyChange(currency, value) {
    const ZAR = currency === "g" ? tryConvert(value, toZAR) : value;
    setZAR(ZAR);
    const GBP = currency === "z" ? tryConvert(value, toGBP) : value;
    setGBP(GBP);
  }

  return (
    <div>
      {/* {gbp_zar} */}
      <CurrencyInput
        currency="g"
        currencyAmount={GBP}
        onCurrencyChange={handleCurrencyChange}
      />
      {/* {zar_gbp} */}
      <CurrencyInput
        currency="z"
        currencyAmount={ZAR}
        onCurrencyChange={handleCurrencyChange}
      />
      <CurrencyVerdict GBP={parseFloat(GBP)} />
    </div>
  );
}

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const paletteType = darkMode ? "dark" : "light";
  const theme = createTheme({
    palette: {
      mode: paletteType,
    },
  });

  const MaterialUISwitch = styled(Switch)(({ theme }) => ({
    width: 62,
    height: 34,
    padding: 7,
    "& .MuiSwitch-switchBase": {
      margin: 1,
      padding: 0,
      transform: "translateX(6px)",
      "&.Mui-checked": {
        color: "#fff",
        transform: "translateX(22px)",
        "& .MuiSwitch-thumb:before": {
          backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
            "#fff"
          )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
        },
        "& + .MuiSwitch-track": {
          opacity: 1,
          backgroundColor:
            theme.palette.mode === "dark" ? "#8796A5" : "#aab4be",
        },
      },
    },
    "& .MuiSwitch-thumb": {
      backgroundColor: theme.palette.mode === "dark" ? "#003892" : "#001e3c",
      width: 32,
      height: 32,
      "&:before": {
        content: "''",
        position: "absolute",
        width: "100%",
        height: "100%",
        left: 0,
        top: 0,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          "#fff"
        )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
      },
    },
    "& .MuiSwitch-track": {
      opacity: 1,
      backgroundColor: theme.palette.mode === "dark" ? "#8796A5" : "#aab4be",
      borderRadius: 20 / 2,
    },
  }));

  function handleThemeChange() {
    setDarkMode(!darkMode);
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <FormGroup>
        <FormControlLabel
          control={
            <MaterialUISwitch
              sx={{ m: 1 }}
              checked={darkMode ? true : false}
              onChange={handleThemeChange}
            />
          }
          label={darkMode ? "Dark Mode" : "Light Mode"}
        />
      </FormGroup>
      <CurrencyCalculator />
    </ThemeProvider>
  );
}

export default App;
