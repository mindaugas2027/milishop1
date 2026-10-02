import { actionErrorMessage, useActionMutation, useActionQuery } from "@agent-native/core/client/hooks";
import { useState } from "react";

type OrderItem = {
  slug: string;
  name: string;
  image: string;
  quantity: number;
  unitPriceCents: number;
  unitCostCents: number | null;
};

type AdminOrder = {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  paymentStatus: string;
  status: string;
  items: OrderItem[];
  totalCents: string;
  costCents: string;
  profitCents: string;
  createdAt: string;
};

const statuses = [
  { value: "received", label: "Gautas" },
  { value: "processing", label: "Vykdomas" },
  { value: "shipped", label: "Išsiųstas" },
  { value: "completed", label: "Įvykdytas" },
  { value: "cancelled", label: "Atšauktas" },
] as const;

function formatCents(cents: string | number) {
  return `${(Number(cents) / 100).toFixed(2).replace(".", ",")} €`;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("lt-LT", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

export default function OrderManager() {
  const { data, isPending, isError } = useActionQuery("list-orders", {});
  const { mutate: updateOrder, isPending: isUpdating, error: updateError } = useActionMutation("update-order");
  const { mutate: deleteOrder, isPending: isDeleting, error: deleteError } = useActionMutation("delete-order");
  const [removedOrderIds, setRemovedOrderIds] = useState<string[]>([]);
  const orders = ((data ?? []) as AdminOrder[]).filter((order) => !removedOrderIds.includes(order.id));
  const completedOrders = orders.filter((order) => order.status === "completed" && order.paymentStatus === "paid" && order.profitCents !== "");
  const grossProfitCents = completedOrders.reduce((sum, order) => sum + Number(order.profitCents), 0);
  const grossRevenueCents = completedOrders.reduce((sum, order) => sum + Number(order.totalCents), 0);
  const fieldClass = "rounded-lg border border-[#203b40]/15 bg-white px-2.5 py-2 text-xs text-[#203b40]";

  const removeOrder = (order: AdminOrder) => {
    if (!window.confirm(`Visam laikui ištrinti užsakymą ${order.orderNumber}? Šio veiksmo atšaukti nepavyks.`)) return;
    setRemovedOrderIds((current) => [...current, order.id]);
    deleteOrder({ id: order.id }, {
      onError: () => setRemovedOrderIds((current) => current.filter((id) => id !== order.id)),
    });
  };

  return (
    <section className="admin-panel mt-6" aria-busy={isPending || isUpdating || isDeleting}>
      {orders.length > 0 && (
        <div className="flex flex-wrap gap-x-8 gap-y-2 border-b border-[#203b40]/8 pb-5 text-sm">
          <p><span className="text-[#203b40]/55">Pardavimai</span> <strong className="ml-2">{formatCents(grossRevenueCents)}</strong></p>
          <p><span className="text-[#203b40]/55">Pelnas iš apmokėtų ir įvykdytų</span> <strong className="ml-2 text-[#2f7f7b]">{formatCents(grossProfitCents)}</strong></p>
          <p className="basis-full text-xs text-[#203b40]/45">Suvestinė įtraukia tik pilnas savikainas turinčius apmokėtus įvykdytus užsakymus; neįskaičiuotas pristatymas ir kitos išlaidos.</p>
        </div>
      )}
      {isError && <p role="alert" className="py-8 text-sm text-[#bd6659]">Užsakymų įkelti nepavyko. Patikrinkite administratoriaus prisijungimą ir duomenų bazę.</p>}
      {updateError && <p role="alert" className="mt-4 text-sm text-[#bd6659]">{actionErrorMessage(updateError) ?? "Užsakymo būsenos išsaugoti nepavyko."}</p>}
      {deleteError && <p role="alert" className="mt-4 text-sm text-[#bd6659]">{actionErrorMessage(deleteError) ?? "Užsakymo ištrinti nepavyko."}</p>}
      {isPending && <p role="status" className="py-8 text-sm text-[#203b40]/55">Įkeliami užsakymai…</p>}
      {!isPending && !isError && orders.length === 0 && <p className="py-12 text-center text-sm text-[#203b40]/50">Užsakymų dar nėra.</p>}
      <div>
        {orders.map((order) => {
          const costsComplete = order.items.every((item) => item.unitCostCents !== null);
          return (
            <article key={order.id} className="border-b border-[#203b40]/8 py-5 last:border-0">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <h3 className="font-semibold text-[#203b40]">{order.orderNumber}</h3>
                  <p className="mt-1 text-xs text-[#203b40]/50">{formatDate(order.createdAt)}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <label className="grid gap-1 text-[10px] font-semibold text-[#203b40]/50">Užsakymas
                    <select className={fieldClass} aria-label={`Užsakymo ${order.orderNumber} būsena`} value={order.status} disabled={isUpdating} onChange={(event) => updateOrder({ id: order.id, status: event.target.value as typeof statuses[number]["value"] })}>
                      {statuses.map((status) => <option key={status.value} value={status.value}>{status.label}</option>)}
                    </select>
                  </label>
                  <label className="grid gap-1 text-[10px] font-semibold text-[#203b40]/50">Apmokėjimas
                    <select className={fieldClass} aria-label={`Užsakymo ${order.orderNumber} apmokėjimas`} value={order.paymentStatus} disabled={isUpdating} onChange={(event) => updateOrder({ id: order.id, paymentStatus: event.target.value as "unpaid" | "paid" | "refunded" })}>
                      <option value="unpaid">Neapmokėtas</option>
                      <option value="paid">Apmokėtas</option>
                      <option value="refunded">Grąžintas</option>
                    </select>
                  </label>
                  <button type="button" className="admin-row-action self-end text-[#bd6659] disabled:opacity-50" disabled={isDeleting} onClick={() => removeOrder(order)}>Ištrinti</button>
                </div>
              </div>
              <div className="mt-4 grid gap-5 text-sm md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                <div className="grid content-start gap-1 text-[#203b40]/65">
                  <strong className="text-[#203b40]">{order.customerName}</strong>
                  <a className="w-fit hover:text-[#2f7f7b]" href={`mailto:${order.customerEmail}`}>{order.customerEmail}</a>
                  <a className="w-fit hover:text-[#2f7f7b]" href={`tel:${order.customerPhone}`}>{order.customerPhone}</a>
                  <p className="mt-2 whitespace-pre-line">{order.shippingAddress}</p>
                </div>
                <div className="grid content-start gap-2">
                  {order.items.map((item) => (
                    <div key={item.slug} className="flex justify-between gap-4 text-xs">
                      <span className="text-[#203b40]/65">{item.name} × {item.quantity}</span>
                      <strong className="shrink-0 text-[#203b40]">{formatCents(item.unitPriceCents * item.quantity)}</strong>
                    </div>
                  ))}
                  <dl className="mt-2 grid grid-cols-2 gap-y-1 border-t border-[#203b40]/8 pt-3 text-xs">
                    <dt className="text-[#203b40]/55">Prekių suma</dt><dd className="text-right font-semibold">{formatCents(order.totalCents)}</dd>
                    <dt className="text-[#203b40]/55">Savikaina</dt><dd className="text-right">{costsComplete ? formatCents(order.costCents) : "Trūksta duomenų"}</dd>
                    <dt className="font-semibold text-[#203b40]">Pelnas</dt><dd className="text-right font-semibold text-[#2f7f7b]">{costsComplete ? formatCents(order.profitCents) : "Įveskite savikainą"}</dd>
                  </dl>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}