"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Plus } from "lucide-react";
import { PlanSheet } from "./plan-sheet";
import { Badge } from "@/components/ui/badge";

interface PlansTableProps {
  initialPlans: any[]; // ToDo: strict type
}

export function PlansTable({ initialPlans }: PlansTableProps) {
  const router = useRouter();
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
                <div className="flex flex-wrap gap-1 max-w-[200px]">
                   {plan.features?.length > 0 ? (
                     plan.features.slice(0, 3).map((f: string, i: number) => (
                       <Badge key={i} variant="outline" className="text-xs">{f}</Badge>
                     ))
                   ) : (
                     <span className="text-xs text-muted-foreground">—</span>
                   )}
                   {plan.features?.length > 3 && (
                     <Badge variant="outline" className="text-xs">+{plan.features.length - 3}</Badge>
                   )}
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
             router.refresh();
         }}
      />
    </div>
  );
}
