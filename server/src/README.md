# API notes
All protected endpoints require `Authorization: Bearer <token>`.
Roles: `employee`, `manager`, `hr`.
Dates are stored as ISO-compatible values. Attendance is limited to one check-in per user per calendar date.
