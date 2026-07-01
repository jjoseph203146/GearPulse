-- Tracks whether a user has completed the onboarding flow (account type,
-- instruments, spaces, brands, profile). Used by route guards to send
-- signed-in-but-not-onboarded users back into the onboarding flow.
alter table profiles add column onboarding_completed boolean not null default false;
