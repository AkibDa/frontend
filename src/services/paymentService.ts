import { createPaymentOrder } from './api';

interface CartItem {
  item_id: string;
  quantity: number;
}

export const initiatePayment = async (
  cartItems: CartItem[],
  stallId: string,
  userEmail: string,
  userName: string
): Promise<{
  success: boolean;
  paymentId?: string;
  orderId?: string;
  signature?: string;
  internalOrderId?: string;
  error?: string;
}> => {
  try {
    console.log('🔄 Creating payment order...', { stallId, items: cartItems });

    const orderData = await createPaymentOrder(stallId, cartItems);
    console.log('✅ Order created:', orderData);

    // Load Razorpay SDK if not loaded
    if (!(window as any).Razorpay) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);

      await new Promise((resolve, reject) => {
        script.onload = () => resolve(true);
        script.onerror = () => reject(new Error('Failed to load Razorpay SDK'));
      });
    }

    return new Promise((resolve) => {
      const options = {
        key: orderData.key_id,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'GreenPlate',
        description: 'Food Order Payment',
        order_id: orderData.id,

        prefill: {
          email: userEmail,
          name: userName,
        },

        theme: { color: '#10B981' },

        handler: function (response: any) {
          console.log('✅ Razorpay handler response:', response);

          resolve({
            success: true,
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            signature: response.razorpay_signature,
            internalOrderId: orderData.internal_order_id,
          });
        },

        modal: {
          ondismiss: function () {
            resolve({
              success: false,
              error: 'Payment cancelled by user',
            });
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    });
  } catch (error: any) {
    console.error('Payment Error:', error);

    return {
      success: false,
      error: error.message || 'Payment failed',
    };
  }
};
