import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { apiGet } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { AlertTriangle, Calendar, Package } from "lucide-react";
import { useEffect, useState } from "react";

interface BackendExpiredItem {
  id: number;
  itemCode: string;
  itemName: string;
  warehouse: string;
  stock: number;
  expiryDate: string;
  daysUntilExpiry: number;
  status: string;
}

interface BackendResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export const ExpiredItemsPage = () => {
  const { toast } = useToast();
  const { token } = useAuthStore();

  const [items, setItems] = useState<BackendExpiredItem[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (!token) return;

        const res = await apiGet<BackendResponse<BackendExpiredItem[]>>(
          "/stock/expired",
          token
        );

        if (!res.success) {
          throw new Error(res.message || "Gagal memuat data barang expired");
        }

        setItems(res.data);
      } catch (error) {
        toast({
          title: "Gagal memuat data",
          description:
            error instanceof Error ? error.message : "Terjadi kesalahan",
          variant: "destructive",
        });
      }
    };

    loadData();
  }, [token, toast]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "expired":
        return "bg-destructive";
      case "critical":
        return "bg-destructive";
      case "warning":
        return "bg-warning";
      case "normal":
        return "bg-success";
      default:
        return "bg-secondary";
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      expired: "Sudah Kedaluwarsa",
      critical: "Kritis (< 7 hari)",
      warning: "Peringatan (< 30 hari)",
      normal: "Normal",
    };
    return labels[status] || status;
  };

  const expiredCount = items.filter((i) => i.status === "expired").length;
  const criticalCount = items.filter((i) => i.status === "critical").length;
  const warningCount = items.filter((i) => i.status === "warning").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Barang Kedaluwarsa
          </h1>
          <p className="text-muted-foreground">
            Pantau barang yang sudah atau akan mendekati tanggal kedaluwarsa
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Batch</p>
                <p className="text-2xl font-bold">{items.length}</p>
              </div>
              <Package className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-destructive/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Sudah Kedaluwarsa
                </p>
                <p className="text-2xl font-bold text-destructive">
                  {expiredCount}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-destructive/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Kritis (&lt; 7 hari)
                </p>
                <p className="text-2xl font-bold text-destructive">
                  {criticalCount}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-warning/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Peringatan (&lt; 30 hari)
                </p>
                <p className="text-2xl font-bold text-warning">
                  {warningCount}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Items Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Barang per Status Kedaluwarsa</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kode Barang</TableHead>
                  <TableHead>Nama Barang</TableHead>
                  <TableHead>Gudang</TableHead>
                  <TableHead>Stok (Batch)</TableHead>
                  <TableHead>Tanggal Kedaluwarsa</TableHead>
                  <TableHead>Sisa Hari</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-mono text-sm">
                      {item.itemCode}
                    </TableCell>
                    <TableCell className="font-medium">
                      {item.itemName}
                    </TableCell>
                    <TableCell className="text-sm">{item.warehouse}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.stock}</Badge>
                    </TableCell>
                    <TableCell className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {new Date(item.expiryDate).toLocaleDateString("id-ID")}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`font-semibold ${
                          item.daysUntilExpiry < 0
                            ? "text-destructive"
                            : item.daysUntilExpiry < 7
                            ? "text-destructive"
                            : item.daysUntilExpiry < 30
                            ? "text-warning"
                            : "text-success"
                        }`}
                      >
                        {item.daysUntilExpiry < 0
                          ? `${Math.abs(item.daysUntilExpiry)} hari yang lalu`
                          : `${item.daysUntilExpiry} hari`}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="default"
                        className={getStatusColor(item.status)}
                      >
                        {getStatusLabel(item.status)}
                      </Badge>
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
};
