import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface StockFormData {
  itemId: string;
  quantity: number;
  date: string;
  notes: string;
}

interface StockFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: StockFormData) => void;
  type: 'IN' | 'OUT';
}

// Mock items data - replace with actual API call
const mockItems = [
  { id: '1', code: 'LAP-001', name: 'Laptop Dell XPS 15', stock: 45 },
  { id: '2', code: 'FUR-001', name: 'Office Chair Ergonomic', stock: 120 },
  { id: '3', code: 'ELC-001', name: 'Printer HP LaserJet', stock: 28 },
  { id: '4', code: 'ELC-002', name: 'Wireless Mouse Logitech', stock: 85 },
  { id: '5', code: 'OFF-001', name: 'Paper A4 Ream', stock: 200 },
];

export const StockFormModal = ({ isOpen, onClose, onSubmit, type }: StockFormModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<StockFormData>({
    defaultValues: {
      itemId: '',
      quantity: 0,
      date: new Date().toISOString().split('T')[0],
      notes: '',
    },
  });

  const selectedItemId = watch('itemId');
  const selectedItem = mockItems.find(item => item.id === selectedItemId);

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
          <DialogTitle>
            Add Stock {type === 'IN' ? 'IN' : 'OUT'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
          {/* Item Selection */}
          <div className="space-y-2">
            <Label htmlFor="itemId">Item *</Label>
            <Select
              value={watch('itemId')}
              onValueChange={(value) => setValue('itemId', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select item" />
              </SelectTrigger>
              <SelectContent>
                {mockItems.map((item) => (
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

          {/* Current Stock Info */}
          {selectedItem && (
            <div className="rounded-lg border border-border bg-muted/50 p-3">
              <p className="text-sm text-muted-foreground">Current Stock</p>
              <p className="text-2xl font-bold text-foreground">{selectedItem.stock}</p>
            </div>
          )}

          {/* Quantity */}
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity *</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              {...register('quantity', {
                required: 'Quantity is required',
                min: { value: 1, message: 'Quantity must be at least 1' },
                validate: (value) => {
                  if (type === 'OUT' && selectedItem && value > selectedItem.stock) {
                    return `Cannot exceed current stock (${selectedItem.stock})`;
                  }
                  return true;
                },
              })}
              className="w-full"
            />
            {errors.quantity && (
              <p className="text-sm text-destructive">{errors.quantity.message}</p>
            )}
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date">Date *</Label>
            <Input
              id="date"
              type="date"
              {...register('date', { required: 'Date is required' })}
              className="w-full"
            />
            {errors.date && (
              <p className="text-sm text-destructive">{errors.date.message}</p>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              {...register('notes')}
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
              className={type === 'IN' ? 'bg-success hover:bg-success/90' : 'bg-warning hover:bg-warning/90'}
            >
              Save Stock {type === 'IN' ? 'IN' : 'OUT'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
