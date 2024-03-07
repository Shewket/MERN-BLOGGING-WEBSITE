import axios from "axios";
import { useEffect, useState } from "react";
import AnimationWrapper from "../common/page-animation";
import BlogPostCard from "../components/blog-post.component";
import InPageNavigation from "../components/inpage-navigation.component";
import Loader from "../components/loader.component";
import MinimalBlogPost from "../components/nobanner-blog-post.component";

const HomePage = () => {

    let [blogs, setBlogs] = useState(null);
    let [trendingBlogs, setTrendingBlogs] = useState(null);

    const fetchLatesBlogs = () => {
        axios.get(import.meta.env.VITE_SERVER_DOMAIN + "/blog/latest-blogs")
        .then( ({data}) => {
            setBlogs(data.blogs);
        })
        .catch(err => {
            console.log(err);
        }) 
    }

    const fetchTrendingBlogs = () => {
        axios.get(import.meta.env.VITE_SERVER_DOMAIN + "/blog/trending-blogs")
        .then( ({data}) => {
            setTrendingBlogs(data.blogs);
        })
        .catch(err => {
            console.log(err);
        }) 
    }

    useEffect(() => {
        fetchLatesBlogs();
        fetchTrendingBlogs();
    }, [])

    return (
        <AnimationWrapper>
            <section className="h-cover flex justify-center gap-10">

                {/* Side Bar */}
                <div></div>

                {/* Lates Blogs */}
                <div className="w-full">
                    <InPageNavigation routes={["home", "trending blogs"]} defaultHidden={["trending blogs"]}>
                        
                        <>
                            {
                                blogs == null ? <Loader />
                                : blogs.map((blog, idx) => {
                                    return <AnimationWrapper transition={{duration:1, delay: idx*.1}} key={idx}>
                                        <BlogPostCard content={blog} author={blog.author.personal_info} />
                                    </AnimationWrapper>
                                })
                            }
                        </>

                        {
                             trendingBlogs == null ? <Loader />
                             : trendingBlogs.map((blog, idx) => {
                                 return <AnimationWrapper transition={{duration:1, delay: idx*.1}} key={idx}>
                                     <MinimalBlogPost />
                                 </AnimationWrapper>
                             })

                        }
                    </InPageNavigation>

                </div>

                {/* Filters and trending blogs */}
                <div>

                </div>
            </section>
        </AnimationWrapper>
    )
}

export default HomePage;