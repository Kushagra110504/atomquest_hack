"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createGoal(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "EMPLOYEE") {
    throw new Error("Unauthorized");
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const thrustArea = formData.get("thrustArea") as string;
  const uom = formData.get("uom") as string;
  const target = parseFloat(formData.get("target") as string);
  const weightage = parseFloat(formData.get("weightage") as string);

  if (weightage < 10) throw new Error("Weightage must be at least 10%");

  await prisma.goal.create({
    data: {
      title,
      description,
      thrustArea,
      uom: uom as "NUMERIC_MIN" | "NUMERIC_MAX" | "TIMELINE" | "ZERO",
      target,
      weightage,
      employeeId: session.user.id,
      status: "DRAFT",
    },
  });

  revalidatePath("/dashboard/goals");
}
