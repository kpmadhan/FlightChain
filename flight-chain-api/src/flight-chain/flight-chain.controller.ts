import {Get, Controller, Param, HttpStatus, Post, Body} from '@nestjs/common';
import {FlightChainService} from "./fight-chain.service";
import {AcrisFlight} from "../acris-schema/AcrisFlight";
import {ApiImplicitBody, ApiImplicitParam, ApiOperation, ApiResponse, ApiUseTags} from "@nestjs/swagger";

@ApiUseTags('FlightChain')
@Controller()
export class FlightChainController {
    constructor(private readonly flightChainService: FlightChainService) {
    }

    @ApiOperation({title: 'Get all Flights', description: 'Return all flights in the world state '})
    @Get()
    public async getAll(): Promise<AcrisFlight[]> {
        console.log('FlightChainController.getAll()');
        return this.flightChainService.findAll();
    }

    @ApiOperation({title: 'Get one flight', description: 'Returns the live state of the flight identified by flightKey'})
    @ApiImplicitParam({name: 'flightKey', type: 'string', required: true, description: 'Unique key for each flight. The key is made up of [DepDate][DepAirport][OperatingAirline][OperatingFlightNum]. e.g. 2018-07-22LGWBA0227'})
    @Get('/:flightKey')
    @ApiResponse({ status: 200, description: 'The flight has been successfully returned.'})
    @ApiResponse({ status: 404, description: 'Not flight matching the given flightKey has been found.'})
    public async getOneFlight(@Param('flightKey') flightKey): Promise<AcrisFlight> {
        console.log('FlightChainController.getOneFlight()');
        return this.flightChainService.findOne(flightKey);
        //res.status(HttpStatus.OK).json(flight);
    }


    @ApiOperation({title: 'Get flight history', description: 'Returns the history of udpates for the flight identified by flightKey'})
    @ApiImplicitParam({name: 'flightKey', type: 'string', required: true, description: 'Unique key for each flight. The key is made up of [DepDate][DepAirport][OperatingAirline][OperatingFlightNum]. e.g. 2018-07-22LGWBA0227'})
    @Get('/:flightKey/history')
    @ApiResponse({ status: 200, description: 'The flight has been successfully returned.'})
    @ApiResponse({ status: 404, description: 'Not flight matching the given flightKey has been found.'})
    public async getFlightHIstory(@Param('flightKey') flightKey): Promise<AcrisFlight> {
        console.log('FlightChainController.getFlightHIstory()');
        return this.flightChainService.findFlightHistory(flightKey);
    }

    @ApiOperation({ title: 'Create new flight on the network' })
    @ApiResponse({
        status: 201,
        description: 'The flight record has been successfully created.',
    })
    @Post()
    public async createFlight(@Body() flight: AcrisFlight): Promise<AcrisFlight> {
        console.log('FlightChainController.createFlight()');
        return this.flightChainService.createFlight(flight);
    }

    @ApiOperation({ title: 'Update an existing flight on the network' })
    @ApiResponse({
        status: 201,
        description: 'The flight record has been successfully updated.',
    })
    @ApiImplicitParam({name: 'flightKey', type: 'string', required: true, description: 'Unique key for each flight. The key is made up of [DepDate][DepAirport][OperatingAirline][OperatingFlightNum]. e.g. 2018-07-22LGWBA0227'})
    @Post('/:flightKey')
    public async updateFlight(@Param('flightKey') flightKey, @Body() flight: AcrisFlight): Promise<AcrisFlight> {
        console.log('FlightChainController.updateFlight()');
        return this.flightChainService.updateFlight(flightKey, flight);
    }
}
