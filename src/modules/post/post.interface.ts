import { PostStatus } from "../../../generated/prisma/enums";

export interface ICreatePostPayLoad{
    title : string,
    content : string,
    thumbnail ?: string,
    isFeatured ?: boolean,
    status ?: PostStatus,
    tags : string[]
}

export interface IUpdatePostPayload{
    title ?: string,
    content ?: string,
    thumbnail ?: string,
    isFeatured ?: boolean,
    status ?: PostStatus,
    tags ?: string[]
}