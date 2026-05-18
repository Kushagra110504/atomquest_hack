import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default async function TeamGoalsPage() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== "MANAGER" && session.user.role !== "ADMIN")) {
    redirect("/dashboard");
  }

  const teamMembers = await prisma.user.findMany({
    where: { managerId: session.user.id },
    include: {
      goals: true,
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Team Goals</h1>
        <p className="text-zinc-500">Review and approve goals for your direct reports.</p>
      </div>

      {teamMembers.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center text-zinc-500">
            You do not have any direct reports currently assigned.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {teamMembers.map((member) => (
            <Card key={member.id} className="overflow-hidden">
              <CardHeader className="bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-100 dark:border-zinc-800 flex flex-row items-center gap-4 py-4">
                <Avatar>
                  <AvatarFallback className="bg-indigo-100 text-indigo-700">{member.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">{member.name}</CardTitle>
                  <p className="text-sm text-zinc-500">{member.email}</p>
                </div>
                <div className="ml-auto flex gap-2">
                  <Badge variant="outline">{member.goals.length} Goals</Badge>
                  {member.goals.some(g => g.status === "SUBMITTED") && (
                    <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Needs Review</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {member.goals.length === 0 ? (
                  <div className="p-6 text-sm text-zinc-500 text-center">No goals created yet.</div>
                ) : (
                  <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {member.goals.map((goal) => (
                      <div key={goal.id} className="p-4 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">{goal.title}</span>
                            <Badge variant="secondary" className="text-[10px] uppercase tracking-wider">{goal.status}</Badge>
                          </div>
                          <div className="text-xs text-zinc-500 flex gap-3">
                            <span>Target: {goal.target}</span>
                            <span>Weightage: {goal.weightage}%</span>
                          </div>
                        </div>
                        {goal.status === "SUBMITTED" && (
                          <div className="flex gap-2">
                            <Badge className="bg-green-100 text-green-700 cursor-pointer hover:bg-green-200">Approve</Badge>
                            <Badge className="bg-red-100 text-red-700 cursor-pointer hover:bg-red-200">Reject</Badge>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
