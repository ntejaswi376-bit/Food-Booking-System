import React from 'react';
import { Plus, Minus, Star } from 'lucide-react';
import { MenuItem } from '../../types';
import { formatINR } from '../../config/constants';
import { VegBadge } from '../common/VegBadge';
import { useCart } from '../../hooks/useCart';

interface MenuCardProps {
  item: MenuItem;
}

export const MenuCard: React.FC<MenuCardProps> = ({ item }) => {
  const { cart, addItem, updateQuantity, isAddingItem } = useCart();

  const cartItem = cart?.items?.find((i) => i.menuItemId === item._id);
  const quantity = cartItem?.quantity || 0;

  const handleAdd = () => {
    if (!item.isAvailable) return;
    addItem({ menuItemId: item._id, quantity: 1 });
  };

  const handleIncrement = () => {
    if (!item.isAvailable || quantity >= 20) return;
    updateQuantity({ menuItemId: item._id, quantity: quantity + 1 });
  };

  const handleDecrement = () => {
    if (quantity <= 0) return;
    updateQuantity({ menuItemId: item._id, quantity: quantity - 1 });
  };

  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-100 flex items-start justify-between gap-4 hover:border-slate-200 transition">
      {/* Details Col */}
      <div className="flex-1 space-y-1.5">
        <div className="flex items-center gap-2">
          <VegBadge isVeg={item.isVeg} size="sm" />
          {item.isBestseller && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold text-amber-800 bg-amber-100">
              <Star className="w-2.5 h-2.5 fill-current" />
              Bestseller
            </span>
          )}
        </div>

        <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
          {item.name}
        </h4>

        <div className="text-sm font-semibold text-slate-800">
          {formatINR(item.price)}
        </div>

        {item.description && (
          <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 max-w-md">
            {item.description}
          </p>
        )}
      </div>

      {/* Image & Action Button Col */}
      <div className="relative shrink-0 flex flex-col items-center">
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-slate-100">
          <img
            src={item.image}
            alt={item.name}
            loading="lazy"
            referrerPolicy="no-referrer"
            className={`w-full h-full object-cover transition ${
              !item.isAvailable ? 'grayscale opacity-60' : ''
            }`}
          />
        </div>

        {/* Action Button */}
        <div className="mt-[-16px] z-10">
          {!item.isAvailable ? (
            <span className="px-3 py-1.5 text-xs font-bold text-slate-500 bg-slate-100 border border-slate-200 rounded-xl shadow-xs">
              Sold Out
            </span>
          ) : quantity > 0 ? (
            <div className="flex items-center bg-white border border-primary text-primary rounded-xl shadow-md overflow-hidden">
              <button
                type="button"
                onClick={handleDecrement}
                className="px-2 py-1.5 hover:bg-orange-50 transition"
                title="Decrease"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="px-2 text-xs font-bold min-w-[20px] text-center">
                {quantity}
              </span>
              <button
                type="button"
                onClick={handleIncrement}
                disabled={quantity >= 20}
                className="px-2 py-1.5 hover:bg-orange-50 transition disabled:opacity-40"
                title="Increase"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              disabled={isAddingItem}
              onClick={handleAdd}
              className="px-5 py-1.5 text-xs font-bold uppercase tracking-wider text-primary hover:text-white bg-white hover:bg-primary border border-primary/40 hover:border-primary rounded-xl shadow-md transition"
            >
              Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
