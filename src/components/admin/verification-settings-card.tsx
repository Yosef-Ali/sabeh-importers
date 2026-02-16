"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2, Edit } from "lucide-react";
import { toast } from "sonner";
import {
  createVerificationMethod,
  deleteVerificationMethod,
  updateVerificationMethod,
} from "@/lib/actions/verification-methods";

interface Method {
  id: string;
  name: string;
  description: string | null;
  isRequired: boolean;
  isActive: boolean;
}

export function VerificationSettingsCard({ methods }: { methods: Method[] }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState<Method | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      isRequired: formData.get("isRequired") === "on",
    };

    try {
      if (editingMethod) {
        await updateVerificationMethod(editingMethod.id, data);
        toast.success("Verification method updated");
      } else {
        await createVerificationMethod(data);
        toast.success("Verification method created");
      }
      setIsDialogOpen(false);
      setEditingMethod(null);
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure? This cannot be undone.")) return;
    try {
      await deleteVerificationMethod(id);
      toast.success("Method deleted");
      router.refresh();
    } catch {
      toast.error("Failed to delete method");
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Verification Methods</CardTitle>
          <CardDescription>
            Define the documents sellers must provide to get verified.
          </CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => setEditingMethod(null)}
              className="gap-2"
            >
              <Plus className="h-4 w-4" /> Add Method
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingMethod ? "Edit Method" : "Add Verification Method"}
              </DialogTitle>
              <DialogDescription>
                Configure the document requirement details.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Method Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="e.g. Importer License"
                  defaultValue={editingMethod?.name}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Instructions (Optional)</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="e.g. Please upload a clear scan of your license..."
                  defaultValue={editingMethod?.description || ""}
                />
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="isRequired"
                  name="isRequired"
                  defaultChecked={editingMethod?.isRequired}
                />
                <Label htmlFor="isRequired">Required for Verification</Label>
              </div>
              <DialogFooter>
                <Button type="submit">Save</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {methods.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No verification methods defined yet.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Required</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {methods.map((method) => (
                <TableRow key={method.id}>
                  <TableCell className="font-medium">{method.name}</TableCell>
                  <TableCell className="text-muted-foreground text-sm max-w-xs truncate">
                    {method.description || "—"}
                  </TableCell>
                  <TableCell>
                    {method.isRequired ? (
                      <Badge>Required</Badge>
                    ) : (
                      <Badge variant="outline">Optional</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setEditingMethod(method);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDelete(method.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
