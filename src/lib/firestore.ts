import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "./firebase";
import { DEFAULT_BRAND_SETTINGS, DEFAULT_SEO_SETTINGS, type BrandSettings, type SeoSettings } from "./site";
import { serializeImages, slugify } from "./utils";

export type Product = {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number | null;
  category: string;
  images: string;
  featured: boolean;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type Workshop = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  steps: string;
  learnings: string;
  output: string | null;
  ageGroup: string | null;
  duration: string | null;
  images: string;
  featured: boolean;
  published: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  read: boolean;
  createdAt: Date;
};

type FirestoreData = Record<string, unknown>;

function toDate(value: unknown): Date {
  if (value && typeof value === "object" && "toDate" in value) {
    return (value as { toDate: () => Date }).toDate();
  }
  return new Date();
}

function fromDoc<T>(id: string, data: FirestoreData): T {
  return {
    id,
    ...data,
    createdAt: toDate(data.createdAt),
    updatedAt: data.updatedAt !== undefined ? toDate(data.updatedAt) : undefined,
  } as T;
}

async function uniqueSlug(collectionName: "products" | "workshops", base: string) {
  let slug = base;
  let i = 1;
  while (
    !(
      await getDocs(query(collection(db, collectionName), where("slug", "==", slug)))
    ).empty
  ) {
    slug = `${base}-${i++}`;
  }
  return slug;
}

// ---- Products ----

export async function getProducts(): Promise<Product[]> {
  const snap = await getDocs(query(collection(db, "products"), orderBy("createdAt", "desc")));
  return snap.docs.map((d) => fromDoc<Product>(d.id, d.data()));
}

export async function getPublishedProducts(): Promise<Product[]> {
  const snap = await getDocs(
    query(collection(db, "products"), where("published", "==", true))
  );
  return snap.docs
    .map((d) => fromDoc<Product>(d.id, d.data()))
    .sort((a, b) => {
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      return b.createdAt.getTime() - a.createdAt.getTime();
    });
}

export async function getProduct(slug: string): Promise<Product | null> {
  const snap = await getDocs(
    query(collection(db, "products"), where("slug", "==", slug), where("published", "==", true), limit(1))
  );
  if (snap.empty) return null;
  return fromDoc<Product>(snap.docs[0].id, snap.docs[0].data());
}

export async function getProductById(id: string): Promise<Product | null> {
  const snap = await getDoc(doc(db, "products", id));
  if (!snap.exists()) return null;
  return fromDoc<Product>(snap.id, snap.data());
}

export async function getAllProductSlugs(): Promise<string[]> {
  const snap = await getDocs(
    query(collection(db, "products"), where("published", "==", true))
  );
  return snap.docs.map((d) => d.data().slug as string);
}

export type ProductInput = {
  title: string;
  description: string;
  category: string;
  price?: number | null;
  images?: string[];
  featured?: boolean;
  published?: boolean;
  slug?: string;
};

export async function createProduct(data: ProductInput) {
  const slug = await uniqueSlug("products", slugify(data.slug || data.title));
  const ref = await addDoc(collection(db, "products"), {
    title: data.title,
    description: data.description,
    category: data.category,
    price: data.price ?? null,
    images: serializeImages(data.images || []),
    featured: data.featured ?? false,
    published: data.published ?? true,
    slug,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateProduct(id: string, data: ProductInput) {
  await updateDoc(doc(db, "products", id), {
    title: data.title,
    description: data.description,
    category: data.category,
    price: data.price ?? null,
    images: serializeImages(data.images || []),
    featured: data.featured ?? false,
    published: data.published ?? true,
    ...(data.slug ? { slug: slugify(data.slug) } : {}),
    updatedAt: serverTimestamp(),
  });
}

export async function deleteProduct(id: string) {
  await deleteDoc(doc(db, "products", id));
}

// ---- Workshops ----

export async function getWorkshops(): Promise<Workshop[]> {
  const snap = await getDocs(collection(db, "workshops"));
  return snap.docs
    .map((d) => fromDoc<Workshop>(d.id, d.data()))
    .sort((a, b) => a.sortOrder - b.sortOrder || a.title.localeCompare(b.title));
}

export async function getPublishedWorkshops(): Promise<Workshop[]> {
  const snap = await getDocs(
    query(collection(db, "workshops"), where("published", "==", true))
  );
  return snap.docs
    .map((d) => fromDoc<Workshop>(d.id, d.data()))
    .sort((a, b) => a.sortOrder - b.sortOrder || a.title.localeCompare(b.title));
}

export async function getFeaturedWorkshops(count: number): Promise<Workshop[]> {
  const all = await getPublishedWorkshops();
  return [...all]
    .sort((a, b) => {
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      return a.sortOrder - b.sortOrder;
    })
    .slice(0, count);
}

export async function getWorkshop(slug: string): Promise<Workshop | null> {
  const snap = await getDocs(
    query(collection(db, "workshops"), where("slug", "==", slug), where("published", "==", true), limit(1))
  );
  if (snap.empty) return null;
  return fromDoc<Workshop>(snap.docs[0].id, snap.docs[0].data());
}

export async function getWorkshopById(id: string): Promise<Workshop | null> {
  const snap = await getDoc(doc(db, "workshops", id));
  if (!snap.exists()) return null;
  return fromDoc<Workshop>(snap.id, snap.data());
}

export async function getAllWorkshopSlugs(): Promise<string[]> {
  const snap = await getDocs(
    query(collection(db, "workshops"), where("published", "==", true))
  );
  return snap.docs.map((d) => d.data().slug as string);
}

export type WorkshopInput = {
  title: string;
  summary: string;
  description: string;
  steps?: string[];
  learnings?: string[];
  output?: string | null;
  ageGroup?: string | null;
  duration?: string | null;
  images?: string[];
  featured?: boolean;
  published?: boolean;
  sortOrder?: number;
};

export async function createWorkshop(data: WorkshopInput) {
  const slug = await uniqueSlug("workshops", slugify(data.title));
  const ref = await addDoc(collection(db, "workshops"), {
    title: data.title,
    summary: data.summary,
    description: data.description,
    steps: JSON.stringify(data.steps || []),
    learnings: JSON.stringify(data.learnings || []),
    output: data.output || null,
    ageGroup: data.ageGroup || null,
    duration: data.duration || null,
    images: serializeImages(data.images || []),
    featured: data.featured ?? false,
    published: data.published ?? true,
    sortOrder: data.sortOrder ?? 99,
    slug,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export type WorkshopUpdateInput = Partial<WorkshopInput>;

export async function updateWorkshop(id: string, data: WorkshopUpdateInput) {
  const { images, steps, learnings, ...rest } = data;
  await updateDoc(doc(db, "workshops", id), {
    ...rest,
    ...(steps ? { steps: JSON.stringify(steps) } : {}),
    ...(learnings ? { learnings: JSON.stringify(learnings) } : {}),
    ...(images ? { images: serializeImages(images) } : {}),
    updatedAt: serverTimestamp(),
  });
}

export async function deleteWorkshop(id: string) {
  await deleteDoc(doc(db, "workshops", id));
}

// ---- Contact messages ----

export type MessageInput = {
  name: string;
  email: string;
  phone?: string | null;
  subject: string;
  message: string;
};

export async function createMessage(data: MessageInput) {
  await addDoc(collection(db, "contactMessages"), {
    name: data.name,
    email: data.email,
    phone: data.phone || null,
    subject: data.subject,
    message: data.message,
    read: false,
    createdAt: serverTimestamp(),
  });
}

export async function getMessages(): Promise<ContactMessage[]> {
  const snap = await getDocs(query(collection(db, "contactMessages"), orderBy("createdAt", "desc")));
  return snap.docs.map((d) => fromDoc<ContactMessage>(d.id, d.data()));
}

export async function markMessageRead(id: string) {
  await updateDoc(doc(db, "contactMessages", id), { read: true });
}

// ---- SEO settings ----

export async function getSeoSettings(): Promise<SeoSettings> {
  const snap = await getDoc(doc(db, "siteSettings", "seo"));
  if (!snap.exists()) return DEFAULT_SEO_SETTINGS;
  const data = snap.data() as Partial<SeoSettings>;
  return {
    siteName: data.siteName || DEFAULT_SEO_SETTINGS.siteName,
    siteDescription: data.siteDescription || DEFAULT_SEO_SETTINGS.siteDescription,
    ogImage: data.ogImage || DEFAULT_SEO_SETTINGS.ogImage,
    pages: {
      home: { ...DEFAULT_SEO_SETTINGS.pages.home, ...data.pages?.home },
      urunler: { ...DEFAULT_SEO_SETTINGS.pages.urunler, ...data.pages?.urunler },
      atolyeler: { ...DEFAULT_SEO_SETTINGS.pages.atolyeler, ...data.pages?.atolyeler },
      ozelTasarim: { ...DEFAULT_SEO_SETTINGS.pages.ozelTasarim, ...data.pages?.ozelTasarim },
      iletisim: { ...DEFAULT_SEO_SETTINGS.pages.iletisim, ...data.pages?.iletisim },
    },
  };
}

export async function updateSeoSettings(data: SeoSettings) {
  await setDoc(doc(db, "siteSettings", "seo"), data, { merge: true });
}

export async function getBrandSettings(): Promise<BrandSettings> {
  const snap = await getDoc(doc(db, "siteSettings", "brand"));
  return { ...DEFAULT_BRAND_SETTINGS, ...(snap.exists() ? snap.data() : {}) };
}

export async function updateBrandSettings(data: BrandSettings) {
  await setDoc(doc(db, "siteSettings", "brand"), data);
}
