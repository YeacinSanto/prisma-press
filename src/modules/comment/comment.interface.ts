
import { CommentStatus } from "../../../generated/prisma/enums";

export interface ICreateCommentPayLoad{
    postId : string,
    content : string
}

export interface IUpdateCommentPayLoad{
    content ?: string,
    status ?: CommentStatus
}

export interface IModerateCommentPayLoad{
    status : CommentStatus
}