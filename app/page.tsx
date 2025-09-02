"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Plus,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Receipt,
  AlertCircle,
} from "lucide-react";
import { ReportData } from "@/lib/types";
import DashboardOverview from "@/components/DashboardOverview";
import TransactionsList from "@/components/TransactionsList";
import CategoriesManager from "@/components/CategoriesManager";
import DebtManager from "@/components/DebtManager";
import ReportsView from "@/components/ReportsView";
import CashManagement from "@/components/CashManagement";

export default function Home() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      console.log("🔄 Fetching report data...");
      setLoading(true);
      setError(null);

      const response = await fetch("/api/reports");
      console.log("📡 API Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `HTTP ${response.status}: ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log("📊 Received data:", data);
      setReportData(data);
    } catch (error) {
      console.error("❌ Error fetching report data:", error);
      setError(error instanceof Error ? error.message : "Failed to fetch data");
    } finally {
      setLoading(false);
      console.log("✅ Data fetching completed");
    }
  };

  const handleDataChange = () => {
    fetchReportData();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              {/* <DollarSign className="h-8 w-8 text-blue-600 mr-3" /> */}
              <h1 className="text-2xl font-bold text-gray-900">X Finance</h1>
            </div>
            <div className="flex items-center space-x-4">
              {error && (
                <div className="flex items-center text-red-600 text-sm">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {error}
                </div>
              )}
              <Button
                onClick={fetchReportData}
                variant="outline"
                disabled={loading}
              >
                {loading ? "Loading..." : "Refresh Data"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger
              value="transactions"
              className="flex items-center gap-2"
            >
              <Receipt className="h-4 w-4" />
              Transactions
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Categories
            </TabsTrigger>
            <TabsTrigger value="debts" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Debts
            </TabsTrigger>
            <TabsTrigger value="cash" className="flex items-center gap-2">
              <Receipt className="h-4 w-4" />
              Cash
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4" />
              Reports
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <DashboardOverview
              reportData={reportData}
              loading={loading}
              error={error}
            />
          </TabsContent>

          <TabsContent value="transactions" className="space-y-6">
            <TransactionsList onDataChange={handleDataChange} />
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <CategoriesManager onDataChange={handleDataChange} />
          </TabsContent>

          <TabsContent value="debts" className="space-y-6">
            <DebtManager onDataChange={handleDataChange} />
          </TabsContent>

          <TabsContent value="cash" className="space-y-6">
            <CashManagement onDataChange={handleDataChange} />
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <ReportsView reportData={reportData} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
