'use strict';
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var fabric_chaincode_utils_1 = require("@theledger/fabric-chaincode-utils");
var certificateHelper_1 = require("./certificateHelper");
var flightChainLogic_1 = require("./flightChainLogic");
var merge = require('deepmerge');
var FlightChain = /** @class */ (function (_super) {
    __extends(FlightChain, _super);
    function FlightChain() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.certificateHelper = new certificateHelper_1.CertificateHelper();
        return _this;
    }
    /**
     * Must be defined, even if it is a NOOP
     *
     * @param {StubHelper} stubHelper
     * @param {string[]} args
     * @returns {Promise<void>}
     */
    FlightChain.prototype.initLedger = function (stubHelper, args) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('============= START : initLedger ===========');
                        return [4 /*yield*/, stubHelper.putState('version', 'MyVersion')];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Return a single flight, as identified by the flight key.
     *
     * @param stubHelper
     * @param args
     * @returns {Promise<any>}
     */
    FlightChain.prototype.version = function (stubHelper, args) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('============= START : version ===========');
                        return [4 /*yield*/, stubHelper.getStateAsObject('version')];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Return a single flight, as identified by the flight key.
     *
     * @param stubHelper
     * @param args
     * @returns {Promise<any>}
     */
    FlightChain.prototype.getFlight = function (stubHelper, args) {
        return __awaiter(this, void 0, void 0, function () {
            var flightKey;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('============= START : getFlight ===========');
                        if (args.length !== 1) {
                            throw new Error('Incorrect number of arguments. Expecting FlightKey ex: 2018-07-22LHRBA0227');
                        }
                        flightKey = args[0];
                        return [4 /*yield*/, stubHelper.getStateAsObject(flightKey)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Return the history of updates for a single flight, as identified by the flight key.
     *
     * @param stubHelper
     * @param args
     * @returns {Promise<void>}
     */
    FlightChain.prototype.getFlightHistory = function (stubHelper, args) {
        return __awaiter(this, void 0, void 0, function () {
            var flightKey;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('============= START : getFlightHistory ===========');
                        if (args.length < 1) {
                            throw new Error('Incorrect number of arguments. Expecting FlightKey ex: 2018-07-22LHRBA0227');
                        }
                        flightKey = args[0];
                        console.log('- start getFlightHistory: %s\n', flightKey);
                        return [4 /*yield*/, stubHelper.getHistoryForKeyAsList(flightKey)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Create a new flight on the network.
     *
     * @param stubHelper
     * @param args
     * @returns {Promise<void>}
     */
    FlightChain.prototype.createFlight = function (stubHelper, args) {
        return __awaiter(this, void 0, void 0, function () {
            var iataCode, flight, msg, flightKey, existingFlight, msg;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('============= START : Create Flight ===========');
                        iataCode = certificateHelper_1.CertificateHelper.getIataCode(stubHelper.getClientIdentity());
                        if (args.length !== 1) {
                            throw new Error('Incorrect number of arguments. Expecting one argument containing ACRIS flight data.');
                        }
                        console.log(args[0]);
                        flight = JSON.parse(args[0]);
                        if (!flight) {
                            msg = "No ACRIS flightdata passed in as arg[0] '" + args[0] + "'";
                            console.error(msg);
                            throw new Error(msg);
                        }
                        flightChainLogic_1.FlightChainLogic.verifyValidACRIS(flight);
                        flightChainLogic_1.FlightChainLogic.verifyAbleToCreateOrModifyFlight(iataCode, flight);
                        flightKey = flightChainLogic_1.FlightChainLogic.generateUniqueKey(flight);
                        return [4 /*yield*/, stubHelper.getStateAsObject(flightKey)];
                    case 1:
                        existingFlight = _a.sent();
                        if (existingFlight) {
                            msg = "A flight with this flight key '" + flightKey + "' already exists";
                            console.error(msg);
                            throw new Error(msg);
                        }
                        // TODO: Check if this docType needs to be set for couchDB
                        flight.docType = 'flight';
                        // TODO: Is this best place to add these values ? The history doesn't seem to easily allow way to determine who updates.
                        flight.updaterId = iataCode;
                        flight.txId = stubHelper.getStub().getTxID();
                        return [4 /*yield*/, stubHelper.putState(flightKey, flight)];
                    case 2:
                        _a.sent();
                        console.log('============= END : Create Flight ===========');
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Update an existing flight on the network.
     *
     * @param stubHelper
     * @param args
     * @returns {Promise<void>}
     */
    FlightChain.prototype.updateFlight = function (stubHelper, args) {
        return __awaiter(this, void 0, void 0, function () {
            var iataCode, flightKey, flightDelta, existingFlight, msg, mergedFlight, mergedFlightKey, msg;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("============= START : updateFlight key " + args[0] + " ===========");
                        if (args.length !== 2) {
                            throw new Error('Incorrect number of arguments. Expecting 2 (flightKey & new ACRIS flight data)');
                        }
                        iataCode = certificateHelper_1.CertificateHelper.getIataCode(stubHelper.getClientIdentity());
                        flightKey = args[0];
                        flightDelta = JSON.parse(args[1]);
                        return [4 /*yield*/, stubHelper.getStateAsObject(flightKey)];
                    case 1:
                        existingFlight = _a.sent();
                        if (!existingFlight) {
                            msg = "A flight with this flight key '" + flightKey + "' does not yet exist. It must be created first";
                            console.error(msg);
                            throw new Error(msg);
                        }
                        flightChainLogic_1.FlightChainLogic.verifyAbleToCreateOrModifyFlight(iataCode, existingFlight);
                        mergedFlight = merge(existingFlight, flightDelta);
                        console.log('flightDelta', flightDelta);
                        console.log('existingFlight', existingFlight);
                        console.log('mergedFlight', mergedFlight);
                        flightChainLogic_1.FlightChainLogic.verifyValidACRIS(mergedFlight);
                        mergedFlightKey = flightChainLogic_1.FlightChainLogic.generateUniqueKey(mergedFlight);
                        if (mergedFlightKey !== flightKey) {
                            msg = "You cannot change data that will modify the flight key (originDate, departureAirport, operatingAirline.iataCode or flightNumber.trackNumber)";
                            console.error(msg);
                            throw new Error(msg);
                        }
                        // TODO: Is this best place to add these values ? The history doesn't seem to easily allow way to determine who updates.
                        mergedFlight.updaterId = iataCode;
                        mergedFlight.txId = stubHelper.getStub().getTxID();
                        return [4 /*yield*/, stubHelper.putState(flightKey, mergedFlight)];
                    case 2:
                        _a.sent();
                        console.log('============= END : updateFlight ===========');
                        return [2 /*return*/];
                }
            });
        });
    };
    return FlightChain;
}(fabric_chaincode_utils_1.Chaincode));
exports.FlightChain = FlightChain;
