import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MembersModule } from './members/members.module';
import { DonationsModule } from './donations/donations.module';
import { LivestreamsModule } from './livestreams/livestreams.module';
import { PaymentsModule } from './payments/payments.module';
import { EventsModule } from './events/events.module';
import { SermonsModule } from './sermons/sermons.module';
import { ArticlesModule } from './articles/articles.module';
import { PodcastsModule } from './podcasts/podcasts.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    MembersModule,
    DonationsModule,
    LivestreamsModule,
    PaymentsModule,
    EventsModule,
    SermonsModule,
    ArticlesModule,
    PodcastsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
