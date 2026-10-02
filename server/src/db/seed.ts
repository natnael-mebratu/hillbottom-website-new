import "dotenv/config";
import bcrypt from "bcryptjs";
import { db } from "./client.js";
import { adminUsers, siteMedia, projects } from "./schema.js";

const seedProjects = [
  {
    slug: "hillbottom-village",
    name: "Hill Bottom Village",
    status: "ongoing" as const,
    location: "Ayat, Addis Ababa",
    summary: "Block A Complete · Block B due October 2026.",
  },
  {
    slug: "urban-kaza",
    name: "Urban Kaza",
    status: "ongoing" as const,
    location: "Kazanchis, near Addis Sport Park",
    summary: "Residential apartments in progress.",
  },
  {
    slug: "recreation-center",
    name: "Hill Bottom Commercial + Recreation",
    status: "upcoming" as const,
    location: "Ayat, Addis Ababa — Phase 3",
    summary: "Community hub, coming January 2027.",
  },
];

async function seed() {
  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;
  if (!email || !password) {
    throw new Error(
      "SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD must be set to seed the initial admin user",
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await db
    .insert(adminUsers)
    .values({ email: email.toLowerCase(), passwordHash, role: "admin" })
    .onConflictDoNothing({ target: adminUsers.email });

  await db
    .insert(siteMedia)
    .values({ id: 1 })
    .onConflictDoNothing({ target: siteMedia.id });

  await db.insert(projects).values(seedProjects).onConflictDoNothing({ target: projects.slug });

  console.log(`Seeded admin user: ${email}`);
  console.log(`Seeded ${seedProjects.length} baseline projects`);
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
