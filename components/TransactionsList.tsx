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
import { Plus, Edit, Trash2, TrendingUp, TrendingDown } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

interface Transaction {
  id: string;
  amount: number;
  description: string;
  date: string;
  type: "INCOME" | "EXPENSE";
  categoryId: string;
  isPaid: boolean;
  paidAmount?: number;
  dueDate?: string;
  notes?: string;
  category: {
    id: string;
    name: string;
    color: string;
  };
}

interface Category {
  id: string;
  name: string;
  type: string;
  color: string;
}

interface TransactionsListProps {
  onDataChange: () => void;
}

export default function TransactionsList({
  onDataChange,
}: TransactionsListProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [formData, setFormData] = useState({
    amount: "",
    description: "",
    date: "",
    type: "INCOME" as "INCOME" | "EXPENSE",
    categoryId: "",
    isPaid: true,
    paidAmount: "",
    dueDate: "",
    notes: "",
  });

  useEffect(() => {
    fetchTransactions();
    fetchCategories();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await fetch("/api/transactions");
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingTransaction
        ? `/api/transactions/${editingTransaction.id}`
        : "/api/transactions";
      const method = editingTransaction ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount),
          paidAmount: formData.paidAmount
            ? parseFloat(formData.paidAmount)
            : undefined,
        }),
      });

      if (response.ok) {
        setIsDialogOpen(false);
        resetForm();
        fetchTransactions();
        onDataChange();
      }
    } catch (error) {
      console.error("Error saving transaction:", error);
    }
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setFormData({
      amount: transaction.amount.toString(),
      description: transaction.description,
      date: new Date(transaction.date).toISOString().split("T")[0],
      type: transaction.type,
      categoryId: transaction.categoryId,
      isPaid: transaction.isPaid,
      paidAmount: transaction.paidAmount?.toString() || "",
      dueDate: transaction.dueDate
        ? new Date(transaction.dueDate).toISOString().split("T")[0]
        : "",
      notes: transaction.notes || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this transaction?")) {
      try {
        const response = await fetch(`/api/transactions/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          fetchTransactions();
          onDataChange();
        }
      } catch (error) {
        console.error("Error deleting transaction:", error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      amount: "",
      description: "",
      date: "",
      type: "INCOME",
      categoryId: "",
      isPaid: true,
      paidAmount: "",
      dueDate: "",
      notes: "",
    });
    setEditingTransaction(null);
  };

  const getFilteredCategories = () => {
    return categories.filter(
      (cat) => cat.type === "BOTH" || cat.type === formData.type
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Transactions</h2>
          <p className="text-muted-foreground">
            Manage your income and expense transactions
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Transaction
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingTransaction ? "Edit Transaction" : "Add Transaction"}
              </DialogTitle>
              <DialogDescription>
                {editingTransaction
                  ? "Update the transaction details below."
                  : "Add a new transaction to your records."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: "INCOME" | "EXPENSE") =>
                      setFormData({ ...formData, type: value, categoryId: "" })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INCOME">Income</SelectItem>
                      <SelectItem value="EXPENSE">Expense</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (ETB)</Label>
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

              <div className="space-y-2">
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
                <div className="space-y-2">
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
                <div className="space-y-2">
                  <Label htmlFor="categoryId">Category</Label>
                  <Select
                    value={formData.categoryId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, categoryId: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {getFilteredCategories().map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="isPaid">Payment Status</Label>
                  <Select
                    value={formData.isPaid.toString()}
                    onValueChange={(value) =>
                      setFormData({ ...formData, isPaid: value === "true" })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Paid</SelectItem>
                      <SelectItem value="false">Unpaid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paidAmount">Paid Amount (ETB)</Label>
                  <Input
                    id="paidAmount"
                    type="number"
                    step="0.01"
                    value={formData.paidAmount}
                    onChange={(e) =>
                      setFormData({ ...formData, paidAmount: e.target.value })
                    }
                    placeholder="Leave empty for full payment"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) =>
                    setFormData({ ...formData, dueDate: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Input
                  id="notes"
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                />
              </div>

              <DialogFooter>
                <Button type="submit">
                  {editingTransaction ? "Update" : "Create"} Transaction
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {transactions.map((transaction) => (
          <Card key={transaction.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div
                    className={`p-2 rounded-full ${
                      transaction.type === "INCOME"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {transaction.type === "INCOME" ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold">{transaction.description}</h3>
                    <p className="text-sm text-muted-foreground">
                      {transaction.category.name} •{" "}
                      {formatDate(transaction.date)}
                    </p>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-sm">
                        Total: {formatCurrency(transaction.amount)}
                      </span>
                      {transaction.paidAmount !== undefined && (
                        <span className="text-sm">
                          Paid: {formatCurrency(transaction.paidAmount)}
                        </span>
                      )}
                      {transaction.paidAmount !== undefined &&
                        transaction.paidAmount < transaction.amount && (
                          <span className="text-sm text-orange-600">
                            Remaining:{" "}
                            {formatCurrency(
                              transaction.amount - transaction.paidAmount
                            )}
                          </span>
                        )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(transaction)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(transaction.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
