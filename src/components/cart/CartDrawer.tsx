import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, Sparkles, AlertTriangle } from 'lucide-react';
import { useAuth, SignInButton } from '../../lib/auth';
import { useCartStore } from '../../lib/cartStore';
import { useCart } from '../../hooks/useCart';
import { formatINR } from '../../config/constants';
import { VegBadge } from '../common/VegBadge';

export const CartDrawer: React.FC = () => {
  const { isCartDrawerOpen, closeCartDrawer } = useCartStore();
  const { cart, isLoading, updateQuantity, removeItem, clearCart } = useCart();
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();

  if (!isCartDrawerOpen) return null;

  const items = cart?.items || [];
  const restaurant = cart?.restaurant;
  const subtotal = cart?.subtotal || 0;
  const deliveryFee = cart?.deliveryFee || 0;
  const tax = cart?.tax || 0;
  const total = cart?.total || 0;
  const freeThreshold = cart?.freeDeliveryThreshold || 500;
  const neededForFree = cart?.amountNeededForFreeDelivery || 0;
  const freeProgress = Math.min(100, Math.round((subtotal / freeThreshold) * 100));

  const minOrder = restaurant?.minOrder || 0;
  const isBelowMinOrder = minOrder > 0 && subtotal < minOrder;

  const handleProceedToCheckout = () => {
    closeCartDrawer();
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeCartDrawer}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-primary/10 text-primary rounded-lg">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Your Crave Cart</h2>
                {restaurant && (
                  <p className="text-xs text-slate-500 font-medium">
                    From {restaurant.name} ({restaurant.area})
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {items.length > 0 && (
                <button
                  type="button"
                  onClick={() => clearCart()}
                  className="text-xs text-rose-600 hover:text-rose-700 font-medium px-2 py-1 hover:bg-rose-50 rounded transition"
                  title="Clear Cart"
                >
                  Clear
                </button>
              )}
              <button
                type="button"
                onClick={closeCartDrawer}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Main Body */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
            {isLoading ? (
              <div className="py-16 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mb-2" />
                <p className="text-xs text-slate-500">Loading your cart...</p>
              </div>
            ) : items.length === 0 ? (
              <div className="py-16 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-slate-800">Your cart is empty</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-xs">
                  Hungry? Browse delicious restaurants in Chennai and drop your favorites in here.
                </p>
                <button
                  type="button"
                  onClick={closeCartDrawer}
                  className="mt-6 px-5 py-2 text-sm font-semibold text-white bg-primary hover:bg-primary-dark rounded-xl shadow-xs transition"
                >
                  Explore Restaurants
                </button>
              </div>
            ) : (
              <>
                {/* Free Delivery Meter */}
                <div className="p-3 bg-amber-50/70 border border-amber-200/60 rounded-xl">
                  <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                    <span className="flex items-center gap-1.5 text-amber-900">
                      <Sparkles className="w-3.5 h-3.5 text-primary" />
                      {neededForFree > 0
                        ? `Add ${formatINR(neededForFree)} more for FREE delivery!`
                        : '🎉 Congratulations! You unlocked FREE delivery!'}
                    </span>
                    <span className="text-slate-600">{freeProgress}%</span>
                  </div>
                  <div className="w-full h-2 bg-amber-200/60 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-300 rounded-full"
                      style={{ width: `${freeProgress}%` }}
                    />
                  </div>
                </div>

                {/* Items List */}
                <div className="divide-y divide-slate-100">
                  {items.map((item) => (
                    <div key={item.menuItemId} className="py-3 flex items-center justify-between gap-3">
                      <div className="flex items-start gap-2.5 flex-1 min-w-0">
                        <div className="mt-0.5 shrink-0">
                          <VegBadge isVeg={item.isVeg} size="sm" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-slate-900 truncate">{item.name}</p>
                          <p className="text-xs text-slate-500 font-medium">
                            {formatINR(item.price)} each
                          </p>
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50 overflow-hidden">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity({
                                menuItemId: item.menuItemId,
                                quantity: item.quantity - 1,
                              })
                            }
                            className="p-1 hover:bg-slate-200 text-slate-700 transition"
                            title="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-2 text-xs font-bold text-slate-800 min-w-[20px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            disabled={item.quantity >= 20}
                            onClick={() =>
                              updateQuantity({
                                menuItemId: item.menuItemId,
                                quantity: item.quantity + 1,
                              })
                            }
                            className="p-1 hover:bg-slate-200 text-slate-700 transition disabled:opacity-40"
                            title="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <span className="text-sm font-bold text-slate-900 w-16 text-right">
                          {formatINR(item.lineTotal)}
                        </span>

                        <button
                          type="button"
                          onClick={() => removeItem(item.menuItemId)}
                          className="p-1 text-slate-400 hover:text-rose-600 transition"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Min order alert if applicable */}
                {isBelowMinOrder && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-800">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>
                      Minimum order for {restaurant?.name} is {formatINR(minOrder)}. Please add{' '}
                      <span className="font-bold">{formatINR(minOrder - subtotal)}</span> more to proceed.
                    </span>
                  </div>
                )}

                {/* Bill Details */}
                <div className="bg-slate-50 rounded-xl p-4 space-y-2 border border-slate-100 text-xs text-slate-600">
                  <div className="font-bold text-slate-900 text-sm border-b border-slate-200/80 pb-2">
                    Bill Summary
                  </div>
                  <div className="flex justify-between">
                    <span>Item Total</span>
                    <span className="font-semibold text-slate-800">{formatINR(subtotal)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Delivery Partner Fee</span>
                    <div>
                      {deliveryFee === 0 ? (
                        <span className="font-semibold text-emerald-700 flex items-center gap-1">
                          <span className="line-through text-slate-400 font-normal">₹40</span> FREE
                        </span>
                      ) : (
                        <span className="font-semibold text-slate-800">{formatINR(deliveryFee)}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span>GST (5% Government Tax)</span>
                    <span className="font-semibold text-slate-800">{formatINR(tax)}</span>
                  </div>
                  <div className="border-t border-slate-200/80 pt-2 flex justify-between text-sm font-bold text-slate-900">
                    <span>To Pay</span>
                    <span className="text-primary">{formatINR(total)}</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer Checkout Bar */}
          {items.length > 0 && (
            <div className="p-4 border-t border-slate-100 bg-white space-y-2 sticky bottom-0">
              {!isSignedIn ? (
                <SignInButton mode="modal">
                  <button
                    type="button"
                    className="w-full py-3 px-4 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl shadow-xs transition flex items-center justify-between"
                  >
                    <span>Sign In to Checkout</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </SignInButton>
              ) : (
                <button
                  type="button"
                  disabled={isBelowMinOrder}
                  onClick={handleProceedToCheckout}
                  className="w-full py-3 px-4 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl shadow-xs transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-between"
                >
                  <div className="text-left">
                    <span className="text-xs font-medium block text-orange-100 uppercase tracking-wider">
                      {items.length} {items.length === 1 ? 'item' : 'items'}
                    </span>
                    <span className="text-base">{formatINR(total)}</span>
                  </div>
                  <div className="flex items-center gap-1 font-bold">
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
