import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { FRIEND_REQUEST_NOTIFICATION } from '../constants';
import { UserRepository } from 'src/features/user/repositories';
import { BadRequestException, Logger } from '@nestjs/common';

@WebSocketGateway({ origin: '*' })
export class FriendRequestGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  constructor(private readonly userRepository: UserRepository) {}

  @WebSocketServer()
  public readonly server: Server;

  public handleDisconnect(client: Server): void {
    Logger.log(`${client} is disconnected`);
  }

  public async sendFriendRequestNotification(
    userId: string,
    message: string,
  ): Promise<boolean> {
    return this.server.to(userId).emit(FRIEND_REQUEST_NOTIFICATION, message);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public afterInit(server: Server): void {
    Logger.log('Websocket gateway initialized.');
  }

  public async handleConnection(client: Socket): Promise<void> {
    try {
      const userId = client.handshake.query['userId'] as string;

      if (!userId) {
        Logger.error('User id is not provided in handshake');
        client.disconnect();
        return;
      }

      const user = await this.userRepository.findById(userId);

      if (!user) {
        Logger.log('No user found');
        client.disconnect();
        return;
      }

      client.join(userId);
      Logger.log('User connected');
    } catch (error) {
      client.disconnect();
      throw new BadRequestException(error);
    }
  }
}
