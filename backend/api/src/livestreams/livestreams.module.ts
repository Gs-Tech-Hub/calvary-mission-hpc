import { Module } from '@nestjs/common';
import { LivestreamsService } from './livestreams.service';
import { LivestreamsController } from './livestreams.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [LivestreamsController],
  providers: [LivestreamsService],
  exports: [LivestreamsService],
})
export class LivestreamsModule {}
