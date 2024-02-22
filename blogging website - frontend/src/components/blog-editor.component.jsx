import { Link } from "react-router-dom";
import AnimationWrapper from "../common/page-animation";
import logo from "../imgs/logo1.png"
import defaultBanner from "../imgs/blog banner.png";
import uploadImage from "../common/uploadImg";
import { useContext} from "react";
import { Toaster, toast } from "react-hot-toast";
import {EditorContext} from "../pages/editor.pages";


const BlogEditor = () => {


    let { blog, blog: { title, banner, content, tags, des}, setBlog} = useContext(EditorContext)

    console.log(blog);


    const handleBannerUpload = (img) => {


        if(img){

            let loadingToast = toast.loading('Uploading...')

            
            uploadImage(img).then(response => {
                const imageUrlArray = response;
                console.log(imageUrlArray[0]);

                if(imageUrlArray[0]) {
                    const url = import.meta.env.VITE_SERVER_DOMAIN + '/' + imageUrlArray[0]
                    toast.dismiss(loadingToast);
                    toast.success('Uploaded 👍')
                    
                    setBlog({...blog, banner: url})
    
                }
            }) 
            .catch(err => {
                toast.dismiss(loadingToast);
                return toast.error('Something went wrong 😔 :)' + err);
            })

        }
        
    }

    const handleTitleKeyDown = (e) => {
        if(e.key === 'Enter'){
            e.preventDefault();
        }
    }

    const handleTitleChange = (e) => {
        let input = e.target;
        input.style.height = 'auto';
        input.style.height = input.scrollHeight + 'px';

        setBlog({...blog, title: input.value})
    }

    const handleError = (e) => {
        let img = e.target;

        img.src = defaultBanner;
    }
    
    return (
        <>

            <nav className="navbar">
                <Link to="/">
                    <img src={logo} className="flex-none w-52"/>
                </Link>
                <p className="max-md:hidden text-black line-clamp-1 w-full">
                    {title ? title : "New Blog" }
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
                                    src={banner}
                                    className="z-20"
                                    onError={handleError}
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

                        <textarea
                            placeholder="Blog Title"
                            className="text-4xl font-medium w-full h-20 outline-none resize-none mt-10 leading-tight placeholder:opacity-40"
                            onKeyDown={handleTitleKeyDown}
                            onChange={handleTitleChange}
                        />

                        <hr className="w-full opacity-10 my-1"/>




                    </div>

                </section>

            </AnimationWrapper>
    
        </>

        
        
    )
}

export default BlogEditor;