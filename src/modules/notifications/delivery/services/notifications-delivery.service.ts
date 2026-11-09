import { Injectable } from "@nestjs/common";
import { SocketGateway } from "../../../../infra/socket/socket.gateway";
import type { NewNotification } from "../../inbox/services/notifications-internal.service";

/** Livraison temps réel (Socket.IO). Point d'intégration pour un futur canal push. */
@Injectable()
export class NotificationsDeliveryService {
  constructor(private readonly socketGateway: SocketGateway) {}

  dispatch(userIds: number[], notification: NewNotification): void {
    this.socketGateway.emitNotificationToUsers(userIds, notification);
  }
}
