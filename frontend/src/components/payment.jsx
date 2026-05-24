import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { handlePayment } from '../actions/Subscription';
import { showAppAlert } from '../utils/appAlert';

const PricingCard = ({ name, price, features, isCurrentPlan, onClick, planType }) => {
  const isFreePlan = planType === 'free';
  const getPlanStyles = () => {
    if (isCurrentPlan) return 'border-2 border-theme-accent-primary ring-4 ring-theme-accent-primary/10';
    if (planType === 'gold') return 'border border-amber-500/30 bg-gradient-to-b from-transparent to-amber-500/5';
    if (planType === 'silver') return 'border border-slate-400/30';
    return 'border border-theme-border';
  };

  return (
    <div className={`relative flex flex-col justify-between p-6 rounded-2xl bg-theme-bg-surface shadow-xs transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${getPlanStyles()}`}>
      
      {isCurrentPlan && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white bg-theme-accent-primary rounded-full shadow-sm">
          Active Plan
        </span>
      )}
      
      <div>
        <h3 className="text-lg font-bold text-theme-text-main mb-2">{name}</h3>
        
        <div className="flex items-baseline gap-1 my-4 text-theme-text-main">
          <span className="text-2xl font-bold tracking-tight">₹</span>
          <span className="text-4xl font-extrabold tracking-tight">{price}</span>
          <span className="text-sm font-medium text-theme-text-dim">/mo</span>
        </div>
        
        <ul className="space-y-3 my-6 border-t border-theme-border/60 pt-6">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2.5 text-sm text-theme-text-muted">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-500 shrink-0 text-xs font-bold">
                ✓
              </span> 
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <button 
        onClick={onClick}
        disabled={isCurrentPlan || isFreePlan}
        className={`w-full py-2.5 rounded-xl text-sm font-semibold tracking-wide transition-all cursor-pointer active:scale-98 ${
          isCurrentPlan || isFreePlan
            ? 'bg-theme-bg-element text-theme-text-dim cursor-not-allowed font-medium' 
            : planType === 'gold'
              ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-sm shadow-amber-500/10'
              : 'bg-theme-accent-primary hover:bg-theme-accent-hover text-white shadow-sm shadow-theme-accent-primary/10'
        }`}
      >
        {isCurrentPlan ? 'Current Plan' : isFreePlan ? 'Included' : 'Upgrade Plan'}
      </button>
    </div>
  );
};

const Payment = () => {
  const User = useSelector((state) => state.currentUserReducer);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentPlan = User?.result?.subscription || 'free';

  const handleSub = async (amount) => {
    if (User === null) {
      showAppAlert('Log in or sign up to buy a subscription.');
      navigate('/login');
    } else if (amount <= 0) {
      showAppAlert({
        title: 'Free Plan',
        message: 'The free plan does not require payment.',
        variant: 'info',
      });
    } else {
      dispatch(handlePayment(User.result._id, amount));
    }
  };

  const pricingPlansData = [
    {
      name: 'Free Plan',
      price: '0',
      features: ['1 Question / Day', 'Character Limit — 250'],
      amount: 0,
      planType: 'free',
    },
    {
      name: 'Silver Plan',
      price: '100',
      features: ['5 Questions / Day', 'Character Limit — Unlimited'],
      amount: 100,
      planType: 'silver',
    },
    {
      name: 'Gold Plan',
      price: '1,000',
      features: ['Unlimited Questions', 'Character Limit — Unlimited'],
      amount: 1000,
      planType: 'gold',
    },
  ];

  return (
    // Cleaned container shell: takes full width of whatever parent block it resides in
    <div className="w-full max-w-5xl mx-auto py-6">
      
      {/* Section Header Description */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-3xl font-extrabold text-theme-text-main tracking-tight mb-3">
          Choose your subscription plan
        </h2>
        <p className="text-base text-theme-text-muted">
          Unlock higher daily post limits, remove text parameters, and maximize your core development resolution workflows.
        </p>
      </div>
      
      {/* Responsive 3-Column Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch w-full">
        {pricingPlansData.map((plan, index) => (
          <PricingCard
            key={index}
            name={plan.name}
            price={plan.price}
            features={plan.features}
            isCurrentPlan={currentPlan === plan.planType}
            onClick={() => handleSub(plan.amount)}
            planType={plan.planType}
          />
        ))}
      </div>
      
    </div>
  );
};

export default Payment;
