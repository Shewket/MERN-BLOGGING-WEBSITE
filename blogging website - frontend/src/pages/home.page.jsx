import axios from "axios";
import { useEffect, useState } from "react";
import AnimationWrapper from "../common/page-animation";
import BlogPostCard from "../components/blog-post.component";
import InPageNavigation from "../components/inpage-navigation.component";
import Loader from "../components/loader.component";
import MinimalBlogPost from "../components/nobanner-blog-post.component";
import { activeTabRef } from "../components/inpage-navigation.component";
import NoDataMessage from "../components/nodata.component";

const HomePage = () => {

    let [blogs, setBlogs] = useState(null);
    let [trendingBlogs, setTrendingBlogs] = useState(null);
    let [pageState, setPageState] = useState("home");

    let categories = ["big data", "machine learning" ,"deep learning", "cryptography", "neural network", "back end", "front end"]

    const fetchLatestBlogs = () => {
        axios.get(import.meta.env.VITE_SERVER_DOMAIN + "/blog/latest-blogs")
        .then( ({data}) => {
            setBlogs(data.blogs);
        })
        .catch(err => {
            console.log(err);
        }) 
    }

    const fetchBlogsByCategory = () => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/blog/search-blogs", {tag: pageState})
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

    const loadBlogByCategory = (e) => {
        let category = e.target.innerText.toLowerCase();

        setBlogs(null);

        if(pageState == category){
            setPageState("home");
            return;
        }

        setPageState(category);
    }

    useEffect(() => {

        activeTabRef.current.click()

        if(pageState == "home"){
            fetchLatestBlogs();
        } else{
            fetchBlogsByCategory();
        }

        if(!trendingBlogs){
            fetchTrendingBlogs();
        }
        
        
    }, [pageState])

    return (
        <AnimationWrapper>
            <section className="h-cover flex justify-center gap-10">

                {/* Side Bar */}
                <div></div>

                {/* Latest Blogs */}
                <div className="w-full">
                    <InPageNavigation routes={[pageState, "trending blogs"]} defaultHidden={["trending blogs"]}>
                        
                        <>
                            {
                                blogs == null ?  (
                                    <Loader />
                                ) : (
                                    blogs.length ? 
                                        blogs.map((blog, idx) => {
                                            return (<AnimationWrapper transition={{duration:1, delay: idx*.1}} key={idx}>
                                                <BlogPostCard content={blog} author={blog.author.personal_info} />
                                                </AnimationWrapper>
                                            );
                                        })
                                    : <NoDataMessage message="No Blogs published" />
                            )}
                        </>

                        {
                             trendingBlogs == null ? (
                                <Loader />
                             ) : (
                                trendingBlogs.length ? 
                                    trendingBlogs.map((blog, idx) => {
                                        return <AnimationWrapper transition={{duration:1, delay: idx*.1}} key={idx}>
                                            <MinimalBlogPost blog={blog} index={idx}/>
                                        </AnimationWrapper>
                                    })
                                : <NoDataMessage message="No Trending Blogs" />
                        )}
                    </InPageNavigation>

                </div>

                {/* Filters and trending blogs */}
                <div className="min-w-[40%] lg:min-w-[400px] max-w-min border-l border-grey pl-8 pt-3 max-md:hidden">

                    <div className="flex flex-col gap-10">
                        <div>
                            <h1 className="font-medium text-xl mb-8">Tags for all related posts</h1>

                            <div className="flex gap-3 flex-wrap">
                                {
                                    categories.map((category, idx) => {
                                        return (
                                            <button onClick={loadBlogByCategory} className={"tag " + (pageState == category ? " bg-black text-white ": " ")} key={idx}>
                                            {category}
                                        </button>
                                        );
                                    })
                                    
                                }
                            </div>
                        </div>

                    

                        <div>
                            <h1 className="font-medium text-xl mb-8">Trending <i className="fi fi-rr-arrow-trend-up"></i></h1>

                            {
                                trendingBlogs == null ? (
                                    <Loader />
                                ) 
                                : (
                                    trendingBlogs.length ?
                                        trendingBlogs.map((blog, idx) => {
                                            return <AnimationWrapper transition={{duration:1, delay: idx*.1}} key={idx}>
                                                <MinimalBlogPost blog={blog} index={idx}/>
                                            </AnimationWrapper>
                                            })
                                    : <NoDataMessage message="No Trending Blogs" />
                                )
                            }
                        </div>

                    </div>

                </div>
            </section>
        </AnimationWrapper>
    )
}

export default HomePage;