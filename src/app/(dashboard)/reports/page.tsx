"use client";

import React, { useState } from "react";
import {
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  BarChart3,
  PieChart,
  LineChart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";

const salesData = [
  { month: "Jan", revenue: 1850000, orders: 145, customers: 89 },
  { month: "Feb", revenue: 2100000, orders: 168, customers: 102 },
  { month: "Mar", revenue: 1950000, orders: 152, customers: 95 },
  { month: "Apr", revenue: 2300000, orders: 185, customers: 118 },
  { month: "May", revenue: 2450000, orders: 198, customers: 125 },
  { month: "Jun", revenue: 2600000, orders: 210, customers: 132 },
];

const topProducts = [
  { name: "Cooking Oil 5L", category: "Cooking Oil", sold: 2450, revenue: 3675000, growth: 12.5 },
  { name: "Rice 25kg", category: "Grains", sold: 1890, revenue: 3024000, growth: 8.3 },
  { name: "Sugar 50kg", category: "Sugar", sold: 1560, revenue: 4680000, growth: -2.1 },
  { name: "Flour 25kg", category: "Flour", sold: 1420, revenue: 1917000, growth: 5.7 },
  { name: "Pasta 500g", category: "Pasta", sold: 3200, revenue: 144000, growth: 15.2 },
];

const topCustomers = [
  { name: "Bekele & Sons", orders: 89, revenue: 2450000, avgOrder: 27528 },
  { name: "Amhara Regional Traders", orders: 156, revenue: 4850000, avgOrder: 31090 },
  { name: "Haile Wholesale", orders: 67, revenue: 1850000, avgOrder: 27612 },
  { name: "Mulatu General Store", orders: 45, revenue: 856000, avgOrder: 19022 },
  { name: "Selam Supermarket", orders: 34, revenue: 678000, avgOrder: 19941 },
];

const regionData = [
  { region: "Addis Ababa", orders: 245, revenue: 5680000, percentage: 35 },
  { region: "Oromia", orders: 156, revenue: 3450000, percentage: 22 },
  { region: "Amhara", orders: 134, revenue: 2980000, percentage: 19 },
  { region: "SNNPR", orders: 98, revenue: 1850000, percentage: 12 },
  { region: "Dire Dawa", orders: 67, revenue: 1250000, percentage: 8 },
  { region: "Others", orders: 45, revenue: 690000, percentage: 4 },
];

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState("this-month");

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">Analyze your business performance</p>
        </div>
        <div className="flex gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="this-week">This Week</SelectItem>
              <SelectItem value="this-month">This Month</SelectItem>
              <SelectItem value="this-quarter">This Quarter</SelectItem>
              <SelectItem value="this-year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">{formatCurrency(13250000)}</p>
                <div className="flex items-center gap-1 text-xs text-green-600">
                  <TrendingUp className="h-3 w-3" />
                  <span>+12.5% vs last period</span>
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold">1,058</p>
                <div className="flex items-center gap-1 text-xs text-green-600">
                  <TrendingUp className="h-3 w-3" />
                  <span>+8.3% vs last period</span>
                </div>
              </div>
              <ShoppingCart className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Order Value</p>
                <p className="text-2xl font-bold">{formatCurrency(12524)}</p>
                <div className="flex items-center gap-1 text-xs text-green-600">
                  <TrendingUp className="h-3 w-3" />
                  <span>+3.8% vs last period</span>
                </div>
              </div>
              <BarChart3 className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Customers</p>
                <p className="text-2xl font-bold">234</p>
                <div className="flex items-center gap-1 text-xs text-red-600">
                  <TrendingDown className="h-3 w-3" />
                  <span>-2.1% vs last period</span>
                </div>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="sales" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sales">Sales Overview</TabsTrigger>
          <TabsTrigger value="products">Top Products</TabsTrigger>
          <TabsTrigger value="customers">Top Customers</TabsTrigger>
          <TabsTrigger value="regions">By Region</TabsTrigger>
        </TabsList>

        {/* Sales Overview */}
        <TabsContent value="sales" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Sales Trend</CardTitle>
              <CardDescription>Revenue and orders over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center border rounded-lg bg-muted/30">
                <div className="text-center text-muted-foreground">
                  <LineChart className="mx-auto h-12 w-12 mb-2" />
                  <p>Sales Chart Placeholder</p>
                  <p className="text-sm">Integrate with Recharts for visualization</p>
                </div>
              </div>

              <Table className="mt-4">
                <TableHeader>
                  <TableRow>
                    <TableHead>Month</TableHead>
                    <TableHead className="text-right">Revenue</TableHead>
                    <TableHead className="text-right">Orders</TableHead>
                    <TableHead className="text-right">Customers</TableHead>
                    <TableHead className="text-right">Avg Order</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {salesData.map((row) => (
                    <TableRow key={row.month}>
                      <TableCell className="font-medium">{row.month} 2026</TableCell>
                      <TableCell className="text-right">{formatCurrency(row.revenue)}</TableCell>
                      <TableCell className="text-right">{row.orders}</TableCell>
                      <TableCell className="text-right">{row.customers}</TableCell>
                      <TableCell className="text-right">{formatCurrency(Math.round(row.revenue / row.orders))}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Top Products */}
        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Top Selling Products</CardTitle>
              <CardDescription>Products by revenue and units sold</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Units Sold</TableHead>
                    <TableHead className="text-right">Revenue</TableHead>
                    <TableHead className="text-right">Growth</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topProducts.map((product, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell className="text-right">{product.sold.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{formatCurrency(product.revenue)}</TableCell>
                      <TableCell className="text-right">
                        <span className={product.growth >= 0 ? "text-green-600" : "text-red-600"}>
                          {product.growth >= 0 ? "+" : ""}{product.growth}%
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Top Customers */}
        <TabsContent value="customers">
          <Card>
            <CardHeader>
              <CardTitle>Top Customers</CardTitle>
              <CardDescription>Customers by order value</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead className="text-right">Orders</TableHead>
                    <TableHead className="text-right">Revenue</TableHead>
                    <TableHead className="text-right">Avg Order</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topCustomers.map((customer, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{customer.name}</TableCell>
                      <TableCell className="text-right">{customer.orders}</TableCell>
                      <TableCell className="text-right">{formatCurrency(customer.revenue)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(customer.avgOrder)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* By Region */}
        <TabsContent value="regions">
          <Card>
            <CardHeader>
              <CardTitle>Sales by Region</CardTitle>
              <CardDescription>Geographic distribution of sales</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 lg:grid-cols-2">
                <div className="h-[250px] flex items-center justify-center border rounded-lg bg-muted/30">
                  <div className="text-center text-muted-foreground">
                    <PieChart className="mx-auto h-12 w-12 mb-2" />
                    <p>Regional Distribution Chart</p>
                  </div>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Region</TableHead>
                      <TableHead className="text-right">Orders</TableHead>
                      <TableHead className="text-right">Revenue</TableHead>
                      <TableHead className="text-right">Share</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {regionData.map((region, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{region.region}</TableCell>
                        <TableCell className="text-right">{region.orders}</TableCell>
                        <TableCell className="text-right">{formatCurrency(region.revenue)}</TableCell>
                        <TableCell className="text-right">{region.percentage}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
