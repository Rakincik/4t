(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/Desktop/4t-akademi-yeni/src/app/admin/kurslar/data:bceb20 [app-client] (ecmascript) <text/javascript>", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"4053bf9bcf2ca0bf5328eb402444830862d9ee789c":"deleteCourse"},"Desktop/4t-akademi-yeni/src/app/admin/kurslar/actions.ts",""] */ __turbopack_context__.s([
    "deleteCourse",
    ()=>deleteCourse
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/4t-akademi-yeni/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-client] (ecmascript)");
"use turbopack no side effects";
;
var deleteCourse = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createServerReference"])("4053bf9bcf2ca0bf5328eb402444830862d9ee789c", __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findSourceMapURL"], "deleteCourse"); //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vYWN0aW9ucy50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzZXJ2ZXJcIjtcblxuaW1wb3J0IHsgcHJpc21hIH0gZnJvbSBcIkAvbGliL3ByaXNtYVwiO1xuaW1wb3J0IHsgcmV2YWxpZGF0ZVBhdGggfSBmcm9tIFwibmV4dC9jYWNoZVwiO1xuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gQ291cnNlIENSVURcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0Q291cnNlcygpIHtcbiAgICByZXR1cm4gcHJpc21hLmNvdXJzZS5maW5kTWFueSh7XG4gICAgICAgIGluY2x1ZGU6IHsgdmFyaWFudHM6IHsgb3JkZXJCeTogeyBvcmRlcjogJ2FzYyd9IH0sIGFkZG9uczogeyBvcmRlckJ5OiB7IG9yZGVyOiAnYXNjJ30gfSB9LFxuICAgICAgICBvcmRlckJ5OiB7IGNyZWF0ZWRBdDogXCJkZXNjXCIgfSxcbiAgICB9KTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldENvdXJzZShpZDogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHByaXNtYS5jb3Vyc2UuZmluZFVuaXF1ZSh7XG4gICAgICAgIHdoZXJlOiB7IGlkIH0sXG4gICAgICAgIGluY2x1ZGU6IHsgdmFyaWFudHM6IHsgb3JkZXJCeTogeyBvcmRlcjogJ2FzYyd9IH0sIGFkZG9uczogeyBvcmRlckJ5OiB7IG9yZGVyOiAnYXNjJ30gfSwgY291cG9uczogeyBvcmRlckJ5OiB7IGNyZWF0ZWRBdDogJ2Rlc2MnIH0gfSB9LFxuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBwYXJzZUZvcm1EYXRhKGZvcm1EYXRhOiBGb3JtRGF0YSkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHRpdGxlOiBmb3JtRGF0YS5nZXQoXCJ0aXRsZVwiKSBhcyBzdHJpbmcsXG4gICAgICAgIHNsdWc6IGZvcm1EYXRhLmdldChcInNsdWdcIikgYXMgc3RyaW5nLFxuICAgICAgICBzdWJ0aXRsZTogZm9ybURhdGEuZ2V0KFwic3VidGl0bGVcIikgYXMgc3RyaW5nIHx8IG51bGwsXG4gICAgICAgIGRlc2NyaXB0aW9uOiBmb3JtRGF0YS5nZXQoXCJkZXNjcmlwdGlvblwiKSBhcyBzdHJpbmcgfHwgbnVsbCxcbiAgICAgICAgcHJpY2U6IHBhcnNlRmxvYXQoZm9ybURhdGEuZ2V0KFwicHJpY2VcIikgYXMgc3RyaW5nKSB8fCAwLFxuICAgICAgICBvbGRQcmljZTogZm9ybURhdGEuZ2V0KFwib2xkUHJpY2VcIikgPyBwYXJzZUZsb2F0KGZvcm1EYXRhLmdldChcIm9sZFByaWNlXCIpIGFzIHN0cmluZykgOiBudWxsLFxuICAgICAgICBpbWFnZVVybDogZm9ybURhdGEuZ2V0KFwiaW1hZ2VVcmxcIikgYXMgc3RyaW5nIHx8IG51bGwsXG4gICAgICAgIHZpZGVvVXJsOiBmb3JtRGF0YS5nZXQoXCJ2aWRlb1VybFwiKSBhcyBzdHJpbmcgfHwgbnVsbCxcbiAgICAgICAgY2F0ZWdvcnk6IGZvcm1EYXRhLmdldChcImNhdGVnb3J5XCIpIGFzIHN0cmluZyB8fCBudWxsLFxuICAgICAgICB0eXBlOiAoZm9ybURhdGEuZ2V0KFwidHlwZVwiKSBhcyBzdHJpbmcgfHwgXCJLVVJTXCIpIGFzIGFueSxcbiAgICAgICAgaXNBY3RpdmU6IGZvcm1EYXRhLmdldChcImlzQWN0aXZlXCIpID09PSBcInRydWVcIixcbiAgICAgICAgaG91cnM6IGZvcm1EYXRhLmdldChcImhvdXJzXCIpIGFzIHN0cmluZyB8fCBudWxsLFxuICAgICAgICBxdWVzdGlvbnM6IGZvcm1EYXRhLmdldChcInF1ZXN0aW9uc1wiKSBhcyBzdHJpbmcgfHwgbnVsbCxcbiAgICAgICAgYm9va1ByaWNlOiBmb3JtRGF0YS5nZXQoXCJib29rUHJpY2VcIikgPyBwYXJzZUZsb2F0KGZvcm1EYXRhLmdldChcImJvb2tQcmljZVwiKSBhcyBzdHJpbmcpIDogbnVsbCxcbiAgICAgICAgYmFkZ2U6IGZvcm1EYXRhLmdldChcImJhZGdlXCIpIGFzIHN0cmluZyB8fCBudWxsLFxuICAgICAgICBkdXJhdGlvbjogZm9ybURhdGEuZ2V0KFwiZHVyYXRpb25cIikgYXMgc3RyaW5nIHx8IG51bGwsXG4gICAgICAgIHN0dWRlbnRDb3VudDogZm9ybURhdGEuZ2V0KFwic3R1ZGVudENvdW50XCIpIGFzIHN0cmluZyB8fCBudWxsLFxuICAgICAgICByZXNvdXJjZXM6IGZvcm1EYXRhLmdldChcInJlc291cmNlc1wiKSBhcyBzdHJpbmcgfHwgbnVsbCxcbiAgICAgICAgZmVhdHVyZXM6IGZvcm1EYXRhLmdldChcImZlYXR1cmVzXCIpID8gSlNPTi5wYXJzZShmb3JtRGF0YS5nZXQoXCJmZWF0dXJlc1wiKSBhcyBzdHJpbmcpIDogbnVsbCxcbiAgICAgICAgbGVhcm5pbmdPdXRjb21lczogZm9ybURhdGEuZ2V0KFwibGVhcm5pbmdPdXRjb21lc1wiKSA/IEpTT04ucGFyc2UoZm9ybURhdGEuZ2V0KFwibGVhcm5pbmdPdXRjb21lc1wiKSBhcyBzdHJpbmcpIDogbnVsbCxcbiAgICAgICAgY3VycmljdWx1bTogZm9ybURhdGEuZ2V0KFwiY3VycmljdWx1bVwiKSA/IEpTT04ucGFyc2UoZm9ybURhdGEuZ2V0KFwiY3VycmljdWx1bVwiKSBhcyBzdHJpbmcpIDogbnVsbCxcbiAgICAgICAgaW5zdHJ1Y3RvcjogZm9ybURhdGEuZ2V0KFwiaW5zdHJ1Y3RvclwiKSA/IEpTT04ucGFyc2UoZm9ybURhdGEuZ2V0KFwiaW5zdHJ1Y3RvclwiKSBhcyBzdHJpbmcpIDogbnVsbCxcbiAgICAgICAgZXBpc29kZXM6IGZvcm1EYXRhLmdldChcImVwaXNvZGVzXCIpID8gSlNPTi5wYXJzZShmb3JtRGF0YS5nZXQoXCJlcGlzb2Rlc1wiKSBhcyBzdHJpbmcpIDogbnVsbCxcbiAgICAgICAgY2FzdDogZm9ybURhdGEuZ2V0KFwiY2FzdFwiKSA/IEpTT04ucGFyc2UoZm9ybURhdGEuZ2V0KFwiY2FzdFwiKSBhcyBzdHJpbmcpIDogbnVsbCxcbiAgICAgICAgdGFnczogZm9ybURhdGEuZ2V0KFwidGFnc1wiKSA/IEpTT04ucGFyc2UoZm9ybURhdGEuZ2V0KFwidGFnc1wiKSBhcyBzdHJpbmcpIDogbnVsbCxcbiAgICAgICAgYWNjZXNzRW5kRGF0ZTogZm9ybURhdGEuZ2V0KFwiYWNjZXNzRW5kRGF0ZVwiKSA/IG5ldyBEYXRlKGZvcm1EYXRhLmdldChcImFjY2Vzc0VuZERhdGVcIikgYXMgc3RyaW5nKSA6IG51bGwsXG4gICAgICAgIGFjY2Vzc0R1cmF0aW9uRGF5czogZm9ybURhdGEuZ2V0KFwiYWNjZXNzRHVyYXRpb25EYXlzXCIpID8gcGFyc2VJbnQoZm9ybURhdGEuZ2V0KFwiYWNjZXNzRHVyYXRpb25EYXlzXCIpIGFzIHN0cmluZykgOiBudWxsLFxuICAgIH07XG59XG5cbmZ1bmN0aW9uIHBhcnNlUmVsYXRpb25zKGZvcm1EYXRhOiBGb3JtRGF0YSkge1xuICAgIGNvbnN0IHZhcmlhbnRzTGlzdCA9IGZvcm1EYXRhLmdldChcInZhcmlhbnRzXCIpID8gSlNPTi5wYXJzZShmb3JtRGF0YS5nZXQoXCJ2YXJpYW50c1wiKSBhcyBzdHJpbmcpIDogW107XG4gICAgY29uc3QgYWRkb25zTGlzdCA9IGZvcm1EYXRhLmdldChcImFkZG9uc1wiKSA/IEpTT04ucGFyc2UoZm9ybURhdGEuZ2V0KFwiYWRkb25zXCIpIGFzIHN0cmluZykgOiBbXTtcbiAgICBjb25zdCBjb3Vwb25zTGlzdCA9IGZvcm1EYXRhLmdldChcImNvdXBvbnNcIikgPyBKU09OLnBhcnNlKGZvcm1EYXRhLmdldChcImNvdXBvbnNcIikgYXMgc3RyaW5nKSA6IFtdO1xuICAgIHJldHVybiB7XG4gICAgICAgIHZhcmlhbnRzOiB2YXJpYW50c0xpc3QubWFwKCh2OiBhbnksIGk6IG51bWJlcikgPT4gKHsgdGl0bGU6IHYudGl0bGUsIHByaWNlOiBOdW1iZXIodi5wcmljZSksIG9sZFByaWNlOiB2Lm9sZFByaWNlID8gTnVtYmVyKHYub2xkUHJpY2UpIDogbnVsbCwgb3JkZXI6IGkgfSkpLFxuICAgICAgICBhZGRvbnM6IGFkZG9uc0xpc3QubWFwKChhOiBhbnksIGk6IG51bWJlcikgPT4gKHsgdGl0bGU6IGEudGl0bGUsIHByaWNlOiBOdW1iZXIoYS5wcmljZSksIG9yZGVyOiBpIH0pKSxcbiAgICAgICAgY291cG9uczogY291cG9uc0xpc3QubWFwKChjOiBhbnkpID0+ICh7XG4gICAgICAgICAgICBpZDogYy5pZCB8fCB1bmRlZmluZWQsXG4gICAgICAgICAgICBjb2RlOiBjLmNvZGUsIHR5cGU6IGMudHlwZSwgYW1vdW50OiBOdW1iZXIoYy5hbW91bnQpLFxuICAgICAgICAgICAgbWF4VXNlczogYy5tYXhVc2VzID8gTnVtYmVyKGMubWF4VXNlcykgOiBudWxsLFxuICAgICAgICAgICAgZXhwaXJlc0F0OiBjLmV4cGlyZXNBdCA/IG5ldyBEYXRlKGMuZXhwaXJlc0F0KSA6IG51bGwsXG4gICAgICAgICAgICBpc0FjdGl2ZTogYy5pc0FjdGl2ZSA/PyB0cnVlLFxuICAgICAgICB9KSlcbiAgICB9O1xufVxuXG5mdW5jdGlvbiByZXZhbGlkYXRlQWxsKHNsdWc/OiBzdHJpbmcpIHtcbiAgICByZXZhbGlkYXRlUGF0aChcIi9hZG1pbi9rdXJzbGFyXCIpO1xuICAgIHJldmFsaWRhdGVQYXRoKFwiL2t1cnNsYXJcIik7XG4gICAgcmV2YWxpZGF0ZVBhdGgoXCIvZmxpeFwiKTtcbiAgICByZXZhbGlkYXRlUGF0aChcIi9rYW1wbGFyXCIpO1xuICAgIGlmIChzbHVnKSByZXZhbGlkYXRlUGF0aChgL2t1cnMvJHtzbHVnfWApO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY3JlYXRlQ291cnNlKGZvcm1EYXRhOiBGb3JtRGF0YSkge1xuICAgIGNvbnN0IGRhdGEgPSBwYXJzZUZvcm1EYXRhKGZvcm1EYXRhKTtcbiAgICBjb25zdCByZWxzID0gcGFyc2VSZWxhdGlvbnMoZm9ybURhdGEpO1xuICAgIGNvbnN0IGNvdXJzZSA9IGF3YWl0IHByaXNtYS5jb3Vyc2UuY3JlYXRlKHsgXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIC4uLmRhdGEsXG4gICAgICAgICAgICB2YXJpYW50czogeyBjcmVhdGU6IHJlbHMudmFyaWFudHMgfSxcbiAgICAgICAgICAgIGFkZG9uczogeyBjcmVhdGU6IHJlbHMuYWRkb25zIH1cbiAgICAgICAgfSBcbiAgICB9KTtcbiAgICAvLyBDcmVhdGUgY291cG9ucyBsaW5rZWQgdG8gdGhpcyBjb3Vyc2VcbiAgICBpZiAocmVscy5jb3Vwb25zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgZm9yIChjb25zdCBjIG9mIHJlbHMuY291cG9ucykge1xuICAgICAgICAgICAgYXdhaXQgcHJpc21hLmNvdXBvbi5jcmVhdGUoeyBkYXRhOiB7IGNvZGU6IGMuY29kZSwgdHlwZTogYy50eXBlLCBhbW91bnQ6IGMuYW1vdW50LCBtYXhVc2VzOiBjLm1heFVzZXMsIGV4cGlyZXNBdDogYy5leHBpcmVzQXQsIGlzQWN0aXZlOiBjLmlzQWN0aXZlLCBjb3Vyc2VJZDogY291cnNlLmlkIH0gfSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV2YWxpZGF0ZUFsbCgpO1xuICAgIHJldHVybiB7IHN1Y2Nlc3M6IHRydWUsIGlkOiBjb3Vyc2UuaWQgfTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVwZGF0ZUNvdXJzZShpZDogc3RyaW5nLCBmb3JtRGF0YTogRm9ybURhdGEpIHtcbiAgICBjb25zdCBkYXRhID0gcGFyc2VGb3JtRGF0YShmb3JtRGF0YSk7XG4gICAgY29uc3QgcmVscyA9IHBhcnNlUmVsYXRpb25zKGZvcm1EYXRhKTtcbiAgICBcbiAgICAvLyBQZXJmb3JtIGlubGluZSBkZWxldGUtYW5kLWNyZWF0ZSBmb3IgcmVsYXRpb25zXG4gICAgYXdhaXQgcHJpc21hLmNvdXJzZVZhcmlhbnQuZGVsZXRlTWFueSh7IHdoZXJlOiB7IGNvdXJzZUlkOiBpZCB9IH0pO1xuICAgIGF3YWl0IHByaXNtYS5jb3Vyc2VBZGRvbi5kZWxldGVNYW55KHsgd2hlcmU6IHsgY291cnNlSWQ6IGlkIH0gfSk7XG4gICAgXG4gICAgYXdhaXQgcHJpc21hLmNvdXJzZS51cGRhdGUoeyBcbiAgICAgICAgd2hlcmU6IHsgaWQgfSwgXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIC4uLmRhdGEsXG4gICAgICAgICAgICB2YXJpYW50czogeyBjcmVhdGU6IHJlbHMudmFyaWFudHMgfSxcbiAgICAgICAgICAgIGFkZG9uczogeyBjcmVhdGU6IHJlbHMuYWRkb25zIH1cbiAgICAgICAgfSBcbiAgICB9KTtcbiAgICAvLyBTeW5jIGNvdXBvbnM6IHVwc2VydCBleGlzdGluZywgY3JlYXRlIG5ldywgZGVsZXRlIHJlbW92ZWRcbiAgICBjb25zdCBleGlzdGluZ0NvdXBvbnMgPSBhd2FpdCBwcmlzbWEuY291cG9uLmZpbmRNYW55KHsgd2hlcmU6IHsgY291cnNlSWQ6IGlkIH0gfSk7XG4gICAgY29uc3Qgc3VibWl0dGVkSWRzID0gcmVscy5jb3Vwb25zLmZpbHRlcigoYzogYW55KSA9PiBjLmlkKS5tYXAoKGM6IGFueSkgPT4gYy5pZCk7XG4gICAgLy8gRGVsZXRlIHJlbW92ZWQgY291cG9uc1xuICAgIGNvbnN0IHRvRGVsZXRlID0gZXhpc3RpbmdDb3Vwb25zLmZpbHRlcihlYyA9PiAhc3VibWl0dGVkSWRzLmluY2x1ZGVzKGVjLmlkKSk7XG4gICAgZm9yIChjb25zdCBkIG9mIHRvRGVsZXRlKSB7IGF3YWl0IHByaXNtYS5jb3Vwb24uZGVsZXRlKHsgd2hlcmU6IHsgaWQ6IGQuaWQgfSB9KTsgfVxuICAgIC8vIFVwc2VydCBjb3Vwb25zXG4gICAgZm9yIChjb25zdCBjIG9mIHJlbHMuY291cG9ucykge1xuICAgICAgICBpZiAoYy5pZCkge1xuICAgICAgICAgICAgYXdhaXQgcHJpc21hLmNvdXBvbi51cGRhdGUoeyB3aGVyZTogeyBpZDogYy5pZCB9LCBkYXRhOiB7IGNvZGU6IGMuY29kZSwgdHlwZTogYy50eXBlLCBhbW91bnQ6IGMuYW1vdW50LCBtYXhVc2VzOiBjLm1heFVzZXMsIGV4cGlyZXNBdDogYy5leHBpcmVzQXQsIGlzQWN0aXZlOiBjLmlzQWN0aXZlIH0gfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhd2FpdCBwcmlzbWEuY291cG9uLmNyZWF0ZSh7IGRhdGE6IHsgY29kZTogYy5jb2RlLCB0eXBlOiBjLnR5cGUsIGFtb3VudDogYy5hbW91bnQsIG1heFVzZXM6IGMubWF4VXNlcywgZXhwaXJlc0F0OiBjLmV4cGlyZXNBdCwgaXNBY3RpdmU6IGMuaXNBY3RpdmUsIGNvdXJzZUlkOiBpZCB9IH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldmFsaWRhdGVBbGwoZGF0YS5zbHVnKTtcbiAgICByZXR1cm4geyBzdWNjZXNzOiB0cnVlIH07XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBkZWxldGVDb3Vyc2UoaWQ6IHN0cmluZykge1xuICAgIGF3YWl0IHByaXNtYS5jb3Vyc2UuZGVsZXRlKHsgd2hlcmU6IHsgaWQgfSB9KTtcbiAgICByZXZhbGlkYXRlQWxsKCk7XG4gICAgcmV0dXJuIHsgc3VjY2VzczogdHJ1ZSB9O1xufVxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI4VEFxSXNCIn0=
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/4t-akademi-yeni/src/app/admin/kurslar/DeleteCourseButton.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DeleteCourseButton
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/4t-akademi-yeni/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/4t-akademi-yeni/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$TrashIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrashIcon$3e$__ = __turbopack_context__.i("[project]/Desktop/4t-akademi-yeni/node_modules/@heroicons/react/24/outline/esm/TrashIcon.js [app-client] (ecmascript) <export default as TrashIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$src$2f$app$2f$admin$2f$kurslar$2f$data$3a$bceb20__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/Desktop/4t-akademi-yeni/src/app/admin/kurslar/data:bceb20 [app-client] (ecmascript) <text/javascript>");
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/4t-akademi-yeni/node_modules/next/navigation.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
function DeleteCourseButton({ id, title }) {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [deleting, setDeleting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    async function handleDelete() {
        if (!confirm(`"${title}" kursunu silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`)) {
            return;
        }
        setDeleting(true);
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$src$2f$app$2f$admin$2f$kurslar$2f$data$3a$bceb20__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["deleteCourse"])(id);
            router.refresh();
        } catch (error) {
            alert("Silme işlemi başarısız oldu.");
        } finally{
            setDeleting(false);
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        onClick: handleDelete,
        disabled: deleting,
        className: "p-2 text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition disabled:opacity-50",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$TrashIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__TrashIcon$3e$__["TrashIcon"], {
            className: "h-4 w-4"
        }, void 0, false, {
            fileName: "[project]/Desktop/4t-akademi-yeni/src/app/admin/kurslar/DeleteCourseButton.tsx",
            lineNumber: 39,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/Desktop/4t-akademi-yeni/src/app/admin/kurslar/DeleteCourseButton.tsx",
        lineNumber: 34,
        columnNumber: 9
    }, this);
}
_s(DeleteCourseButton, "klZmafgE6CAXwWp2POxZcv9A3fk=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = DeleteCourseButton;
var _c;
__turbopack_context__.k.register(_c, "DeleteCourseButton");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Desktop/4t-akademi-yeni/node_modules/@heroicons/react/24/outline/esm/TrashIcon.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/4t-akademi-yeni/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
function TrashIcon({ title, titleId, ...props }, svgRef) {
    return /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"]("svg", Object.assign({
        xmlns: "http://www.w3.org/2000/svg",
        fill: "none",
        viewBox: "0 0 24 24",
        strokeWidth: 1.5,
        stroke: "currentColor",
        "aria-hidden": "true",
        "data-slot": "icon",
        ref: svgRef,
        "aria-labelledby": titleId
    }, props), title ? /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"]("title", {
        id: titleId
    }, title) : null, /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"]("path", {
        strokeLinecap: "round",
        strokeLinejoin: "round",
        d: "m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
    }));
}
const ForwardRef = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"](TrashIcon);
const __TURBOPACK__default__export__ = ForwardRef;
}),
"[project]/Desktop/4t-akademi-yeni/node_modules/@heroicons/react/24/outline/esm/TrashIcon.js [app-client] (ecmascript) <export default as TrashIcon>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TrashIcon",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$TrashIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Desktop$2f$4t$2d$akademi$2d$yeni$2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$TrashIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Desktop/4t-akademi-yeni/node_modules/@heroicons/react/24/outline/esm/TrashIcon.js [app-client] (ecmascript)");
}),
"[project]/Desktop/4t-akademi-yeni/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// This file must be bundled in the app's client layer, it shouldn't be directly
// imported by the server.
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    callServer: null,
    createServerReference: null,
    findSourceMapURL: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    callServer: function() {
        return _appcallserver.callServer;
    },
    createServerReference: function() {
        return _client.createServerReference;
    },
    findSourceMapURL: function() {
        return _appfindsourcemapurl.findSourceMapURL;
    }
});
const _appcallserver = __turbopack_context__.r("[project]/Desktop/4t-akademi-yeni/node_modules/next/dist/client/app-call-server.js [app-client] (ecmascript)");
const _appfindsourcemapurl = __turbopack_context__.r("[project]/Desktop/4t-akademi-yeni/node_modules/next/dist/client/app-find-source-map-url.js [app-client] (ecmascript)");
const _client = __turbopack_context__.r("[project]/Desktop/4t-akademi-yeni/node_modules/next/dist/compiled/react-server-dom-turbopack/client.js [app-client] (ecmascript)"); //# sourceMappingURL=action-client-wrapper.js.map
}),
]);

//# sourceMappingURL=Desktop_4t-akademi-yeni_56526e48._.js.map