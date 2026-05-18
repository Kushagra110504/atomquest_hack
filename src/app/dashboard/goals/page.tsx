import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { GoalsClient } from "./GoalsClient";
import { redirect } from "next/navigation";

export default async function GoalsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const goals = await prisma.goal.findMany({
    where: { employeeId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Goals</h1>
        <p className="text-zinc-500">Create and track your performance goals for this cycle.</p>
      </div>
      
      <GoalsClient initialGoals={goals} userId={session.user.id} />
    </div>
  );
}
