import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  api,
  getAdminToken,
  setAdminToken,
  clearAdminToken,
  type ProgressUpdate,
  type SiteMedia,
  type Project,
  type ProjectStatus,
  type PricingPlan,
  type BlogPost,
  type MarketingPost,
  type TeamMember,
  type SisterCompany,
} from "@/lib/apiClient";
import { VideoEmbed, isVideoUrl } from "@/components/VideoEmbed";

const SITE_URL = import.meta.env.VITE_SITE_URL ?? "https://hillbottomproperties.com";

const sections = [
  { id: "dashboard", label: "Dashboard" },
  { id: "projects", label: "Projects" },
  { id: "progress", label: "Progress Updates" },
  { id: "pricing", label: "Pricing & Plans" },
  { id: "team", label: "Team" },
  { id: "blog", label: "Blog" },
  { id: "marketing", label: "Marketing Feed" },
  { id: "sister-companies", label: "Sister Companies" },
  { id: "media", label: "Site Media & Promo" },
  { id: "leads", label: "Leads" },
  { id: "publish", label: "Publish" },
] as const;

type SectionId = (typeof sections)[number]["id"];

function useAuthedQuery<T>(
  key: (string | number | null)[],
  fn: () => Promise<T>,
  enabled = true,
) {
  return useQuery({ queryKey: key, queryFn: fn, enabled, retry: false });
}

function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const login = useMutation({
    mutationFn: () => api.login(email, password),
    onSuccess: (data) => {
      setAdminToken(data.token);
      setError("");
      onSuccess();
    },
    onError: () => setError("Incorrect email or password."),
  });

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#07111f] px-6 text-white">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          login.mutate();
        }}
        className="w-full max-w-md border border-white/10 bg-[#0d1b2d] p-8"
      >
        <p className="text-xs uppercase tracking-[0.3em] text-[#c09a60]">Hill Bottom</p>
        <h1 className="mt-3 text-3xl font-semibold">Admin sign in</h1>
        <p className="mt-2 text-sm text-white/45">
          Manage projects, construction updates, media, promo, and leads.
        </p>
        <div className="mt-7 space-y-4">
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="admin-input"
            autoComplete="username"
          />
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="admin-input"
            autoComplete="current-password"
          />
          <button
            disabled={login.isPending}
            className="w-full bg-[#c09a60] px-4 py-3 text-sm font-semibold text-[#07111f] hover:bg-[#d2b277] disabled:opacity-60"
          >
            {login.isPending ? "Signing in..." : "Sign in"}
          </button>
          {error && <p className="text-sm text-red-300">{error}</p>}
        </div>
        <a href={SITE_URL} className="mt-6 block text-center text-sm text-white/45 hover:text-white">
          Back to website
        </a>
      </form>
    </main>
  );
}

function DashboardSection() {
  const projects = useAuthedQuery(["admin-projects"], () => api.listProjects());
  const leads = useAuthedQuery(["admin-leads"], api.listLeads);
  const team = useAuthedQuery(["admin-team"], api.listTeam);
  const sisterCompanies = useAuthedQuery(["admin-sister-companies"], api.listSisterCompanies);

  const stats = [
    { label: "Projects", value: projects.data?.length ?? "—" },
    { label: "Leads captured", value: leads.data?.length ?? "—" },
    { label: "Team members", value: team.data?.length ?? "—" },
    { label: "Sister companies", value: sisterCompanies.data?.length ?? "—" },
  ];

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {stats.map((stat) => (
        <div key={stat.label} className="border border-white/10 bg-[#0d1b2d] p-6">
          <p className="text-xs uppercase tracking-[0.25em] text-white/40">{stat.label}</p>
          <p className="mt-3 text-4xl font-semibold text-[#c09a60]">{stat.value}</p>
        </div>
      ))}
    </div>
  );
}

const emptyDraft = {
  type: "actual" as "dream" | "actual",
  mediaUrl: "",
  caption: "",
  milestoneLabel: "",
  completionPercent: 0,
};

function ProgressSection() {
  const queryClient = useQueryClient();
  const projects = useAuthedQuery(["admin-projects"], () => api.listProjects());
  const [projectId, setProjectId] = useState<number | null>(null);
  const activeProjectId = projectId ?? projects.data?.[0]?.id ?? null;

  const updates = useAuthedQuery(
    ["admin-progress", activeProjectId],
    () => api.listProgress(activeProjectId!),
    activeProjectId != null,
  );

  const [draft, setDraft] = useState(emptyDraft);
  const [saved, setSaved] = useState(false);

  const createUpdate = useMutation({
    mutationFn: (input: Omit<ProgressUpdate, "id" | "postedAt">) => api.createProgress(input),
    onSuccess: () => {
      setDraft(emptyDraft);
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2500);
      queryClient.invalidateQueries({ queryKey: ["admin-progress", activeProjectId] });
      queryClient.invalidateQueries({ queryKey: ["progress", activeProjectId] });
    },
  });

  const deleteUpdate = useMutation({
    mutationFn: (id: number) => api.deleteProgress(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-progress", activeProjectId] });
      queryClient.invalidateQueries({ queryKey: ["progress", activeProjectId] });
    },
  });

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!activeProjectId || !draft.mediaUrl.trim()) return;
    createUpdate.mutate({ ...draft, projectId: activeProjectId });
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
      <section>
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-white/40">
              Construction status
            </p>
            <h2 className="mt-2 text-3xl font-semibold">Published updates</h2>
          </div>
          <select
            value={activeProjectId ?? ""}
            onChange={(e) => setProjectId(Number(e.target.value))}
            className="admin-input w-auto"
          >
            {projects.data?.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-3">
          {updates.data?.length === 0 && (
            <div className="border border-white/10 bg-[#0d1b2d] p-8 text-white/45">
              No updates yet for this project.
            </div>
          )}
          {updates.data?.map((update) => (
            <article key={update.id} className="border border-white/10 bg-[#0d1b2d] p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs uppercase tracking-wider text-[#c09a60]">
                  {update.type === "dream" ? "Dream" : "Actual"}
                  {update.milestoneLabel ? ` · ${update.milestoneLabel}` : ""}
                </p>
                {update.completionPercent != null && (
                  <span className="text-2xl font-semibold text-[#c09a60]">
                    {update.completionPercent}%
                  </span>
                )}
              </div>
              {update.caption && (
                <p className="mt-3 text-sm leading-relaxed text-white/55">{update.caption}</p>
              )}
              <div className="mt-4 max-w-sm">
                {isVideoUrl(update.mediaUrl) ? (
                  <VideoEmbed url={update.mediaUrl} title="Update media" />
                ) : (
                  <img src={update.mediaUrl} alt="" className="w-full h-auto" />
                )}
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-white/35">
                <span>{new Date(update.postedAt).toLocaleDateString()}</span>
                <button
                  onClick={() => deleteUpdate.mutate(update.id)}
                  className="text-red-300/70 hover:text-red-300"
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <aside>
        <form onSubmit={submit} className="border border-white/10 bg-[#0d1b2d] p-6">
          <p className="text-xs uppercase tracking-[0.25em] text-[#c09a60]">New milestone</p>
          <h2 className="mt-2 text-xl font-semibold">Publish status update</h2>
          <div className="mt-5 space-y-4">
            <select
              value={draft.type}
              onChange={(e) =>
                setDraft((d) => ({ ...d, type: e.target.value as "dream" | "actual" }))
              }
              className="admin-input"
            >
              <option value="dream">Dream (original render/visual)</option>
              <option value="actual">Actual (live site photo/video)</option>
            </select>
            <input
              required
              value={draft.mediaUrl}
              onChange={(e) => setDraft((d) => ({ ...d, mediaUrl: e.target.value }))}
              placeholder="Image or video URL (YouTube, Vimeo, or direct file)"
              className="admin-input"
            />
            {draft.mediaUrl && isVideoUrl(draft.mediaUrl) && (
              <div className="border border-white/10 p-1">
                <VideoEmbed url={draft.mediaUrl} title="Preview" />
              </div>
            )}
            <input
              value={draft.milestoneLabel}
              onChange={(e) => setDraft((d) => ({ ...d, milestoneLabel: e.target.value }))}
              placeholder="Milestone label (e.g. Foundation)"
              className="admin-input"
            />
            <textarea
              value={draft.caption}
              onChange={(e) => setDraft((d) => ({ ...d, caption: e.target.value }))}
              placeholder="Caption / description"
              rows={3}
              className="admin-input resize-none"
            />
            <input
              type="number"
              min={0}
              max={100}
              value={draft.completionPercent}
              onChange={(e) =>
                setDraft((d) => ({ ...d, completionPercent: Number(e.target.value) }))
              }
              placeholder="Overall completion %"
              className="admin-input"
            />
            <button
              type="submit"
              disabled={createUpdate.isPending}
              className="w-full bg-[#c09a60] px-4 py-3 text-sm font-semibold text-[#07111f] hover:bg-[#d2b277] disabled:opacity-60"
            >
              {createUpdate.isPending ? "Publishing..." : "Publish update"}
            </button>
            {saved && (
              <p className="text-center text-xs text-emerald-300">
                Saved. Run Publish to push it live.
              </p>
            )}
          </div>
        </form>
      </aside>
    </div>
  );
}

function MediaSection() {
  const siteMedia = useAuthedQuery(["admin-site-media"], api.getSiteMedia);
  const queryClient = useQueryClient();
  const [form, setForm] = useState<SiteMedia | null>(null);
  const [saved, setSaved] = useState(false);

  const current = form ?? siteMedia.data;

  const save = useMutation({
    mutationFn: (input: Partial<SiteMedia>) => api.updateSiteMedia(input),
    onSuccess: (data) => {
      setForm(data);
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2500);
      queryClient.invalidateQueries({ queryKey: ["site-media"] });
      queryClient.invalidateQueries({ queryKey: ["admin-site-media"] });
    },
  });

  if (!current) {
    return <p className="text-white/45">Loading media settings...</p>;
  }

  function field<K extends keyof SiteMedia>(key: K, value: SiteMedia[K]) {
    setForm({ ...current, [key]: value } as SiteMedia);
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        save.mutate(current);
      }}
      className="max-w-xl space-y-8"
    >
      <div className="border border-white/10 bg-[#0d1b2d] p-6">
        <p className="text-xs uppercase tracking-[0.25em] text-[#c09a60]">Public media</p>
        <h2 className="mt-2 text-xl font-semibold">Manage video areas</h2>
        <p className="mt-2 text-xs leading-relaxed text-white/40">
          Paste a YouTube, Vimeo, or direct video URL — it renders as an embedded
          player on the site, not a link.
        </p>
        <div className="mt-5 space-y-4">
          <input
            value={current.heroVideoUrl}
            onChange={(e) => field("heroVideoUrl", e.target.value)}
            placeholder="Home hero video URL"
            className="admin-input"
          />
          {current.heroVideoUrl && (
            <div className="border border-white/10 p-1 max-w-xs">
              <VideoEmbed url={current.heroVideoUrl} title="Hero video preview" />
            </div>
          )}
          <input
            value={current.featuredProjectVideoUrl}
            onChange={(e) => field("featuredProjectVideoUrl", e.target.value)}
            placeholder="Featured project video URL"
            className="admin-input"
          />
          {current.featuredProjectVideoUrl && (
            <div className="border border-white/10 p-1 max-w-xs">
              <VideoEmbed url={current.featuredProjectVideoUrl} title="Featured video preview" />
            </div>
          )}
          <select
            value={current.virtualTourProvider}
            onChange={(e) => field("virtualTourProvider", e.target.value as SiteMedia["virtualTourProvider"])}
            className="admin-input"
          >
            <option value="iframe">Embedded page</option>
            <option value="youtube">YouTube</option>
            <option value="vimeo">Vimeo</option>
            <option value="external">External tour</option>
          </select>
          <input
            value={current.virtualTourUrl}
            onChange={(e) => field("virtualTourUrl", e.target.value)}
            placeholder="Virtual tour URL"
            className="admin-input"
          />
          <input
            value={current.virtualTourTitle}
            onChange={(e) => field("virtualTourTitle", e.target.value)}
            placeholder="Virtual tour title"
            className="admin-input"
          />
        </div>
      </div>

      <div className="border border-white/10 bg-[#0d1b2d] p-6">
        <p className="text-xs uppercase tracking-[0.25em] text-[#c09a60]">Billboard QR landing page</p>
        <h2 className="mt-2 text-xl font-semibold">Promo page video &amp; giveaway</h2>
        <p className="mt-2 text-xs leading-relaxed text-white/40">
          Controls the video and Seychelles giveaway card on promo.html —
          the standalone page the billboard QR code points to.
        </p>
        <div className="mt-5 space-y-4">
          <input
            value={current.promoVideoUrl}
            onChange={(e) => field("promoVideoUrl", e.target.value)}
            placeholder="Promo video URL (YouTube link)"
            className="admin-input"
          />
          {current.promoVideoUrl && (
            <div className="border border-white/10 p-1 max-w-xs">
              <VideoEmbed url={current.promoVideoUrl} title="Promo video preview" />
            </div>
          )}
          <input
            value={current.promoGiftTitle}
            onChange={(e) => field("promoGiftTitle", e.target.value)}
            placeholder="Giveaway badge text (e.g. Free Flight)"
            className="admin-input"
          />
          <textarea
            value={current.promoGiftBody}
            onChange={(e) => field("promoGiftBody", e.target.value)}
            placeholder="Giveaway description"
            rows={3}
            className="admin-input resize-none"
          />
          <input
            value={current.promoPartnerUrl}
            onChange={(e) => field("promoPartnerUrl", e.target.value)}
            placeholder="Partner link (e.g. Travel Sultan Instagram)"
            className="admin-input"
          />
        </div>
      </div>

      <div>
        <button
          disabled={save.isPending}
          className="w-full border border-[#c09a60]/50 px-4 py-3 text-sm font-semibold text-[#c09a60] hover:bg-[#c09a60]/10 disabled:opacity-60"
        >
          {save.isPending ? "Saving..." : "Save media & promo settings"}
        </button>
        {saved && (
          <p className="mt-2 text-center text-xs text-emerald-300">
            Saved. Run Publish to push it live.
          </p>
        )}
      </div>
    </form>
  );
}

const projectStatuses: ProjectStatus[] = [
  "upcoming",
  "under_construction",
  "ongoing",
  "completed",
];

const emptyProjectDraft = {
  slug: "",
  name: "",
  status: "upcoming" as ProjectStatus,
  location: "",
  summary: "",
  heroImageUrl: "",
  completionPercent: 0,
  currentStage: "",
  nextMilestone: "",
  unitTypes: [] as Record<string, unknown>[],
  floorPlans: [] as Record<string, unknown>[],
};

function ProjectsSection() {
  const queryClient = useQueryClient();
  const projects = useAuthedQuery(["admin-projects"], () => api.listProjects());
  const [draft, setDraft] = useState(emptyProjectDraft);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
    queryClient.invalidateQueries({ queryKey: ["projects"] });
  }

  const createProject = useMutation({
    mutationFn: () => api.createProject(draft),
    onSuccess: () => {
      setDraft(emptyProjectDraft);
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2500);
      invalidate();
    },
  });

  const updateProject = useMutation({
    mutationFn: (id: number) => api.updateProject(id, draft),
    onSuccess: () => {
      setDraft(emptyProjectDraft);
      setEditingId(null);
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2500);
      invalidate();
    },
  });

  const deleteProject = useMutation({
    mutationFn: (id: number) => api.deleteProject(id),
    onSuccess: invalidate,
  });

  function startEdit(project: Project) {
    setEditingId(project.id);
    setDraft({
      slug: project.slug,
      name: project.name,
      status: project.status,
      location: project.location ?? "",
      summary: project.summary ?? "",
      heroImageUrl: project.heroImageUrl ?? "",
      completionPercent: project.completionPercent ?? 0,
      currentStage: project.currentStage ?? "",
      nextMilestone: project.nextMilestone ?? "",
      unitTypes: project.unitTypes,
      floorPlans: project.floorPlans,
    });
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!draft.slug.trim() || !draft.name.trim()) return;
    if (editingId) updateProject.mutate(editingId);
    else createProject.mutate();
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
      <section>
        <div className="mb-5">
          <p className="text-xs uppercase tracking-[0.25em] text-white/40">Portfolio</p>
          <h2 className="mt-2 text-3xl font-semibold">Projects</h2>
        </div>
        <div className="space-y-3">
          {projects.data?.length === 0 && (
            <div className="border border-white/10 bg-[#0d1b2d] p-8 text-white/45">
              No projects yet.
            </div>
          )}
          {projects.data?.map((project) => (
            <article key={project.id} className="border border-white/10 bg-[#0d1b2d] p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-wider text-[#c09a60]">
                    {project.status.replace(/_/g, " ")}
                  </p>
                  <h3 className="mt-1 text-lg font-semibold">{project.name}</h3>
                  <p className="text-xs text-white/35 mt-1">/{project.slug}</p>
                  {(project.currentStage || project.nextMilestone) && (
                    <p className="text-xs text-white/45 mt-2">
                      {project.currentStage || "—"} → {project.nextMilestone || "—"}
                    </p>
                  )}
                </div>
                <span className="text-xl font-semibold text-[#c09a60]">
                  {project.completionPercent != null ? `${project.completionPercent}%` : "Not set"}
                </span>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-white/35">
                <button onClick={() => startEdit(project)} className="text-white/60 hover:text-white">
                  Edit
                </button>
                <button
                  onClick={() => deleteProject.mutate(project.id)}
                  className="text-red-300/70 hover:text-red-300"
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <aside>
        <form onSubmit={submit} className="border border-white/10 bg-[#0d1b2d] p-6">
          <p className="text-xs uppercase tracking-[0.25em] text-[#c09a60]">
            {editingId ? "Edit project" : "New project"}
          </p>
          <h2 className="mt-2 text-xl font-semibold">
            {editingId ? "Update project" : "Add project"}
          </h2>
          <div className="mt-5 space-y-4">
            <input
              required
              value={draft.name}
              onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
              placeholder="Project name"
              className="admin-input"
            />
            <input
              required
              value={draft.slug}
              onChange={(e) => setDraft((d) => ({ ...d, slug: e.target.value }))}
              placeholder="URL slug (e.g. my-project)"
              className="admin-input"
            />
            <select
              value={draft.status}
              onChange={(e) => setDraft((d) => ({ ...d, status: e.target.value as ProjectStatus }))}
              className="admin-input"
            >
              {projectStatuses.map((status) => (
                <option key={status} value={status}>
                  {status.replace(/_/g, " ")}
                </option>
              ))}
            </select>
            <input
              value={draft.location}
              onChange={(e) => setDraft((d) => ({ ...d, location: e.target.value }))}
              placeholder="Location"
              className="admin-input"
            />
            <textarea
              value={draft.summary}
              onChange={(e) => setDraft((d) => ({ ...d, summary: e.target.value }))}
              placeholder="Summary"
              rows={3}
              className="admin-input resize-none"
            />
            <input
              value={draft.heroImageUrl}
              onChange={(e) => setDraft((d) => ({ ...d, heroImageUrl: e.target.value }))}
              placeholder="Hero image URL"
              className="admin-input"
            />
            <input
              type="number"
              min={0}
              max={100}
              value={draft.completionPercent}
              onChange={(e) =>
                setDraft((d) => ({ ...d, completionPercent: Number(e.target.value) }))
              }
              placeholder="Completion %"
              className="admin-input"
            />
            <div className="border-t border-white/10 pt-4">
              <p className="mb-3 text-xs uppercase tracking-[0.2em] text-white/35">
                Construction page status card
              </p>
              <input
                value={draft.currentStage}
                onChange={(e) => setDraft((d) => ({ ...d, currentStage: e.target.value }))}
                placeholder="Current stage (e.g. Foundation Complete)"
                className="admin-input"
              />
              <input
                value={draft.nextMilestone}
                onChange={(e) => setDraft((d) => ({ ...d, nextMilestone: e.target.value }))}
                placeholder="Next milestone (e.g. Block B — Oct 2026)"
                className="admin-input mt-4"
              />
            </div>
            <button
              type="submit"
              disabled={createProject.isPending || updateProject.isPending}
              className="w-full bg-[#c09a60] px-4 py-3 text-sm font-semibold text-[#07111f] hover:bg-[#d2b277] disabled:opacity-60"
            >
              {editingId ? "Save changes" : "Add project"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setDraft(emptyProjectDraft);
                }}
                className="w-full border border-white/15 px-4 py-2 text-xs uppercase tracking-widest text-white/50 hover:text-white"
              >
                Cancel edit
              </button>
            )}
            {saved && <p className="text-center text-xs text-emerald-300">Saved.</p>}
          </div>
        </form>
      </aside>
    </div>
  );
}

const emptyPricingDraft = {
  unitType: "",
  price: "",
  currency: "ETB",
  installmentPlan: [] as Record<string, unknown>[],
  discountRules: [] as Record<string, unknown>[],
};

function PricingSection() {
  const queryClient = useQueryClient();
  const projects = useAuthedQuery(["admin-projects"], () => api.listProjects());
  const [projectId, setProjectId] = useState<number | null>(null);
  const activeProjectId = projectId ?? projects.data?.[0]?.id ?? null;

  const plans = useAuthedQuery(
    ["admin-pricing", activeProjectId],
    () => api.listPricing(activeProjectId!),
    activeProjectId != null,
  );

  const [draft, setDraft] = useState(emptyPricingDraft);

  const createPlan = useMutation({
    mutationFn: (input: Omit<PricingPlan, "id" | "createdAt" | "updatedAt">) =>
      api.createPricing(input),
    onSuccess: () => {
      setDraft(emptyPricingDraft);
      queryClient.invalidateQueries({ queryKey: ["admin-pricing", activeProjectId] });
      queryClient.invalidateQueries({ queryKey: ["pricing", activeProjectId] });
    },
  });

  const deletePlan = useMutation({
    mutationFn: (id: number) => api.deletePricing(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-pricing", activeProjectId] });
      queryClient.invalidateQueries({ queryKey: ["pricing", activeProjectId] });
    },
  });

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!activeProjectId || !draft.unitType.trim() || !draft.price.trim()) return;
    createPlan.mutate({ ...draft, projectId: activeProjectId });
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
      <section>
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-white/40">Payment plans</p>
            <h2 className="mt-2 text-3xl font-semibold">Pricing</h2>
          </div>
          <select
            value={activeProjectId ?? ""}
            onChange={(e) => setProjectId(Number(e.target.value))}
            className="admin-input w-auto"
          >
            {projects.data?.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-3">
          {plans.data?.length === 0 && (
            <div className="border border-white/10 bg-[#0d1b2d] p-8 text-white/45">
              No pricing plans yet for this project.
            </div>
          )}
          {plans.data?.map((plan) => (
            <article key={plan.id} className="border border-white/10 bg-[#0d1b2d] p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-lg font-semibold">{plan.unitType}</h3>
                <span className="text-xl font-semibold text-[#c09a60]">
                  {plan.currency} {plan.price}
                </span>
              </div>
              <button
                onClick={() => deletePlan.mutate(plan.id)}
                className="mt-4 text-xs text-red-300/70 hover:text-red-300"
              >
                Delete
              </button>
            </article>
          ))}
        </div>
      </section>

      <aside>
        <form onSubmit={submit} className="border border-white/10 bg-[#0d1b2d] p-6">
          <p className="text-xs uppercase tracking-[0.25em] text-[#c09a60]">New plan</p>
          <h2 className="mt-2 text-xl font-semibold">Add pricing</h2>
          <div className="mt-5 space-y-4">
            <input
              required
              value={draft.unitType}
              onChange={(e) => setDraft((d) => ({ ...d, unitType: e.target.value }))}
              placeholder="Unit type (e.g. 2BR Apartment)"
              className="admin-input"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                required
                value={draft.price}
                onChange={(e) => setDraft((d) => ({ ...d, price: e.target.value }))}
                placeholder="Price"
                className="admin-input"
              />
              <input
                value={draft.currency}
                onChange={(e) => setDraft((d) => ({ ...d, currency: e.target.value }))}
                placeholder="Currency"
                className="admin-input"
              />
            </div>
            <button
              type="submit"
              disabled={createPlan.isPending}
              className="w-full bg-[#c09a60] px-4 py-3 text-sm font-semibold text-[#07111f] hover:bg-[#d2b277] disabled:opacity-60"
            >
              Add pricing plan
            </button>
          </div>
        </form>
      </aside>
    </div>
  );
}

const emptyTeamDraft = {
  name: "",
  role: "",
  department: "",
  bio: "",
  photoUrl: "",
  sortOrder: 0,
};

function TeamSection() {
  const queryClient = useQueryClient();
  const team = useAuthedQuery(["admin-team"], api.listTeam);
  const [draft, setDraft] = useState(emptyTeamDraft);
  const [editingId, setEditingId] = useState<number | null>(null);

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ["admin-team"] });
    queryClient.invalidateQueries({ queryKey: ["team"] });
  }

  const createMember = useMutation({
    mutationFn: () => api.createTeamMember(draft),
    onSuccess: () => {
      setDraft(emptyTeamDraft);
      invalidate();
    },
  });

  const updateMember = useMutation({
    mutationFn: (id: number) => api.updateTeamMember(id, draft),
    onSuccess: () => {
      setDraft(emptyTeamDraft);
      setEditingId(null);
      invalidate();
    },
  });

  const deleteMember = useMutation({
    mutationFn: (id: number) => api.deleteTeamMember(id),
    onSuccess: invalidate,
  });

  function startEdit(member: TeamMember) {
    setEditingId(member.id);
    setDraft({
      name: member.name,
      role: member.role,
      department: member.department ?? "",
      bio: member.bio ?? "",
      photoUrl: member.photoUrl ?? "",
      sortOrder: member.sortOrder,
    });
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!draft.name.trim() || !draft.role.trim()) return;
    if (editingId) updateMember.mutate(editingId);
    else createMember.mutate();
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
      <section>
        <div className="mb-5">
          <p className="text-xs uppercase tracking-[0.25em] text-white/40">People</p>
          <h2 className="mt-2 text-3xl font-semibold">Team</h2>
        </div>
        <div className="space-y-3">
          {team.data?.length === 0 && (
            <div className="border border-white/10 bg-[#0d1b2d] p-8 text-white/45">
              No team members yet.
            </div>
          )}
          {team.data?.map((member) => (
            <article key={member.id} className="border border-white/10 bg-[#0d1b2d] p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold">{member.name}</h3>
                  <p className="text-xs text-white/45 mt-1">
                    {member.role}
                    {member.department ? ` · ${member.department}` : ""}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-white/35">
                <button onClick={() => startEdit(member)} className="text-white/60 hover:text-white">
                  Edit
                </button>
                <button
                  onClick={() => deleteMember.mutate(member.id)}
                  className="text-red-300/70 hover:text-red-300"
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <aside>
        <form onSubmit={submit} className="border border-white/10 bg-[#0d1b2d] p-6">
          <p className="text-xs uppercase tracking-[0.25em] text-[#c09a60]">
            {editingId ? "Edit member" : "New member"}
          </p>
          <div className="mt-5 space-y-4">
            <input
              required
              value={draft.name}
              onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
              placeholder="Full name"
              className="admin-input"
            />
            <input
              required
              value={draft.role}
              onChange={(e) => setDraft((d) => ({ ...d, role: e.target.value }))}
              placeholder="Role / title"
              className="admin-input"
            />
            <input
              value={draft.department}
              onChange={(e) => setDraft((d) => ({ ...d, department: e.target.value }))}
              placeholder="Department"
              className="admin-input"
            />
            <textarea
              value={draft.bio}
              onChange={(e) => setDraft((d) => ({ ...d, bio: e.target.value }))}
              placeholder="Short bio"
              rows={3}
              className="admin-input resize-none"
            />
            <input
              value={draft.photoUrl}
              onChange={(e) => setDraft((d) => ({ ...d, photoUrl: e.target.value }))}
              placeholder="Photo URL"
              className="admin-input"
            />
            <input
              type="number"
              value={draft.sortOrder}
              onChange={(e) => setDraft((d) => ({ ...d, sortOrder: Number(e.target.value) }))}
              placeholder="Sort order"
              className="admin-input"
            />
            <button
              type="submit"
              disabled={createMember.isPending || updateMember.isPending}
              className="w-full bg-[#c09a60] px-4 py-3 text-sm font-semibold text-[#07111f] hover:bg-[#d2b277] disabled:opacity-60"
            >
              {editingId ? "Save changes" : "Add member"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setDraft(emptyTeamDraft);
                }}
                className="w-full border border-white/15 px-4 py-2 text-xs uppercase tracking-widest text-white/50 hover:text-white"
              >
                Cancel edit
              </button>
            )}
          </div>
        </form>
      </aside>
    </div>
  );
}

const emptyBlogDraft = {
  slug: "",
  title: "",
  excerpt: "",
  content: "",
  coverImageUrl: "",
  author: "",
  published: false,
};

function BlogSection() {
  const queryClient = useQueryClient();
  const posts = useAuthedQuery(["admin-blog"], api.listBlogPostsAdmin);
  const [draft, setDraft] = useState(emptyBlogDraft);
  const [editingId, setEditingId] = useState<number | null>(null);

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ["admin-blog"] });
    queryClient.invalidateQueries({ queryKey: ["blog"] });
  }

  const createPost = useMutation({
    mutationFn: () => api.createBlogPost(draft),
    onSuccess: () => {
      setDraft(emptyBlogDraft);
      invalidate();
    },
  });

  const updatePost = useMutation({
    mutationFn: (id: number) => api.updateBlogPost(id, draft),
    onSuccess: () => {
      setDraft(emptyBlogDraft);
      setEditingId(null);
      invalidate();
    },
  });

  const deletePost = useMutation({
    mutationFn: (id: number) => api.deleteBlogPost(id),
    onSuccess: invalidate,
  });

  function startEdit(post: BlogPost) {
    setEditingId(post.id);
    setDraft({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt ?? "",
      content: post.content,
      coverImageUrl: post.coverImageUrl ?? "",
      author: post.author ?? "",
      published: post.published,
    });
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!draft.slug.trim() || !draft.title.trim() || !draft.content.trim()) return;
    if (editingId) updatePost.mutate(editingId);
    else createPost.mutate();
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
      <section>
        <div className="mb-5">
          <p className="text-xs uppercase tracking-[0.25em] text-white/40">Content</p>
          <h2 className="mt-2 text-3xl font-semibold">Blog posts</h2>
        </div>
        <div className="space-y-3">
          {posts.data?.length === 0 && (
            <div className="border border-white/10 bg-[#0d1b2d] p-8 text-white/45">
              No blog posts yet.
            </div>
          )}
          {posts.data?.map((post) => (
            <article key={post.id} className="border border-white/10 bg-[#0d1b2d] p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-lg font-semibold">{post.title}</h3>
                <span
                  className={`text-xs px-2.5 py-1 rounded-full border ${
                    post.published
                      ? "border-emerald-700/40 text-emerald-400"
                      : "border-white/15 text-white/40"
                  }`}
                >
                  {post.published ? "Published" : "Draft"}
                </span>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-white/35">
                <button onClick={() => startEdit(post)} className="text-white/60 hover:text-white">
                  Edit
                </button>
                <button
                  onClick={() => deletePost.mutate(post.id)}
                  className="text-red-300/70 hover:text-red-300"
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <aside>
        <form onSubmit={submit} className="border border-white/10 bg-[#0d1b2d] p-6">
          <p className="text-xs uppercase tracking-[0.25em] text-[#c09a60]">
            {editingId ? "Edit post" : "New post"}
          </p>
          <div className="mt-5 space-y-4">
            <input
              required
              value={draft.title}
              onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
              placeholder="Title"
              className="admin-input"
            />
            <input
              required
              value={draft.slug}
              onChange={(e) => setDraft((d) => ({ ...d, slug: e.target.value }))}
              placeholder="URL slug"
              className="admin-input"
            />
            <textarea
              value={draft.excerpt}
              onChange={(e) => setDraft((d) => ({ ...d, excerpt: e.target.value }))}
              placeholder="Excerpt"
              rows={2}
              className="admin-input resize-none"
            />
            <textarea
              required
              value={draft.content}
              onChange={(e) => setDraft((d) => ({ ...d, content: e.target.value }))}
              placeholder="Full content"
              rows={6}
              className="admin-input resize-none"
            />
            <input
              value={draft.coverImageUrl}
              onChange={(e) => setDraft((d) => ({ ...d, coverImageUrl: e.target.value }))}
              placeholder="Cover image URL"
              className="admin-input"
            />
            <input
              value={draft.author}
              onChange={(e) => setDraft((d) => ({ ...d, author: e.target.value }))}
              placeholder="Author"
              className="admin-input"
            />
            <label className="flex items-center gap-2 text-sm text-white/60">
              <input
                type="checkbox"
                checked={draft.published}
                onChange={(e) => setDraft((d) => ({ ...d, published: e.target.checked }))}
              />
              Published
            </label>
            <button
              type="submit"
              disabled={createPost.isPending || updatePost.isPending}
              className="w-full bg-[#c09a60] px-4 py-3 text-sm font-semibold text-[#07111f] hover:bg-[#d2b277] disabled:opacity-60"
            >
              {editingId ? "Save changes" : "Add post"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setDraft(emptyBlogDraft);
                }}
                className="w-full border border-white/15 px-4 py-2 text-xs uppercase tracking-widest text-white/50 hover:text-white"
              >
                Cancel edit
              </button>
            )}
          </div>
        </form>
      </aside>
    </div>
  );
}

const emptyMarketingDraft = { title: "", body: "", mediaUrl: "", campaignTag: "" };

function MarketingSection() {
  const queryClient = useQueryClient();
  const posts = useAuthedQuery(["admin-marketing"], api.listMarketing);
  const [draft, setDraft] = useState(emptyMarketingDraft);

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ["admin-marketing"] });
    queryClient.invalidateQueries({ queryKey: ["marketing"] });
  }

  const createPost = useMutation({
    mutationFn: (input: Omit<MarketingPost, "id" | "createdAt" | "publishedAt">) =>
      api.createMarketingPost(input),
    onSuccess: () => {
      setDraft(emptyMarketingDraft);
      invalidate();
    },
  });

  const deletePost = useMutation({
    mutationFn: (id: number) => api.deleteMarketingPost(id),
    onSuccess: invalidate,
  });

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!draft.title.trim()) return;
    createPost.mutate(draft);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
      <section>
        <div className="mb-5">
          <p className="text-xs uppercase tracking-[0.25em] text-white/40">Campaigns</p>
          <h2 className="mt-2 text-3xl font-semibold">Marketing feed</h2>
        </div>
        <div className="space-y-3">
          {posts.data?.length === 0 && (
            <div className="border border-white/10 bg-[#0d1b2d] p-8 text-white/45">
              No campaign posts yet.
            </div>
          )}
          {posts.data?.map((post) => (
            <article key={post.id} className="border border-white/10 bg-[#0d1b2d] p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-lg font-semibold">{post.title}</h3>
                {post.campaignTag && (
                  <span className="text-xs px-2.5 py-1 rounded-full border border-[#907B46]/40 text-[#907B46]">
                    {post.campaignTag}
                  </span>
                )}
              </div>
              {post.mediaUrl && isVideoUrl(post.mediaUrl) && (
                <div className="mt-4 max-w-sm">
                  <VideoEmbed url={post.mediaUrl} title={post.title} />
                </div>
              )}
              <button
                onClick={() => deletePost.mutate(post.id)}
                className="mt-4 text-xs text-red-300/70 hover:text-red-300"
              >
                Delete
              </button>
            </article>
          ))}
        </div>
      </section>

      <aside>
        <form onSubmit={submit} className="border border-white/10 bg-[#0d1b2d] p-6">
          <p className="text-xs uppercase tracking-[0.25em] text-[#c09a60]">New post</p>
          <div className="mt-5 space-y-4">
            <input
              required
              value={draft.title}
              onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
              placeholder="Title"
              className="admin-input"
            />
            <textarea
              value={draft.body}
              onChange={(e) => setDraft((d) => ({ ...d, body: e.target.value }))}
              placeholder="Body"
              rows={4}
              className="admin-input resize-none"
            />
            <input
              value={draft.mediaUrl}
              onChange={(e) => setDraft((d) => ({ ...d, mediaUrl: e.target.value }))}
              placeholder="Image or video URL"
              className="admin-input"
            />
            {draft.mediaUrl && isVideoUrl(draft.mediaUrl) && (
              <div className="border border-white/10 p-1">
                <VideoEmbed url={draft.mediaUrl} title="Preview" />
              </div>
            )}
            <input
              value={draft.campaignTag}
              onChange={(e) => setDraft((d) => ({ ...d, campaignTag: e.target.value }))}
              placeholder="Campaign tag"
              className="admin-input"
            />
            <button
              type="submit"
              disabled={createPost.isPending}
              className="w-full bg-[#c09a60] px-4 py-3 text-sm font-semibold text-[#07111f] hover:bg-[#d2b277] disabled:opacity-60"
            >
              Publish post
            </button>
          </div>
        </form>
      </aside>
    </div>
  );
}

const emptySisterDraft = { name: "", summary: "", logoUrl: "", websiteUrl: "", sortOrder: 0 };

function SisterCompaniesSection() {
  const queryClient = useQueryClient();
  const companies = useAuthedQuery(["admin-sister-companies"], api.listSisterCompanies);
  const [draft, setDraft] = useState(emptySisterDraft);
  const [editingId, setEditingId] = useState<number | null>(null);

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ["admin-sister-companies"] });
    queryClient.invalidateQueries({ queryKey: ["sister-companies"] });
  }

  const createCompany = useMutation({
    mutationFn: () => api.createSisterCompany(draft),
    onSuccess: () => {
      setDraft(emptySisterDraft);
      invalidate();
    },
  });

  const updateCompany = useMutation({
    mutationFn: (id: number) => api.updateSisterCompany(id, draft),
    onSuccess: () => {
      setDraft(emptySisterDraft);
      setEditingId(null);
      invalidate();
    },
  });

  const deleteCompany = useMutation({
    mutationFn: (id: number) => api.deleteSisterCompany(id),
    onSuccess: invalidate,
  });

  function startEdit(company: SisterCompany) {
    setEditingId(company.id);
    setDraft({
      name: company.name,
      summary: company.summary ?? "",
      logoUrl: company.logoUrl ?? "",
      websiteUrl: company.websiteUrl ?? "",
      sortOrder: company.sortOrder,
    });
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!draft.name.trim()) return;
    if (editingId) updateCompany.mutate(editingId);
    else createCompany.mutate();
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
      <section>
        <div className="mb-5">
          <p className="text-xs uppercase tracking-[0.25em] text-white/40">Partners</p>
          <h2 className="mt-2 text-3xl font-semibold">Sister Companies</h2>
        </div>
        <div className="space-y-3">
          {companies.data?.length === 0 && (
            <div className="border border-white/10 bg-[#0d1b2d] p-8 text-white/45">
              No sister companies yet.
            </div>
          )}
          {companies.data?.map((company) => (
            <article key={company.id} className="border border-white/10 bg-[#0d1b2d] p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-lg font-semibold">{company.name}</h3>
                {company.websiteUrl && (
                  <a
                    href={company.websiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-[#c09a60] hover:text-[#d2b277]"
                  >
                    Visit site ↗
                  </a>
                )}
              </div>
              {company.summary && (
                <p className="mt-2 text-sm text-white/55">{company.summary}</p>
              )}
              <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-white/35">
                <button onClick={() => startEdit(company)} className="text-white/60 hover:text-white">
                  Edit
                </button>
                <button
                  onClick={() => deleteCompany.mutate(company.id)}
                  className="text-red-300/70 hover:text-red-300"
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <aside>
        <form onSubmit={submit} className="border border-white/10 bg-[#0d1b2d] p-6">
          <p className="text-xs uppercase tracking-[0.25em] text-[#c09a60]">
            {editingId ? "Edit company" : "New company"}
          </p>
          <div className="mt-5 space-y-4">
            <input
              required
              value={draft.name}
              onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
              placeholder="Company name"
              className="admin-input"
            />
            <textarea
              value={draft.summary}
              onChange={(e) => setDraft((d) => ({ ...d, summary: e.target.value }))}
              placeholder="Short description"
              rows={3}
              className="admin-input resize-none"
            />
            <input
              value={draft.logoUrl}
              onChange={(e) => setDraft((d) => ({ ...d, logoUrl: e.target.value }))}
              placeholder="Logo URL"
              className="admin-input"
            />
            <input
              value={draft.websiteUrl}
              onChange={(e) => setDraft((d) => ({ ...d, websiteUrl: e.target.value }))}
              placeholder="Website URL"
              className="admin-input"
            />
            <input
              type="number"
              value={draft.sortOrder}
              onChange={(e) => setDraft((d) => ({ ...d, sortOrder: Number(e.target.value) }))}
              placeholder="Sort order"
              className="admin-input"
            />
            <button
              type="submit"
              disabled={createCompany.isPending || updateCompany.isPending}
              className="w-full bg-[#c09a60] px-4 py-3 text-sm font-semibold text-[#07111f] hover:bg-[#d2b277] disabled:opacity-60"
            >
              {editingId ? "Save changes" : "Add company"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setDraft(emptySisterDraft);
                }}
                className="w-full border border-white/15 px-4 py-2 text-xs uppercase tracking-widest text-white/50 hover:text-white"
              >
                Cancel edit
              </button>
            )}
          </div>
        </form>
      </aside>
    </div>
  );
}

function LeadsSection() {
  const leads = useAuthedQuery(["admin-leads"], api.listLeads);

  function exportCsv() {
    if (!leads.data?.length) return;
    const header = ["Name", "Email", "Phone", "Country", "Interested in", "Source", "Campaign", "Date"];
    const rows = leads.data.map((l) => [
      l.fullName,
      l.email,
      l.phone ?? "",
      l.country ?? "",
      l.interestedIn ?? "",
      l.source ?? "",
      [l.utmSource, l.utmMedium, l.utmCampaign].filter(Boolean).join(" / "),
      new Date(l.createdAt).toISOString(),
    ]);
    const csv = [header, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "hillbottom-leads.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div className="mb-5 flex items-end justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-white/40">Contact &amp; interest</p>
          <h2 className="mt-2 text-3xl font-semibold">Leads</h2>
        </div>
        <button
          onClick={exportCsv}
          className="border border-white/15 px-4 py-2 text-xs uppercase tracking-widest text-white/60 hover:text-white hover:border-white/35"
        >
          Export CSV
        </button>
      </div>
      <div className="overflow-x-auto border border-white/10 bg-[#0d1b2d]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wider text-white/40">
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Phone</th>
              <th className="p-4">Interested in</th>
              <th className="p-4">Source</th>
              <th className="p-4">Campaign</th>
              <th className="p-4">CRM</th>
              <th className="p-4">Date</th>
            </tr>
          </thead>
          <tbody>
            {leads.data?.length === 0 && (
              <tr>
                <td colSpan={8} className="p-8 text-center text-white/40">
                  No leads captured yet.
                </td>
              </tr>
            )}
            {leads.data?.map((lead) => (
              <tr key={lead.id} className="border-b border-white/5 text-white/70">
                <td className="p-4">{lead.fullName}</td>
                <td className="p-4">{lead.email}</td>
                <td className="p-4">{lead.phone ?? "—"}</td>
                <td className="p-4">{lead.interestedIn ?? "—"}</td>
                <td className="p-4">{lead.source ?? "—"}</td>
                <td className="p-4">
                  {[lead.utmSource, lead.utmMedium, lead.utmCampaign].filter(Boolean).join(" / ") || "—"}
                </td>
                <td className="p-4">
                  {lead.odooLeadId ? (
                    <span className="text-emerald-400">#{lead.odooLeadId}</span>
                  ) : (
                    <span className="text-white/30">—</span>
                  )}
                </td>
                <td className="p-4">{new Date(lead.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PublishSection() {
  const [result, setResult] = useState<{ published: boolean; reason?: string; log?: string[]; error?: string } | null>(null);

  const publish = useMutation({
    mutationFn: () => api.publish(),
    onSuccess: setResult,
    onError: (err: Error) => setResult({ published: false, error: err.message }),
  });

  return (
    <div className="max-w-2xl">
      <p className="text-xs uppercase tracking-[0.25em] text-white/40">Go live</p>
      <h2 className="mt-2 text-3xl font-semibold">Publish</h2>
      <p className="mt-3 text-sm leading-relaxed text-white/50">
        The public site is static HTML — nothing you save above is live until
        you publish. This pulls everything from the database, regenerates the
        site, and pushes it. Vercel picks up the push and redeploys.
      </p>
      <button
        onClick={() => publish.mutate()}
        disabled={publish.isPending}
        className="mt-6 w-full bg-[#c09a60] px-4 py-4 text-sm font-semibold text-[#07111f] hover:bg-[#d2b277] disabled:opacity-60"
      >
        {publish.isPending ? "Publishing — this can take a minute..." : "Publish now"}
      </button>

      {result && (
        <div className="mt-6 border border-white/10 bg-[#0d1b2d] p-5">
          {result.error ? (
            <p className="text-sm text-red-300">Publish failed: {result.error}</p>
          ) : result.published ? (
            <p className="text-sm text-emerald-300">Published. The site is redeploying now.</p>
          ) : (
            <p className="text-sm text-white/50">
              Nothing to publish — {result.reason ?? "no changes since the last publish"}.
            </p>
          )}
          {result.log && (
            <pre className="mt-4 max-h-64 overflow-auto whitespace-pre-wrap text-xs text-white/35">
              {result.log.join("\n\n")}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}

export default function Admin() {
  const [authenticated, setAuthenticated] = useState(() => !!getAdminToken());
  const [section, setSection] = useState<SectionId>("dashboard");

  if (!authenticated) {
    return <LoginForm onSuccess={() => setAuthenticated(true)} />;
  }

  function signOut() {
    clearAdminToken();
    setAuthenticated(false);
  }

  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      <header className="border-b border-white/10 bg-[#0b1629]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#c09a60]">Hill Bottom</p>
            <h1 className="mt-1 text-2xl font-semibold">Content Admin</h1>
          </div>
          <div className="flex items-center gap-5 text-sm">
            <button onClick={signOut} className="text-white/45 hover:text-white">
              Sign out
            </button>
            <a href={SITE_URL} className="text-white/60 hover:text-white">
              View website →
            </a>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl gap-8 px-6 py-10">
        <nav className="w-52 flex-shrink-0 space-y-1">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => setSection(s.id)}
              className={`block w-full px-4 py-3 text-left text-sm transition-colors ${
                section === s.id
                  ? "bg-[#c09a60]/15 text-[#c09a60]"
                  : "text-white/50 hover:bg-white/5 hover:text-white"
              }`}
            >
              {s.label}
            </button>
          ))}
        </nav>
        <div className="min-w-0 flex-1">
          {section === "dashboard" && <DashboardSection />}
          {section === "projects" && <ProjectsSection />}
          {section === "progress" && <ProgressSection />}
          {section === "pricing" && <PricingSection />}
          {section === "team" && <TeamSection />}
          {section === "blog" && <BlogSection />}
          {section === "marketing" && <MarketingSection />}
          {section === "sister-companies" && <SisterCompaniesSection />}
          {section === "media" && <MediaSection />}
          {section === "leads" && <LeadsSection />}
          {section === "publish" && <PublishSection />}
        </div>
      </div>
    </main>
  );
}
