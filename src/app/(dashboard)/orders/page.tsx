"use client";

import React, { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Printer,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  Package,
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
import { formatCurrency, formatDate } from "@/lib/utils";

const orders = [
  {
    id: "1",
    orderNumber: "SAB-2601-0042",
    customer: "Abebe Trading",
    customerPhone: "+251 91 234 5678",
    items: 5,
    total: 48300,
    status: "PENDING",
    paymentStatus: "UNPAID",
    source: "WHATSAPP",
    createdAt: "2026-01-12T10:30:00",
  },
  {
    id: "2",
    orderNumber: "SAB-2601-0041",
    customer: "Mulatu General Store",
    customerPhone: "+251 92 345 6789",
    items: 12,
    total: 132250,
    status: "CONFIRMED",
    paymentStatus: "PARTIAL",
    source: "DIRECT",
    createdAt: "2026-01-12T09:15:00",
  },
  {
    id: "3",
    orderNumber: "SAB-2601-0040",
    customer: "Haile Wholesale",
    customerPhone: "+251 93 456 7890",
    items: 25,
    total: 281750,
    status: "PROCESSING",
    paymentStatus: "PAID",
    source: "PHONE",
    createdAt: "2026-01-11T16:45:00",
  },
  {
    id: "4",
    orderNumber: "SAB-2601-0039",
    customer: "Tigist Mini Market",
    customerPhone: "+251 94 567 8901",
    items: 3,
    total: 18975,
    status: "SHIPPED",
    paymentStatus: "PAID",
    source: "WHATSAPP",
    createdAt: "2026-01-11T14:20:00",
  },
  {
    id: "5",
    orderNumber: "SAB-2601-0038",
    customer: "Bekele & Sons",
    customerPhone: "+251 95 678 9012",
    items: 8,
    total: 89700,
    status: "DELIVERED",
    paymentStatus: "PAID",
    source: "DISTRIBUTOR",
    createdAt: "2026-01-10T11:00:00",
  },
];

function getStatusBadge(status: string) {
  const styles: Record<string, { variant: any; icon: React.ReactNode }> = {
    PENDING: { variant: "warning", icon: <Clock className="h-3 w-3" /> },
    CONFIRMED: { variant: "info", icon: <CheckCircle className="h-3 w-3" /> },
    PROCESSING: { variant: "secondary", icon: <Package className="h-3 w-3" /> },
    SHIPPED: { variant: "info", icon: <Truck className="h-3 w-3" /> },
    DELIVERED: { variant: "success", icon: <CheckCircle className="h-3 w-3" /> },
    CANCELLED: { variant: "destructive", icon: <XCircle className="h-3 w-3" /> },
  };
  const style = styles[status] || { variant: "default", icon: null };
  return (
    <Badge variant={style.variant} className="gap-1">
      {style.icon} {status}
    </Badge>
  );
}

function getPaymentBadge(status: string) {
  const variants: Record<string, any> = {
    PAID: "success",
    PARTIAL: "warning",
    UNPAID: "destructive",
    REFUNDED: "secondary",
  };
  return <Badge variant={variants[status] || "default"}>{status}</Badge>;
}

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground">Manage and track customer orders</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Order
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Pending", count: orders.filter((o) => o.status === "PENDING").length, color: "orange" },
          { label: "Processing", count: orders.filter((o) => ["CONFIRMED", "PROCESSING"].includes(o.status)).length, color: "blue" },
          { label: "Shipped", count: orders.filter((o) => o.status === "SHIPPED").length, color: "purple" },
          { label: "Delivered", count: orders.filter((o) => o.status === "DELIVERED").length, color: "green" },
        ].map((stat) => (
          <Card key={stat.label} className="cursor-pointer hover:bg-muted/50">
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground">{stat.label}</div>
              <div className="text-2xl font-bold">{stat.count}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
          <CardDescription>View and manage all customer orders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search orders..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                <SelectItem value="PROCESSING">Processing</SelectItem>
                <SelectItem value="SHIPPED">Shipped</SelectItem>
                <SelectItem value="DELIVERED">Delivered</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead className="text-center">Items</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono font-medium">{order.orderNumber}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{order.customer}</p>
                        <p className="text-sm text-muted-foreground">{order.customerPhone}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">{order.items}</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(order.total)}</TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell>{getPaymentBadge(order.paymentStatus)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem><Eye className="mr-2 h-4 w-4" />View</DropdownMenuItem>
                          <DropdownMenuItem><Edit className="mr-2 h-4 w-4" />Edit</DropdownMenuItem>
                          <DropdownMenuItem><Printer className="mr-2 h-4 w-4" />Print</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
