import { useState, useEffect } from "react";
import { ethers } from "ethers";

function SendepnsNotification() {
  const [haveMetamask, sethaveMetamask] = useState(true);
  const [accountAddress, setAccountAddress] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const { ethereum } = window;
  const provider = new ethers.providers.Web3Provider(window.ethereum);

  const PK = "0x" + process.env.REACT_APP_PRIVATE_KEY;
  const signer = new ethers.Wallet(PK);

  useEffect(() => {
    if (localStorage.getItem("wallet_address") !== "") {
      setIsConnected(true);
      setAccountAddress(localStorage.getItem("wallet_address"));
      sethaveMetamask(true);
    }
  }, []);


  const sendNotification = async () => {
    try {
      const apiResponse = await EpnsAPI.payloads.sendNotification({
        signer,
        type: 1, 
        identityType: 2, 
        notification: {
          title: `${title}`,
          body: `${body}`,
        },
        payload: {
          title: `${title}`,
          body: `${body}`,
          cta: "",
          img: "",
        },
        channel: `eip155:42:${accountAddress}`, 
        env: "staging",
      });

      console.log("API repsonse: ", apiResponse);
    } catch (err) {
      console.error("Error: ", err);
    }
  };

  return (
    <div>
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-12">
                    <div className="form-group">
                      <label htmlFor="title">Title</label>
                      <input
                        type="text"
                        className="form-control"
                        id="title"
                        placeholder="Enter Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="form-group">
                      <label htmlFor="body">Body</label>
                      <input
                        type="text"
                        className="form-control"
                        id="body"
                        placeholder="Enter Body"
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-12">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={sendNotification}
                    >
                      Send Notification to all your stakeholders
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SendepnsNotification;
