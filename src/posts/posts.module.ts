import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PostsController } from "./posts.controller";
import { PostsService } from "./posts.service";
import { Post } from "./post.entity";
import { User } from "src/users/user.entity";

@Module({
    imports: [TypeOrmModule.forFeature([User, Post])],
    controllers: [PostsController],
    providers: [PostsService],
})
export class PostsModule {}
