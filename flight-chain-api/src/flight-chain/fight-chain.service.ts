import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {AcrisFlight} from '../acris-schema/AcrisFlight';
import {ChaincodeInvokeRequest, ChaincodeQueryRequest, TransactionRequest} from 'fabric-client';

const Fabric_Client = require('fabric-client');
const path = require('path');
const util = require('util');
const os = require('os');

@Injectable()
export class FlightChainService {
    private readonly flights: AcrisFlight[] = [];

    private fabric_client = null;
    private channel = null;
    private member_user;

    // TODO - should channel name be env or API param, or other?
    private username = process.env.IDENTITY;
    private channelName = 'channel-flight-chain';
    private peerEndpoints: string[] = ['grpc://localhost:7051'];
    private ordererEndpoint = 'grpc://localhost:7050';

    constructor() {

        this.fabric_client = new Fabric_Client();
        // TODO - should channel name be env or API param?
        this.channel = this.fabric_client.newChannel(this.channelName);
        // TODO - change Peers & Orderers to env variable
        this.peerEndpoints.forEach(peer => {
            console.log('Adding peer endpoing ' + peer);
            this.channel.addPeer(this.fabric_client.newPeer(peer));
        });
        this.channel.addOrderer(this.fabric_client.newOrderer(this.ordererEndpoint));

        const store_path = path.join('./bootstrap/', 'hfc-key-store');
        console.log('Store path:' + store_path);

        // create the key value store as defined in the fabric-client/config/default.json 'key-value-store' setting
        Fabric_Client.newDefaultKeyValueStore({
            path: store_path
        }).then((state_store) => {
            // assign the store to the fabric client
            this.fabric_client.setStateStore(state_store);
            const crypto_suite = Fabric_Client.newCryptoSuite();
            // use the same location for the state store (where the users' certificate are kept)
            // and the crypto store (where the users' keys are kept)
            const crypto_store = Fabric_Client.newCryptoKeyStore({path: store_path});
            crypto_suite.setCryptoKeyStore(crypto_store);
            this.fabric_client.setCryptoSuite(crypto_suite);

            // get the enrolled user from persistence, this user will sign all requests
            return this.fabric_client.getUserContext(this.username, true);
        }).then((user_from_store) => {
            if (user_from_store && user_from_store.isEnrolled()) {
                console.log('Successfully loaded ' + this.username + ' from persistence');
            } else {
                console.error(`Failed to get the identity ${this.username}.... Did you run 'node bootstrap/enrollAdmin.js && node bootstrap/registerUser.js  ${this.username}'`);
                process.exit(1);
            }
        });
    }

    public async findOne(flightKey: string): Promise<AcrisFlight> {

        console.log('FlightChainService.findOne()', flightKey);
        const request = {
            // targets : --- letting this default to the peers assigned to the channel
            chaincodeId: 'flightchain',
            fcn: 'getFlight',
            args: [flightKey]
        };

        return this.queryChainCodeState(request);
    }

    public async findFlightHistory(flightKey: any): Promise<AcrisFlight> {
        console.log('FlightChainService.findFlightHistory()', flightKey);
        const request: ChaincodeInvokeRequest = {
            // targets : --- letting this default to the peers assigned to the channel
            chaincodeId: 'flightchain',
            fcn: 'getFlightHistory',
            args: [flightKey],
            txId: undefined,
        };
        return this.queryChainCodeState(request);

    }


    public async createFlight(flight: AcrisFlight): Promise<any> {
        console.log('FlightChainService.createFlight()');

        // get a transaction id object based on the current user assigned to fabric client
        const tx_id = this.fabric_client.newTransactionID();
        console.log('Assigning transaction_id: ', tx_id._transaction_id);

        // must send the proposal to endorsing peers
        const request: ChaincodeInvokeRequest = {
            // targets: let default to the peer assigned to the client
            chaincodeId: 'flightchain',
            fcn: 'createFlight',
            args: [JSON.stringify(flight)],
            // chainId: 'channel-flight-chain',
            txId: tx_id,
            // proposalResponses: null,
            // proposal: null
        };
        return this.commitTransaction(request);
    }

    public async updateFlight(flightKey: string, flightDelta: AcrisFlight): Promise<AcrisFlight> {
        console.log('FlightChainService.updateFlight()');

        // get a transaction id object based on the current user assigned to fabric client
        const tx_id = this.fabric_client.newTransactionID();
        console.log('Assigning transaction_id: ', tx_id._transaction_id);

        // must send the proposal to endorsing peers
        const request = {
            // targets: let default to the peer assigned to the client
            chaincodeId: 'flightchain',
            fcn: 'updateFlight',
            args: [flightKey, JSON.stringify(flightDelta)],
            chainId: 'channel-flight-chain',
            txId: tx_id,
            proposalResponses: null,
            proposal: null
        };
        return this.commitTransaction(request);

    }


    public async getTransactionInfo(transactionId: string): Promise<AcrisFlight> {
        const transactionInfo: any = await this.channel.queryTransaction(transactionId).catch((err) => {
            console.error('error getting transaction id', err);
            throw new HttpException(err, HttpStatus.BAD_REQUEST);
        });

        return transactionInfo;

        // if (transactionInfo) {
        //     console.error('transactionInfo', transactionInfo.transactionEnvelope.signature.toString());
            // console.error('transactionInfo.header.channel_header', transactionInfo.transactionEnvelope.payload.header.channel_header);
            // console.error('transactionInfo.header.signature_header', transactionInfo.transactionEnvelope.payload.header.signature_header);
            // console.error('transactionInfo.payload.data.actions.header', transactionInfo.transactionEnvelope.payload.data.actions[0].header);
            // console.error('transactionInfo.payload.data.actions.payload', transactionInfo.transactionEnvelope.payload.data.actions[0].payload);
            // console.error('transactionInfo', transactionInfo.toString());
        // }

    }


    /**
     *
     * @param {Client.ChaincodeInvokeRequest} transactionProposalRequest
     * @returns {Promise<any>}
     */
    private async commitTransaction(transactionProposalRequest: ChaincodeInvokeRequest): Promise<any> {


        const sendTransactionProposalResults = await this.channel.sendTransactionProposal(transactionProposalRequest).catch((err) => {
            console.error('sendTransactionProposal', err);
            throw new HttpException(err, HttpStatus.BAD_REQUEST);
        });

        const proposalResponses = sendTransactionProposalResults[0];
        const proposal = sendTransactionProposalResults[1];
        let isProposalGood = false;
        if (proposalResponses && proposalResponses[0].response &&
            proposalResponses[0].response.status === 200) {
            isProposalGood = true;
            console.log('Transaction proposal was good');
        } else {
            let msg = null;
            if (!proposalResponses[0].response.message) {
                msg = 'Transaction proposal was bad, unknown error';
            } else {
                msg = proposalResponses[0].response.message;
            }
            console.log(proposalResponses[0]);
            console.log('payload', proposalResponses[0].response.payload);
            console.log('payload', proposalResponses[0].response.payload.toString('utf8'));
            console.error(msg);
            throw new HttpException(msg, HttpStatus.BAD_REQUEST);
            // return new Promise<any>((resolve, reject) => { reject(msg); });
        }
        if (!isProposalGood) {
            let msg = 'Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...';
            console.error(msg);
            // throw new Error(msg)
            throw new HttpException(msg, HttpStatus.BAD_REQUEST);
            // return new Promise<any>((resolve, reject) => { reject(msg); });
        }

        console.log(util.format(
            'Successfully sent Proposal and received ProposalResponse: Status - %s, message - \'%s\'',
            proposalResponses[0].response.status, proposalResponses[0].response.message));

        const transactionRequest: TransactionRequest = {
            proposalResponses: proposalResponses,
            proposal: proposal,
        }

        // set the transaction listener and set a timeout of 30 sec
        // if the transaction did not get committed within the timeout period,
        // report a TIMEOUT status
        const transaction_id_string = transactionProposalRequest.txId.getTransactionID(); // Get the transaction ID string to be used by the event processing

        const sendTransactionResponse = await this.channel.sendTransaction(transactionRequest).catch((err) => {
            console.log(err);
            throw new HttpException(err, HttpStatus.BAD_REQUEST);
        });
        console.log('sendTransactionResponse', sendTransactionResponse);
        if (sendTransactionResponse.status !== 'SUCCESS') {
            console.log('sendTransactionResponse failed');
            throw new HttpException('sendTransactionResponse failed', HttpStatus.BAD_REQUEST);

        }


        // get an eventhub once the fabric client has a user assigned. The user
        // is required bacause the event registration must be signed
        const event_hub = this.fabric_client.newEventHub();
        event_hub.setPeerAddr('grpc://localhost:7053');

        // using resolve the promise so that result status may be processed
        // under the then clause rather than having the catch clause process
        // the status
        const txPromise = new Promise((resolve, reject) => {
            const handle = setTimeout(() => {
                event_hub.disconnect();
                reject(new HttpException('Trnasaction did not complete within 3 seconds', HttpStatus.REQUEST_TIMEOUT));
            }, 3000);
            console.log('event_hub.connect');
            event_hub.connect();
            console.log('event_hub.registerTxEvent');
            event_hub.registerTxEvent(transaction_id_string, (tx, code) => {
                // this is the callback for transaction event status
                // first some clean up of event listener
                clearTimeout(handle);
                event_hub.unregisterTxEvent(transaction_id_string);
                event_hub.disconnect();

                // now let the application know what happened
                let return_status: any = {event_status: code, tx_id: transaction_id_string};
                if (code !== 'VALID') {
                    console.error('The transaction was invalid, code = ' + code);
                    reject(new HttpException('Problem with the tranaction, event status ::' + code, HttpStatus.INTERNAL_SERVER_ERROR));
                } else {
                    console.log('The transaction has been committed on peer ' + event_hub._ep._endpoint.addr);
                    resolve(return_status);
                }
            }, (err) => {
                // this is the callback if something goes wrong with the event registration or processing
                reject(new HttpException('There was a problem with the eventhub ::' + err, HttpStatus.INTERNAL_SERVER_ERROR));
            });
        });

        const event_hubResponse: any = await txPromise;
        console.log('event_hubResponse', event_hubResponse);

        if (event_hubResponse.event_status !== 'VALID') {
            throw new HttpException(event_hubResponse, HttpStatus.BAD_REQUEST)
        }

        return event_hubResponse;
    }

    private async queryChainCodeState(request: ChaincodeQueryRequest): Promise<AcrisFlight> {

        const query_responses: Buffer[] = await this.channel.queryByChaincode(request).catch((err) => {
            console.error('queryByChaincode', err);
            throw new HttpException(err, HttpStatus.BAD_REQUEST);
        });

        if (query_responses && query_responses.length === 1) {
            if (query_responses[0] instanceof Error) {
                console.error('error from query = ', query_responses[0]);
                throw new HttpException(query_responses[0], HttpStatus.INTERNAL_SERVER_ERROR);
            } else {

                if (query_responses[0].toString().length === 0 || query_responses[0].toString() == '[]') {
                    throw new HttpException(`No matching flight for flightKey`, HttpStatus.NOT_FOUND);
                } else {
                    console.log('Response is ', query_responses[0].toString());
                }
            }
        } else {
            console.error('No payloads were returned from query');
            throw new HttpException(query_responses[0], HttpStatus.NOT_FOUND);
        }
        return JSON.parse(query_responses[0].toString());
    }
}