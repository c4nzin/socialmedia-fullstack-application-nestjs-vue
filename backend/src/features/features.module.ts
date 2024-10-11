import { Module } from '@nestjs/common';
import { AccountModule } from './account/account.module';
import { AuthModule } from './auth/auth.module';
import { FollowModule } from './follow/follow.module';
import { MessageModule } from './message/message.module';
import { NotificationModule } from './notification/notification.module';
import { OtpModule } from './otp/otp.module';
import { PostModule } from './posts/post.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    AccountModule,
    AuthModule,
    FollowModule,
    MessageModule,
    NotificationModule,
    OtpModule,
    PostModule,
    UserModule,
    // FriendModule
  ],
})
export class FeaturesModule {}
