import fs from 'fs';
import {nanoid} from 'nanoid';
import Blog from '../Schema/Blog.js';
import User from '../Schema/User.js';
import Notification from '../Schema/Notification.js';
import Comment from '../Schema/Comment.js';


const DESCRIPTION_LIMIT = 500;
const TAGS_LIMIT = 10;


const upLoadImages =(req, res)  => {


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

    let {title, des, banner, tags, content, draft, id} = req.body;
    

    if(!title.length){
        return res.status(403).json({"error": "Title is required."});
    }

    if(!draft){
        if(!des.length || des.length > DESCRIPTION_LIMIT){
            return res.status(403).json({"error": "Description is required under 500 characters."});
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
    }

    tags = tags.map(tag => tag.toLowerCase());

    let blog_id = id || title.replace(/[^a-zA-Z0-9]/g, ' ').replace(/\s+/g, '-').trim() + nanoid();

    if(id){

        Blog.findOneAndUpdate({blog_id}, {title, des, banner, content, tags, draft: draft ? draft : false})
        .then(() => {
            return res.status(200).json({id: blog_id});
        })
        .catch(err => {
            return res.status(500).json({"error": err.message})
        })

    }else{

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
            return res.status(500).json({error: "Failed to create blog: " + err.message  })
        })

    }
    
    

}

const getLatestBlogs = (req, res) => {

    let {page} = req.body;

    const maxLimit = 5;

    Blog.find({draft: false})
    .populate("author", "personal_info.profile_img personal_info.username personal_info.fullname -_id")
    .sort({"publishedAt": -1})
    .select("blog_id title des banner activity tags publishedAt -_id")
    .skip((page -1) * maxLimit)
    .limit(maxLimit)
    .then(blogs => {
        return res.status(200).json({blogs});
    })
    .catch(err => {
        return res.status(500).json({"error": err.message });
    })
}

const getTrendingBlogs = (req, res) => {
    Blog.find({ draft: false })
    .populate("author", "personal_info.profile_img personal_info.username personal_info.fullname -_id")
    .sort({ "activity.total_read ": -1, "activity.total_likes": -1, "publishedAt": -1})
    .select("blog_id title publishedAt -_id")
    .limit(5)
    .then(blogs => {
        return res.status(200).json({ blogs });
    })
    .catch(err => {
        return res.status(500).json({ "error": err.message });
    })
    
}

const getSearchingBlogs = (req, res) => {
    let {tag, query, author, page, limit, eliminate_blog} = req.body;

    let findQuery;

    let maxLimit = limit ? limit : 1;

    if(tag){
        findQuery = {tags: tag, draft: false, blog_id: {$ne: eliminate_blog}};
    } else if(query){
        findQuery = {draft: false, title: new RegExp(query, 'i')}
    } else if(author){
        findQuery = {author, draft: false}
    }

    Blog.find(findQuery)
    .populate("author", "personal_info.profile_img personal_info.username personal_info.fullname -_id")
    .sort({"publishedAt": -1})
    .select("blog_id title des banner activity tags publishedAt -_id")
    .skip((page -1) * maxLimit)
    .limit(maxLimit)
    .then(blogs => {
        return res.status(200).json({blogs});
    })
    .catch(err => {
        return res.status(500).json({"error": err.message });
    })


}

const getCountOfAllLatestBlogs = (req, res) => {

    Blog.countDocuments({ draft: false })
    .then(count => {
        return res.status(200).json( {totalDocs: count} );
    })
    .catch(err => {
        console.log(err.message);
        return res.status(500).json({"error": err.message });
    })

}

const getCountOfSearchingBlogs = (req, res) => {
    let {tag, query, author} = req.body;

    let findQuery;

    if(tag){
        findQuery = {tags: tag, draft: false};
    } else if(query){
        findQuery = {draft: false, title: new RegExp(query, 'i')}
    } else if(author){
        findQuery = {author, draft: false}
    }

    Blog.countDocuments(findQuery)
    .then(count => {
        return res.status(200).json( {totalDocs: count} );
    })
    .catch(err => {
        console.log(err.message);
        return res.status(500).json({"error": err.message });
    })
}

const getBlog = (req, res) => {

    let {blog_id, draft, mode} = req.body;

    let increamentVal = mode != 'edit' ? 1 : 0;

    Blog.findOneAndUpdate({blog_id} , {$inc: {"activity.total_reads": increamentVal}})
    .populate("author", "personal_info.fullname personal_info.username personal_info.profile_img")
    .select("title des content banner activity publishedAt blog_id tags")
    .then(blog => {
       
        User.findOneAndUpdate({"personal_info.username": blog.author.personal_info.username}, {$inc: {"account_info.total_reads": increamentVal}
        })
        .catch(err => {
            return res.status(500).json({"error": err.message})
        })

        if(blog.draft && !draft){
            return res.status(500).json({"error": "You can not access draft blogs."})
        }

        return res.status(200).json({blog});
    })
    .catch(err => {
        return res.status(500).json({"error": err.message });
    })

}

const likeBlog = (req, res) => {

    let user_id = req.user;

    // isLikedByUser default value is false
    let {_id, isLikedByUser} = req.body;

    let increamentVal = !isLikedByUser ? 1 : -1;

    Blog.findOneAndUpdate({_id}, {$inc: {"activity.total_likes": increamentVal}})
    .then(blog => {
        if(!isLikedByUser){
            let like = new Notification({
                type: "like",
                blog: _id,
                notification_for: blog.author,
                user: user_id
            })

            like.save().then(notification => {
                return res.status(200).json({liked_by_user: true})
            })
        } else{
            Notification.findOneAndDelete({ user: user_id, blog: _id, type: "like" })
            .then(data => {
                return res.status(200).json({liked_by_user: false});
            })
            .catch(err => {
                return res.status(500).json({"error": err.message});
            })
        }
    })

}

const getIsLikedByUser = (req, res) => {

    let user_id = req.user;

    let {_id} = req.body;

    Notification.exists({user: user_id, type: "like", blog: _id})
    .then(result => {
        return res.status(200).json({result})
    })
    .catch(err => {
        return res.status(500).json({"error": err.message });
    })

}

const manageBlogs = (req, res) => { 

    let user_id = req.user;

    let {page, draft, query, deletedDocCount} = req.body;

    let maxLimit = 5;
    let skipDocs = (page - 1) * maxLimit;

    if(deletedDocCount) {
        skipDocs -= deletedDocCount;

    }

    // title is case sensative
    Blog.find({author: user_id, draft, title: new RegExp(query, 'i')})
    .skip(skipDocs)
    .limit(maxLimit)
    .sort({publishedAt: -1})
    .select("title banner publishedAt blog_id activity des draft -_id")
    .then(blogs => {
        return res.status(200).json({blogs});
    })
    .catch(err => {
        return res.status(500).json({"error": err.message });
    })

}

const getBlogsCount = (req, res) => {
    let user_id = req.user; 

    let {draft, query} = req.body;

    Blog.countDocuments({author: user_id, draft, title: new RegExp(query, 'i')})
    .then(count => {
        return res.status(200).json({totalDocs: count});
    })
    .catch(err => {
        console.log(err.message);
        return res.status(500).json({"error": err.message });
    })


}

const deleteBlog = (req, res) => {

    let user_id = req.user;
    let {blog_id} = req.body;

    Blog.findOneAndDelete({blog_id})
    .then(blog => {
        Notification.deleteMany({blog: blog._id}).then(data => console.log('Notifications deleted'));

        Comment.deleteMany({blog_id: blog._id}).then(data => console.log('Comments deleted'));

        User.findOneAndUpdate({_id: user_id}, {$pull: {blog: blog._id}, $inc: {"account_info.total_posts": -1}})
        .then(user => console.log('Blog deleted'));

        return res.status(200).json({"status": "Done!"});
    })
    .catch(err => {
        return res.status(500).json({"error": err.message });
    })
    
}




export {upLoadImages, createBlog, getLatestBlogs, getTrendingBlogs, getSearchingBlogs, getCountOfAllLatestBlogs, getCountOfSearchingBlogs, getBlog, likeBlog, getIsLikedByUser, manageBlogs, getBlogsCount, deleteBlog};