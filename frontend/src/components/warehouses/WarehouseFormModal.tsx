import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";

interface WarehouseFormData {
  id?: number;
  code: string;
  name: string;
  location: string;
  address: string;
  capacity?: number | null;
  status: string;
}

interface WarehouseFormModalProps {
  open: boolean;
  onClose: () => void;
  warehouse?: WarehouseFormData | null;
  onSubmit: (data: Omit<WarehouseFormData, "id">) => void;
}

export const WarehouseFormModal = ({
  open,
  onClose,
  warehouse,
  onSubmit,
}: WarehouseFormModalProps) => {
  const [formData, setFormData] = useState<Omit<WarehouseFormData, "id">>({
    code: warehouse?.code || "",
    name: warehouse?.name || "",
    location: warehouse?.location || "",
    address: warehouse?.address || "",
    capacity: warehouse?.capacity ?? null,
    status: warehouse?.status || "aktif",
  });

  useEffect(() => {
    setFormData({
      code: warehouse?.code || "",
      name: warehouse?.name || "",
      location: warehouse?.location || "",
      address: warehouse?.address || "",
      capacity: warehouse?.capacity ?? null,
      status: warehouse?.status || "aktif",
    });
  }, [warehouse, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {warehouse ? "Edit Data Gudang" : "Tambah Data Gudang"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="code">Kode Gudang *</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Nama Gudang *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Lokasi *</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Alamat *</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              rows={3}
              required
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="capacity">Kapasitas (opsional)</Label>
              <Input
                id="capacity"
                type="number"
                value={formData.capacity ?? ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    capacity: e.target.value ? Number(e.target.value) : null,
                  })
                }
                min={0}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="aktif">Aktif</SelectItem>
                  <SelectItem value="non_aktif">Non Aktif</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="ghost1" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit">
              {warehouse ? "Simpan Perubahan" : "Simpan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
