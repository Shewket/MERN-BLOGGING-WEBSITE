import { useState, useRef, useEffect } from "react";

export let activeTabLineRef;
export let activeTabRef;

const InPageNavigation = ({routes,defaultHidden = [], defaultActiveIndex = 0, children}) => {

    activeTabLineRef = useRef();
    activeTabRef = useRef();

    let [inPageNavIndex, setInPageNavIndex] = useState(defaultActiveIndex);

    const changePageState = (btn, idx) => {
        let {offsetWidth, offsetLeft} = btn;

        activeTabLineRef.current.style.width = offsetWidth + "px";
        activeTabLineRef.current.style.left = offsetLeft + "px";

        setInPageNavIndex(idx);

    }

    useEffect(() => {
        changePageState(activeTabRef.current, defaultActiveIndex)        
    }, [])

    return (
        <>
            <div className="relative mb-8 bg-white border-b border-grey flex flex-nowrap overflow-x-auto">
                {
                    routes.map((route, idx) => {
                        return (
                            <button key={idx} className={"p-4 px-5 capitalize " + (inPageNavIndex == idx ? "text-black " : "text-dark-grey " +
                                 (defaultHidden.includes(route) ? "md:hidden " : " "))}
                                    ref = {idx == defaultActiveIndex ? activeTabRef : null}
                                    onClick={(e) => {changePageState(e.target, idx)}}>
                                {route}
                            </button>
                        )
                    })
                }

                <hr ref={activeTabLineRef} className="absolute bottom-0 duration-300"/>

            </div>


            {Array.isArray(children) ? children[inPageNavIndex] : children}
        </>
    )
}

export default InPageNavigation;