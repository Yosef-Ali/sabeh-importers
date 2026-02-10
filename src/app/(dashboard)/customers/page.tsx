"use client";

import React, { useState } from "react";
import {
  Plus,
  Search,
  MoreHorizontal,
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Eye,
  Edit,
  Trash2,
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatCurrency } from "@/lib/utils";

const customers = [
  {
    id: "1",
    name: "Abebe Trading",
    nameAmharic: "አበበ ንግድ",
    type: "WHOLESALE",
    phone: "+251 91 234 5678",
    whatsapp: "+251 91 234 5678",
    email: "abebe@trading.com",
    city: "Addis Ababa",
    region: "Bole",
    totalOrders: 45,
    totalSpent: 856000,
    balance: 25000,
    status: "active",
  },
  {
    id: "2",
    name: "Mulatu General Store",
    nameAmharic: "ሙላቱ ጠቅላላ መደብር",
    type: "RETAIL",
    phone: "+251 92 345 6789",
    whatsapp: "+251 92 345 6789",
    email: "mulatu@store.com",
    city: "Bahir Dar",
    region: "Amhara",
    totalOrders: 28,
    totalSpent: 425000,
    balance: 0,
    status: "active",
  },
  {
    id: "3",
    name: "Haile Wholesale",
    nameAmharic: "ኃይሌ ጅምላ",
    type: "WHOLESALE",
    phone: "+251 93 456 7890",
    whatsapp: "+251 93 456 7890",
    email: "haile@wholesale.com",
    city: "Hawassa",
    region: "SNNPR",
    totalOrders: 67,
    totalSpent: 1250000,
    balance: -15000,
    status: "active",
  },
  {
    id: "4",
    name: "Tigist Mini Market",
    nameAmharic: "ትግስት ሚኒ ማርኬት",
    type: "RETAIL",
    phone: "+251 94 567 8901",
    whatsapp: null,
    email: null,
    city: "Adama",
    region: "Oromia",
    totalOrders: 12,
    totalSpent: 98000,
    balance: 5000,
    status: "active",
  },
  {
    id: "5",
    name: "Bekele & Sons",
    nameAmharic: "በቀለ እና ልጆች",
    type: "DISTRIBUTOR",
    phone: "+251 95 678 9012",
    whatsapp: "+251 95 678 9012",
    email: "bekele@sons.com",
    city: "Dire Dawa",
    region: "Dire Dawa",
    totalOrders: 89,
    totalSpent: 2450000,
    balance: 0,
    status: "active",
  },
  {
    id: "6",
    name: "Selam Supermarket",
    nameAmharic: "ሰላም ሱፐርማርኬት",
    type: "WHOLESALE",
    phone: "+251 96 789 0123",
    whatsapp: "+251 96 789 0123",
    email: "info@selam.com",
    city: "Mekelle",
    region: "Tigray",
    totalOrders: 34,
    totalSpent: 678000,
    balance: 45000,
    status: "inactive",
  },
];

function getTypeBadge(type: string) {
  const variants: Record<string, any> = {
    RETAIL: "secondary",
    WHOLESALE: "default",
    DISTRIBUTOR: "success",
  };
  return <Badge variant={variants[type] || "default"}>{type}</Badge>;
}

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.nameAmharic.includes(searchQuery) ||
      customer.phone.includes(searchQuery);
    const matchesType = typeFilter === "all" || customer.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const totalCustomers = customers.length;
  const wholesaleCount = customers.filter((c) => c.type === "WHOLESALE").length;
  const retailCount = customers.filter((c) => c.type === "RETAIL").length;
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
          <p className="text-muted-foreground">Manage your customer relationships</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Customer
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Customers</p>
            <p className="text-2xl font-bold">{totalCustomers}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Wholesale</p>
            <p className="text-2xl font-bold">{wholesaleCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Retail</p>
            <p className="text-2xl font-bold">{retailCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Revenue</p>
            <p className="text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customer List</CardTitle>
          <CardDescription>All registered customers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search customers..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="RETAIL">Retail</SelectItem>
                <SelectItem value="WHOLESALE">Wholesale</SelectItem>
                <SelectItem value="DISTRIBUTOR">Distributor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className="text-center">Orders</TableHead>
                  <TableHead className="text-right">Total Spent</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {customer.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{customer.name}</p>
                          <p className="text-sm text-muted-foreground font-amharic">
                            {customer.nameAmharic}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getTypeBadge(customer.type)}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Phone className="h-3 w-3" />
                          {customer.phone}
                        </div>
                        {customer.whatsapp && (
                          <div className="flex items-center gap-1 text-sm text-green-600">
                            <MessageCircle className="h-3 w-3" />
                            WhatsApp
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <MapPin className="h-3 w-3" />
                        {customer.city}, {customer.region}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">{customer.totalOrders}</TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(customer.totalSpent)}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={customer.balance > 0 ? "text-orange-600" : customer.balance < 0 ? "text-green-600" : ""}>
                        {formatCurrency(Math.abs(customer.balance))}
                        {customer.balance > 0 && " (owes)"}
                        {customer.balance < 0 && " (credit)"}
                      </span>
                    </TableCell>
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
                          <DropdownMenuItem><Eye className="mr-2 h-4 w-4" />View Profile</DropdownMenuItem>
                          <DropdownMenuItem><Edit className="mr-2 h-4 w-4" />Edit</DropdownMenuItem>
                          <DropdownMenuItem><MessageCircle className="mr-2 h-4 w-4" />WhatsApp</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />Delete
                          </DropdownMenuItem>
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
