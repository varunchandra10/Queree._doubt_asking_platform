import * as api from '../api'
import { showAppAlert } from '../utils/appAlert';
import { setCurrentUser } from './currentUser';

export const handlePayment = (id, amount) => async (dispatch) => {
    try {
        const { data } = await api.order(amount);
        const order = data?.order;
        const razorpayKey = data?.keyId || import.meta.env.VITE_RAZORPAY_KEY_ID;
        const checkoutImage = `${window.location.origin}/favicon.svg`;

        if (!order?.id) {
            showAppAlert({
                title: 'Payment Unavailable',
                message: 'Could not create a Razorpay order. Please try again later.',
                variant: 'danger',
            });
            return;
        }

        if (!razorpayKey) {
            showAppAlert({
                title: 'Missing Razorpay Key',
                message: 'Set `KEY_ID` on the server or `VITE_RAZORPAY_KEY_ID` in the frontend environment.',
                variant: 'danger',
            });
            return;
        }

        if (!window.Razorpay) {
            showAppAlert({
                title: 'Checkout Not Loaded',
                message: 'The Razorpay checkout script is unavailable. Refresh the page and try again.',
                variant: 'danger',
            });
            return;
        }

        const options = {
            key: razorpayKey,
            amount: order.amount,
            currency: "INR",
            name: "Queere. Plan",
            description: "Tutorial of RazorPay",
            image: checkoutImage,
            handler: async function (response) {
                try {
                    const result = await api.verifyOrder({
                        userId: id,
                        amount,
                        response,
                    });

                    if (result.data.success === true) {
                        const updatedUser = result.data.result;

                        if (updatedUser) {
                            dispatch(setCurrentUser({
                                token: JSON.parse(localStorage.getItem('Profile') || '{}')?.token,
                                result: updatedUser,
                            }));
                            dispatch({ type: "UPDATE_CURRENT_USER", payload: updatedUser });

                            const storedProfile = JSON.parse(localStorage.getItem('Profile') || '{}');
                            localStorage.setItem('Profile', JSON.stringify({
                                ...storedProfile,
                                result: updatedUser,
                            }));
                        }

                        showAppAlert({
                            title: 'Subscription Updated',
                            message: 'Your new subscription plan is active.',
                            variant: 'success',
                        });
                    } else {
                        showAppAlert({
                            title: 'Activation Failed',
                            message: result.data?.error || 'The subscription plan could not be activated. Please try again later.',
                            variant: 'danger',
                        });
                    }
                } catch (error) {
                    showAppAlert({
                        title: 'Activation Failed',
                        message: error?.response?.data?.error || 'The subscription plan could not be activated. Please try again later.',
                        variant: 'danger',
                    });
                }
            },
            prefill: {
                name: "Varun Chandra",
                email: "varun@example.com",
                contact: "9346101109"
            },
            notes: {
                "address": "Razorpay Corporate Office"
            },
            theme: {
                "color": "#121212"
            }
        };
        const razor = new window.Razorpay(options);
        razor.open();
    } catch (err) {
        console.log(err);
        showAppAlert({
            title: 'Payment Error',
            message: err?.response?.data?.error || 'Unable to start the subscription payment flow.',
            variant: 'danger',
        });
    }
}

export const checkSubscription = (id) => async (dispatch) => {
    try {
        const { data } = await api.checkSubs(id);
        console.log(data);
        if (data.subs === 'free') {
            dispatch({ type: "UPDATE_CURRENT_USER", payload: data.newUser })
            showAppAlert({
                title: 'Subscription Ended',
                message: 'Your monthly subscription has ended.',
                variant: 'warning',
            });
        }
    } catch (err) {
        console.log(err);
    }
}
