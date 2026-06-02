import "dotenv/config";
import bcrypt from "bcryptjs";
import { connectDB } from "../src/config/db.js";
import Agent from "../src/models/Agent.js";
import User from "../src/models/User.js";

const demoAgents = [
  {
    name: "Asha Nair",
    email: "asha.agent@example.com",
    mobile: "+919876543210",
    password: "Agent@123"
  },
  {
    name: "Ravi Kumar",
    email: "ravi.agent@example.com",
    mobile: "+919876543211",
    password: "Agent@123"
  },
  {
    name: "Meera Shah",
    email: "meera.agent@example.com",
    mobile: "+919876543212",
    password: "Agent@123"
  },
  {
    name: "Kiran Rao",
    email: "kiran.agent@example.com",
    mobile: "+919876543213",
    password: "Agent@123"
  },
  {
    name: "Sneha Patel",
    email: "sneha.agent@example.com",
    mobile: "+919876543214",
    password: "Agent@123"
  }
];

const seedDemo = async () => {
  await connectDB();

  const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin@12345";

  await User.findOneAndUpdate(
    { email: adminEmail },
    {
      email: adminEmail,
      password: await bcrypt.hash(adminPassword, 10),
      role: "admin"
    },
    { upsert: true, new: true }
  );

  for (const agent of demoAgents) {
    await Agent.findOneAndUpdate(
      { email: agent.email },
      {
        ...agent,
        password: await bcrypt.hash(agent.password, 10)
      },
      { upsert: true, new: true }
    );
  }

  console.log("Demo data ready:");
  console.log(`Admin: ${adminEmail} / ${adminPassword}`);
  console.log("Agents: 5 demo agents created with password Agent@123");
  process.exit(0);
};

seedDemo().catch((error) => {
  console.error(error.message);
  process.exit(1);
});

