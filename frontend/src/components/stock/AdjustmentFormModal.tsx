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
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export interface AdjustmentFormData {
  itemId: string;
  warehouseId: string;
  adjustmentType: string;
  quantity: number;
  date: string;
  reason: string;
}

interface StockItemOption {
  id: string;
  code: string;
  name: string;
}

interface WarehouseOption {
  id: string;
  name: string;
}

interface AdjustmentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AdjustmentFormData) => void;
  items: StockItemOption[];
  warehouses: WarehouseOption[];
}

export const AdjustmentFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  items,
  warehouses,
}: AdjustmentFormModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AdjustmentFormData>({
    defaultValues: {
      itemId: "",
      warehouseId: "",
      adjustmentType: "",
      quantity: 0,
      date: new Date().toISOString().split("T")[0],
      reason: "",
    },
  });

  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  const onSubmitForm = (data: AdjustmentFormData) => {
    onSubmit(data);
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Penyesuaian Stok</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
          {/* Item */}
          <div className="space-y-2">
            <Label htmlFor="itemId">Barang *</Label>
            <Select
              value={watch("itemId")}
              onValueChange={(value) => setValue("itemId", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih Barang" />
              </SelectTrigger>
              <SelectContent>
                {items.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.code} - {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.itemId && (
              <p className="text-sm text-destructive">Barang wajib dipilih</p>
            )}
          </div>

          {/* Warehouse */}
          <div className="space-y-2">
            <Label htmlFor="warehouseId">Gudang *</Label>
            <Select
              value={watch("warehouseId")}
              onValueChange={(value) => setValue("warehouseId", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih gudang" />
              </SelectTrigger>
              <SelectContent>
                {warehouses.map((wh) => (
                  <SelectItem key={wh.id} value={wh.id}>
                    {wh.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.warehouseId && (
              <p className="text-sm text-destructive">Gudang wajib dipilih</p>
            )}
          </div>

          {/* Adjustment Type */}
          <div className="space-y-2">
            <Label htmlFor="adjustmentType">Jenis Penyesuaian *</Label>
            <Select
              value={watch("adjustmentType")}
              onValueChange={(value) => setValue("adjustmentType", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih jenis" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rusak">Rusak</SelectItem>
                <SelectItem value="hilang">Hilang</SelectItem>
                <SelectItem value="retur">Retur</SelectItem>
              </SelectContent>
            </Select>
            {errors.adjustmentType && (
              <p className="text-sm text-destructive">Jenis wajib dipilih</p>
            )}
          </div>

          {/* Quantity */}
          <div className="space-y-2">
            <Label htmlFor="quantity">Jumlah Penyesuaian *</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              {...register("quantity", {
                required: "Jumlah wajib diisi",
                min: { value: 1, message: "Jumlah minimal 1" },
              })}
            />
            {errors.quantity && (
              <p className="text-sm text-destructive">
                {errors.quantity.message}
              </p>
            )}
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date">Tanggal *</Label>
            <Input
              id="date"
              type="date"
              {...register("date", { required: "Tanggal wajib diisi" })}
            />
            {errors.date && (
              <p className="text-sm text-destructive">{errors.date.message}</p>
            )}
          </div>

          {/* Reason */}
          <div className="space-y-2">
            <Label htmlFor="reason">Alasan Penyesuaian</Label>
            <Textarea
              id="reason"
              {...register("reason")}
              placeholder="Deskripsi penyesuaian"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit">Simpan Penyesuaian</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
