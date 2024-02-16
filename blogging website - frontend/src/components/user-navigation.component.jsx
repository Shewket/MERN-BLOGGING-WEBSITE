import AnimationWrapper from "../common/page-animation";
import {Link, useNavigate} from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../App";
import { removeFromSession } from "../common/session";
import { useUser, useDescope } from '@descope/react-sdk';

const UserNavigationPanel = () => {

    const { userAuth: {username}, setUserAuth } = useContext(UserContext);

    const userDetail = useUser();
    const navigate = useNavigate();

    const {logout} = useDescope();
    
    console.log(userDetail);

    const signOutUser = () => {
        removeFromSession("user");
        setUserAuth({access_token: null});
        logout().then(() => {
            removeFromSession("user");
            navigate('/')
        })
    }

    

    return (
        <AnimationWrapper
            className="absolute right-0 z-50"
            transition={ {duration: 0.2} }
        >

            <div className="bg-white abosolute right-0 border border-grey w-60 duration-200">

                <Link to="/editor" className="flex gap-2 link md:hidden pl-8 py-4">
                    <i class="fi fi-rr-file-edit"></i>
                    <p>Write</p>
                </Link>

                <Link to={`/user/${username}`} className="link pl-8 py-4">
                    Profile
                </Link>

                <Link to="/dashboard/blogs" className="link pl-8 py-4">
                    Dashboard
                </Link>

                <Link to="/settings/edit-profile" className="link pl-8 py-4">
                    Settings
                </Link>

                <span className="absolute border-t border-grey w-[100%]">
                </span>

                <button className="text-left p-4 hover:bg-grey w-full pl-8 py-4"
                        onClick={signOutUser}
                >
                    <h1 className="font-bold text-xl mg-1">Sign Out</h1>
                    <p className="text-dark-grey">@{username || userDetail?.user?.name}</p>
                </button>

            </div>

        </AnimationWrapper>
    )
}

export default UserNavigationPanel;