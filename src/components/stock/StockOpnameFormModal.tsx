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

const opnameSchema = z.object({
  warehouseId: z.string().min(1, 'Gudang harus dipilih'),
  scheduledDate: z.string().min(1, 'Tanggal harus dipilih'),
  pic: z.string().min(1, 'Penanggung jawab harus diisi'),
  notes: z.string().optional(),
});

type OpnameFormData = z.infer<typeof opnameSchema>;

interface StockOpnameFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: OpnameFormData) => void;
}

const mockWarehouses = [
  { id: '1', name: 'Gudang Pusat' },
  { id: '2', name: 'Gudang Jakarta' },
  { id: '3', name: 'Gudang Surabaya' },
];

export const StockOpnameFormModal = ({
  open,
  onClose,
  onSubmit,
}: StockOpnameFormModalProps) => {
  const form = useForm<OpnameFormData>({
    resolver: zodResolver(opnameSchema),
    defaultValues: {
      warehouseId: '',
      scheduledDate: '',
      pic: '',
      notes: '',
    },
  });

  const handleSubmit = (data: OpnameFormData) => {
    onSubmit(data);
    onClose();
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Mulai Stok Opname</DialogTitle>
          <DialogDescription>
            Buat jadwal stok opname untuk verifikasi fisik inventori
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="warehouseId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gudang</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih gudang" />
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
              name="scheduledDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tanggal Pelaksanaan</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Penanggung Jawab</FormLabel>
                  <FormControl>
                    <Input placeholder="Nama penanggung jawab" {...field} />
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
              <Button type="submit">Mulai Opname</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
