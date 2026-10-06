const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

export type ProjectStatus = "completed" | "ongoing" | "under_construction" | "upcoming";

export type Project = {
  id: number;
  slug: string;
  name: string;
  status: ProjectStatus;
  location: string | null;
  summary: string | null;
  heroImageUrl: string | null;
  unitTypes: Record<string, unknown>[];
  floorPlans: Record<string, unknown>[];
  completionPercent: number;
  currentStage: string | null;
  nextMilestone: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ProgressUpdate = {
  id: number;
  projectId: number;
  type: "dream" | "actual";
  mediaUrl: string;
  caption: string | null;
  milestoneLabel: string | null;
  completionPercent: number | null;
  postedAt: string;
};

export type SiteMedia = {
  id: number;
  heroVideoUrl: string;
  featuredProjectVideoUrl: string;
  virtualTourProvider: "iframe" | "youtube" | "vimeo" | "external";
  virtualTourUrl: string;
  virtualTourTitle: string;
  // Billboard-QR promo landing page (promo.html) — video + giveaway copy.
  promoVideoUrl: string;
  promoGiftTitle: string;
  promoGiftBody: string;
  promoPartnerUrl: string;
  updatedAt: string;
};

export type Lead = {
  id: number;
  fullName: string;
  email: string;
  phone: string | null;
  country: string | null;
  interestedIn: string | null;
  message: string | null;
  source: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  landingPage: string | null;
  referrer: string | null;
  odooLeadId: number | null;
  createdAt: string;
};

export type TeamMember = {
  id: number;
  name: string;
  role: string;
  department: string | null;
  bio: string | null;
  photoUrl: string | null;
  sortOrder: number;
  createdAt: string;
};

export type PricingPlan = {
  id: number;
  projectId: number;
  unitType: string;
  price: string;
  currency: string;
  installmentPlan: Record<string, unknown>[];
  discountRules: Record<string, unknown>[];
  createdAt: string;
  updatedAt: string;
};

export type BlogPost = {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  coverImageUrl: string | null;
  author: string | null;
  published: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type MarketingPost = {
  id: number;
  title: string;
  body: string | null;
  mediaUrl: string | null;
  campaignTag: string | null;
  publishedAt: string;
  createdAt: string;
};

export type SisterCompany = {
  id: number;
  name: string;
  summary: string | null;
  logoUrl: string | null;
  websiteUrl: string | null;
  sortOrder: number;
  createdAt: string;
};

export type PublishResult = {
  published: boolean;
  reason?: string;
  log?: string[];
  error?: string;
};

const ADMIN_TOKEN_KEY = "hb-admin-token";

export function getAdminToken(): string | null {
  return localStorage.getItem(ADMIN_TOKEN_KEY);
}

export function setAdminToken(token: string) {
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
}

export function clearAdminToken() {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
}

async function request<T>(
  path: string,
  options: { method?: string; body?: unknown; auth?: boolean } = {},
): Promise<T> {
  const headers: Record<string, string> = {};
  if (options.body !== undefined) headers["Content-Type"] = "application/json";
  if (options.auth) {
    const token = getAdminToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    method: options.method ?? "GET",
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body?.error?.toString?.() ?? `Request failed: ${response.status}`);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export const api = {
  login: (email: string, password: string) =>
    request<{ token: string; admin: { id: number; email: string; role: string } }>(
      "/api/auth/login",
      { method: "POST", body: { email, password } },
    ),

  listProjects: (status?: ProjectStatus) =>
    request<Project[]>(`/api/projects${status ? `?status=${status}` : ""}`),
  getProject: (slug: string) => request<Project>(`/api/projects/${slug}`),
  createProject: (input: Omit<Project, "id" | "createdAt" | "updatedAt">) =>
    request<Project>("/api/projects", { method: "POST", body: input, auth: true }),
  updateProject: (id: number, input: Partial<Omit<Project, "id" | "createdAt" | "updatedAt">>) =>
    request<Project>(`/api/projects/${id}`, { method: "PUT", body: input, auth: true }),
  deleteProject: (id: number) =>
    request<void>(`/api/projects/${id}`, { method: "DELETE", auth: true }),

  listProgress: (projectId: number) =>
    request<ProgressUpdate[]>(`/api/progress/project/${projectId}`),
  createProgress: (input: Omit<ProgressUpdate, "id" | "postedAt">) =>
    request<ProgressUpdate>("/api/progress", { method: "POST", body: input, auth: true }),
  deleteProgress: (id: number) =>
    request<void>(`/api/progress/${id}`, { method: "DELETE", auth: true }),

  getSiteMedia: () => request<SiteMedia | null>("/api/site-media"),
  updateSiteMedia: (input: Partial<Omit<SiteMedia, "id" | "updatedAt">>) =>
    request<SiteMedia>("/api/site-media", { method: "PUT", body: input, auth: true }),

  submitLead: (input: Omit<Lead, "id" | "createdAt">) =>
    request<Lead>("/api/leads", { method: "POST", body: input }),
  listLeads: () => request<Lead[]>("/api/leads", { auth: true }),

  listPricing: (projectId: number) =>
    request<PricingPlan[]>(`/api/pricing/project/${projectId}`),
  createPricing: (input: Omit<PricingPlan, "id" | "createdAt" | "updatedAt">) =>
    request<PricingPlan>("/api/pricing", { method: "POST", body: input, auth: true }),
  deletePricing: (id: number) =>
    request<void>(`/api/pricing/${id}`, { method: "DELETE", auth: true }),

  listBlogPosts: () => request<BlogPost[]>("/api/blog"),
  listBlogPostsAdmin: () => request<BlogPost[]>("/api/blog/admin", { auth: true }),
  getBlogPost: (slug: string) => request<BlogPost>(`/api/blog/${slug}`),
  createBlogPost: (
    input: Omit<BlogPost, "id" | "createdAt" | "updatedAt" | "publishedAt"> & {
      publishedAt?: string | null;
    },
  ) => request<BlogPost>("/api/blog", { method: "POST", body: input, auth: true }),
  updateBlogPost: (id: number, input: Partial<Omit<BlogPost, "id" | "createdAt" | "updatedAt">>) =>
    request<BlogPost>(`/api/blog/${id}`, { method: "PUT", body: input, auth: true }),
  deleteBlogPost: (id: number) =>
    request<void>(`/api/blog/${id}`, { method: "DELETE", auth: true }),

  listMarketing: () => request<MarketingPost[]>("/api/marketing"),
  createMarketingPost: (input: Omit<MarketingPost, "id" | "createdAt" | "publishedAt"> & { publishedAt?: string }) =>
    request<MarketingPost>("/api/marketing", { method: "POST", body: input, auth: true }),
  deleteMarketingPost: (id: number) =>
    request<void>(`/api/marketing/${id}`, { method: "DELETE", auth: true }),

  listTeam: () => request<TeamMember[]>("/api/team"),
  createTeamMember: (input: Omit<TeamMember, "id" | "createdAt">) =>
    request<TeamMember>("/api/team", { method: "POST", body: input, auth: true }),
  updateTeamMember: (id: number, input: Partial<Omit<TeamMember, "id" | "createdAt">>) =>
    request<TeamMember>(`/api/team/${id}`, { method: "PUT", body: input, auth: true }),
  deleteTeamMember: (id: number) =>
    request<void>(`/api/team/${id}`, { method: "DELETE", auth: true }),

  listSisterCompanies: () => request<SisterCompany[]>("/api/sister-companies"),
  createSisterCompany: (input: Omit<SisterCompany, "id" | "createdAt">) =>
    request<SisterCompany>("/api/sister-companies", { method: "POST", body: input, auth: true }),
  updateSisterCompany: (id: number, input: Partial<Omit<SisterCompany, "id" | "createdAt">>) =>
    request<SisterCompany>(`/api/sister-companies/${id}`, { method: "PUT", body: input, auth: true }),
  deleteSisterCompany: (id: number) =>
    request<void>(`/api/sister-companies/${id}`, { method: "DELETE", auth: true }),

  // Regenerates the static site from the DB and pushes — see
  // server/src/routes/publish.ts. Can take a while (runs the full build).
  publish: () => request<PublishResult>("/api/publish", { method: "POST", auth: true }),
};
