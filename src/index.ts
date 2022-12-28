import { PrismaClient } from '@prisma/client';
import express, { application } from 'express';

const prisma = new PrismaClient();
const app = express();

app.use(express.json());

// USERS
app.get('/users', async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

app.post('/users', async (req, res) => {
  console.log(req.body, 'req.body');
  const { name, email, phone, address } = req.body;
  const user = await prisma.user.create({
    data: {
      name,
      email,
      phone,
      address,
    },
  });
  res.json(user);
});

app.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  const user = await prisma.user.update({
    where: { id: Number(id) },
    data: {
      name,
      email,
    },
  });
  res.json(user);
});

// ORDERS
app.get('/orders', async (req, res) => {
  const orders = await prisma.order.findMany({
    include: {
      user: true,
      product: true,
    },
  });
  console.log(orders, 'orders');
  res.json(orders);
});

// create order
app.post('/orders', async (req, res) => {
  const { userId, productId, quantity } = req.body;
  const order = await prisma.order.create({
    data: {
      userId: Number(userId),
      productId: Number(productId),
      quantity: Number(quantity),
      status: 'PENDING',
    },
  } as any);
  res.json(order);
});

// update order status  (PENDING, DELIVERED, CANCELLED)
app.put('/orders/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const order = await prisma.order.update({
    where: { id: Number(id) },
    data: {
      status,
    },
  });
  res.json(order);
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT} `);
});
