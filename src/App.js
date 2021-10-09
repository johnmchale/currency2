import "./App.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FormControl } from "react-bootstrap";
import { InputGroup } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { Form } from "react-bootstrap";

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
    <div className="font-link">
      <fieldset className="form-label ms-2">
        <legend>
          Enter value in {currencyNames[currency].name}{" "}
          <img
            src={currencyNames[currency].flag}
            alt={currencyNames[currency].name}
          ></img>
        </legend>
      </fieldset>
      <Form.Group className="mb-3">
        <InputGroup className="mb-3" size="lg">
          <InputGroup.Text>{currency === "g" ? "£" : "R"}</InputGroup.Text>
          <FormControl value={currencyAmount} onChange={handleChange} />
        </InputGroup>
      </Form.Group>
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
  return (
    <div>
      <CurrencyCalculator />
    </div>
  );
}

export default App;
