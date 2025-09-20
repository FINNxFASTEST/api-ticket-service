import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { QueryTicketDto } from './dto/query-ticket.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TicketEntity } from './entities/ticket.entity';

@ApiTags('tickets')
@Controller('tickets')
export class TicketsController {
    constructor(private readonly ticketsService: TicketsService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new concert ticket' })
    @ApiResponse({ status: 201, description: 'Ticket created successfully', type: TicketEntity })
    create(@Body() dto: CreateTicketDto) {
        return this.ticketsService.create(dto);
    }

    @Get()
    @ApiOperation({ summary: 'List tickets with filter & pagination' })
    @ApiResponse({ status: 200, description: 'List of tickets', type: [TicketEntity] })
    findAll(@Query() q: QueryTicketDto) {
        return this.ticketsService.findAll(q);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a single ticket by ID' })
    @ApiResponse({ status: 200, description: 'Ticket details', type: TicketEntity })
    findOne(@Param('id') id: string) {
        return this.ticketsService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a ticket (event, seat, price, status, etc.)' })
    @ApiResponse({ status: 200, description: 'Ticket updated', type: TicketEntity })
    update(@Param('id') id: string, @Body() dto: UpdateTicketDto) {
        return this.ticketsService.update(id, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a ticket' })
    @ApiResponse({ status: 200, description: 'Ticket deleted' })
    remove(@Param('id') id: string) {
        return this.ticketsService.remove(id);
    }
}
