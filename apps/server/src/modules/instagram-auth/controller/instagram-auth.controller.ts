import { AuthGuard } from '@guards/auth.guard';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { InstagramAuthDto } from '../dto/instagram-auth.dto';
import { InstagramAuthService } from '../services/instagram-auth.service';

@UseGuards(AuthGuard)
@Controller('instagram')
export class InstagramAuthController {
    constructor(private readonly instagramAuthService: InstagramAuthService) {}

    @Post('login')
    login(@Body() body: InstagramAuthDto) {
        return this.instagramAuthService.login(body);
    }
}
