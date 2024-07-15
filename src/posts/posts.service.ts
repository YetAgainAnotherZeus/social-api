import { Injectable } from "@nestjs/common";
import { Post } from "./post.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { NewPostDto } from "./dto/new-post.dto";
import { User } from "src/users/user.entity";

const POST_SELECT_FILTER = {
    id: true,
    content: true,
    createdAt: true,
    updatedAt: true,
    author: {
        id: true,
        name: true,
    },
};

@Injectable()
export class PostsService {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
        @InjectRepository(Post)
        private readonly postsRepository: Repository<Post>,
    ) {}

    async getAll(page: number = 1, perPage: number = 10) {
        return await this.postsRepository.find({
            skip: (page - 1) * perPage,
            take: perPage,
            relations: {
                author: true,
            },
            select: POST_SELECT_FILTER,
        });
    }

    async getLatest() {
        const posts = await this.postsRepository.find({
            order: { createdAt: "DESC" },
            take: 10,
            relations: {
                author: true,
            },
            select: POST_SELECT_FILTER,
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

    async getById(id: number) {
        return await this.postsRepository.findOne({
            where: { id },
            relations: {
                author: true,
            },
            select: POST_SELECT_FILTER,
        });
    }
}
