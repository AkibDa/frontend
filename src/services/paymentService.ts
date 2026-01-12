import { createPaymentOrder } from './api';

interface CartItem {
  item_id: string;  // Changed from 'id' to match
  quantity: number;
}

export const initiatePayment = async (
  cartItems: CartItem[],
  stallId: string,
  userEmail: string,
  userName: string
): Promise<{ success: boolean; paymentId?: string; error?: string }> => {
  try {
    console.log('🔄 Creating payment order...', { stallId, items: cartItems });
    
    // Cart items already have item_id, just pass them through
    const orderData = await createPaymentOrder(stallId, cartItems);

    console.log('✅ Order created:', orderData);

    // Load Razorpay if not already loaded
    if (!(window as any).Razorpay) {
      console.log('📦 Loading Razorpay SDK...');
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);

      await new Promise((resolve, reject) => {
        script.onload = () => {
          console.log('✅ Razorpay SDK loaded');
          resolve(true);
        };
        script.onerror = () => reject(new Error('Failed to load Razorpay SDK'));
      });
    }

    // Razorpay options
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
      theme: {
        color: '#10B981'
      },
    };

    console.log('🚀 Opening Razorpay checkout...');

    return new Promise((resolve) => {
      try {
        const rzp = new (window as any).Razorpay(options);
        
        rzp.on('payment.success', (response: any) => {
          console.log('✅ Payment success:', response);
          resolve({
            success: true,
            paymentId: response.razorpay_payment_id
          });
        });

        rzp.on('payment.failed', (response: any) => {
          console.log('❌ Payment failed:', response);
          resolve({
            success: false,
            error: response.error?.description || 'Payment failed'
          });
        });

        rzp.open();
      } catch (error: any) {
        console.error('❌ Error opening Razorpay:', error);
        resolve({
          success: false,
          error: error.message || 'Failed to open payment gateway'
        });
      }
    });

  } catch (error: any) {
    console.error('❌ Payment Error:', error);
    
    if (error.response) {
      const errorMessage = error.response.data?.message || 'Server error';
      return {
        success: false,
        error: errorMessage
      };
    } else if (error.request) {
      return {
        success: false,
        error: 'Cannot connect to server'
      };
    } else {
      return {
        success: false,
        error: error.message || 'Payment failed'
      };
    }
  }
};
