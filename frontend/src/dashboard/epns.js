import Header from "../components/header/Header";
import DashboardHeader from "../components/dashboard/header/DashboardHeader";
import * as EpnsAPI from "@epnsproject/sdk-restapi";
import { NotificationItem, chainNameType } from "@epnsproject/sdk-uiweb";
import { useEffect, useState } from "react";

const Epns = () => {
  const [notifications, setNotifications] = useState([]);
  const [haveMetamask, sethaveMetamask] = useState(true);
  const [accountAddress, setAccountAddress] = useState("");
  const [isConnected, setIsConnected] = useState(false);


  useEffect(() => {
    if (localStorage.getItem("wallet_address") !== "") {
      setIsConnected(true);
      setAccountAddress(localStorage.getItem("wallet_address"));
      sethaveMetamask(true);
      fetchNotifs();
    }
  }, []);
    const fetchNotifs = async () => {
      const notifications = await EpnsAPI.user.getFeeds({
        user: `eip155:42:${accountAddress}`,
        env: "staging",
      });
        setNotifications(notifications);
      console.log("Notifications: \n\n", notifications);
    };


  return (
    <>
      <Header />
      <DashboardHeader />
      <div className="admin-wrapper  bg-slate-200">
        <div className="container w-full">
          <div className=" w-full g-12 space-y-2">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notificationTitle={notification.title}
                notificationBody={notification.message}
                cta={notification.cta}
                app={notification.app}
                icon={notification.icon}
                image={notification.image}
                url={notification.url}
                theme={notification.theme}
                chainName={notification.blockchain}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Epns;
