"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Target, Plus, AlertCircle, Loader2 } from "lucide-react";
import { Goal } from "@prisma/client";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createGoal } from "@/app/actions/goals";
import { toast } from "sonner";

export function GoalsClient({ initialGoals, userId }: { initialGoals: Goal[]; userId: string }) {
  const [goals, setGoals] = useState(initialGoals);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const totalWeightage = goals.reduce((acc, goal) => acc + goal.weightage, 0);
  const isValid = totalWeightage === 100 && goals.length <= 8 && goals.every((g) => g.weightage >= 10);
  
  const statusColors: Record<string, string> = {
    DRAFT: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100",
    SUBMITTED: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
    APPROVED: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
    LOCKED: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100",
  };

  async function handleCreateGoal(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData(e.currentTarget);
      await createGoal(formData);
      toast.success("Goal created successfully");
      setIsDialogOpen(false);
      // Let Server Action's revalidatePath handle the refresh, we just wait a bit or let Next.js refresh the page props.
      window.location.reload(); 
    } catch (err: any) {
      toast.error(err.message || "Failed to create goal");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Summary Banner */}
      <Card className="bg-primary/10 border-primary/20 dark:bg-primary/5 dark:border-primary/10">
        <CardContent className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex gap-8 w-full md:w-auto justify-between md:justify-start">
            <div>
              <p className="text-sm font-medium text-foreground/70">Total Goals</p>
              <p className="text-2xl font-bold text-foreground">{goals.length} <span className="text-sm font-normal opacity-70">/ 8</span></p>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground/70">Total Weightage</p>
              <p className={`text-2xl font-bold ${totalWeightage === 100 ? "text-green-600 dark:text-green-400" : "text-amber-600 dark:text-amber-500"}`}>
                {totalWeightage}% <span className="text-sm font-normal opacity-70">/ 100%</span>
              </p>
            </div>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger
                render={
                  <Button variant="outline" className="flex-1 md:flex-none bg-background hover:bg-muted" disabled={goals.length >= 8} />
                }
              >
                <Plus className="w-4 h-4 mr-2" /> Add Goal
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create New Goal</DialogTitle>
                  <DialogDescription>
                    Define your performance goal. Weightage must be at least 10%.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateGoal} className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Goal Title</Label>
                    <Input id="title" name="title" required placeholder="e.g. Increase sales revenue" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" name="description" placeholder="Briefly describe the objective..." />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="thrustArea">Thrust Area</Label>
                      <Select name="thrustArea" defaultValue="Growth">
                        <SelectTrigger>
                          <SelectValue placeholder="Select Area" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Growth">Growth</SelectItem>
                          <SelectItem value="Operations">Operations</SelectItem>
                          <SelectItem value="Customer">Customer</SelectItem>
                          <SelectItem value="People">People</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="uom">Unit of Measurement</Label>
                      <Select name="uom" defaultValue="NUMERIC_MIN">
                        <SelectTrigger>
                          <SelectValue placeholder="UOM" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="NUMERIC_MIN">Numeric (Min)</SelectItem>
                          <SelectItem value="NUMERIC_MAX">Numeric (Max)</SelectItem>
                          <SelectItem value="TIMELINE">Timeline</SelectItem>
                          <SelectItem value="ZERO">Zero-based</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="target">Target Value</Label>
                      <Input id="target" name="target" type="number" step="0.01" required placeholder="100" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="weightage">Weightage (%)</Label>
                      <Input id="weightage" name="weightage" type="number" min="10" max="100" required placeholder="20" />
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                    Create Goal
                  </Button>
                </form>
              </DialogContent>
            </Dialog>

            <Button className="flex-1 md:flex-none" disabled={!isValid || goals.length === 0}>
              Submit for Approval
            </Button>
          </div>
        </CardContent>
      </Card>

      {!isValid && goals.length > 0 && (
        <div className="flex items-center gap-2 text-sm text-amber-800 dark:text-amber-200 bg-amber-50 dark:bg-amber-900/30 p-3 rounded-md border border-amber-200 dark:border-amber-800">
          <AlertCircle className="w-4 h-4" />
          <span>To submit, total weightage must be exactly 100% and each goal must be at least 10%.</span>
        </div>
      )}

      {/* Goal List */}
      {goals.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-lg">
          <Target className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground">No goals yet</h3>
          <p className="text-muted-foreground mt-1 mb-4">Get started by creating your first performance goal.</p>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" /> Create Goal
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {goals.map((goal) => (
            <Card key={goal.id} className="hover:border-primary/50 transition-colors">
              <CardContent className="p-5 flex flex-col md:flex-row items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-lg">{goal.title}</h3>
                    <Badge variant="secondary" className={statusColors[goal.status]}>
                      {goal.status}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-sm mb-3">{goal.description || "No description provided."}</p>
                  <div className="flex gap-4 text-sm text-foreground/80">
                    <div><span className="font-medium text-foreground">Area:</span> {goal.thrustArea || "N/A"}</div>
                    <div><span className="font-medium text-foreground">Target:</span> {goal.target} {goal.uom.replace("NUMERIC_", "")}</div>
                  </div>
                </div>
                <div className="text-left md:text-right w-full md:w-auto p-3 md:p-0 bg-muted/50 md:bg-transparent rounded-lg">
                  <div className="text-2xl font-bold text-primary">{goal.weightage}%</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mt-1">Weightage</div>
                  {goal.status === "DRAFT" && (
                    <Button variant="link" size="sm" className="mt-2 text-primary h-auto p-0 hover:text-primary/80">Edit</Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
