import { type FormEvent, useState } from "react";
import { Link } from "react-router";

export default function LoginRoute() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setIsPending(true);

    try {
      const response = await fetch("/api/admin-auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.statusMessage ?? "Neteisingas el. paštas arba slaptažodis.");
      }

      window.location.replace("/admin");
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Prisijungti nepavyko.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f8f6] px-4 py-12 text-[#203b40]">
      <div className="mx-auto max-w-md rounded-[28px] border border-[#203b40]/10 bg-white p-7 shadow-[0_20px_60px_rgba(32,59,64,0.12)]">
        <div className="mb-6 flex items-center gap-3">
          <span className="levitara-logo-mark" aria-hidden="true">M</span>
          <span className="text-[17px] font-semibold tracking-[-0.04em]">milishop</span>
        </div>

        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#398b86]">Admin prisijungimas</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.07em]">Prisijunkite</h1>
        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <label className="grid gap-1.5 text-sm font-medium text-[#203b40]/70">
            El. paštas
            <input
              className="rounded-xl border border-[#203b40]/15 bg-[#fbfcfb] px-3 py-2.5 text-sm text-[#203b40] outline-none transition focus:border-[#2f7f7b] focus:ring-2 focus:ring-[#2f7f7b]/15"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="El. paštas"
              autoComplete="email"
              required
            />
          </label>

          <label className="grid gap-1.5 text-sm font-medium text-[#203b40]/70">
            Slaptažodis
            <input
              className="rounded-xl border border-[#203b40]/15 bg-[#fbfcfb] px-3 py-2.5 text-sm text-[#203b40] outline-none transition focus:border-[#2f7f7b] focus:ring-2 focus:ring-[#2f7f7b]/15"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
            />
          </label>

          {error ? (
            <div className="rounded-xl border border-[#d97d71]/30 bg-[#fbe9e7] px-3 py-2 text-sm text-[#8d3b3a]">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-full bg-[#2f7f7b] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(47,127,123,0.18)] transition hover:bg-[#256d69]"
          >
            {isPending ? "Jungiama…" : "Prisijungti"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-[#203b40]/55">
          Atgal į <Link to="/" className="font-semibold text-[#2f7f7b] hover:underline">parduotuvę</Link>
        </div>
      </div>
    </div>
  );
}
