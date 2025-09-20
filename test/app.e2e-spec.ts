import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Tickets API (e2e)', () => {
    let app: INestApplication;
    let prisma: PrismaService;
    let ticketId: string;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(
            new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
        );
        await app.init();

        prisma = app.get(PrismaService);
        await prisma.ticket.deleteMany(); // reset DB before tests
    });

    afterAll(async () => {
        await app.close();
    });

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

        const ids = res.body.items.map((t: any) => t.id);
        expect(ids).toContain(ticketId); // ✅ check ว่ามี ticket ที่เพิ่งสร้างจริง ๆ
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


    it('/tickets (POST) → should handle concurrent ticket creation', async () => {
        const payloads = [
            { title: 'Coldplay Bangkok', seatNumber: 'A1', price: 3000 },
            { title: 'Coldplay Bangkok', seatNumber: 'A2', price: 3000 },
            { title: 'Coldplay Bangkok', seatNumber: 'A3', price: 3000 },
            { title: 'Coldplay Bangkok', seatNumber: 'A4', price: 3000 },
            { title: 'Coldplay Bangkok', seatNumber: 'A5', price: 3000 },
        ];

        // run all requests concurrently
        const results = await Promise.all(
            payloads.map((p) =>
                request(app.getHttpServer())
                    .post('/tickets')
                    .send(p)
                    .expect(201),
            ),
        );

        // ตรวจสอบว่า response ถูกต้องทั้งหมด
        results.forEach((res, idx) => {
            expect(res.body).toHaveProperty('id');
            expect(res.body.title).toBe(payloads[idx].title);
            expect(res.body.seatNumber).toBe(payloads[idx].seatNumber);
        });

        // ตรวจสอบใน DB ว่ามีทั้งหมดถูกสร้าง
        const all = await prisma.ticket.findMany({
            where: { title: 'Coldplay Bangkok' },
        });
        expect(all.length).toBeGreaterThanOrEqual(payloads.length);
    });


});
