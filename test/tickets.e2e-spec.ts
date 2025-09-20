import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Tickets (e2e)', () => {
    let app: INestApplication;
    let prisma: PrismaService;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
        await app.init();

        prisma = app.get(PrismaService);
        await prisma.ticket.deleteMany(); // clean DB before tests
    });

    afterAll(async () => {
        await app.close();
    });

    let ticketId: string;

    it('/tickets (POST) → should create a ticket', async () => {
        const res = await request(app.getHttpServer())
            .post('/tickets')
            .send({
                title: 'Coldplay World Tour 2025',
                seatNumber: 'A12',
                price: 3500,
            })
            .expect(201);

        expect(res.body).toHaveProperty('id');
        expect(res.body.title).toBe('Coldplay World Tour 2025');
        expect(res.body.priority).toBe('MEDIUM');
        expect(res.body.status).toBe('OPEN');

        ticketId = res.body.id;
    });

    it('/tickets (GET) → should list tickets', async () => {
        const res = await request(app.getHttpServer())
            .get('/tickets')
            .expect(200);

        expect(res.body.items.length).toBeGreaterThan(0);
        expect(res.body.items[0]).toHaveProperty('title');
    });

    it('/tickets/:id (GET) → should get one ticket', async () => {
        const res = await request(app.getHttpServer())
            .get(`/tickets/${ticketId}`)
            .expect(200);

        expect(res.body.id).toBe(ticketId);
        expect(res.body.title).toBe('Coldplay World Tour 2025');
    });

    it('/tickets/:id (PATCH) → should update ticket status', async () => {
        const res = await request(app.getHttpServer())
            .patch(`/tickets/${ticketId}`)
            .send({ status: 'RESOLVED' })
            .expect(200);

        expect(res.body.status).toBe('RESOLVED');
    });

    it('/tickets/:id (DELETE) → should delete ticket', async () => {
        const res = await request(app.getHttpServer())
            .delete(`/tickets/${ticketId}`)
            .expect(200);

        expect(res.body.ok).toBe(true);
    });
});
