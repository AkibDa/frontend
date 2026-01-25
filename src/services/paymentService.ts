import { createPaymentOrder } from './api';

interface CartItem {
  item_id: string;
  quantity: number;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

const loadRazorpaySDK = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;

    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Razorpay SDK'));

    document.body.appendChild(script);
  });
};

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
    console.log('🔄 Creating payment order...', { stallId, cartItems });

    // 1️⃣ Create order from backend
    const orderData = await createPaymentOrder(stallId, cartItems);

    // 2️⃣ Load Razorpay SDK
    await loadRazorpaySDK();

    // 3️⃣ Open Razorpay checkout
    return await new Promise((resolve) => {
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // ✅ FROM ENV
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'GreenPlate',
        description: 'Food Order Payment',
        order_id: orderData.id,

        prefill: {
          email: userEmail,
          name: userName,
        },

        theme: {
          color: '#10B981',
        },

        handler: (response: any) => {
          console.log('✅ Razorpay success:', response);

          resolve({
            success: true,
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            signature: response.razorpay_signature,
            internalOrderId: orderData.internal_order_id,
          });
        },

        modal: {
          ondismiss: () => {
            resolve({
              success: false,
              error: 'Payment cancelled by user',
            });
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    });
  } catch (error: any) {
    console.error('❌ Payment Error:', error);

    return {
      success: false,
      error: error?.message || 'Payment failed',
    };
  }
};
