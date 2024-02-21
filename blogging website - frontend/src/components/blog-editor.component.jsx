import { Link } from "react-router-dom";
import AnimationWrapper from "../common/page-animation";
import logo from "../imgs/logo1.png"
import defaultBanner from "../imgs/blog banner.png";
import uploadImage from "../common/uploadImg";
import { useRef, useState } from "react";
import { Toaster, toast } from "react-hot-toast";


const BlogEditor = () => {

    let blogBannerRef = useRef();

    const handleBannerUpload = (img) => {

        

    

        if(img){

            let loadingToast = toast.loading('Uploading...')

            
            uploadImage(img).then(response => {
                const imageUrlArray = response;
                console.log(imageUrlArray[0]);

                if(imageUrlArray[0]) {
                    toast.dismiss(loadingToast);
                    toast.success('Uploaded 👍')
                    blogBannerRef.current.src = import.meta.env.VITE_SERVER_DOMAIN + '/' + imageUrlArray[0];
                    console.log(blogBannerRef.current.src);
    
                }
            }) 
            .catch(err => {
                toast.dismiss(loadingToast);
                return toast.error(err +' (Something went wrong 😔)');
            })

        }

        

        
    }
    
    return (
        <>

            <nav className="navbar">
                <Link to="/">
                    <img src={logo} className="flex-none w-52"/>
                </Link>
                <p className="max-md:hidden text-black line-clamp-1 w-full">
                    New Blog
                </p>

                <div className="flex gap-4 ml-auto"> 
                    <button className="btn-dark py-2">
                        Publish
                    </button>
                    <button className="btn-light py-2">
                        Save Draft
                    </button>
                </div>

            </nav>

            <Toaster />

            <AnimationWrapper>
                <section>
                    <div className="mx-auto max-w-[900px] w-full">

                        <div className="relative aspect-video hover:opacity-80 bg-white border-4 border-grey">
                            <label htmlFor="uploadBanner" className="cursor-pointer">
                                <img 
                                    ref={blogBannerRef}
                                    src={defaultBanner}
                                    className="z-20"
                                />
                                <input 
                                    id="uploadBanner" 
                                    type="file"
                                    multiple
                                    accept=".png, .jpg, .jpeg"
                                    hidden
                                    onChange={handleBannerUpload}
                                    />
                                
                            </label>

                        </div>

                    </div>

                </section>

            </AnimationWrapper>
    
        </>
        
    )
}

export default BlogEditor;