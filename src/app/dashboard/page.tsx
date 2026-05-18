import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, TrendingUp, CheckCircle, Clock } from "lucide-react";

export default async function DashboardOverview() {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  const role = session.user.role;

  // Gather stats based on role
  let totalGoals = 0;
  let approvedGoals = 0;
  
  if (role === "EMPLOYEE") {
    totalGoals = await prisma.goal.count({ where: { employeeId: session.user.id } });
    approvedGoals = await prisma.goal.count({ where: { employeeId: session.user.id, status: { in: ["APPROVED", "LOCKED"] } } });
  } else if (role === "MANAGER") {
    totalGoals = await prisma.goal.count({ where: { employee: { managerId: session.user.id } } });
    approvedGoals = await prisma.goal.count({ where: { employee: { managerId: session.user.id }, status: { in: ["APPROVED", "LOCKED"] } } });
  } else if (role === "ADMIN") {
    totalGoals = await prisma.goal.count();
    approvedGoals = await prisma.goal.count({ where: { status: { in: ["APPROVED", "LOCKED"] } } });
  }

  const completionRate = totalGoals > 0 ? Math.round((approvedGoals / totalGoals) * 100) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
        <p className="text-zinc-500">Welcome back, {session.user.name}. Here's what's happening today.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Goals</CardTitle>
            <Target className="h-4 w-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalGoals}</div>
            <p className="text-xs text-zinc-500">
              {role === "EMPLOYEE" ? "Your personal goals" : "Team goals managed"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved Goals</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedGoals}</div>
            <p className="text-xs text-zinc-500">Ready for execution</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approval Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completionRate}%</div>
            <div className="mt-2 h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: `${completionRate}%` }} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Check-in</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Q2</div>
            <p className="text-xs text-zinc-500">Opens in October</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-zinc-500">Activity stream will appear here.</p>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Goal Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-zinc-500">Chart will appear here.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
