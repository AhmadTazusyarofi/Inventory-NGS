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
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export interface StartOpnameFormData {
  warehouseId: string;
  date: string;
}

interface WarehouseOption {
  id: string;
  name: string;
}

interface StartOpnameFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: StartOpnameFormData) => void;
  warehouses: WarehouseOption[];
}

export const StartOpnameFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  warehouses,
}: StartOpnameFormModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<StartOpnameFormData>({
    defaultValues: {
      warehouseId: "",
      date: new Date().toISOString().split("T")[0],
    },
  });

  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  const onSubmitForm = (data: StartOpnameFormData) => {
    onSubmit(data);
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Mulai Stock Opname</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
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

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit">Mulai Opname</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
