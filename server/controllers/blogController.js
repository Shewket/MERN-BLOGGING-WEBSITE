import fs from 'fs';
import {nanoid} from 'nanoid';
import Blog from '../Schema/Blog.js';
import User from '../Schema/User.js';

const DESCRIPTION_LIMIT = 200;
const TAGS_LIMIT = 10;


const upLoadImages =(req, res)  => {

    console.log(req.files);

    const uploadedFiles = [];

    for(let i = 0; i < req.files.length; i++) {
        const {path, originalname} = req.files[i];
        const parts = originalname.split('.');
        const ext = parts[parts.length - 1];
        const  newPath = path + '.' + ext;
        fs.renameSync(path, newPath);
        uploadedFiles.push(newPath.replace('uploads\\',''));

    }
    res.json(uploadedFiles);

}

const createBlog = (req, res) => {
    
    let authorId = req.user;

    let {title, des, banner, tags, content, draft} = req.body;

    if(!title.length){
        return res.status(403).json({"error": "Title is required."});
    }

    if(!des.length || des.length > DESCRIPTION_LIMIT){
        return res.status(403).json({"error": "Description is required under 200 characters."});
    }

    if(!banner.length){
        return res.status(403).json({"error": "Banner is required."});
    }

    if(!content.blocks.length){
        return res.status(403).json({"error": "Content is required."});
    }

    if(!tags.length || tags.length > TAGS_LIMIT) {
        return res.status(403).json({"error": "Tags is required, Maxium 10."});
    }

    tags = tags.map(tag => tag.toLowerCase());

    let blog_id = title.replace(/[^a-zA-Z0-9]/g, ' ').replace(/\s+/g, '-').trim() + nanoid();
    
    let blog = new Blog({
        title, des, banner, content, tags, author: authorId, blog_id: blog_id, draft: Boolean(draft) 
    })

    blog.save().then(blog => {
        let increamentVal = draft ? 0 : 1;

        User.findOneAndUpdate({_id: authorId}, {$inc: {"account_info.total_posts": increamentVal}, $push: {"blogs": blog._id}})
            .then(user => {
                return res.status(200).json({id: blog.blog_id})
            })
            .catch(err => {
                return res.status(500).json({error: "Failed to update total posts number."})
            })
    })
    .catch(err => {
        return res.status(500).json({error: "Failed to create blog: " + err.message})
    })

}




export {upLoadImages, createBlog};