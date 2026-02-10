"use client";

import React, { useState } from "react";
import {
  Plus,
  Search,
  MoreHorizontal,
  MapPin,
  Star,
  TrendingUp,
  CheckCircle,
  Clock,
  XCircle,
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/lib/utils";

const distributors = [
  {
    id: "1",
    code: "DIST-001",
    name: "Bekele & Sons Distribution",
    nameAmharic: "በቀለ እና ልጆች ስርጭት",
    contactPerson: "Bekele Tadesse",
    phone: "+251 95 678 9012",
    city: "Dire Dawa",
    region: "Dire Dawa",
    territory: ["Dire Dawa", "Harar", "Jijiga"],
    creditLimit: 500000,
    balance: 125000,
    totalOrders: 89,
    totalRevenue: 2450000,
    discountRate: 5,
    rating: 4.8,
    status: "APPROVED",
    performance: 92,
  },
  {
    id: "2",
    code: "DIST-002",
    name: "Amhara Regional Traders",
    nameAmharic: "አማራ ክልል ነጋዴዎች",
    contactPerson: "Yohannes Alemu",
    phone: "+251 91 111 2222",
    city: "Bahir Dar",
    region: "Amhara",
    territory: ["Bahir Dar", "Gondar", "Dessie"],
    creditLimit: 750000,
    balance: 0,
    totalOrders: 156,
    totalRevenue: 4850000,
    discountRate: 7,
    rating: 4.9,
    status: "APPROVED",
    performance: 98,
  },
  {
    id: "3",
    code: "DIST-003",
    name: "Southern Express",
    nameAmharic: "ደቡብ ኤክስፕረስ",
    contactPerson: "Mesfin Haile",
    phone: "+251 92 222 3333",
    city: "Hawassa",
    region: "SNNPR",
    territory: ["Hawassa", "Arba Minch", "Wolaita"],
    creditLimit: 400000,
    balance: 85000,
    totalOrders: 67,
    totalRevenue: 1850000,
    discountRate: 4,
    rating: 4.5,
    status: "APPROVED",
    performance: 85,
  },
  {
    id: "4",
    code: "DIST-004",
    name: "Oromia General Supplies",
    nameAmharic: "ኦሮሚያ ጠቅላላ አቅርቦቶች",
    contactPerson: "Chaltu Bekele",
    phone: "+251 93 333 4444",
    city: "Adama",
    region: "Oromia",
    territory: ["Adama", "Bishoftu", "Jimma"],
    creditLimit: 600000,
    balance: 250000,
    totalOrders: 45,
    totalRevenue: 980000,
    discountRate: 5,
    rating: 4.2,
    status: "APPROVED",
    performance: 78,
  },
  {
    id: "5",
    code: "DIST-005",
    name: "Tigray Wholesale Network",
    nameAmharic: "ትግራይ ጅምላ ኔትወርክ",
    contactPerson: "Gebremichael Tesfay",
    phone: "+251 94 444 5555",
    city: "Mekelle",
    region: "Tigray",
    territory: ["Mekelle", "Axum", "Adwa"],
    creditLimit: 300000,
    balance: 0,
    totalOrders: 0,
    totalRevenue: 0,
    discountRate: 3,
    rating: null,
    status: "PENDING",
    performance: 0,
  },
  {
    id: "6",
    code: "DIST-006",
    name: "Eastern Corridor Supplies",
    nameAmharic: "ምስራቅ ኮሪዶር አቅርቦቶች",
    contactPerson: "Ahmed Mohammed",
    phone: "+251 95 555 6666",
    city: "Harar",
    region: "Harari",
    territory: ["Harar"],
    creditLimit: 200000,
    balance: 200000,
    totalOrders: 12,
    totalRevenue: 280000,
    discountRate: 3,
    rating: 3.5,
    status: "SUSPENDED",
    performance: 45,
  },
];

function getStatusBadge(status: string) {
  const config: Record<string, { variant: any; icon: React.ReactNode }> = {
    APPROVED: { variant: "success", icon: <CheckCircle className="h-3 w-3" /> },
    PENDING: { variant: "warning", icon: <Clock className="h-3 w-3" /> },
    SUSPENDED: { variant: "destructive", icon: <XCircle className="h-3 w-3" /> },
  };
  const { variant, icon } = config[status] || { variant: "default", icon: null };
  return (
    <Badge variant={variant} className="gap-1">
      {icon} {status}
    </Badge>
  );
}

function getPerformanceColor(performance: number) {
  if (performance >= 90) return "text-green-600";
  if (performance >= 70) return "text-blue-600";
  if (performance >= 50) return "text-orange-600";
  return "text-red-600";
}

export default function DistributorsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDistributors = distributors.filter((d) =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.region.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalDistributors = distributors.length;
  const activeCount = distributors.filter((d) => d.status === "APPROVED").length;
  const totalRevenue = distributors.reduce((sum, d) => sum + d.totalRevenue, 0);
  const avgRating = distributors.filter((d) => d.rating).reduce((sum, d) => sum + (d.rating || 0), 0) / 
                   distributors.filter((d) => d.rating).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Distributors</h1>
          <p className="text-muted-foreground">Manage your distribution network</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Distributor
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Distributors</p>
            <p className="text-2xl font-bold">{totalDistributors}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Active</p>
            <p className="text-2xl font-bold text-green-600">{activeCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Revenue</p>
            <p className="text-2xl font-bold">{formatCurrency(totalRevenue)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Avg Rating</p>
            <div className="flex items-center gap-1">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <p className="text-2xl font-bold">{avgRating.toFixed(1)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Distributor Network</CardTitle>
          <CardDescription>View and manage all distributors</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search distributors..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredDistributors.map((distributor) => (
              <Card key={distributor.id} className="relative overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-primary/10 text-primary text-lg">
                          {distributor.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{distributor.name}</p>
                        <p className="text-sm text-muted-foreground">{distributor.code}</p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>View Orders</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="mt-4 space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{distributor.city}, {distributor.region}</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      {distributor.territory.slice(0, 3).map((t) => (
                        <Badge key={t} variant="outline" className="text-xs">
                          {t}
                        </Badge>
                      ))}
                      {distributor.territory.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{distributor.territory.length - 3}
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t">
                      <div>
                        <p className="text-xs text-muted-foreground">Revenue</p>
                        <p className="font-semibold">{formatCurrency(distributor.totalRevenue)}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Orders</p>
                        <p className="font-semibold">{distributor.totalOrders}</p>
                      </div>
                      <div className="text-right">
                        {distributor.rating && (
                          <>
                            <p className="text-xs text-muted-foreground">Rating</p>
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span className="font-semibold">{distributor.rating}</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Performance</span>
                        <span className={`font-semibold ${getPerformanceColor(distributor.performance)}`}>
                          {distributor.performance}%
                        </span>
                      </div>
                      <Progress value={distributor.performance} className="h-2" />
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      {getStatusBadge(distributor.status)}
                      {distributor.balance > 0 && (
                        <span className="text-sm text-orange-600">
                          Balance: {formatCurrency(distributor.balance)}
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
