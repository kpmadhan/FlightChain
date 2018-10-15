"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var shim = require("fabric-shim");
var flightChain_1 = require("./flightChain");
// FlightChain Chaincode is moved to seperate file for testing
shim.start(new flightChain_1.FlightChain());
