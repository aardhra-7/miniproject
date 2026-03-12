/**
 * StaySphere – Firebase Firestore Collections Schema
 * 
 * NOTE: Firestore is schema-less. This file documents the expected
 * structure of each collection for reference.
 *
 * ─────────────────────────────────────────────────────────
 * Collection: users  (Document ID = userId e.g. "STU-2023-033")
 * ─────────────────────────────────────────────────────────
 * {
 *   name: string,
 *   role: "student" | "faculty" | "authority" | "admin",
 *   password: string (bcrypt hashed),
 *   email: string,
 *   phone: string,
 *   isActive: boolean,
 *   lastLogin: string (ISO date),
 *   createdAt: string (ISO date)
 * }
 *
 * ─────────────────────────────────────────────────────────
 * Collection: students  (Document ID = userId)
 * ─────────────────────────────────────────────────────────
 * {
 *   name: string,
 *   rollNumber: string,
 *   department: string,
 *   year: number,
 *   roomNumber: string,
 *   wing: string,
 *   hostelBlock: string,
 *   parentName: string,
 *   parentPhone: string,
 *   address: string,
 *   city: string,
 *   state: string,
 *   dateOfBirth: string,
 *   gender: "Male" | "Female" | "Other",
 *   bloodGroup: string,
 *   medicalInfo: string,
 *   email: string,
 *   phone: string,
 *   isActive: boolean,
 *   createdAt: string
 * }
 *
 * ─────────────────────────────────────────────────────────
 * Collection: attendance  (Auto-generated document ID)
 * ─────────────────────────────────────────────────────────
 * {
 *   studentId: string,
 *   studentName: string,
 *   date: string (YYYY-MM-DD),
 *   session: "morning" | "evening" | "night",
 *   status: "present" | "absent" | "leave" | "outgoing",
 *   markedBy: string (userId),
 *   remarks: string,
 *   createdAt: string
 * }
 *
 * ─────────────────────────────────────────────────────────
 * Collection: messCuts  (Auto-generated document ID)
 * ─────────────────────────────────────────────────────────
 * {
 *   studentId: string,
 *   studentName: string,
 *   fromDate: string,
 *   toDate: string,
 *   reason: string,
 *   numberOfDays: number,
 *   status: "pending" | "approved" | "rejected",
 *   approvedBy: string,
 *   approvedAt: string,
 *   remarks: string,
 *   createdAt: string
 * }
 *
 * ─────────────────────────────────────────────────────────
 * Collection: outgoings  (Auto-generated document ID)
 * ─────────────────────────────────────────────────────────
 * {
 *   studentId: string,
 *   studentName: string,
 *   reason: string,
 *   expectedReturnTime: string,
 *   latitude: number | null,
 *   longitude: number | null,
 *   timestamp: string,
 *   status: "active" | "returned" | "overdue",
 *   returnStatus: "pending" | "valid_return" | "invalid_return",
 *   returnLatitude: number | null,
 *   returnLongitude: number | null,
 *   returnTimestamp: string | null,
 *   createdAt: string
 * }
 *
 * ─────────────────────────────────────────────────────────
 * Collection: homeGoings  (Auto-generated document ID)
 * ─────────────────────────────────────────────────────────
 * {
 *   studentId: string,
 *   studentName: string,
 *   fromDate: string,
 *   toDate: string,
 *   reason: string,
 *   latitude: number | null,
 *   longitude: number | null,
 *   timestamp: string,
 *   status: "pending" | "approved" | "rejected" | "completed",
 *   returnStatus: "pending" | "valid_return" | "invalid_return",
 *   returnLatitude: number | null,
 *   returnLongitude: number | null,
 *   returnTimestamp: string | null,
 *   approvedBy: string,
 *   approvedAt: string,
 *   remarks: string,
 *   createdAt: string
 * }
 *
 * ─────────────────────────────────────────────────────────
 * Collection: notifications  (Auto-generated document ID)
 * ─────────────────────────────────────────────────────────
 * {
 *   title: string,
 *   message: string,
 *   type: "announcement" | "alert" | "notice" | "reminder",
 *   targetRole: "all" | "student" | "faculty" | "authority" | "admin",
 *   targetUsers: string[],
 *   sentBy: string,
 *   priority: "low" | "medium" | "high",
 *   isActive: boolean,
 *   createdAt: string
 * }
 */

module.exports = {}; // Schema reference only
