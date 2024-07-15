import {
    Body,
    Controller,
    Get,
    NotFoundException,
    Param,
    Post,
    Query,
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

    @Get()
    async getAll(
        @Query("page") page: string = "1",
        @Query("perPage") perPage: string = "10",
    ) {
        const newPage = Math.max(parseInt(page), 1);
        const newPerPage = Math.max(Math.min(parseInt(perPage), 50), 1);
        const posts = await this.postsService.getAll(newPage, newPerPage);

        return {
            pageInfo: {
                page: newPage,
                perPage: newPerPage,
            },
            posts,
        };
    }

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

    @Get(":id")
    async getOne(@Param() params: any) {
        const id = parseInt(params.id);

        if (isNaN(id)) {
            throw new NotFoundException();
        }

        const post = await this.postsService.getById(id);

        if (!post) {
            throw new NotFoundException();
        }

        return post;
    }

    @UseGuards(AuthGuard)
    @Post(":id/delete")
    async deletePost(
        @Param() params: any,
        @Request() req: Record<string, any>,
    ) {
        const userId: number = req.user.id;

        const id = parseInt(params.id);

        if (isNaN(id)) {
            throw new NotFoundException();
        }

        await this.postsService.deletePost(id, userId);

        return null;
    }
}
