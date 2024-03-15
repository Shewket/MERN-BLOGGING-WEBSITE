import { useContext, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import AnimationWrapper from "../common/page-animation";
import { EditorContext } from "../pages/editor.pages";
import ocr from "../imgs/ocr.png"
import uploadImage  from "../common/uploadImg";
import {useRef} from "react";
import { useState } from "react";
import axios from "axios";


const OCRForm = () => {

    let {setEditorState, setTextEditor} = useContext(EditorContext);

    const [currentImageUrl, setCurrentImageUrl] = useState('')

    const [selectedLanguage, setSelectedLanguage] = useState('');

    let ocrImageRef = useRef();


    const handleCloseEvent = () => {
        setEditorState("editor");
        setTextEditor({isReady:false});
    }

    const handleOCRImageEvent = (img) => {
        if(img){

            let loadingToast = toast.loading('Uploading...')

            
            uploadImage(img).then(url => {
            

                if(url) {
                    toast.dismiss(loadingToast);
                    toast.success('Uploaded 👍')

                    ocrImageRef.current.src = url;
                    setCurrentImageUrl(url);
                    

    
                }
            }) 
            .catch(err => {
                toast.dismiss(loadingToast);
                return toast.error('Something went wrong 😔 :)' + err);
            })

        }
    }

    const handleLanguageChangeEvent = (e) => {
        setSelectedLanguage(e.target.value)
    }


    const sendImageAndLanguageEvent = () => {
        


        if(!currentImageUrl) {
            return toast.error('Please upload an image first 😔');
        }

        if(!selectedLanguage){
            return toast.error('Please select a language first 😔');
        }

        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/blog/ocr", {
            image: currentImageUrl,
            language: selectedLanguage
        })



    }




    return (
        <AnimationWrapper>
            <section className="w-screen min-h-screen grid items-center lg:grid-cols-2 py-16 lg:gap-4">
                <Toaster />

                <button className="w-12 h-12 absolute right-[5vw] z-10 top-[5%] lg:top-[10%]"
                        onClick={handleCloseEvent}
                >
                    <i className="fi fi-rr-cross"></i>
                </button>

                <div className="max-w-[550px] center mb-12  md:pl-8 lg:border-r border-grey md:top-[100px] md:px-12 ">
                    <p className="text-dark-grey mb-1">Please Upload</p>

                    <div className="w-full aspect-video rounded-lg overflow-hidden bg-grey mt-4">

                    <label htmlFor="uploadOCR" className="cursor-pointer">
                                <img 
                                    ref={ocrImageRef}
                                    src={ocr}
                                    className="z-20"
                                />
                                <input 
                                    id="uploadOCR" 
                                    type="file"
                                    accept=".png, .jpg, .jpeg"
                                    hidden
                                    onChange={handleOCRImageEvent}
                                    />
                                
                            </label>
                        </div>

                    
                    <div className="mt-4 flex items-center space-x-6">
            
                        <div class="flex items-center">
                            <input id="default-radio-1" onClick={handleLanguageChangeEvent} type="radio" value="English" name="default-radio"  class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                            <label for="default-radio-1" class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Englsih</label>
                        </div>
                        <div class="flex items-center">
                            <input id="default-radio-2" onClick={handleLanguageChangeEvent} type="radio" value="Chinese" name="default-radio" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                            <label for="default-radio-2" class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Chinese</label>
                        </div>

                        <div class="flex items-center">
                            <input id="default-radio-3" onClick={handleLanguageChangeEvent} type="radio" value="Uyghur" name="default-radio" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                            <label for="default-radio-3" class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Uyghur</label>
                        </div>
                 
                    </div>
                    


                </div>



                <div className="border-grey lg:border-1 lg:pl-8 md:pt-5">

                        <p className="text-dark-grey mb-2">Converted text</p>
                        <textarea 
    

                            className="h-64 resize-none leadning-7 input-box pl-4"
                        >

                        </textarea>

                        <div className="sm:items-left">
                            <button className="btn-dark lg:px-4 ml-52 mt-10"
                                    onClick={sendImageAndLanguageEvent}
                            >Convert</button>
                        </div>
                        

                         
                </div>

                

                
            </section>

        </AnimationWrapper>
    )
}

export default OCRForm;