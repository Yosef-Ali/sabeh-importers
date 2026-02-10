"use client";

import React, { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Download,
  Upload,
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
import { formatCurrency } from "@/lib/utils";

// Sample product data
const products = [
  {
    id: "1",
    sku: "CO-005",
    name: "Cooking Oil 5L",
    nameAmharic: "የምግብ ዘይት 5 ሊትር",
    category: "Cooking Oil",
    brand: "Golden",
    costPrice: 1200,
    wholesalePrice: 1400,
    retailPrice: 1500,
    stock: 450,
    minStock: 50,
    status: "active",
  },
  {
    id: "2",
    sku: "RC-025",
    name: "Rice 25kg Bag",
    nameAmharic: "ሩዝ 25 ኪሎ",
    category: "Grains",
    brand: "Basmati",
    costPrice: 1400,
    wholesalePrice: 1550,
    retailPrice: 1600,
    stock: 12,
    minStock: 100,
    status: "low_stock",
  },
  {
    id: "3",
    sku: "SG-050",
    name: "Sugar 50kg",
    nameAmharic: "ስኳር 50 ኪሎ",
    category: "Sugar",
    brand: "Wonji",
    costPrice: 2800,
    wholesalePrice: 3000,
    retailPrice: 3200,
    stock: 5,
    minStock: 30,
    status: "low_stock",
  },
  {
    id: "4",
    sku: "FL-025",
    name: "Flour 25kg",
    nameAmharic: "ዱቄት 25 ኪሎ",
    category: "Flour",
    brand: "Kaliti",
    costPrice: 1100,
    wholesalePrice: 1250,
    retailPrice: 1350,
    stock: 280,
    minStock: 80,
    status: "active",
  },
  {
    id: "5",
    sku: "PS-500",
    name: "Pasta 500g",
    nameAmharic: "ፓስታ 500 ግራም",
    category: "Pasta",
    brand: "Barilla",
    costPrice: 35,
    wholesalePrice: 40,
    retailPrice: 45,
    stock: 1200,
    minStock: 200,
    status: "active",
  },
  {
    id: "6",
    sku: "TM-400",
    name: "Tomato Paste 400g",
    nameAmharic: "ቲማቲም ፔስት 400 ግራም",
    category: "Canned Goods",
    brand: "Safari",
    costPrice: 45,
    wholesalePrice: 55,
    retailPrice: 65,
    stock: 850,
    minStock: 150,
    status: "active",
  },
  {
    id: "7",
    sku: "ML-001",
    name: "Milk Powder 500g",
    nameAmharic: "የወተት ዱቄት 500 ግራም",
    category: "Dairy",
    brand: "Anchor",
    costPrice: 280,
    wholesalePrice: 320,
    retailPrice: 350,
    stock: 0,
    minStock: 50,
    status: "out_of_stock",
  },
  {
    id: "8",
    sku: "SP-100",
    name: "Soap Bar 100g",
    nameAmharic: "ሳሙና 100 ግራም",
    category: "Household",
    brand: "Lux",
    costPrice: 18,
    wholesalePrice: 22,
    retailPrice: 25,
    stock: 2500,
    minStock: 500,
    status: "active",
  },
];

const categories = [
  "All Categories",
  "Cooking Oil",
  "Grains",
  "Sugar",
  "Flour",
  "Pasta",
  "Canned Goods",
  "Dairy",
  "Household",
];

function getStockBadge(status: string) {
  switch (status) {
    case "active":
      return <Badge variant="success">In Stock</Badge>;
    case "low_stock":
      return <Badge variant="warning">Low Stock</Badge>;
    case "out_of_stock":
      return <Badge variant="destructive">Out of Stock</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
}

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.nameAmharic.includes(searchQuery);

    const matchesCategory =
      selectedCategory === "All Categories" ||
      product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">
            Manage your product catalog and inventory
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Total Products</div>
            <div className="text-2xl font-bold">{products.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">In Stock</div>
            <div className="text-2xl font-bold text-green-600">
              {products.filter((p) => p.status === "active").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Low Stock</div>
            <div className="text-2xl font-bold text-orange-600">
              {products.filter((p) => p.status === "low_stock").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Out of Stock</div>
            <div className="text-2xl font-bold text-red-600">
              {products.filter((p) => p.status === "out_of_stock").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Product List</CardTitle>
          <CardDescription>
            A list of all products in your inventory
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name, SKU, or Amharic name..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          {/* Products Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Cost</TableHead>
                  <TableHead className="text-right">Wholesale</TableHead>
                  <TableHead className="text-right">Retail</TableHead>
                  <TableHead className="text-center">Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground font-amharic">
                          {product.nameAmharic}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {product.sku}
                    </TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(product.costPrice)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(product.wholesalePrice)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(product.retailPrice)}
                    </TableCell>
                    <TableCell className="text-center">
                      <span
                        className={
                          product.stock <= product.minStock
                            ? "font-semibold text-orange-600"
                            : ""
                        }
                      >
                        {product.stock}
                      </span>
                    </TableCell>
                    <TableCell>{getStockBadge(product.status)}</TableCell>
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
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {filteredProducts.length} of {products.length} products
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
