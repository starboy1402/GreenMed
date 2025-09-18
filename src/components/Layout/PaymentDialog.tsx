import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { paymentApi } from '@/lib/api';
import { Loader2 } from 'lucide-react';

interface PaymentDialogProps {
  orderId: number;
  amount: number;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const PaymentDialog: React.FC<PaymentDialogProps> = ({ orderId, amount, isOpen, onClose, onSuccess }) => {
  const [paymentMethod, setPaymentMethod] = useState('bKash');
  const [transactionId, setTransactionId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handlePayment = async () => {
    if (!transactionId.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid transaction ID.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      await paymentApi.processPayment(orderId, { paymentMethod, transactionId });
      toast({
        title: "Payment Submitted!",
        description: `Your payment for order #${orderId} is being verified.`,
      });
      onSuccess();
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "Could not process payment. Please check the details and try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Complete Your Payment</DialogTitle>
          <DialogDescription>
            You are paying ৳{amount.toFixed(2)} for Order #{orderId}.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div>
            <Label className="font-semibold">Select Payment Method</Label>
            <RadioGroup defaultValue="bKash" onValueChange={setPaymentMethod} className="mt-2 space-y-1">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="bKash" id="bKash" />
                <Label htmlFor="bKash">bKash</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Nagad" id="Nagad" />
                <Label htmlFor="Nagad">Nagad</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Card" id="Card" />
                <Label htmlFor="Card">Credit/Debit Card</Label>
              </div>
            </RadioGroup>
          </div>
          <div>
            <Label htmlFor="trxId" className="font-semibold">Transaction ID (TrxID)</Label>
            <Input 
              id="trxId"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              placeholder="Enter the TrxID from your payment app"
              className="mt-2"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handlePayment} disabled={isProcessing}>
            {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirm Payment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;

