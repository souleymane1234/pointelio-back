"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildNotificationsUserRoom = exports.NOTIFICATIONS_SOCKET_EVENT_NEW = void 0;
exports.NOTIFICATIONS_SOCKET_EVENT_NEW = "notifications.new";
const buildNotificationsUserRoom = (userId) => `user:${userId}`;
exports.buildNotificationsUserRoom = buildNotificationsUserRoom;
//# sourceMappingURL=notifications-realtime.constants.js.map