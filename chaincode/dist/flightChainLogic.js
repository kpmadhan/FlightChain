"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FlightChainLogic = /** @class */ (function () {
    function FlightChainLogic() {
    }
    /**
     * Generate the unique flight key from the ACRIS data.
     * @param {AcrisFlight} flight
     *
     * @returns {string}
     */
    FlightChainLogic.generateUniqueKey = function (flight) {
        var flightNum = flight.flightNumber.trackNumber;
        while (flightNum.length < 4)
            flightNum = '0' + flightNum;
        var flightKey = flight.originDate + flight.departureAirport + flight.operatingAirline.iataCode + flightNum;
        console.log('generateUniqueKey: ', flightKey);
        return flightKey;
    };
    /**
     * Validate the ACRIS json data.
     *
     * @param {AcrisFlight} flight
     * @throws Error if the ACRIS is not valid
     */
    FlightChainLogic.verifyValidACRIS = function (flight) {
        if (!flight || !flight.operatingAirline || !flight.operatingAirline.iataCode || flight.operatingAirline.iataCode.length !== 2) {
            var msg = "Invalid flight data, there is no valid flight.operatingAirline.iataCode set.";
            console.log(msg, flight);
            throw new Error(msg);
        }
        if (!flight || !flight.departureAirport || flight.departureAirport.length !== 3) {
            var msg = 'Invalid flight data, there is no valid flight.departureAirport set.';
            console.log(msg, flight);
            throw new Error(msg);
        }
        if (!flight || !flight.arrivalAirport || flight.arrivalAirport.length !== 3) {
            var msg = 'Invalid flight data, there is no valid flight.arrivalAirport set.';
            console.log(msg, flight);
            throw new Error(msg);
        }
        if (!flight || !flight.flightNumber || !flight.flightNumber.trackNumber || flight.flightNumber.trackNumber.length !== 4) {
            var msg = 'Invalid flight data, there is no valid 4 digit flight.flightNumber.trackNumber set.';
            console.log(msg, flight);
            throw new Error(msg);
        }
        if (!flight || !flight.originDate || !Date.parse(flight.originDate)) {
            var msg = 'Invalid flight data, there is no valid flight.originDate set (e.g. 2018-09-13).';
            console.log(msg, flight);
            throw new Error(msg);
        }
    };
    /**
     * Verify that the caller (identified by iata_code) is allowed to create/update this flight.
     *
     * @param {string} iata_code
     * @param {AcrisFlight} flight
     * @returns {boolean}
     */
    FlightChainLogic.verifyAbleToCreateOrModifyFlight = function (iata_code, flight) {
        if (!iata_code || iata_code.length > 3) {
            var msg = "Invalid iata-code '" + iata_code + "' ";
            console.log(msg);
            throw new Error(msg);
        }
        if (this.isAirline(iata_code)) {
            var operatingAirlne = this.getOperatingAirline(flight);
            if (operatingAirlne.toUpperCase() !== iata_code.toUpperCase()) {
                var msg = "Operating airline '" + operatingAirlne + "' does not match certificate iata-code '" + iata_code + "'";
                console.log(msg);
                throw new Error(msg);
            }
        }
        else {
            var departureAirport = this.getDepartureAirport(flight);
            var arrivalAirport = this.getArrivalAirport(flight);
            if (iata_code.toUpperCase() !== departureAirport.toUpperCase() &&
                iata_code.toUpperCase() !== arrivalAirport.toUpperCase()) {
                var msg = "The iata airport code " + iata_code + " does not match the departure airport (" + departureAirport + ") or the arrival airport (" + arrivalAirport + ")";
                console.log(msg);
                throw new Error(msg);
            }
        }
    };
    /**
     * If iata_code is 2, assume airline. Otherwise assume airport.
     * @param {string} iata_code
     * @returns {boolean}
     */
    FlightChainLogic.isAirline = function (iata_code) {
        return iata_code.length === 2;
    };
    FlightChainLogic.getOperatingAirline = function (flight) {
        return flight.operatingAirline.iataCode;
    };
    FlightChainLogic.getDepartureAirport = function (flight) {
        return flight.departureAirport;
    };
    FlightChainLogic.getArrivalAirport = function (flight) {
        return flight.arrivalAirport;
    };
    return FlightChainLogic;
}());
exports.FlightChainLogic = FlightChainLogic;
