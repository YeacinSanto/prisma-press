import { prisma } from "../../lib/prisma"
import { ICreateCommentPayLoad, IModerateCommentPayLoad, IUpdateCommentPayLoad } from "./comment.interface"


const createComment = async(authorId:string,payLoad:ICreateCommentPayLoad) =>{
    await prisma.post.findFirstOrThrow({
        where :{
            id : payLoad.postId
        }
    })
    const comment = await prisma.comment.create({
        data : {
            ...payLoad,
            authorId
        }
    })
    return comment
}
const getCommentByAuthorId = async(authorId:string) =>{
    const comment = await prisma.comment.findMany({
        where : {
            authorId
        },
        orderBy : {createdAt: "desc"},
        include : {
            post : {
                select : {
                    id : true,
                    title : true
                }
            }
        }
    })
    return comment
}
const getCommentByCommentId = async(commentId:string) =>{
    const comment = await prisma.comment.findUnique({
        where : {
            id : commentId,
        },
        include : {
            post : {
                select : {
                    id : true,
                    title : true,
                    views : true
                }
            }
        }
    })
    return comment
}
const updateComment = async(commentId:string, authorId: string, data: IUpdateCommentPayLoad) =>{
    const commentData = await prisma.comment.findUniqueOrThrow({
        where : {
            id : commentId,
            authorId
        },
        select : {
            id : true
        }
    })
    const comment = await prisma.comment.update({
        where : {
            id : commentId,
            authorId
        },
        data
    })
    return comment
}
const deleteComment = async(commentId:string, authorId:string) =>{
    const commentData = await prisma.comment.findFirstOrThrow({
        where : {
            id : commentId,
            authorId
        },
        select : {
            id : true
        }
    })
    const comment = await prisma.comment.delete({
        where : {
            id : commentData.id
        }
    })
    return null
    
}
const moderateComment = async(id:string,data:IModerateCommentPayLoad) =>{
    const commentData = await prisma.comment.findUniqueOrThrow({
        where : {
            id
        },
        select : {
            id : true,
            status : true
        }
    })

    if(commentData.status=== data.status){
        throw new Error(`Your provided status ${data.status} is already up to date`)
    }

    const comment = await prisma.comment.update({
        where : {
            id
        },
        data
    })
    return comment
}


export const commentService = {
    createComment,
    getCommentByAuthorId,
    getCommentByCommentId,
    updateComment,
    deleteComment,
    moderateComment
}