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

interface StockFormData {
  itemId: string;
  warehouseId: string;
  quantity: number;
  date: string;
  notes: string;
  batchNumber?: string;
  expiryDate?: string;
}

interface StockItemOption {
  id: string;
  code: string;
  name: string;
  stock: number;
}

interface WarehouseOption {
  id: string;
  name: string;
}

interface StockFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: StockFormData) => void;
  type: "IN" | "OUT";
  items: StockItemOption[];
  warehouses: WarehouseOption[];
}

export const StockFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  type,
  items,
  warehouses,
}: StockFormModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<StockFormData>({
    defaultValues: {
      itemId: "",
      warehouseId: "",
      quantity: 0,
      date: new Date().toISOString().split("T")[0],
      notes: "",
    },
  });

  const selectedItemId = watch("itemId");
  const selectedItem = items.find((item) => item.id === selectedItemId);

  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  const onSubmitForm = (data: StockFormData) => {
    onSubmit(data);
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Stok {type === "IN" ? "IN" : "OUT"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
          {/* Item Selection */}
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
                    {item.code} - {item.name} (Stock: {item.stock})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.itemId && (
              <p className="text-sm text-destructive">Item is required</p>
            )}
          </div>

          {/* Warehouse Selection */}
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

          {/* Current Stock Info */}
          {selectedItem && (
            <div className="rounded-lg border border-border bg-muted/50 p-3">
              <p className="text-sm text-muted-foreground">Current Stock</p>
              <p className="text-2xl font-bold text-foreground">
                {selectedItem.stock}
              </p>
            </div>
          )}

          {/* Quantity */}
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity *</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              {...register("quantity", {
                required: "Quantity is required",
                min: { value: 1, message: "Quantity must be at least 1" },
                validate: (value) => {
                  if (
                    type === "OUT" &&
                    selectedItem &&
                    value > selectedItem.stock
                  ) {
                    return `Cannot exceed current stock (${selectedItem.stock})`;
                  }
                  return true;
                },
              })}
              className="w-full"
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
              {...register("date", { required: "Date is required" })}
              className="w-full"
            />
            {errors.date && (
              <p className="text-sm text-destructive">{errors.date.message}</p>
            )}
          </div>

          {type === "IN" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="batchNumber">Nomor Batch</Label>
                <Input
                  id="batchNumber"
                  {...register("batchNumber")}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Tanggal Kedaluwarsa</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  {...register("expiryDate")}
                  className="w-full"
                />
              </div>
            </>
          )}

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Catatan</Label>
            <Textarea
              id="notes"
              {...register("notes")}
              placeholder="Add any additional notes..."
              rows={3}
              className="w-full resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              className={
                type === "IN"
                  ? "bg-success hover:bg-success/90"
                  : "bg-warning hover:bg-warning/90"
              }
            >
              Save Stock {type === "IN" ? "IN" : "OUT"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
