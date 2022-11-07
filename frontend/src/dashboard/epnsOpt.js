import React, {useState, useEffect} from "react";
import axios from "axios";
import { ethers } from "ethers";

function EpnsOpt() {
  const [key, setKey] = useState("today");
  const [tokens, setTokens] = useState("");
  const [user, setUser] = useState("");
  const [accountAddress, setAccountAddress] = useState("");
  const [subscriptions, setSubscriptions] = useState([]);
  const tokenID = [];
  const PK = "0x" + process.env.REACT_APP_PRIVATE_KEY;
  const _signer = new ethers.Wallet(PK);
  useEffect(() => {
    if (JSON.stringify(localStorage.getItem("wallet_address")) != null) {
      setUser(JSON.stringify(localStorage.getItem("wallet_address")));
    }
    fetchData();
    subscribe();
    Subscriptions();
  }, [tokens]);

  async function fetchData() {
    const response = await axios.get(
      "https://api.covalenthq.com/v1/80001/tokens/0xe6c5586d13ad0f33f438fa6A4002EA05A48994b5/nft_token_ids/?quote-currency=USD&format=JSON&key=ckey_d602af5fb4154aa5ace006300cc"
    );
    console.log(response.data.data.items.length);
    setTokens(response.data.data.items.length);
    for (let i = 1; i <= tokens; i++) {
      tokenID.push(i);
    }
    console.log(tokenID);
    const items = await Promise.all(
      tokenID.map(async (item) => {
        const res = await axios.get(
          `https://api.covalenthq.com/v1/80001/tokens/0xe6c5586d13ad0f33f438fa6A4002EA05A48994b5/nft_metadata/${item}/?quote-currency=USD&format=JSON&key=ckey_d602af5fb4154aa5ace006300cc`
        );

        if (
          user !==
          JSON.stringify(res.data.data.items[0].nft_data[0].original_owner)
        ) {
          console.log(res.data.data.items[0].nft_data[0].original_owner);

          let item = {
            id: res.data.data.items[0].nft_data[0].token_id,
            name: res.data.data.items[0].nft_data[0].external_data.name,
            image: res.data.data.items[0].nft_data[0].external_data.image,
            owner: res.data.data.items[0].nft_data[0].original_owner,
          };
          //console.log(item);
          return item;
        } else {
          return "";
        }
      })
    );
    console.log(items);
    setData(items);
  }
  console.log(data);

  const subscribe = data.map((elem) => {
    if (elem !== "") {
      console.log(elem);
      OptIn(elem, user);
    }
  });

  const OptIn = async (elem, user) => {
    try {
      await EpnsAPI.channels.subscribe({
        signer: _signer,
        channelAddress: `eip155:42:${elem.owner}`,
        userAddress: `eip155:42:${user}`,
        onSuccess: () => {
          console.log("opt in success");
        },
        onError: () => {
          console.error("opt in error");
        },
        env: "staging",
      });

      console.log("API repsonse: ", apiResponse);
    } catch (err) {
      console.error("Error: ", err);
    }
  };
  const OptOut = async (elem, user) => {
    try {
      await EpnsAPI.channels.unsubscribe({
        signer: _signer,
        channelAddress: `eip155:42:${elem.owner}`,
        userAddress: `eip155:42:${user}`,
        onSuccess: () => {
          console.log("opt in success");
        },
        onError: () => {
          console.error("opt in error");
        },
        env: "staging",
      });

      console.log("API repsonse: ", apiResponse);
    } catch (err) {
      console.error("Error: ", err);
    }
  };
  const Subscriptions = async (elem, user) => {
    try {
      const subscriptions = await EpnsAPI.user.getSubscriptions({
        user: `eip155:42:${user}`, // user address in CAIP
        env: "staging",
      });

      console.log("API repsonse: ", apiResponse);
      setSubscriptions(subscriptions);
    } catch (err) {
      console.error("Error: ", err);
    }
  };

  return (
    <div>
      <div className="admin-wrapper  bg-slate-200">
        <div className="container w-full">
          <div className=" w-full g-12 space-y-2">
            {subscriptions.map((elem) => (
              <div className="flex flex-col justify-center items-center">
                <div className="flex flex-row justify-center items-center">
                  <p className="text-white">{elem}</p>
                </div>
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  onClick={() => OptOut(elem, user)}
                >
                  Unsubscribe
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EpnsOpt;
