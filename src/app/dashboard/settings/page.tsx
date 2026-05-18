import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Settings</h1>
        <p className="text-zinc-500">Configure global portal settings and cycles.</p>
      </div>

      <div className="grid gap-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Performance Cycle Management</CardTitle>
            <CardDescription>Set the active period for the entire organization.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Current Active Period</Label>
              <Select defaultValue="GOAL_SETTING">
                <SelectTrigger>
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GOAL_SETTING">Goal Setting (May)</SelectItem>
                  <SelectItem value="Q1">Q1 Check-in (July)</SelectItem>
                  <SelectItem value="Q2">Q2 Check-in (October)</SelectItem>
                  <SelectItem value="Q3">Q3 Check-in (January)</SelectItem>
                  <SelectItem value="Q4">Q4 / Annual (March/April)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full">Update Cycle</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Maintenance</CardTitle>
            <CardDescription>Manage global actions.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 flex flex-col gap-2">
            <Button variant="outline" className="justify-start">Export Achievement Report (CSV)</Button>
            <Button variant="outline" className="justify-start">Force Unlock All Goals</Button>
            <Button variant="outline" className="justify-start text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200">Reset Cycle Data</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
