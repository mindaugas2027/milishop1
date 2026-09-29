import { IconMinus, IconPlus, IconShoppingCart, IconX } from "@tabler/icons-react";
import { useState } from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { formatPrice, priceValue, type CartLine } from "@/lib/cart";

type StoreCartDrawerProps = {
  items: CartLine[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onQuantityChange: (slug: string, amount: number) => void;
  className?: string;
};

export function StoreCartDrawer({ items, open, onOpenChange, onQuantityChange, className = "" }: StoreCartDrawerProps) {
  const [paymentMethod, setPaymentMethod] = useState("paysera");
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const total = items.reduce((sum, item) => sum + priceValue(item.price) * item.quantity, 0);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <button className={`levitara-cart ${className}`} type="button" aria-label={`Krepšelis, ${itemCount} prekių`}>
          <span aria-hidden="true"><IconShoppingCart size={18} stroke={1.8} /></span>
          <span>Krepšelis</span>
          <strong>{itemCount}</strong>
        </button>
      </SheetTrigger>
      <SheetContent side="right" showClose={false} className="levitara-cart-sheet">
        <SheetHeader className="levitara-cart-sheet-header">
          <SheetTitle>Krepšelis <span>{itemCount}</span></SheetTitle>
          <SheetClose asChild>
            <button type="button" className="levitara-cart-close" aria-label="Uždaryti krepšelį"><IconX size={19} /></button>
          </SheetClose>
        </SheetHeader>
        {items.length === 0 ? (
          <div className="levitara-cart-empty">
            <IconShoppingCart size={32} stroke={1.5} aria-hidden="true" />
            <p>Krepšelis tuščias</p>
            <span>Pasirink produktą ir pridėk jį čia.</span>
          </div>
        ) : (
          <>
            <div className="levitara-cart-items">
              {items.map((item) => (
                <article className="levitara-cart-item" key={item.slug}>
                  <img src={item.image} alt="" />
                  <div className="levitara-cart-item-info">
                    <h3>{item.name}</h3>
                    <strong>{item.price}</strong>
                    <div className="levitara-cart-quantity">
                      <button type="button" onClick={() => onQuantityChange(item.slug, -1)} aria-label={`Sumažinti ${item.name} kiekį`}><IconMinus size={14} /></button>
                      <span>{item.quantity}</span>
                      <button type="button" onClick={() => onQuantityChange(item.slug, 1)} aria-label={`Padidinti ${item.name} kiekį`}><IconPlus size={14} /></button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <div className="levitara-cart-payment">
              <p className="text-sm font-semibold text-[#203b40]">Apmokėjimo būdas</p>
              <div className="mt-3 space-y-2 text-sm text-[#203b40]/70">
                <label className="flex items-center gap-2"><input type="radio" name="paymentMethod" checked={paymentMethod === "paysera"} onChange={() => setPaymentMethod("paysera")} />Paysera</label>
                <label className="flex items-center gap-2"><input type="radio" name="paymentMethod" checked={paymentMethod === "bank"} onChange={() => setPaymentMethod("bank")} />Bankinis pavedimas</label>
              </div>
              <div className="mt-3 rounded-xl border border-[#203b40]/10 bg-white p-3 text-xs text-[#203b40]/60">
                {paymentMethod === "paysera" ? "Lietuvos bankai: Swedbank, SEB, Luminor, Revolut, Paysera." : "Galimas bankinis pavedimas per SEB, Swedbank ar Luminor."}
              </div>
            </div>
            <div className="levitara-cart-total"><span>Tarpinė suma</span><strong>{formatPrice(total)}</strong></div>
            <button type="button" disabled className="w-full rounded-full bg-[#2f7f7b] px-4 py-3 text-sm font-semibold text-white opacity-60" title="Atsiskaitymas dar neprijungtas">Apmokėjimas dar neprijungtas</button>
            <p className="levitara-cart-note">Nemokamas pristatymas nuo 50 €. 14 dienų grąžinimo teisė.</p>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
