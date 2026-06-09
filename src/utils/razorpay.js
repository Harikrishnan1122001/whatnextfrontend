// ============================================================
// utils/razorpay.js — Razorpay checkout helper
// ============================================================
import { paymentAPI } from './api';

/**
 * Opens the Razorpay checkout modal.
 * @param {object} opts
 * @param {string} opts.itemType  'course' | 'notes' | 'live_class'
 * @param {string} opts.itemId    MongoDB ObjectId
 * @param {object} opts.user      { name, email, phone }
 * @param {function} opts.onSuccess  Called with payment data after verify
 * @param {function} opts.onFailure  Called on error/dismiss
 */
export const initiatePayment = async ({ itemType, itemId, user, onSuccess, onFailure }) => {
  try {
    // 1. Create order on server
    const { data } = await paymentAPI.createOrder({ itemType, itemId });
    if (!data.success) throw new Error(data.message || 'Failed to create order');

    const { order, key } = data;

    // 2. Open Razorpay checkout
    const options = {
      key: key || process.env.REACT_APP_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency || 'INR',
      name: 'EduPlatform',
      description: data.itemTitle || 'Purchase',
      order_id: order.id,
      prefill: {
        name: user?.name || '',
        email: user?.email || '',
        contact: user?.phone || '',
      },
      theme: { color: '#6c63ff' },
      handler: async (response) => {
        try {
          // 3. Verify payment on server
          const verifyRes = await paymentAPI.verify({
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          });
          if (verifyRes.data.success) {
            onSuccess && onSuccess(verifyRes.data);
          } else {
            onFailure && onFailure(new Error('Payment verification failed'));
          }
        } catch (err) {
          onFailure && onFailure(err);
        }
      },
      modal: {
        ondismiss: () => onFailure && onFailure(new Error('Payment cancelled')),
      },
    };

    if (!window.Razorpay) {
      throw new Error('Razorpay SDK not loaded. Check your index.html');
    }

    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (err) {
    onFailure && onFailure(err);
  }
};
