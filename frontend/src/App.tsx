import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "./pages/auth/LoginPage";
import { DashboardPage } from "./pages/dashboard/DashboardPage";
import { ItemsListPage } from "./pages/items/ItemsListPage";
import { CategoriesPage } from "./pages/categories/CategoriesPage";
import { SuppliersPage } from "./pages/suppliers/SuppliersPage";
import { WarehousesPage } from "./pages/warehouses/WarehousesPage";
import { StockInPage } from "./pages/stock/StockInPage";
import { StockOutPage } from "./pages/stock/StockOutPage";
import { StockTransferPage } from "./pages/stock/StockTransferPage";
import { StockAdjustmentPage } from "./pages/stock/StockAdjustmentPage";
import { StockOpnamePage } from "./pages/stock/StockOpnamePage";
import { ExpiredItemsPage } from "./pages/expired/ExpiredItemsPage";
import { ReportsPage } from "./pages/reports/ReportsPage";
import { UsersManagementPage } from "./pages/users/UsersManagementPage";
import { ActivityLogPage } from "./pages/activity/ActivityLogPage";
import { UserProfilePage } from "./pages/profile/UserProfilePage";
import { SettingsPage } from "./pages/settings/SettingsPage";
import { DashboardLayout } from "./layouts/DashboardLayout";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<LoginPage />} />
          
          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="items" element={<ItemsListPage />} />
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="suppliers" element={<SuppliersPage />} />
            <Route path="warehouses" element={<WarehousesPage />} />
            <Route path="stock/in" element={<StockInPage />} />
            <Route path="stock/out" element={<StockOutPage />} />
            <Route path="stock/transfer" element={<StockTransferPage />} />
            <Route path="stock/adjustment" element={<StockAdjustmentPage />} />
            <Route path="stock/opname" element={<StockOpnamePage />} />
            <Route path="expired-items" element={<ExpiredItemsPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="activity" element={<ActivityLogPage />} />
            <Route path="users" element={<UsersManagementPage />} />
            <Route path="profile" element={<UserProfilePage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
