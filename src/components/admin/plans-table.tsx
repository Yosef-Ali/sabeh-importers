"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  initialPlans: any[];
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-primary">Subscription Plans</h1>
          <p className="text-muted-foreground font-mono text-sm mt-1">
            Manage pricing tiers and features for sellers.
          </p>
        </div>
        <Button onClick={handleCreate} className="gap-2 font-display font-bold">
          <Plus className="h-4 w-4" /> Create Plan
        </Button>
      </div>

      <Card className="border-2 border-primary/10 shadow-card">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px] pl-6">#</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Limits</TableHead>
                <TableHead>Features</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {initialPlans.map((plan) => (
                <TableRow key={plan.id}>
                  <TableCell className="pl-6 text-muted-foreground">
                    {plan.sortOrder}
                  </TableCell>
                  <TableCell>
                    <div>
                      <span className="font-medium text-sm">{plan.name}</span>
                      {plan.nameAmharic && (
                        <span className="block text-xs text-muted-foreground">{plan.nameAmharic}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium tabular-nums">
                      {Number(plan.price).toLocaleString()}
                    </span>
                    <span className="text-xs text-muted-foreground ml-1">{plan.currency}</span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {plan.durationDays} days
                  </TableCell>
                  <TableCell className="text-muted-foreground tabular-nums">
                    {plan.maxActiveListings} listings
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1 max-w-[220px]">
                      {plan.features?.length > 0 ? (
                        <>
                          {plan.features.slice(0, 2).map((f: string, i: number) => (
                            <Badge key={i} variant="outline" className="text-[11px] font-normal">
                              {f}
                            </Badge>
                          ))}
                          {plan.features.length > 2 && (
                            <Badge variant="outline" className="text-[11px] font-normal">
                              +{plan.features.length - 2}
                            </Badge>
                          )}
                        </>
                      ) : (
                        <span className="text-sm text-muted-foreground">—</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {plan.isActive ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 font-normal">
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="font-normal">
                        Inactive
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(plan)}>
                      <Edit className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

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
