import { CommentStatus, PostStatus } from "../../../generated/prisma/enums"
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


        // searching or partial match
        // where : {
        //     title : {
        //         contains : "Ronaldo",
        //         mode : "insensitive"
        //     },
        //     content : {
        //         contains : "Ronaldo",
        //     }
        // },

        // where : {
        //     OR : [
        //         {
        //             title : {
        //                 contains : "Ronaldo",
        //                 mode : "insensitive"
        //             }
        //         },
        //         {
        //             content : {
        //                 contains : "Ronaldo"
        //             }
        //         }
        //     ]
        // },

        // where : {
        //     title : "My Fourth Post"
        // },

        // combining search(OR) and filter(AND)

        // where : {
        //     // filtering
        //     AND : [
        //         {
        //             OR : [
        //                 {
        //                     title : {
        //                         contains : "Ron",
        //                         mode : "insensitive"
        //                     },
        //                     content : {
        //                         contains : "Ron",
        //                         mode : "insensitive"
        //                     }
        //                 }
        //             ]
        //         },
        //         {
        //             title : "Ronaldo"
        //         },
        //         {
        //             content : "Ronaldo"
        //         }
        //     ]
        // },

        // take = how many data we want to show in page,
        // skip = how many data we want to skip
        // like if I have 9 data in one page and I want to go page 3 so have to skip 18 data
        // skip = (page-1) * limit

        take : 1,
        skip : 1,
        // sorting in asending or desending order
        orderBy : {
            createdAt : "desc"
        },

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

const getPostsStats = async () => {
    const transactionResult = await prisma.$transaction(
        async(tx)=>{
            // const totalPosts = await tx.post.count();

            // const totalPublishedPosts = await tx.post.count({
            //     where : {
            //         status : PostStatus.PUBLISHED
            //     }
            // })
            // const totalDraftPosts = await tx.post.count({
            //     where : {
            //         status : PostStatus.DRAFT
            //     }
            // })
            // const totalArchivedPosts = await tx.post.count({
            //     where : {
            //         status : PostStatus.ARCHIVE
            //     }
            // })
            // const totalComments = await tx.comment.count()

            // const totalApprovedComments = await tx.comment.count({
            //     where : {
            //         status : CommentStatus.APPROVED
            //     }
            // })
            // const totalRejectedComments = await tx.comment.count({
            //     where : {
            //         status : CommentStatus.REJECT
            //     }
            // })

            // // const allPosts  = await tx.post.findMany();

            // // let totalPostViews = 0;
            // // allPosts.forEach((post)=>{
            // //     totalPostViews = totalPostViews + post.views
            // // })

            // const totalPostViewsAggregate = await tx.post.aggregate({
            //     _sum : {
            //         views : true
            //     }
            // })

            // const totalPostViews = totalPostViewsAggregate._sum.views

            // return {
            //     totalPosts,
            //     totalPublishedPosts,
            //     totalDraftPosts,
            //     totalArchivedPosts,
            //     totalComments,
            //     totalApprovedComments,
            //     totalRejectedComments,
            //     totalPostViews
            // }

            const [
                totalPosts,
                totalPublishedPosts,
                totalDraftPosts,
                totalArchivedPosts,
                totalComments,
                totalApprovedComments,
                totalRejectedComments,
                totalPostViewsAggregate
            ] = await Promise.all([
                await tx.post.count(),
                await tx.post.count({
                where : {
                    status : PostStatus.PUBLISHED
                    }
                }),
                await tx.post.count({
                where : {
                    status : PostStatus.DRAFT
                    }
                }),
                await tx.post.count({
                where : {
                    status : PostStatus.ARCHIVE
                    }
                }),
                await tx.comment.count(),
                await tx.comment.count({
                where : {
                    status : CommentStatus.APPROVED
                    }
                }),
                await tx.comment.count({
                where : {
                    status : CommentStatus.REJECT
                    }
                }),
                await tx.post.aggregate({
                _sum : {
                    views : true
                }
            })


            ])

            return {
                totalPosts,
                totalPublishedPosts,
                totalDraftPosts,
                totalArchivedPosts,
                totalComments,
                totalApprovedComments,
                totalRejectedComments,
                totalPostViews : totalPostViewsAggregate._sum.views
            }

        }
    )

    return transactionResult;
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