import { Link, useNavigate } from "react-router-dom";
import AnimationWrapper from "../common/page-animation";
import logo from "../imgs/logo1.png"
import defaultBanner from "../imgs/blog banner.png";
import uploadImage from "../common/uploadImg";
import { useContext, useEffect} from "react";
import { Toaster, toast } from "react-hot-toast";
import {EditorContext} from "../pages/editor.pages";
import EditorJS from "@editorjs/editorjs";
import tools from "./tools.component";
import axios from "axios";
import { UserContext } from "../App";




const BlogEditor = () => {


    let { blog, blog: { title, banner, content, tags, des}, setBlog, textEditor, setTextEditor, setEditorState} = useContext(EditorContext);

    let {userAuth: {access_token}} =  useContext(UserContext);

    let navigate = useNavigate();


    useEffect( () => {
        console.log(textEditor.isReady)
        // if(!textEditor.isReady){
            setTextEditor(new EditorJS({
                holder: 'textEditor',
                data: content,
                tools: tools,
                placeholder: 'Start writing here...',
    
            }));
        // }
        
    }, [])


    const handleBannerUpload = (img) => {



        if(img){

            let loadingToast = toast.loading('Uploading...')

            
            uploadImage(img).then(url => {
            

                if(url) {
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

    const handlePublishEvent = () => {
        if(!banner.length){
            return toast.error('Please upload a blog banner to publish it.');
        }

        if(!title.length){
            return toast.error('Please write a title to publish it.');
        }

        console.log(textEditor.isReady)

        if(textEditor.isReady){
            textEditor.save().then(data => {
                console.log(data);
                if(data.blocks.length){
                    setBlog({...blog, content: data});
                    setEditorState("publish");
                } else {
                    return toast.error('Please write some content to publish it.');
                }
            })
            .catch((err) => {
                console.log(err);
            })
        }
    }

    const handleOCREvent = (e) => {
        setEditorState("ocr")
    }

    const handleSaveDraft = (e) => {
        if(e.target.className.includes("disable")) {
            return;
        }

        if(!title.length) {
            return toast.error("Please add a title to your blog saving it as a draft.");
        }

        let loadingToast = toast.loading("Saving Draft......");

        e.target.classList.add('disable');

        

        if(textEditor.isReady){
            textEditor.save().then(content => {

                let blogObj = {
                    title, banner, des, content, tags, draft: true
                };

                axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/blog/create-blog", blogObj, {
                    headers: {
                        'Authorization': `Bearer ${access_token}`
                    }
                })
                .then(() => {
        
                    e.target.classList.remove('disable');
                    toast.dismiss(loadingToast);
                    toast.success("Blog saved successfully. 👏");
        
                    setTimeout(() => {
                        navigate("/");
                    }, 500);
                })
                .catch(( {response} ) => {
                    e.target.classList.remove('disable');
                    toast.dismiss(loadingToast);
                    
                    return toast.error(response.data.error)
                })

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
                    {title ? title : "New Blog" }
                </p>

                <div className="flex gap-4 ml-auto"> 
                    <button className="btn-dark py-2"
                        onClick={handlePublishEvent}
                    >
                        Publish
                    </button>
                    <button className="btn-ocr py-2"
                        onClick={handleOCREvent}
                    >
                        OCR
                    </button>
                    <button className="btn-light py-2"
                            onClick={handleSaveDraft}
                    >
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
                            defaultValue={title}
                            placeholder="Blog Title"
                            className="text-4xl font-medium w-full h-20 outline-none resize-none mt-10 leading-tight placeholder:opacity-40"
                            onKeyDown={handleTitleKeyDown}
                            onChange={handleTitleChange}
                        />

                        <hr className="w-full opacity-10 my-1"/>

                        <div id="textEditor" className="font-gelasio"></div>






                    </div>

                </section>

            </AnimationWrapper>
    
        </>

        
        
    )
}

export default BlogEditor;