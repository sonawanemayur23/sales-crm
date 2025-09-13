import { pgTable, uuid, varchar, text, timestamp, boolean, integer, decimal, json, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Enums
export const opportunityStatusEnum = pgEnum("opportunity_status", [
  "new",
  "contacted", 
  "qualified",
  "demo_scheduled",
  "demo_done",
  "quote_sent",
  "negotiation",
  "approval_pending",
  "won",
  "lost"
]);

export const leadStatusEnum = pgEnum("lead_status", [
  "new",
  "contacted",
  "qualified", 
  "disqualified",
  "converted"
]);

export const activityTypeEnum = pgEnum("activity_type", [
  "call",
  "email", 
  "whatsapp",
  "meeting",
  "note",
  "task"
]);

export const activityDirectionEnum = pgEnum("activity_direction", [
  "in",
  "out"
]);

export const demoModeEnum = pgEnum("demo_mode", [
  "online",
  "in_person"
]);

export const demoStatusEnum = pgEnum("demo_status", [
  "scheduled",
  "rescheduled", 
  "no_show",
  "done",
  "cancelled"
]);

export const billingCycleEnum = pgEnum("billing_cycle", [
  "monthly",
  "yearly"
]);

export const quoteStatusEnum = pgEnum("quote_status", [
  "draft",
  "sent",
  "viewed",
  "approved",
  "rejected",
  "expired"
]);

export const lineTypeEnum = pgEnum("line_type", [
  "plan",
  "feature",
  "service",
  "discount",
  "tax"
]);

export const approvalStatusEnum = pgEnum("approval_status", [
  "pending",
  "approved",
  "rejected"
]);

export const unitTypeEnum = pgEnum("unit_type", [
  "seat",
  "flat",
  "usage"
]);

// Users and Roles
export const users = pgTable("users", {
  userId: uuid("user_id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const roles = pgTable("roles", {
  roleId: uuid("role_id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 50 }).notNull().unique(),
  description: text("description"),
  permissions: json("permissions").$type<string[]>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userRoles = pgTable("user_roles", {
  userRoleId: uuid("user_role_id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.userId).notNull(),
  roleId: uuid("role_id").references(() => roles.roleId).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Accounts and Contacts
export const accounts = pgTable("accounts", {
  accountId: uuid("account_id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  industry: varchar("industry", { length: 100 }),
  website: varchar("website", { length: 255 }),
  size: varchar("size", { length: 50 }), // e.g., "1-10", "11-50", "51-200", "200+"
  billingAddress: json("billing_address").$type<{
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  }>(),
  shippingAddress: json("shipping_address").$type<{
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  }>(),
  gstin: varchar("gstin", { length: 15 }),
  pan: varchar("pan", { length: 10 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const contacts = pgTable("contacts", {
  contactId: uuid("contact_id").primaryKey().defaultRandom(),
  accountId: uuid("account_id").references(() => accounts.accountId),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  jobTitle: varchar("job_title", { length: 100 }),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 20 }),
  whatsappOptIn: boolean("whatsapp_opt_in").default(false),
  ownerUserId: uuid("owner_user_id").references(() => users.userId),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Leads
export const leads = pgTable("leads", {
  leadId: uuid("lead_id").primaryKey().defaultRandom(),
  source: varchar("source", { length: 100 }), // web, referral, campaign, etc.
  campaign: varchar("campaign", { length: 100 }),
  firstName: varchar("first_name", { length: 100 }),
  lastName: varchar("last_name", { length: 100 }),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 20 }),
  company: varchar("company", { length: 255 }),
  firstTouchAt: timestamp("first_touch_at").defaultNow(),
  status: leadStatusEnum("status").default("new"),
  disqualifyReason: text("disqualify_reason"),
  ownerUserId: uuid("owner_user_id").references(() => users.userId),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Opportunities
export const opportunities = pgTable("opportunities", {
  opportunityId: uuid("opportunity_id").primaryKey().defaultRandom(),
  accountId: uuid("account_id").references(() => accounts.accountId),
  primaryContactId: uuid("primary_contact_id").references(() => contacts.contactId),
  ownerUserId: uuid("owner_user_id").references(() => users.userId).notNull(),
  opportunityStatus: opportunityStatusEnum("opportunity_status").default("new"),
  amountEstimate: decimal("amount_estimate", { precision: 12, scale: 2 }),
  currency: varchar("currency", { length: 3 }).default("INR"),
  expectedCloseDate: timestamp("expected_close_date"),
  probabilityPct: integer("probability_pct").default(0),
  lostReasonId: uuid("lost_reason_id"),
  lostNotes: text("lost_notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Activities
export const activities = pgTable("activities", {
  activityId: uuid("activity_id").primaryKey().defaultRandom(),
  parentType: varchar("parent_type", { length: 20 }).notNull(), // lead, opportunity, account, contact
  parentId: uuid("parent_id").notNull(),
  type: activityTypeEnum("type").notNull(),
  direction: activityDirectionEnum("direction").notNull(),
  subject: varchar("subject", { length: 255 }),
  body: text("body"),
  metadata: json("metadata").$type<Record<string, any>>(),
  dueAt: timestamp("due_at"),
  completedAt: timestamp("completed_at"),
  createdBy: uuid("created_by").references(() => users.userId).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Demos
export const demos = pgTable("demos", {
  demoId: uuid("demo_id").primaryKey().defaultRandom(),
  opportunityId: uuid("opportunity_id").references(() => opportunities.opportunityId).notNull(),
  mode: demoModeEnum("mode").notNull(),
  location: varchar("location", { length: 255 }),
  meetLink: varchar("meet_link", { length: 500 }),
  scheduledStart: timestamp("scheduled_start").notNull(),
  scheduledEnd: timestamp("scheduled_end").notNull(),
  status: demoStatusEnum("status").default("scheduled"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Plans and Features
export const plans = pgTable("plans", {
  planId: uuid("plan_id").primaryKey().defaultRandom(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  displayName: varchar("display_name", { length: 100 }).notNull(),
  basePriceMonthly: decimal("base_price_monthly", { precision: 10, scale: 2 }).notNull(),
  basePriceYearly: decimal("base_price_yearly", { precision: 10, scale: 2 }).notNull(),
  minUsers: integer("min_users").default(1),
  maxUsers: integer("max_users"),
  description: text("description"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const features = pgTable("features", {
  featureId: uuid("feature_id").primaryKey().defaultRandom(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  displayName: varchar("display_name", { length: 100 }).notNull(),
  description: text("description"),
  isAddon: boolean("is_addon").default(false),
  unitType: unitTypeEnum("unit_type").notNull(),
  pricePerUnitMonthly: decimal("price_per_unit_monthly", { precision: 10, scale: 2 }),
  pricePerUnitYearly: decimal("price_per_unit_yearly", { precision: 10, scale: 2 }),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Quotes
export const quotes = pgTable("quotes", {
  quoteId: uuid("quote_id").primaryKey().defaultRandom(),
  opportunityId: uuid("opportunity_id").references(() => opportunities.opportunityId).notNull(),
  planId: uuid("plan_id").references(() => plans.planId),
  numUsers: integer("num_users").notNull(),
  currency: varchar("currency", { length: 3 }).default("INR"),
  billingCycle: billingCycleEnum("billing_cycle").notNull(),
  subtotal: decimal("subtotal", { precision: 12, scale: 2 }).notNull(),
  discountAmount: decimal("discount_amount", { precision: 12, scale: 2 }).default("0"),
  taxAmount: decimal("tax_amount", { precision: 12, scale: 2 }).default("0"),
  total: decimal("total", { precision: 12, scale: 2 }).notNull(),
  validUntil: timestamp("valid_until").notNull(),
  status: quoteStatusEnum("status").default("draft"),
  approvalRequired: boolean("approval_required").default(false),
  customerNotes: text("customer_notes"),
  internalNotes: text("internal_notes"),
  pdfUrl: varchar("pdf_url", { length: 500 }),
  publicLinkToken: varchar("public_link_token", { length: 100 }).unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const quoteItems = pgTable("quote_items", {
  quoteItemId: uuid("quote_item_id").primaryKey().defaultRandom(),
  quoteId: uuid("quote_id").references(() => quotes.quoteId).notNull(),
  lineType: lineTypeEnum("line_type").notNull(),
  referenceId: uuid("reference_id"), // plan_id or feature_id
  name: varchar("name", { length: 255 }).notNull(),
  qty: integer("qty").notNull(),
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
  lineTotal: decimal("line_total", { precision: 12, scale: 2 }).notNull(),
  metadata: json("metadata").$type<Record<string, any>>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Approvals
export const approvals = pgTable("approvals", {
  approvalId: uuid("approval_id").primaryKey().defaultRandom(),
  quoteId: uuid("quote_id").references(() => quotes.quoteId).notNull(),
  requestedByUserId: uuid("requested_by_user_id").references(() => users.userId).notNull(),
  approverUserId: uuid("approver_user_id").references(() => users.userId).notNull(),
  status: approvalStatusEnum("status").default("pending"),
  reason: text("reason"),
  actedAt: timestamp("acted_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Lost Reasons
export const lostReasons = pgTable("lost_reasons", {
  lostReasonId: uuid("lost_reason_id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  userRoles: many(userRoles),
  ownedContacts: many(contacts),
  ownedLeads: many(leads),
  ownedOpportunities: many(opportunities),
  createdActivities: many(activities),
}));

export const rolesRelations = relations(roles, ({ many }) => ({
  userRoles: many(userRoles),
}));

export const userRolesRelations = relations(userRoles, ({ one }) => ({
  user: one(users, {
    fields: [userRoles.userId],
    references: [users.userId],
  }),
  role: one(roles, {
    fields: [userRoles.roleId],
    references: [roles.roleId],
  }),
}));

export const accountsRelations = relations(accounts, ({ many }) => ({
  contacts: many(contacts),
  opportunities: many(opportunities),
}));

export const contactsRelations = relations(contacts, ({ one, many }) => ({
  account: one(accounts, {
    fields: [contacts.accountId],
    references: [accounts.accountId],
  }),
  owner: one(users, {
    fields: [contacts.ownerUserId],
    references: [users.userId],
  }),
  primaryOpportunities: many(opportunities),
}));

export const leadsRelations = relations(leads, ({ one }) => ({
  owner: one(users, {
    fields: [leads.ownerUserId],
    references: [users.userId],
  }),
}));

export const opportunitiesRelations = relations(opportunities, ({ one, many }) => ({
  account: one(accounts, {
    fields: [opportunities.accountId],
    references: [accounts.accountId],
  }),
  primaryContact: one(contacts, {
    fields: [opportunities.primaryContactId],
    references: [contacts.contactId],
  }),
  owner: one(users, {
    fields: [opportunities.ownerUserId],
    references: [users.userId],
  }),
  demos: many(demos),
  quotes: many(quotes),
}));

export const activitiesRelations = relations(activities, ({ one }) => ({
  creator: one(users, {
    fields: [activities.createdBy],
    references: [users.userId],
  }),
}));

export const demosRelations = relations(demos, ({ one }) => ({
  opportunity: one(opportunities, {
    fields: [demos.opportunityId],
    references: [opportunities.opportunityId],
  }),
}));

export const quotesRelations = relations(quotes, ({ one, many }) => ({
  opportunity: one(opportunities, {
    fields: [quotes.opportunityId],
    references: [opportunities.opportunityId],
  }),
  plan: one(plans, {
    fields: [quotes.planId],
    references: [plans.planId],
  }),
  quoteItems: many(quoteItems),
  approvals: many(approvals),
}));

export const quoteItemsRelations = relations(quoteItems, ({ one }) => ({
  quote: one(quotes, {
    fields: [quoteItems.quoteId],
    references: [quotes.quoteId],
  }),
}));

export const approvalsRelations = relations(approvals, ({ one }) => ({
  quote: one(quotes, {
    fields: [approvals.quoteId],
    references: [quotes.quoteId],
  }),
  requestedBy: one(users, {
    fields: [approvals.requestedByUserId],
    references: [users.userId],
  }),
  approver: one(users, {
    fields: [approvals.approverUserId],
    references: [users.userId],
  }),
}));
