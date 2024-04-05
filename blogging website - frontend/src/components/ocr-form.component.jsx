import { useContext, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import AnimationWrapper from "../common/page-animation";
import { EditorContext } from "../pages/editor.pages";
import ocr from "../imgs/ocr.png"
import uploadImage  from "../common/uploadImg";
import {useRef} from "react";
import { useState } from "react";
import axios from "axios";
import {AiOutlineCaretUp, AiOutlineCaretDown, AiOutlineSearch} from "react-icons/ai";
import langugeList from "../language-list.json"
import { ThemeContext } from "../App";


const OCRForm = () => {

    let {theme} = useContext(ThemeContext);

    let {setEditorState, setTextEditor} = useContext(EditorContext);

    let [convertedText, setConvertedText] = useState("");

    const [currentImageUrl, setCurrentImageUrl] = useState('');

    const [selectedLanguage, setSelectedLanguage] = useState('');


    const [isOpen, setIsOpen] = useState(false);

    const [inputValue, setInputValue] = useState('');

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

        let convertLoading = toast.loading('Converting...😉')

        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/api/ocr", {
            image: currentImageUrl,
            language: selectedLanguage.abbreviation
        }, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then(res => {
            toast.dismiss(convertLoading);
            setConvertedText(res.data.result);
            toast.success('Converted successfully 😃');

        })
        .catch(err => {
            return toast.error('Something went wrong 😔 :)' + err);
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

                <div className="max-w-[550px] center mb-24 md:pl-8 lg:border-r border-grey md:top-[100px] md:px-12 mt-6">
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

                    
                    <div className="flex items-center space-x-6 mt-8">
            
                        <div className="relative flex flex-col items-center w-[340px] rounded-lg ml-12">

                            <button className="btn-dark p-4 w-full flex items-center justify-between font-bold text-lg tracking-wider border-4 border-transparent active:border-white duration-300 active:text-grey" onClick={() => setIsOpen((prev) => !prev)}>
                                <span className="mr-28">{selectedLanguage ? selectedLanguage.language : "Please Select Language"}</span>
                                {
                                    !isOpen ? (
                                        <AiOutlineCaretDown className="h-4" />
                                    ) : (
                                        <AiOutlineCaretUp className="h-4" />
                                    )
                                }
                            </button>

                            {isOpen && (
                                <ul className={(theme == "light" ? "bg-grey" : "bg-slate-700")+" max-h-40 absolute overflow-y-auto top-20 flex flex-col items-start rounded-lg p-2 w-full"}>
                                    <div className="flex items-center px-2 sticky top-0">
                                        <AiOutlineSearch size={18} className="text-grey-900 "/>
                                        <input 
                                            type="text" 
                                            value={inputValue}
                                            placeholder="Enter a language" 
                                            onChange={(e) => {setInputValue(e.target.value.toLowerCase())}}
                                            className={"w-[270px] placeholder:text-grey-700 p-2 outline-none " + (theme == "light" ? "bg-grey" : "bg-slate-700")}/>
                                    </div>
                                    {langugeList.map((lang, idx) => (
                                        <div className="flex w-full justify-between hover:bg-gray-400 cursor-pointer rounded-r-lg border-l-transparent hover:border-l-white border-l-4" key={idx}>
                                            <li 
                                                key={lang?.language} 
                                                onClick={() => {
                                                    setSelectedLanguage(lang); 
                                                    setIsOpen(false);
                                                    setInputValue("");
                                                }}
                                                className={`font-bold p-1 ${lang?.language?.toLowerCase().startsWith(inputValue) ? "block" : "hidden"}`}>{lang?.language}
                                            </li>
                                        </div>
                                    ))} 
                                </ul>
                            )}
                        </div>
                 
                    </div>
                    


                </div>



                <div className="border-grey mb-24 lg:border-1 lg:pl-8 md:pt-5">

                        <p className="text-dark-grey mb-2">Converted text</p>
                        <textarea 
                            value={convertedText}
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