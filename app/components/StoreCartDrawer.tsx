import { IconMinus, IconPlus, IconShoppingCart, IconX } from "@tabler/icons-react";
import { useState } from "react";
import { actionErrorMessage, useActionMutation } from "@agent-native/core/client/hooks";
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
  onOrderCreated: () => void;
  className?: string;
};

export function StoreCartDrawer({ items, open, onOpenChange, onQuantityChange, onOrderCreated, className = "" }: StoreCartDrawerProps) {
  const [customer, setCustomer] = useState({ customerName: "", customerEmail: "", customerPhone: "", shippingAddress: "" });
  const [confirmation, setConfirmation] = useState("");
  const { mutate: createOrder, isPending, error } = useActionMutation("create-order");
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const total = items.reduce((sum, item) => sum + priceValue(item.price) * item.quantity, 0);

  const submitOrder = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    createOrder({
      ...customer,
      items: items.map((item) => ({ slug: item.slug, quantity: item.quantity })),
    }, {
      onSuccess: (order) => {
        setConfirmation(order.orderNumber);
        onOrderCreated();
      },
    });
  };

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
        {confirmation ? (
          <div className="grid content-start gap-3 py-8">
            <p className="text-xs font-semibold uppercase text-[#2f7f7b]">Užsakymas priimtas</p>
            <h3 className="text-xl font-semibold text-[#171a19]">Ačiū už užsakymą</h3>
            <p className="text-sm text-[#555d59]">Užsakymo numeris <strong>{confirmation}</strong>. Dėl apmokėjimo informacijos susisieksime pateiktais kontaktais.</p>
            <button type="button" onClick={() => { setConfirmation(""); onOpenChange(false); }} className="admin-primary-action mt-2">Tęsti apsipirkimą</button>
          </div>
        ) : items.length === 0 ? (
          <div className="levitara-cart-empty">
            <IconShoppingCart size={32} stroke={1.5} aria-hidden="true" />
            <p>Krepšelis tuščias</p>
            <span>Pasirink produktą ir pridėk jį čia.</span>
          </div>
        ) : (
          <>
            <div className="grid min-h-0 gap-5 overflow-y-auto">
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
              <form className="grid gap-3" onSubmit={submitOrder}>
                <p className="text-sm font-semibold text-[#203b40]">Pristatymo duomenys</p>
                <label className="grid gap-1 text-xs font-medium text-[#203b40]/70">Vardas ir pavardė<input className="rounded-lg border border-[#203b40]/15 bg-white px-3 py-2.5 text-sm" autoComplete="name" required minLength={2} maxLength={120} value={customer.customerName} onChange={(event) => setCustomer({ ...customer, customerName: event.target.value })} /></label>
                <label className="grid gap-1 text-xs font-medium text-[#203b40]/70">El. paštas<input className="rounded-lg border border-[#203b40]/15 bg-white px-3 py-2.5 text-sm" type="email" autoComplete="email" required maxLength={254} value={customer.customerEmail} onChange={(event) => setCustomer({ ...customer, customerEmail: event.target.value })} /></label>
                <label className="grid gap-1 text-xs font-medium text-[#203b40]/70">Telefonas<input className="rounded-lg border border-[#203b40]/15 bg-white px-3 py-2.5 text-sm" type="tel" autoComplete="tel" required minLength={6} maxLength={30} value={customer.customerPhone} onChange={(event) => setCustomer({ ...customer, customerPhone: event.target.value })} /></label>
                <label className="grid gap-1 text-xs font-medium text-[#203b40]/70">Pristatymo adresas<textarea className="rounded-lg border border-[#203b40]/15 bg-white px-3 py-2.5 text-sm" autoComplete="street-address" required minLength={8} maxLength={400} rows={2} value={customer.shippingAddress} onChange={(event) => setCustomer({ ...customer, shippingAddress: event.target.value })} /></label>
                <p className="rounded-lg bg-[#f5f7f5] p-3 text-xs leading-5 text-[#555d59]">Apmokėjimas bankiniu pavedimu. Dėl pavedimo informacijos susisieksime pateiktais kontaktais.</p>
                <div className="levitara-cart-total"><span>Prekių suma</span><strong>{formatPrice(total)}</strong></div>
                {error && <p role="alert" className="text-sm text-[#bd6659]">{actionErrorMessage(error) ?? "Užsakymo pateikti nepavyko. Patikrinkite duomenis ir bandykite dar kartą."}</p>}
                <button type="submit" disabled={isPending} className="w-full rounded-full bg-[#2f7f7b] px-4 py-3 text-sm font-semibold text-white disabled:opacity-60">{isPending ? "Pateikiama…" : "Pateikti užsakymą"}</button>
                <p className="levitara-cart-note">Nemokamas pristatymas nuo 50 €. 14 dienų grąžinimo teisė.</p>
              </form>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
