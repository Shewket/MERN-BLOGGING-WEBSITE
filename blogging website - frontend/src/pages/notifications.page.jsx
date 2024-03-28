import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "../App";
import { filterPaginationData } from "../common/filter-pagination-data";
import Loader from "../components/loader.component";
import AnimationWrapper from "../common/page-animation";
import NoDataMessage from "../components/nodata.component";
import NotificationCard from "../components/notification-card.component";
import LoadMoreDataBtn from "../components/load-more.component";

const Notifications = () => {

    const [filter, setFilter] = useState('all');
    const [notifications, setNotifications] = useState(null);

    let {userAuth, userAuth: {access_token, new_notification_available}, setUserAuth} = useContext(UserContext);

    let filters = ['all', 'like', 'comment', 'reply'];

    const fetchNotifications = ({page, deletedDocCount = 0}) => {

        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/notification/notifications", {page, filter, deletedDocCount}, {
            headers: {
                "Authorization": `Bearer ${access_token}`
            }
        })
        .then( async ({ data: {notifications: data}}) => {

            if(new_notification_available){
                setUserAuth({...userAuth, new_notification_available: false});
            }
            
            let formatedData = await filterPaginationData({
                state: notifications,
                data,
                page,
                countRoute: "/notification/all-notifications-count",
                data_to_send: {filter},
                user: access_token
            })

            setNotifications(formatedData);
            console.log(formatedData);
        })
        .catch(err => {
            console.log(err);
        })
        
    }


    const handleFilter = (e) => {
        let btn = e.target;

        setFilter(btn.innerHTML);

        setNotifications(null);
    }

    useEffect(() => {

        if(access_token){
            fetchNotifications({page: 1});
        }
        
    }, [access_token, filter])
    return (
        <div>
            <h1 className="max-md:hidden">Recent Notifications</h1>

            <div className="my-8 flex gap-6">
                {
                    filters.map((filterName, idx) => {
                        return <button key={idx} className={"py-2 " + (filter == filterName ? "btn-dark" : "btn-light")} onClick={handleFilter}>{filterName}</button>
                    })
                }
            </div>

            {
                notifications == null ? <Loader /> :
                <>
                    {
                        notifications.results.length ?
                            notifications.results.map((notification, idx) => {
                                return <AnimationWrapper key={idx} transition={{delay: idx * 0.08}}>
                                    <NotificationCard data={notification} index={idx} notificationState={{notifications, setNotifications}} />
                                </AnimationWrapper>
                            })
                        :
                        <NoDataMessage message="No Notifications" />
                    }

                    <LoadMoreDataBtn state={notifications} fetchDataFun={fetchNotifications} additionalParam={{deletedDocCount: notifications.deletedDocCount}} />
                </>
            }
        </div>
    )
}

export default Notifications;