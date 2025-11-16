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

const warehouseSchema = z.object({
  name: z.string().min(1, 'Nama gudang harus diisi').max(100),
  code: z.string().min(1, 'Kode gudang harus diisi').max(20),
  address: z.string().min(1, 'Alamat harus diisi').max(500),
  phone: z.string().optional(),
  manager: z.string().optional(),
});

type WarehouseFormData = z.infer<typeof warehouseSchema>;

interface WarehouseFormModalProps {
  open: boolean;
  onClose: () => void;
  warehouse?: {
    id: string;
    name: string;
    code: string;
    address: string;
    phone?: string;
    manager?: string;
  } | null;
  onSubmit: (data: WarehouseFormData) => void;
}

export const WarehouseFormModal = ({
  open,
  onClose,
  warehouse,
  onSubmit,
}: WarehouseFormModalProps) => {
  const form = useForm<WarehouseFormData>({
    resolver: zodResolver(warehouseSchema),
    defaultValues: {
      name: '',
      code: '',
      address: '',
      phone: '',
      manager: '',
    },
  });

  useEffect(() => {
    if (warehouse) {
      form.reset({
        name: warehouse.name,
        code: warehouse.code,
        address: warehouse.address,
        phone: warehouse.phone || '',
        manager: warehouse.manager || '',
      });
    } else {
      form.reset({
        name: '',
        code: '',
        address: '',
        phone: '',
        manager: '',
      });
    }
  }, [warehouse, form]);

  const handleSubmit = (data: WarehouseFormData) => {
    onSubmit(data);
    onClose();
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{warehouse ? 'Edit Gudang' : 'Tambah Gudang Baru'}</DialogTitle>
          <DialogDescription>
            {warehouse ? 'Perbarui informasi gudang' : 'Isi form untuk menambah gudang baru'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Gudang</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan nama gudang" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kode Gudang</FormLabel>
                  <FormControl>
                    <Input placeholder="Contoh: WH-001" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alamat</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Masukkan alamat lengkap gudang" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telepon</FormLabel>
                  <FormControl>
                    <Input placeholder="+62 xxx xxx xxx" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="manager"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pengelola</FormLabel>
                  <FormControl>
                    <Input placeholder="Nama pengelola gudang" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Batal
              </Button>
              <Button type="submit">
                {warehouse ? 'Perbarui' : 'Tambah'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
