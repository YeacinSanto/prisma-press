import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { postService } from "./post.service";
import { sendResponse } from "../../utils/sendResponce";
import status from "http-status";


const createPost = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
    const id = req.user?.id;

    const payLoad = req.body;

    const result = await postService.createPost(payLoad,id as string)

    sendResponse(res,{
        success : true,
        statusCode : status.OK,
        message : "Post created successfully!",
        data : result
    })
})


const getAllPosts = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
    const posts = await postService.getAllPosts();

    sendResponse(res,{
        success : true,
        statusCode : status.OK,
        message : "Post retrive successfully!",
        data : posts
    })

})
const getPostStats = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{

})


const getMyPosts = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
    const authorId = req.user?.id;

    const result = await postService.getMyPost(authorId as string);

    sendResponse(res,{
        success : true,
        statusCode : status.OK,
        message : "My post retrived successfully!",
        data : {result}
    })
    
})


const getPostById = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
    const postId = req.params.postId;

    if(!postId){
        throw new Error("Post id not found")
    }

    const result = await postService.getPostsById(postId as string);

    sendResponse(res,{
        success : true,
        statusCode : status.OK,
        message : "Post retrived successfully!",
        data : result
    })
})

const updatePost = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
    const authorId = req.user?.id;
    const isAdmin = req.user?.role === "ADMIN"
    const postId = req.params.postId;
    const payLoad = req.body;

    const result = await postService.updatePost(postId as string,payLoad,authorId as string,isAdmin)

    sendResponse(res,{
        success : true,
        statusCode : status.OK,
        message : "Post updated successfully!",
        data : {result}
    })

    
})


const deletePost = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
    const authorId = req.user?.id;
    const isAdmin = req.user?.role === "ADMIN"
    const postId = req.params.postId;

    const result = await postService.deletePost(postId as string,authorId as string,isAdmin)

    sendResponse(res,{
        success : true,
        statusCode : status.OK,
        message : "Post deleted successfully!",
        data : null
    })

})


export const postController = {
    createPost,
    getAllPosts,
    getPostStats,
    getMyPosts,
    getPostById,
    updatePost,
    deletePost
}