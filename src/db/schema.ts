import { pgTable, text, timestamp, boolean, jsonb, integer, varchar } from "drizzle-orm/pg-core";

export const profiles = pgTable("profiles", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  display_name: text("display_name"),
  tier: text("tier").default("Basic"),
  role: text("role").default("User"),
  phone_number: text("phone_number"),
  referred_by_email: text("referred_by_email"),
  ancestors: text("ancestors").array(),
  selected_fan_id: text("selected_fan_id"),
  selected_fan_name: text("selected_fan_name"),
  selected_fan_photo_url: text("selected_fan_photo_url"),
  fandom_interests: text("fandom_interests").array(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const card_applications = pgTable("card_applications", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  user_id: text("user_id").references(() => profiles.id),
  full_name: text("full_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  tier: text("tier").notNull(),
  card_design_id: text("card_design_id"),
  status: text("status").default("pending"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const card_designs = pgTable("card_designs", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  tier: text("tier").notNull(),
  image_url: text("image_url").notNull(),
  features: text("features").array(),
  created_at: timestamp("created_at").defaultNow(),
});

export const app_settings = pgTable("app_settings", {
  key: text("key").primaryKey(),
  value: jsonb("value").notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export type Profile = typeof profiles.$inferSelect;
export type CardApplication = typeof card_applications.$inferSelect;
export type CardDesign = typeof card_designs.$inferSelect;
export type AppSetting = typeof app_settings.$inferSelect;
