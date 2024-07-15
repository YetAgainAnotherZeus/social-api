import {
    Body,
    Controller,
    Get,
    Post,
    Request,
    UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "src/auth/auth.guard";
import { NewPostDto } from "./dto/new-post.dto";
import { PostsService } from "./posts.service";
import { AuthenticatedUser } from "src/auth/dto/authenticated-user.dto";

@Controller("posts")
export class PostsController {
    constructor(private readonly postsService: PostsService) {}

    @Get("latest")
    async getLatest() {
        const latestPosts = await this.postsService.getLatest();

        return latestPosts;
    }

    @UseGuards(AuthGuard)
    @Post("new")
    async postNew(
        @Body() body: NewPostDto,
        @Request() req: Record<string, unknown>,
    ) {
        const user = req.user as AuthenticatedUser;
        const newPost = await this.postsService.newPost(user.sub, body);

        return newPost;
    }
}
