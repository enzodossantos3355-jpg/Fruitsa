# FruitStudio — Security Specification (Phase 0)

## 1. Data Invariants

1. **Strict UID Isolation (PII Protection):** A `UserStudioProfile` document at `/users/{userId}` can only be read (`get`), created, or updated by the authenticated user whose `request.auth.uid == userId` and `request.auth.token.email_verified == true` (for writes). Blanket `list` queries on `/users` are strictly denied.
2. **Immutable Ownership & Audit Fields:** Once created, `uid`, `email`, `provider`, and `createdAt` on `/users/{userId}` cannot be mutated.
3. **One-Way Onboarding Completion:** Once `onboardingCompleted` is set to `true`, it cannot be reverted to `false`.
4. **Master Gate & Immutable Activity Logs:** `/users/{userId}/activities/{activityId}` requires the parent `/users/{userId}` document to exist on `get` and `create`, strictly matches `uid == request.auth.uid`, and forbids all updates and deletes.
5. **Strict Server Timestamps & Bounded Payloads:** Every `createdAt` and `updatedAt` field must equal `request.time`, every string has explicit min/max length bounds matching `firebase-blueprint.json`, and no unknown/shadow fields are allowed.

## 2. The "Dirty Dozen" Adversarial Payloads (Must Return PERMISSION_DENIED)

1. **Cross-User PII Read:** Authenticated user `uid_B` calls `get(/users/uid_A)`.
2. **Users Collection Scrape:** Authenticated user calls `list(/users)`.
3. **Unverified Email Write:** User with `email_verified: false` attempts `create(/users/uid_A)`.
4. **Identity Spoofing on Create:** User `uid_A` attempts to create `/users/uid_A` with `{ uid: "uid_B" }`.
5. **Shadow Field Injection:** User `uid_A` attempts to create or update `/users/uid_A` with extra field `isAdmin: true`.
6. **Immutable Field Mutation:** User `uid_A` attempts to update `createdAt` or `email` or `provider` on `/users/uid_A`.
7. **Onboarding State Regression:** User `uid_A` attempts to update `onboardingCompleted: false` after it is `true`.
8. **Client Timestamp Forgery:** User `uid_A` submits a backdated `updatedAt` instead of `serverTimestamp()`.
9. **Resource Poisoning (Oversized String):** User `uid_A` submits a 2,000-character `studioName` or `photoURL`.
10. **Path ID Poisoning:** User attempts to write `/users/uid_A/activities/../../evil!id`.
11. **Orphaned Subcollection Write:** User attempts to create `/users/uid_A/activities/act_1` when `/users/uid_A` does not exist.
12. **Activity Log Tampering:** User `uid_A` attempts `update` or `delete` on `/users/uid_A/activities/act_1`.
