// Dynamic database rows are validated at HTTP boundaries with Zod.
export type Row = {
  id: string;
  user_id?: string;
  created_at: string;
  updated_at: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};
export type Actor = {
  id: string;
  email?: string;
  role: "user" | "admin" | "issuer";
  demo: boolean;
};
export type Table =
  | "users"
  | "profiles"
  | "claims"
  | "claim_facts"
  | "credentials"
  | "credential_events"
  | "services"
  | "service_requirements"
  | "service_sources"
  | "documents"
  | "applications"
  | "journeys"
  | "application_documents"
  | "application_credentials"
  | "application_events"
  | "notifications"
  | "escalations"
  | "escalation_messages"
  | "analytics_events";
