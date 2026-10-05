# Security Specification for Quran Study Circles & Leagues

## 1. Data Invariants
1. A league member record in `/leagues/{leagueId}/members/{memberId}` must have `memberId == request.auth.uid`.
2. A user can only create their own user profile under `/users/{userId}` where `userId == request.auth.uid`.
3. A user can only log activity with `userId == request.auth.uid`.
4. League documents can only be created by authenticated users who assign themselves as `creatorId`.
5. Point increments on member records must be positive numbers and match user ownership.

## 2. Dirty Dozen Attack Payloads
1. **Unauthenticated Read**: Attempting to read `/users/{userId}` when `request.auth == null` -> DENIED.
2. **Impersonate User Profile**: User `uid_A` writing `/users/uid_B` -> DENIED.
3. **Spoof League Member**: User `uid_A` creating `/leagues/{leagueId}/members/uid_B` -> DENIED.
4. **Member Tamper Rank/Points of Other**: User `uid_A` updating points on `uid_B`'s member document -> DENIED.
5. **Activity Log Forgery**: User `uid_A` posting activity pretending to be `uid_B` -> DENIED.
6. **Malicious League ID Injection**: Creating league with 2000-character junk ID -> DENIED.
7. **Negative XP Drain**: Updating member points with negative increment -> DENIED.
8. **Shadow Field Injection**: Adding unapproved arbitrary keys to league document -> DENIED.
9. **Creator Overwrite**: Non-creator updating core league settings -> DENIED.
10. **Unauthorized Delete of League**: Member attempting to delete another creator's league -> DENIED.
11. **Non-Member Activity Injection**: Unauthenticated user posting into `/activity` -> DENIED.
12. **Blanket Query Flood**: Querying without signed-in identity -> DENIED.
