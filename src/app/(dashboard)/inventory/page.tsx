"use client";

import React, { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  ArrowUpDown,
  TrendingUp,
  TrendingDown,
  Package,
  AlertTriangle,
  Warehouse,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const inventory = [
  { id: "1", sku: "CO-005", name: "Cooking Oil 5L", warehouse: "Main Warehouse", quantity: 450, reserved: 25, minStock: 50, maxStock: 500, lastRestock: "2026-01-10" },
  { id: "2", sku: "RC-025", name: "Rice 25kg Bag", warehouse: "Main Warehouse", quantity: 12, reserved: 5, minStock: 100, maxStock: 300, lastRestock: "2026-01-05" },
  { id: "3", sku: "SG-050", name: "Sugar 50kg", warehouse: "Main Warehouse", quantity: 5, reserved: 2, minStock: 30, maxStock: 150, lastRestock: "2026-01-02" },
  { id: "4", sku: "FL-025", name: "Flour 25kg", warehouse: "Secondary", quantity: 280, reserved: 50, minStock: 80, maxStock: 400, lastRestock: "2026-01-08" },
  { id: "5", sku: "PS-500", name: "Pasta 500g", warehouse: "Main Warehouse", quantity: 1200, reserved: 100, minStock: 200, maxStock: 2000, lastRestock: "2026-01-11" },
  { id: "6", sku: "TM-400", name: "Tomato Paste 400g", warehouse: "Secondary", quantity: 850, reserved: 75, minStock: 150, maxStock: 1000, lastRestock: "2026-01-09" },
  { id: "7", sku: "ML-001", name: "Milk Powder 500g", warehouse: "Main Warehouse", quantity: 0, reserved: 0, minStock: 50, maxStock: 200, lastRestock: "2025-12-20" },
  { id: "8", sku: "SP-100", name: "Soap Bar 100g", warehouse: "Secondary", quantity: 2500, reserved: 200, minStock: 500, maxStock: 3000, lastRestock: "2026-01-12" },
];

const movements = [
  { id: "1", type: "IN", product: "Cooking Oil 5L", quantity: 100, reference: "PO-2601-015", date: "2026-01-12" },
  { id: "2", type: "OUT", product: "Rice 25kg Bag", quantity: 50, reference: "SAB-2601-0040", date: "2026-01-11" },
  { id: "3", type: "IN", product: "Soap Bar 100g", quantity: 500, reference: "PO-2601-014", date: "2026-01-12" },
  { id: "4", type: "OUT", product: "Pasta 500g", quantity: 200, reference: "SAB-2601-0039", date: "2026-01-11" },
  { id: "5", type: "ADJUSTMENT", product: "Sugar 50kg", quantity: -5, reference: "Damaged goods", date: "2026-01-10" },
];

function getStockStatus(quantity: number, minStock: number, maxStock: number) {
  const percentage = (quantity / maxStock) * 100;
  if (quantity === 0) return { label: "Out of Stock", variant: "destructive" as const, color: "bg-red-500" };
  if (quantity <= minStock) return { label: "Low Stock", variant: "warning" as const, color: "bg-orange-500" };
  if (percentage >= 80) return { label: "Overstocked", variant: "info" as const, color: "bg-blue-500" };
  return { label: "In Stock", variant: "success" as const, color: "bg-green-500" };
}

export default function InventoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [warehouseFilter, setWarehouseFilter] = useState("all");

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesWarehouse = warehouseFilter === "all" || item.warehouse === warehouseFilter;
    return matchesSearch && matchesWarehouse;
  });

  const totalItems = inventory.reduce((sum, item) => sum + item.quantity, 0);
  const lowStockCount = inventory.filter((item) => item.quantity <= item.minStock && item.quantity > 0).length;
  const outOfStockCount = inventory.filter((item) => item.quantity === 0).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory</h1>
          <p className="text-muted-foreground">Track stock levels across warehouses</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <ArrowUpDown className="mr-2 h-4 w-4" />
            Stock Adjustment
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Stock
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Package className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total Items</p>
                <p className="text-2xl font-bold">{totalItems.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Warehouse className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Products</p>
                <p className="text-2xl font-bold">{inventory.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">Low Stock</p>
                <p className="text-2xl font-bold text-orange-600">{lowStockCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Package className="h-8 w-8 text-red-500" />
              <div>
                <p className="text-sm text-muted-foreground">Out of Stock</p>
                <p className="text-2xl font-bold text-red-600">{outOfStockCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Stock Levels</CardTitle>
            <CardDescription>Current inventory across all warehouses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex flex-col gap-4 md:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search inventory..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={warehouseFilter} onValueChange={setWarehouseFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Warehouse" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Warehouses</SelectItem>
                  <SelectItem value="Main Warehouse">Main Warehouse</SelectItem>
                  <SelectItem value="Secondary">Secondary</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Warehouse</TableHead>
                    <TableHead className="text-center">Available</TableHead>
                    <TableHead>Stock Level</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInventory.map((item) => {
                    const available = item.quantity - item.reserved;
                    const status = getStockStatus(item.quantity, item.minStock, item.maxStock);
                    const percentage = Math.min((item.quantity / item.maxStock) * 100, 100);
                    return (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-muted-foreground font-mono">{item.sku}</p>
                          </div>
                        </TableCell>
                        <TableCell>{item.warehouse}</TableCell>
                        <TableCell className="text-center">
                          <span className="font-semibold">{available}</span>
                          <span className="text-muted-foreground"> / {item.quantity}</span>
                        </TableCell>
                        <TableCell>
                          <div className="w-32">
                            <Progress value={percentage} className={`h-2 ${status.color}`} />
                            <p className="mt-1 text-xs text-muted-foreground">
                              Min: {item.minStock} | Max: {item.maxStock}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={status.variant}>{status.label}</Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>View History</DropdownMenuItem>
                              <DropdownMenuItem>Adjust Stock</DropdownMenuItem>
                              <DropdownMenuItem>Transfer</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Movements</CardTitle>
            <CardDescription>Latest stock changes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {movements.map((movement) => (
                <div key={movement.id} className="flex items-center gap-3 rounded-lg border p-3">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    movement.type === "IN" ? "bg-green-100 text-green-600" :
                    movement.type === "OUT" ? "bg-red-100 text-red-600" :
                    "bg-orange-100 text-orange-600"
                  }`}>
                    {movement.type === "IN" ? <TrendingUp className="h-4 w-4" /> :
                     movement.type === "OUT" ? <TrendingDown className="h-4 w-4" /> :
                     <ArrowUpDown className="h-4 w-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{movement.product}</p>
                    <p className="text-xs text-muted-foreground">{movement.reference}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${
                      movement.type === "IN" ? "text-green-600" :
                      movement.type === "OUT" ? "text-red-600" :
                      "text-orange-600"
                    }`}>
                      {movement.type === "IN" ? "+" : ""}{movement.quantity}
                    </p>
                    <p className="text-xs text-muted-foreground">{movement.date}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="mt-4 w-full">
              View All Movements
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
