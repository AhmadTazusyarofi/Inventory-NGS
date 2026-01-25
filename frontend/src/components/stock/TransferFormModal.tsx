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

export interface TransferFormData {
  itemId: string;
  fromWarehouseId: string;
  toWarehouseId: string;
  quantity: number;
  date: string;
  notes: string;
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

interface TransferFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TransferFormData) => void;
  items: StockItemOption[];
  warehouses: WarehouseOption[];
}

export const TransferFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  items,
  warehouses,
}: TransferFormModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TransferFormData>({
    defaultValues: {
      itemId: "",
      fromWarehouseId: "",
      toWarehouseId: "",
      quantity: 0,
      date: new Date().toISOString().split("T")[0],
      notes: "",
    },
  });

  const fromId = watch("fromWarehouseId");

  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  const onSubmitForm = (data: TransferFormData) => {
    onSubmit(data);
    reset();
    onClose();
  };

  const filteredToWarehouses = warehouses.filter((w) => w.id !== fromId);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Transfer Barang</DialogTitle>
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

          {/* From Warehouse */}
          <div className="space-y-2">
            <Label htmlFor="fromWarehouseId">Gudang Asal *</Label>
            <Select
              value={watch("fromWarehouseId")}
              onValueChange={(value) => setValue("fromWarehouseId", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih gudang asal" />
              </SelectTrigger>
              <SelectContent>
                {warehouses.map((wh) => (
                  <SelectItem key={wh.id} value={wh.id}>
                    {wh.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.fromWarehouseId && (
              <p className="text-sm text-destructive">
                Gudang asal wajib dipilih
              </p>
            )}
          </div>

          {/* To Warehouse */}
          <div className="space-y-2">
            <Label htmlFor="toWarehouseId">Gudang Tujuan *</Label>
            <Select
              value={watch("toWarehouseId")}
              onValueChange={(value) => setValue("toWarehouseId", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih gudang tujuan" />
              </SelectTrigger>
              <SelectContent>
                {filteredToWarehouses.map((wh) => (
                  <SelectItem key={wh.id} value={wh.id}>
                    {wh.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.toWarehouseId && (
              <p className="text-sm text-destructive">
                Gudang tujuan wajib dipilih
              </p>
            )}
          </div>

          {/* Quantity */}
          <div className="space-y-2">
            <Label htmlFor="quantity">Jumlah *</Label>
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

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Catatan</Label>
            <Textarea
              id="notes"
              {...register("notes")}
              placeholder="Catatan tambahan (opsional)"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit">Simpan Transfer</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
