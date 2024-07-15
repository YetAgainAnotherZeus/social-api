import { Injectable } from "@nestjs/common";
import { Post } from "./post.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { NewPostDto } from "./dto/new-post.dto";
import { User } from "src/users/user.entity";

@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
        @InjectRepository(Post)
        private readonly postsRepository: Repository<Post>,
    ) {}

    async getLatest() {
        const posts = await this.postsRepository.find({
            order: { createdAt: "DESC" },
            take: 10,
            relations: {
                author: true,
            },
            select: {
                id: true,
                content: true,
                createdAt: true,
                updatedAt: true,
                author: {
                    id: true,
                    name: true,
                },
            },
        });

        return posts;
    }

    async newPost(userId: number, postDto: NewPostDto) {
        const user = await this.usersRepository.findOne({
            where: { id: userId },
            select: {
                id: true,
                name: true,
            },
        });

        if (!user) {
            return null;
        }

        const post = new Post();
        post.author = user;
        post.content = postDto.content;

        return await this.postsRepository.save(post);
    }
}
