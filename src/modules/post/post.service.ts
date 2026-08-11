import { prisma } from "../../lib/prisma"
import { ICreatePostPayLoad, IUpdatePostPayload } from "./post.interface"

const createPost = async (payLoad: ICreatePostPayLoad, userId: string) => {

    const result = await prisma.post.create({
        data: {
            ...payLoad,
            authorId: userId
        }
    })

    return result

}


const getAllPosts = async () => {
    const posts = await prisma.post.findMany({
        include: {
            author: {
                omit: {
                    password: true
                }
            },
            comments: true
        },

    })

    return posts;
}


const getPostsById = async (postId: string) => {

    // const post = await prisma.post.findUniqueOrThrow({
    //     where : {
    //         id : postId
    //     }
    // })

    // const updatedPost = await prisma.post.update({
    // where : {
    //     id : postId
    // },
    // data : {
    //     views : {
    //         increment : 1
    //     }
    // },
    // include : {
    //     author : {
    //         omit : {
    //             password : true
    //         }
    //     },
    //     comments : true
    // }
    // })

    // return updatedPost

    const transactionResult = await prisma.$transaction(
        async (tx) => {
            await tx.post.update({
                where: {
                    id: postId
                },
                data: {
                    views: {
                        increment: 1
                    }
                }
            })

            const post = await tx.post.findFirstOrThrow({
                where: {
                    id: postId
                },
                include: {
                    author: {
                        omit: {
                            password: true
                        }
                    },
                    comments: true
                }
            });
            return post
        }
    )

    return transactionResult

}

const getMyPost = async (authorId: string) => {
    const result = await prisma.post.findMany({
        where: {
            authorId
        },
        orderBy: {
            createdAt: "desc"
        },
        include: {
            comments: true,
            author: {
                omit: {
                    password: true
                }
            },
            _count: {
                select: {
                    comments: true
                }
            }
        }
    })
    return result;
}

const getPostsStats = async (authorId: string) => {

}


const updatePost = async (postId: string, payload: IUpdatePostPayload, authorId: string, isAdmin: boolean) => {
    const post = await prisma.post.findUniqueOrThrow({
        where: {
            id: postId
        }
    })

    if (!isAdmin && post.authorId !== authorId) {
        throw new Error("You don't have the permission to update this post")
    }

    const result = await prisma.post.update({
        where: {
            id: postId
        },
        data: payload,
        include: {
            author: {
                omit: {
                    password: true
                }
            },
            comments: true
        }
    })

    return result
}

const deletePost = async (postId: string, authorId: string, isAdmin: boolean) => {
    const post = await prisma.post.findFirstOrThrow({
        where: {
            id: postId
        }
    })

    if (!isAdmin && post.authorId !== authorId) {
        throw new Error("You do not have the permission to delete this post")
    }

    const result = await prisma.post.delete({
        where: {
            id: postId
        }
    })

    return null
}


export const postService = {
    createPost,
    getAllPosts,
    getPostsById,
    getPostsStats,
    updatePost,
    deletePost,
    getMyPost
}