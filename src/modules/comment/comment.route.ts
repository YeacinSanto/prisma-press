import { Router } from "express";
import { commentController } from "./comment.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";



const router = Router();

router.get("/author/:authorId", commentController.getCommentByAuthorId)
router.post("/", auth(Role.ADMIN,Role.AUTHOR,Role.USER),commentController.createComment)
router.get("/commentId", commentController.getCommentByCommentId)
router.patch("/:commentId", auth(Role.USER,Role.ADMIN,Role.AUTHOR), commentController.updateComment)
router.delete("/:commentId", auth(Role.USER,Role.ADMIN,Role.AUTHOR), commentController.deleteComment)
router.patch("/:commentId/moderate", auth(Role.ADMIN), commentController.moderateComment)

export const commentRoutes = router