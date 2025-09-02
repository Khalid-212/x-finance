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
  DollarSign,
  Building2,
  CreditCard,
  Smartphone,
  Wallet,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface CashBalance {
  id: string;
  location: string;
  balance: number;
  lastUpdated: string;
  notes?: string;
}

interface CashManagementProps {
  onDataChange: () => void;
}

export default function CashManagement({ onDataChange }: CashManagementProps) {
  const [cashBalances, setCashBalances] = useState<CashBalance[]>([]);
  const [totalCash, setTotalCash] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBalance, setEditingBalance] = useState<CashBalance | null>(
    null
  );
  const [formData, setFormData] = useState({
    location: "",
    balance: "",
    notes: "",
  });
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    fetchCashBalances();
  }, []);

  const fetchCashBalances = async () => {
    try {
      setApiError(null); // Clear any previous errors
      const response = await fetch("/api/cash-balance");

      if (!response.ok) {
        console.error(`API error: ${response.status} ${response.statusText}`);
        const errorData = await response.json().catch(() => ({}));

        if (response.status === 503) {
          setApiError(
            "Database connection failed. Please check your database setup."
          );
        } else {
          setApiError(errorData.error || `API error: ${response.status}`);
        }

        // Set default empty state to prevent .map() errors
        setCashBalances([]);
        setTotalCash(0);
        return;
      }

      const data = await response.json();

      // Ensure we always have arrays to prevent .map() errors
      if (data && data.cashBalances && Array.isArray(data.cashBalances)) {
        setCashBalances(data.cashBalances);
        setTotalCash(data.totalCash || 0);
      } else {
        console.warn("Invalid data format received:", data);
        setCashBalances([]);
        setTotalCash(0);
      }
    } catch (error) {
      console.error("Error fetching cash balances:", error);
      setApiError(
        "Failed to connect to the server. Please check your internet connection."
      );
      // Set default empty state to prevent .map() errors
      setCashBalances([]);
      setTotalCash(0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingBalance
        ? `/api/cash-balance/${editingBalance.id}`
        : "/api/cash-balance";
      const method = editingBalance ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          balance: parseFloat(formData.balance),
        }),
      });

      if (response.ok) {
        setIsDialogOpen(false);
        resetForm();
        fetchCashBalances();
        onDataChange();
      } else {
        const error = await response.json();
        alert(error.error || "Failed to save cash balance");
      }
    } catch (error) {
      console.error("Error saving cash balance:", error);
      alert("Failed to save cash balance");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this cash balance?")) return;

    try {
      const response = await fetch(`/api/cash-balance/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchCashBalances();
        onDataChange();
      } else {
        alert("Failed to delete cash balance");
      }
    } catch (error) {
      console.error("Error deleting cash balance:", error);
      alert("Failed to delete cash balance");
    }
  };

  const resetForm = () => {
    setFormData({
      location: "",
      balance: "",
      notes: "",
    });
    setEditingBalance(null);
  };

  const openEditDialog = (balance: CashBalance) => {
    setEditingBalance(balance);
    setFormData({
      location: balance.location,
      balance: balance.balance.toString(),
      notes: balance.notes || "",
    });
    setIsDialogOpen(true);
  };

  const getLocationIcon = (location: string) => {
    if (location.includes("Cash")) return <Wallet className="h-4 w-4" />;
    if (location.includes("CBE")) return <Building2 className="h-4 w-4" />;
    if (location.includes("Abyssinia"))
      return <Building2 className="h-4 w-4" />;
    if (location.includes("Telebirr"))
      return <Smartphone className="h-4 w-4" />;
    if (location.includes("Birr")) return <CreditCard className="h-4 w-4" />;
    return <DollarSign className="h-4 w-4" />;
  };

  const getLocationColor = (location: string) => {
    if (location.includes("Cash")) return "text-green-600 bg-green-100";
    if (location.includes("CBE")) return "text-blue-600 bg-blue-100";
    if (location.includes("Abyssinia")) return "text-purple-600 bg-purple-100";
    if (location.includes("Telebirr")) return "text-orange-600 bg-orange-100";
    if (location.includes("Birr")) return "text-indigo-600 bg-indigo-100";
    return "text-gray-600 bg-gray-100";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Cash Management</h2>
          <p className="text-muted-foreground">
            Track your cash balances across different locations and payment
            methods
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
              Add Location
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingBalance ? "Edit Cash Balance" : "Add Cash Balance"}
              </DialogTitle>
              <DialogDescription>
                {editingBalance
                  ? "Update cash balance details"
                  : "Create a new cash balance location"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location Name</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  placeholder="e.g., Cash at Hand, CBE Bank"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="balance">Current Balance</Label>
                <Input
                  id="balance"
                  type="number"
                  step="0.01"
                  value={formData.balance}
                  onChange={(e) =>
                    setFormData({ ...formData, balance: e.target.value })
                  }
                  placeholder="0.00"
                  required
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
                  placeholder="Optional notes about this location"
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
                  {editingBalance ? "Update" : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Total Cash Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Total Available Cash
          </CardTitle>
          <CardDescription>
            Combined balance across all locations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-600">
            {formatCurrency(totalCash)}
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </CardContent>
      </Card>

      {/* API Error Display */}
      {apiError && (
        <Card className="md:col-span-2 lg:col-span-3 border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-red-600 text-sm font-semibold">!</span>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium text-red-800">
                  Database Connection Error
                </h3>
                <p className="text-red-700 mt-1">{apiError}</p>
                <div className="mt-3 space-y-2">
                  <p className="text-sm text-red-600">
                    <strong>Quick Fix:</strong> Run the database setup commands:
                  </p>
                  <div className="bg-red-100 p-3 rounded-md">
                    <code className="text-sm text-red-800">
                      npm run db:push && npm run db:seed
                    </code>
                  </div>
                  <p className="text-sm text-red-600">
                    Or use the setup script:{" "}
                    <code className="bg-red-100 px-2 py-1 rounded">
                      ./setup-db.sh
                    </code>
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cash Balance Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.isArray(cashBalances) &&
          cashBalances.map((balance) => (
            <Card key={balance.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  {getLocationIcon(balance.location)}
                  {balance.location}
                </CardTitle>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getLocationColor(
                    balance.location
                  )}`}
                >
                  {balance.location.includes("Cash") ? "Physical" : "Digital"}
                </span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(balance.balance)}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Last updated:{" "}
                  {new Date(balance.lastUpdated).toLocaleDateString()}
                </p>
                {balance.notes && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {balance.notes}
                  </p>
                )}
                <div className="flex items-center space-x-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(balance)}
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(balance.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>

      {!apiError && cashBalances.length === 0 && (
        <Card className="md:col-span-2 lg:col-span-3">
          <CardContent className="p-8 text-center">
            <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No cash balances found</h3>
            <p className="text-muted-foreground mb-4">
              Start by adding your cash locations and current balances.
            </p>
            <Button
              onClick={() => {
                resetForm();
                setIsDialogOpen(true);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add First Location
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
