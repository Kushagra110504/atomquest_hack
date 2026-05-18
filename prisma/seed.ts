import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
const SALT_ROUNDS = 12;

async function main() {
  console.log("Starting seed...");

  await prisma.checkInComment.deleteMany();
  await prisma.achievement.deleteMany();
  await prisma.goal.deleteMany();
  await prisma.user.updateMany({ data: { managerId: null } });
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash("demo1234", SALT_ROUNDS);

  const admin = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@atomquest.dev",
      password: hashedPassword,
      role: "ADMIN",
      department: "Executive",
    },
  });

  const manager1 = await prisma.user.create({
    data: {
      name: "Bob Manager",
      email: "manager@atomquest.dev",
      password: hashedPassword,
      role: "MANAGER",
      department: "Engineering",
      managerId: admin.id,
    },
  });

  const employee1 = await prisma.user.create({
    data: {
      name: "Alice Employee",
      email: "employee@atomquest.dev",
      password: hashedPassword,
      role: "EMPLOYEE",
      department: "Engineering",
      managerId: manager1.id,
    },
  });

  console.log("Seed complete! Users created:");
  console.log("Admin: admin@atomquest.dev / demo1234");
  console.log("Manager: manager@atomquest.dev / demo1234");
  console.log("Employee: employee@atomquest.dev / demo1234");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
