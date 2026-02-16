"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Plus, Check, X, Shield, Star, TrendingUp } from "lucide-react";
import { PlanSheet } from "./plan-sheet";
import { Badge } from "@/components/ui/badge";

interface PlansTableProps {
  initialPlans: any[]; // ToDo: strict type
}

export function PlansTable({ initialPlans }: PlansTableProps) {
  const [plans, setPlans] = useState(initialPlans); // In a real app, use router refresh to sync data
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);

  const handleEdit = (plan: any) => {
    setSelectedPlan(plan);
    setIsSheetOpen(true);
  };

  const handleCreate = () => {
    setSelectedPlan(null);
    setIsSheetOpen(true);
  };

  // Simplistic refresh - in Next.js Server Actions, usually just revalidatePath is enough and page reloads, 
  // but to prevent full reload flicker we rely on router.refresh() usually.
  // For now, we trust the server action revalidation.

  return (
    <div>
      <div className="p-4 border-b flex justify-end">
          <Button onClick={handleCreate} className="gap-2">
            <Plus className="h-4 w-4" /> Create Plan
          </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Sort</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Limits</TableHead>
            <TableHead>Features</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {initialPlans.map((plan) => (
            <TableRow key={plan.id}>
              <TableCell className="font-medium text-muted-foreground">{plan.sortOrder}</TableCell>
              <TableCell className="font-display font-bold text-primary">{plan.name}</TableCell>
              <TableCell>
                {plan.price} <span className="text-xs text-muted-foreground">{plan.currency}</span>
              </TableCell>
              <TableCell>{plan.durationDays} days</TableCell>
              <TableCell>{plan.maxActiveListings} listings</TableCell>
              <TableCell>
                <div className="flex gap-2">
                   {plan.canPromote && <Badge variant="secondary" className="gap-1"><TrendingUp className="h-3 w-3" /> Prom</Badge>}
                   {plan.canFeature && <Badge variant="secondary" className="gap-1"><Star className="h-3 w-3" /> Feat</Badge>}
                </div>
              </TableCell>
              <TableCell>
                {plan.isActive ? (
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">Active</Badge>
                ) : (
                    <Badge variant="outline" className="text-muted-foreground">Inactive</Badge>
                )}
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon" onClick={() => handleEdit(plan)}>
                  <Edit className="h-4 w-4 text-muted-foreground" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <PlanSheet 
         open={isSheetOpen} 
         onOpenChange={setIsSheetOpen} 
         plan={selectedPlan}
         onSuccess={() => {
             // In a client component getting server data as props, we need to refresh the page to see updates
             // or keep local state in sync. For simplicity:
             window.location.reload(); 
         }}
      />
    </div>
  );
}
