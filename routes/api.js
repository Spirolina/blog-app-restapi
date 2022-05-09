import { Router } from "express"
import { create_post, dashboard, post_comment, post_delete, post_edit, post_get } from "../controllers/PostController.js";
import { get_authors, login_post, register_post, } from "../controllers/UserController.js";
const router = Router();

router.post('/login', login_post);

router.post('/register', register_post);

router.get('/dashboard', dashboard);
router.get('/dashboard/:id', post_get);
router.get('/authors', get_authors);


router.post('/dashboard/create', create_post);
router.post('/dashboard/:id', post_comment);

router.put('/dashboard/:id/edit', post_edit);

router.delete('/dashboard/:id/delete',post_delete);


export default router
