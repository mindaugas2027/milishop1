import { actionErrorMessage, useActionMutation, useActionQuery } from "@agent-native/core/client/hooks";
import { uploadEditorImage } from "@agent-native/core/client/uploads";
import { useEffect, useState } from "react";

import { prepareImageUpload } from "@/lib/prepare-image-upload";
import { slugify, type StoreCategoryRecord } from "@/lib/store-products";

type CategoryDraft = {
  id?: string;
  slug: string;
  name: string;
  caption: string;
  image: string;
  enabled: boolean;
  sortOrder: number;
};

const emptyDraft: CategoryDraft = {
  slug: "",
  name: "",
  caption: "",
  image: "",
  enabled: true,
  sortOrder: 10,
};

export default function CategoryManager() {
  const { data: categoryData, isPending, isError } = useActionQuery("list-admin-store-categories", {});
  const categories = (categoryData ?? []) as StoreCategoryRecord[];
  const { mutate: saveCategory, isPending: isSaving, error: saveError } = useActionMutation("update-store-category");
  const { mutate: deleteCategory, isPending: isDeleting, error: deleteError } = useActionMutation("delete-store-category");
  const [draft, setDraft] = useState<CategoryDraft>(emptyDraft);
  const [isUploading, setIsUploading] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (!draft.id && categories?.length && !draft.name) {
      setDraft({ ...emptyDraft, sortOrder: (categories.length + 1) * 10 });
    }
  }, [categories, draft.id, draft.name]);

  const editCategory = (category: NonNullable<typeof categories>[number]) => {
    setFormError("");
    setDraft({
      id: category.id,
      slug: category.slug,
      name: category.name,
      caption: category.caption,
      image: category.image,
      enabled: category.enabled === "true",
      sortOrder: Number(category.sortOrder) || 0,
    });
  };

  const update = <K extends keyof CategoryDraft>(key: K, value: CategoryDraft[K]) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const save = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");
    const slug = draft.slug.trim() || slugify(draft.name);
    if (!slug || !draft.name.trim()) {
      setFormError("Įveskite kategorijos pavadinimą.");
      return;
    }
    saveCategory({ ...draft, slug, name: draft.name.trim(), caption: draft.caption.trim(), sortOrder: Number(draft.sortOrder) || 0 });
  };

  const uploadImage = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    setIsUploading(true);
    setFormError("");
    try {
      if (!file.type.startsWith("image/")) throw new Error("Pasirinkite nuotraukos failą.");
      if (file.size > 10 * 1024 * 1024) throw new Error("Nuotrauka turi būti mažesnė nei 10 MB.");
      const uploaded = await uploadEditorImage(await prepareImageUpload(file));
      update("image", uploaded.src);
    } catch (error) {
      setFormError(actionErrorMessage(error) ?? "Nuotraukos įkelti nepavyko. Patikrinkite Supabase Storage serverio nustatymus ir bandykite dar kartą.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <section className="mx-auto mt-6 grid w-full max-w-[1280px] items-start gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(360px,400px)]">
      <div className="admin-panel min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="admin-panel-title">Kategorijos</h2>
            <p className="mt-1 text-sm text-[#203b40]/55">Valdykite kategorijų matomumą, tvarką ir nuotraukas.</p>
          </div>
          <button type="button" className="admin-primary-action" onClick={() => { setFormError(""); setDraft({ ...emptyDraft, sortOrder: ((categories?.length ?? 0) + 1) * 10 }); }}>+ Nauja kategorija</button>
        </div>
        {isPending && <p role="status" className="mt-5 text-sm text-[#203b40]/55">Įkeliamos kategorijos…</p>}
        {isError && <p role="alert" className="mt-5 text-sm text-[#bd6659]">Kategorijų nepavyko įkelti.</p>}
        <div className="mt-5 grid gap-3">
          {categories?.map((category) => (
            <article key={category.id} className={`flex flex-wrap items-center gap-4 border-b border-[#203b40]/8 py-3 ${category.enabled !== "true" ? "opacity-55" : ""}`}>
              <div className="size-16 shrink-0 overflow-hidden rounded-lg bg-[#e4f1ed]">
                {category.image ? <img src={category.image} alt="" className="size-full object-cover" /> : <div className="flex size-full items-center justify-center text-xs text-[#2f7f7b]">Nėra foto</div>}
              </div>
              <div className="min-w-[180px] flex-1">
                <p className="font-semibold text-[#203b40]">{category.name}</p>
                <p className="mt-0.5 text-xs text-[#203b40]/45">/{category.slug} · {category.enabled === "true" ? "Aktyvi" : "Išjungta"}</p>
                {category.caption && <p className="mt-1 text-sm text-[#203b40]/60">{category.caption}</p>}
              </div>
              <div className="flex gap-2">
                <button type="button" className="admin-row-action" onClick={() => editCategory(category)}>Redaguoti</button>
                <button type="button" className="admin-row-action text-[#bd6659]" disabled={isDeleting} onClick={() => { if (window.confirm(`Ištrinti kategoriją „${category.name}“?`)) deleteCategory({ id: category.id }); }}>Ištrinti</button>
              </div>
            </article>
          ))}
          {!isPending && categories?.length === 0 && <p className="py-8 text-center text-sm text-[#203b40]/45">Kategorijų nėra.</p>}
        </div>
        {deleteError && <p role="alert" className="mt-4 text-sm text-[#bd6659]">Kategorijos ištrinti nepavyko. Pirmiausia perkelkite arba paslėpkite jai priskirtus produktus.</p>}
      </div>

      <form className="admin-panel grid h-fit w-full min-w-0 gap-4" onSubmit={save}>
        <div className="flex items-center justify-between gap-3">
          <h2 className="admin-panel-title">{draft.id ? "Redaguoti kategoriją" : "Nauja kategorija"}</h2>
          {draft.id && <button type="button" className="text-xs font-semibold text-[#2f7f7b]" onClick={() => setDraft({ ...emptyDraft, sortOrder: ((categories?.length ?? 0) + 1) * 10 })}>Atšaukti</button>}
        </div>
        <label className="grid min-w-0 gap-1.5 text-xs font-medium text-[#203b40]/70">Pavadinimas<input className="w-full min-w-0 rounded-lg border border-[#203b40]/15 bg-white px-3 py-2.5 text-sm" value={draft.name} onChange={(event) => update("name", event.target.value)} required /></label>
        <label className="grid min-w-0 gap-1.5 text-xs font-medium text-[#203b40]/70">Slug<input className="w-full min-w-0 rounded-lg border border-[#203b40]/15 bg-white px-3 py-2.5 text-sm" value={draft.slug} onChange={(event) => update("slug", event.target.value)} placeholder="pvz. dovanos" required /></label>
        <label className="grid min-w-0 gap-1.5 text-xs font-medium text-[#203b40]/70">Trumpas aprašymas<textarea className="w-full min-w-0 rounded-lg border border-[#203b40]/15 bg-white px-3 py-2.5 text-sm" rows={3} value={draft.caption} onChange={(event) => update("caption", event.target.value)} /></label>
        <label className="grid min-w-0 gap-1.5 text-xs font-medium text-[#203b40]/70">Nuotraukos URL<input className="w-full min-w-0 rounded-lg border border-[#203b40]/15 bg-white px-3 py-2.5 text-sm" type="url" value={draft.image} onChange={(event) => update("image", event.target.value)} placeholder="https://..." /></label>
        <label className="grid min-w-0 gap-1.5 text-xs font-medium text-[#203b40]/70">Arba įkelkite nuotrauką<input type="file" accept="image/*" disabled={isUploading} onChange={(event) => { void uploadImage(event.currentTarget.files); event.currentTarget.value = ""; }} className="w-full min-w-0 rounded-lg border border-[#203b40]/15 bg-white px-3 py-2.5 text-sm" /></label>
        {draft.image && <img src={draft.image} alt="Kategorijos peržiūra" className="aspect-[1.7] w-full rounded-lg object-cover" />}
        <div className="grid gap-3">
          <label className="grid min-w-0 gap-1.5 text-xs font-medium text-[#203b40]/70">Tvarka<input className="w-full min-w-0 rounded-lg border border-[#203b40]/15 bg-white px-3 py-2.5 text-sm" type="number" min="0" value={draft.sortOrder} onChange={(event) => update("sortOrder", Number(event.target.value))} /></label>
          <label className="flex min-h-11 w-full min-w-0 items-center gap-3 rounded-lg border border-[#203b40]/15 bg-white px-3 py-2.5 text-sm leading-5 text-[#203b40]/70"><input className="size-4 shrink-0 accent-[#2f7f7b]" type="checkbox" checked={draft.enabled} onChange={(event) => update("enabled", event.target.checked)} /><span className="min-w-0">Rodyti parduotuvėje</span></label>
        </div>
        {(formError || saveError) && <p role="alert" className="text-sm text-[#bd6659]">{formError || "Kategorijos išsaugoti nepavyko."}</p>}
        <button type="submit" className="admin-primary-action w-full disabled:opacity-60" disabled={isSaving || isUploading}>{isSaving ? "Saugoma…" : isUploading ? "Įkeliama…" : "Išsaugoti kategoriją"}</button>
      </form>
    </section>
  );
}
