const request = require('supertest');
const app = require('../src/app');

const sampleVehicle = {
  make: 'Toyota',
  model: 'Fortuner',
  category: 'SUV',
  year: 2024,
  color: 'Black',
  fuelType: 'Diesel',
  transmission: 'Automatic',
  price: 4200000,
  quantity: 10,
  description: 'Premium SUV with advanced safety features.',
};

async function registerAndLogin(role = 'user', emailPrefix = 'user') {
  const res = await request(app)
    .post('/api/auth/register')
    .send({
      name: `${role} tester`,
      email: `${emailPrefix}@example.com`,
      password: 'password123',
      role,
    });
  return res.body.token;
}

describe('Vehicle API', () => {
  let adminToken;
  let userToken;

  beforeEach(async () => {
    adminToken = await registerAndLogin('admin', 'admin');
    userToken = await registerAndLogin('user', 'buyer');
  });

  describe('POST /api/vehicles', () => {
    it('allows an admin to add a vehicle', async () => {
      const res = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(sampleVehicle);

      expect(res.status).toBe(201);
      expect(res.body.vehicle.make).toBe('Toyota');
      expect(res.body.vehicle.quantity).toBe(10);
    });

    it('rejects a non-admin user from adding a vehicle', async () => {
      const res = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${userToken}`)
        .send(sampleVehicle);

      expect(res.status).toBe(403);
    });

    it('rejects unauthenticated requests', async () => {
      const res = await request(app).post('/api/vehicles').send(sampleVehicle);
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/vehicles and /search', () => {
    beforeEach(async () => {
      await request(app).post('/api/vehicles').set('Authorization', `Bearer ${adminToken}`).send(sampleVehicle);
      await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ ...sampleVehicle, make: 'Honda', model: 'City', category: 'Sedan', price: 1500000, quantity: 5 });
    });

    it('lists all vehicles', async () => {
      const res = await request(app).get('/api/vehicles').set('Authorization', `Bearer ${userToken}`);
      expect(res.status).toBe(200);
      expect(res.body.count).toBe(2);
    });

    it('searches vehicles by make', async () => {
      const res = await request(app)
        .get('/api/vehicles/search?make=Honda')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.vehicles).toHaveLength(1);
      expect(res.body.vehicles[0].make).toBe('Honda');
    });

    it('searches vehicles by price range', async () => {
      const res = await request(app)
        .get('/api/vehicles/search?minPrice=1000000&maxPrice=2000000')
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.vehicles).toHaveLength(1);
      expect(res.body.vehicles[0].model).toBe('City');
    });
  });

  describe('PUT /api/vehicles/:id and DELETE /api/vehicles/:id', () => {
    let vehicleId;

    beforeEach(async () => {
      const createRes = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(sampleVehicle);
      vehicleId = createRes.body.vehicle._id;
    });

    it('allows an admin to update a vehicle', async () => {
      const res = await request(app)
        .put(`/api/vehicles/${vehicleId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ price: 4000000 });

      expect(res.status).toBe(200);
      expect(res.body.vehicle.price).toBe(4000000);
    });

    it('allows an admin to delete a vehicle', async () => {
      const res = await request(app)
        .delete(`/api/vehicles/${vehicleId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);

      const getRes = await request(app)
        .get(`/api/vehicles/${vehicleId}`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(getRes.status).toBe(404);
    });

    it('rejects a non-admin from deleting a vehicle', async () => {
      const res = await request(app)
        .delete(`/api/vehicles/${vehicleId}`)
        .set('Authorization', `Bearer ${userToken}`);
      expect(res.status).toBe(403);
    });
  });

  describe('POST /api/vehicles/:id/purchase', () => {
    let vehicleId;

    beforeEach(async () => {
      const createRes = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ ...sampleVehicle, quantity: 2 });
      vehicleId = createRes.body.vehicle._id;
    });

    it('decreases quantity after a successful purchase', async () => {
      const res = await request(app)
        .post(`/api/vehicles/${vehicleId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 1 });

      expect(res.status).toBe(201);
      expect(res.body.remainingStock).toBe(1);
      expect(res.body.purchase.invoiceNumber).toMatch(/^INV-/);
    });

    it('rejects purchasing more than available stock', async () => {
      const res = await request(app)
        .post(`/api/vehicles/${vehicleId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 99 });

      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/vehicles/:id/restock', () => {
    let vehicleId;

    beforeEach(async () => {
      const createRes = await request(app)
        .post('/api/vehicles')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ ...sampleVehicle, quantity: 3 });
      vehicleId = createRes.body.vehicle._id;
    });

    it('allows an admin to restock a vehicle', async () => {
      const res = await request(app)
        .post(`/api/vehicles/${vehicleId}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ quantity: 5, supplier: 'Toyota India' });

      expect(res.status).toBe(201);
      expect(res.body.newStock).toBe(8);
    });

    it('rejects a non-admin from restocking', async () => {
      const res = await request(app)
        .post(`/api/vehicles/${vehicleId}/restock`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 5 });

      expect(res.status).toBe(403);
    });
  });
});
