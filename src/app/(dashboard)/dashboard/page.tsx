"use client";

import React from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";

// Stats Card Component
interface StatCardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  trend: "up" | "down";
}

function StatCard({ title, value, change, icon, trend }: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            <div className="flex items-center gap-1 text-xs">
              {trend === "up" ? (
                <>
                  <ArrowUpRight className="h-3 w-3 text-green-500" />
                  <span className="text-green-500">+{change}%</span>
                </>
              ) : (
                <>
                  <ArrowDownRight className="h-3 w-3 text-red-500" />
                  <span className="text-red-500">-{change}%</span>
                </>
              )}
              <span className="text-muted-foreground">vs last month</span>
            </div>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Sample data
const recentOrders = [
  {
    id: "SAB-2601-0042",
    customer: "Abebe Trading",
    total: 45000,
    status: "PENDING",
    date: "2026-01-12",
  },
  {
    id: "SAB-2601-0041",
    customer: "Mulatu Store",
    total: 128500,
    status: "PROCESSING",
    date: "2026-01-12",
  },
  {
    id: "SAB-2601-0040",
    customer: "Haile Wholesale",
    total: 256000,
    status: "SHIPPED",
    date: "2026-01-11",
  },
  {
    id: "SAB-2601-0039",
    customer: "Tigist Mini Market",
    total: 18500,
    status: "DELIVERED",
    date: "2026-01-11",
  },
  {
    id: "SAB-2601-0038",
    customer: "Bekele & Sons",
    total: 89000,
    status: "DELIVERED",
    date: "2026-01-10",
  },
];

const lowStockItems = [
  { name: "Cooking Oil 5L", sku: "CO-005", stock: 8, minStock: 50 },
  { name: "Rice 25kg Bag", sku: "RC-025", stock: 12, minStock: 100 },
  { name: "Sugar 50kg", sku: "SG-050", stock: 5, minStock: 30 },
  { name: "Flour 25kg", sku: "FL-025", stock: 15, minStock: 80 },
];

const topProducts = [
  { name: "Cooking Oil 5L", sales: 450, revenue: 675000 },
  { name: "Rice 25kg", sales: 320, revenue: 512000 },
  { name: "Sugar 50kg", sales: 280, revenue: 420000 },
  { name: "Pasta 500g", sales: 890, revenue: 356000 },
];

function getStatusBadge(status: string) {
  switch (status) {
    case "PENDING":
      return <Badge variant="warning">Pending</Badge>;
    case "PROCESSING":
      return <Badge variant="info">Processing</Badge>;
    case "SHIPPED":
      return <Badge variant="secondary">Shipped</Badge>;
    case "DELIVERED":
      return <Badge variant="success">Delivered</Badge>;
    case "CANCELLED":
      return <Badge variant="destructive">Cancelled</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here&apos;s your business overview.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Download Report</Button>
          <Button>+ New Order</Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(2450000)}
          change={12.5}
          trend="up"
          icon={<DollarSign className="h-6 w-6 text-primary" />}
        />
        <StatCard
          title="Total Orders"
          value="456"
          change={8.2}
          trend="up"
          icon={<ShoppingCart className="h-6 w-6 text-primary" />}
        />
        <StatCard
          title="Total Customers"
          value="234"
          change={15.3}
          trend="up"
          icon={<Users className="h-6 w-6 text-primary" />}
        />
        <StatCard
          title="Products"
          value="1,250"
          change={2.1}
          trend="down"
          icon={<Package className="h-6 w-6 text-primary" />}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Orders</CardTitle>
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>{formatCurrency(order.total)}</TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Top Selling Products</CardTitle>
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div
                  key={product.name}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted font-semibold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {product.sales} units sold
                      </p>
                    </div>
                  </div>
                  <p className="font-semibold">
                    {formatCurrency(product.revenue)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alert */}
      <Card className="border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950/20">
        <CardHeader className="flex flex-row items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-orange-500" />
          <CardTitle className="text-orange-700 dark:text-orange-400">
            Low Stock Alert
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {lowStockItems.map((item) => (
              <div
                key={item.sku}
                className="rounded-lg border border-orange-200 bg-white p-4 dark:border-orange-800 dark:bg-orange-950/30"
              >
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-muted-foreground">SKU: {item.sku}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-2xl font-bold text-orange-600">
                    {item.stock}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Min: {item.minStock}
                  </span>
                </div>
                <Button size="sm" className="mt-3 w-full" variant="outline">
                  Restock
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-4">
        <Button
          variant="outline"
          className="h-24 flex-col gap-2 border-dashed"
        >
          <ShoppingCart className="h-6 w-6" />
          <span>New Order</span>
        </Button>
        <Button
          variant="outline"
          className="h-24 flex-col gap-2 border-dashed"
        >
          <Package className="h-6 w-6" />
          <span>Add Product</span>
        </Button>
        <Button
          variant="outline"
          className="h-24 flex-col gap-2 border-dashed"
        >
          <Users className="h-6 w-6" />
          <span>New Customer</span>
        </Button>
        <Button
          variant="outline"
          className="h-24 flex-col gap-2 border-dashed"
        >
          <TrendingUp className="h-6 w-6" />
          <span>View Reports</span>
        </Button>
      </div>
    </div>
  );
}
