"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Plus,
  Edit,
  Trash2,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

interface Debt {
  id: string;
  amount: number;
  description: string;
  type: "ACCOUNTS_RECEIVABLE" | "ACCOUNTS_PAYABLE";
  date: string;
  dueDate?: string;
  isPaid: boolean;
  creditor?: string;
  debtor?: string;
  interestRate?: number;
  notes?: string;
}

interface DebtManagerProps {
  onDataChange: () => void;
}

export default function DebtManager({ onDataChange }: DebtManagerProps) {
  const [debts, setDebts] = useState<Debt[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDebt, setEditingDebt] = useState<Debt | null>(null);
  const [formData, setFormData] = useState({
    amount: "",
    description: "",
    type: "ACCOUNTS_PAYABLE" as "ACCOUNTS_RECEIVABLE" | "ACCOUNTS_PAYABLE",
    date: new Date().toISOString().split("T")[0],
    dueDate: "",
    isPaid: false,
    creditor: "",
    debtor: "",
    interestRate: "",
    notes: "",
  });

  useEffect(() => {
    fetchDebts();
  }, []);

  const fetchDebts = async () => {
    try {
      const response = await fetch("/api/debts");
      const data = await response.json();
      setDebts(data);
    } catch (error) {
      console.error("Error fetching debts:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingDebt ? `/api/debts/${editingDebt.id}` : "/api/debts";

      const method = editingDebt ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount),
          dueDate: formData.dueDate || undefined,
          interestRate: formData.interestRate
            ? parseFloat(formData.interestRate)
            : undefined,
          creditor: formData.creditor || undefined,
          debtor: formData.debtor || undefined,
        }),
      });

      if (response.ok) {
        setIsDialogOpen(false);
        resetForm();
        fetchDebts();
        onDataChange();
      } else {
        const error = await response.json();
        alert(error.error || "Failed to save debt");
      }
    } catch (error) {
      console.error("Error saving debt:", error);
      alert("Failed to save debt");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this debt?")) return;

    try {
      const response = await fetch(`/api/debts/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchDebts();
        onDataChange();
      } else {
        alert("Failed to delete debt");
      }
    } catch (error) {
      console.error("Error deleting debt:", error);
      alert("Failed to delete debt");
    }
  };

  const resetForm = () => {
    setFormData({
      amount: "",
      description: "",
      type: "ACCOUNTS_PAYABLE",
      date: new Date().toISOString().split("T")[0],
      dueDate: "",
      isPaid: false,
      creditor: "",
      debtor: "",
      interestRate: "",
      notes: "",
    });
    setEditingDebt(null);
  };

  const openEditDialog = (debt: Debt) => {
    setEditingDebt(debt);
    setFormData({
      amount: debt.amount.toString(),
      description: debt.description,
      type: debt.type,
      date: new Date(debt.date).toISOString().split("T")[0],
      dueDate: debt.dueDate
        ? new Date(debt.dueDate).toISOString().split("T")[0]
        : "",
      isPaid: debt.isPaid,
      creditor: debt.creditor || "",
      debtor: debt.debtor || "",
      interestRate: debt.interestRate?.toString() || "",
      notes: debt.notes || "",
    });
    setIsDialogOpen(true);
  };

  const getTypeIcon = (type: string) => {
    return type === "ACCOUNTS_RECEIVABLE" ? (
      <ArrowUpRight className="h-4 w-4" />
    ) : (
      <ArrowDownRight className="h-4 w-4" />
    );
  };

  const getTypeColor = (type: string) => {
    return type === "ACCOUNTS_RECEIVABLE"
      ? "text-green-600 bg-green-100"
      : "text-red-600 bg-red-100";
  };

  const getTypeLabel = (type: string) => {
    return type === "ACCOUNTS_RECEIVABLE" ? "Receivable" : "Payable";
  };

  const totalReceivable = debts
    .filter((debt) => debt.type === "ACCOUNTS_RECEIVABLE" && !debt.isPaid)
    .reduce((sum, debt) => sum + debt.amount, 0);

  const totalPayable = debts
    .filter((debt) => debt.type === "ACCOUNTS_PAYABLE" && !debt.isPaid)
    .reduce((sum, debt) => sum + debt.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Debt Management</h2>
          <p className="text-muted-foreground">
            Manage accounts receivable and payable
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                resetForm();
                setIsDialogOpen(true);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Debt
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingDebt ? "Edit Debt" : "Add Debt"}
              </DialogTitle>
              <DialogDescription>
                {editingDebt
                  ? "Update debt details"
                  : "Create a new debt entry"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(
                      value: "ACCOUNTS_RECEIVABLE" | "ACCOUNTS_PAYABLE"
                    ) => setFormData({ ...formData, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACCOUNTS_PAYABLE">
                        Accounts Payable
                      </SelectItem>
                      <SelectItem value="ACCOUNTS_RECEIVABLE">
                        Accounts Receivable
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="dueDate">Due Date (Optional)</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) =>
                      setFormData({ ...formData, dueDate: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="creditor">
                    {formData.type === "ACCOUNTS_PAYABLE"
                      ? "Creditor"
                      : "Debtor"}{" "}
                    (Optional)
                  </Label>
                  <Input
                    id="creditor"
                    value={
                      formData.type === "ACCOUNTS_PAYABLE"
                        ? formData.creditor
                        : formData.debtor
                    }
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        [formData.type === "ACCOUNTS_PAYABLE"
                          ? "creditor"
                          : "debtor"]: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="interestRate">
                    Interest Rate % (Optional)
                  </Label>
                  <Input
                    id="interestRate"
                    type="number"
                    step="0.01"
                    value={formData.interestRate}
                    onChange={(e) =>
                      setFormData({ ...formData, interestRate: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  id="isPaid"
                  type="checkbox"
                  checked={formData.isPaid}
                  onChange={(e) =>
                    setFormData({ ...formData, isPaid: e.target.checked })
                  }
                  className="rounded"
                />
                <Label htmlFor="isPaid">Paid/Settled</Label>
              </div>

              <div>
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Input
                  id="notes"
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingDebt ? "Update" : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Receivable
            </CardTitle>
            <ArrowUpRight className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totalReceivable)}
            </div>
            <p className="text-xs text-muted-foreground">
              Outstanding payments owed to you
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Payable</CardTitle>
            <ArrowDownRight className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(totalPayable)}
            </div>
            <p className="text-xs text-muted-foreground">
              Outstanding payments you owe
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Debt List */}
      <div className="grid gap-4">
        {debts.map((debt) => (
          <Card key={debt.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div
                    className={`p-2 rounded-full ${
                      debt.type === "ACCOUNTS_RECEIVABLE"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {getTypeIcon(debt.type)}
                  </div>
                  <div>
                    <div className="font-medium">{debt.description}</div>
                    <div className="text-sm text-muted-foreground">
                      {formatDate(debt.date)} • {getTypeLabel(debt.type)}
                      {debt.creditor && ` • ${debt.creditor}`}
                      {debt.debtor && ` • ${debt.debtor}`}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="text-right">
                    <div
                      className={`font-bold ${
                        debt.type === "ACCOUNTS_RECEIVABLE"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {formatCurrency(debt.amount)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {debt.isPaid ? "Paid" : "Outstanding"}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEditDialog(debt)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(debt.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {debts.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No debts yet</h3>
              <p className="text-muted-foreground mb-4">
                Start by adding your first debt entry.
              </p>
              <Button
                onClick={() => {
                  resetForm();
                  setIsDialogOpen(true);
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Debt
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
