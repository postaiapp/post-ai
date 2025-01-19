import { DatabaseModule } from '@database/database.module';
import { TokenValidationService } from '@modules/instagram-auth/services/token-validation.service';
import { Module } from '@nestjs/common';
import { User, UserSchema } from '@schemas/user.schema';
import { IgApiClient } from 'instagram-private-api';
import { PostController } from './controller/post.controller';
import { PostService } from './services/post.service';

@Module({
    imports: [DatabaseModule.forFeature([{ name: User.name, schema: UserSchema }])],
    controllers: [PostController],
    providers: [PostService, IgApiClient, TokenValidationService],
})
export class PostModule {}
