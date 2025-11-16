import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const transferSchema = z.object({
  itemId: z.string().min(1, 'Item harus dipilih'),
  fromWarehouse: z.string().min(1, 'Gudang asal harus dipilih'),
  toWarehouse: z.string().min(1, 'Gudang tujuan harus dipilih'),
  quantity: z.number().min(1, 'Jumlah minimal 1'),
  notes: z.string().optional(),
});

type TransferFormData = z.infer<typeof transferSchema>;

interface StockTransferFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: TransferFormData) => void;
}

const mockItems = [
  { id: '1', name: 'Laptop Dell XPS 13' },
  { id: '2', name: 'Mouse Logitech MX Master' },
  { id: '3', name: 'Keyboard Mechanical RGB' },
];

const mockWarehouses = [
  { id: '1', name: 'Gudang Pusat' },
  { id: '2', name: 'Gudang Jakarta' },
  { id: '3', name: 'Gudang Surabaya' },
];

export const StockTransferFormModal = ({
  open,
  onClose,
  onSubmit,
}: StockTransferFormModalProps) => {
  const form = useForm<TransferFormData>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      itemId: '',
      fromWarehouse: '',
      toWarehouse: '',
      quantity: 1,
      notes: '',
    },
  });

  const handleSubmit = (data: TransferFormData) => {
    onSubmit(data);
    onClose();
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Transfer Stok Baru</DialogTitle>
          <DialogDescription>
            Pindahkan stok barang antar gudang
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="itemId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Item</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih item" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {mockItems.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fromWarehouse"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dari Gudang</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih gudang asal" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {mockWarehouses.map((warehouse) => (
                        <SelectItem key={warehouse.id} value={warehouse.id}>
                          {warehouse.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="toWarehouse"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ke Gudang</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih gudang tujuan" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {mockWarehouses.map((warehouse) => (
                        <SelectItem key={warehouse.id} value={warehouse.id}>
                          {warehouse.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jumlah</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Catatan</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Catatan tambahan (opsional)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Batal
              </Button>
              <Button type="submit">Proses Transfer</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
