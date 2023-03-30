import { useWeb3Contract } from "react-moralis";
import { abi, contractAddresses } from "../constants/index";
import { useMoralis } from "react-moralis";
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useNotification } from "web3uikit";

export default function LotteryEntrance() {
  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const lotteryAddress =
    chainId in contractAddresses ? contractAddresses[chainId][0] : null;

  const [entranceFee, setEntranceFee] = useState("0");

  const dispatch = useNotification();

  const { runContractFunction: getEntranceFee } = useWeb3Contract({
    abi: abi,
    contractAddress: lotteryAddress, //have to specify id
    functionName: "getEntranceFee",
    params: {},
  });

  const { runContractFunction: enterLottery } = useWeb3Contract({
    abi: abi,
    contractAddress: lotteryAddress, //have to specify id
    functionName: "enterLottery",
    params: {},
    msgValue: entranceFee,
  });

  useEffect(() => {
    if (isWeb3Enabled) {
      async function updateUI() {
        const entranceFeeFromCall = (await getEntranceFee()).toString();
        setEntranceFee(entranceFeeFromCall);
      }
      updateUI();
    }
  }, [isWeb3Enabled]);

  async function handleSuccess(tx) {
    await tx.wait(1);
    handleNewNotification(tx);
  }

  const handleNewNotification = () => {
    dispatch({
      type: "info",
      message: "Transaction completed",
      title: "Tx Notification",
      position: "topR",
      icon: "bell",
    });
  };

  return (
    <div>
      {lotteryAddress ? (
        <div>
          <button
            onClick={async () =>
              await enterLottery({
                onSuccess: handleSuccess,
                onError: (error) => console.log(error),
              })
            }
          >
            Enter Lottery to win ETH!
          </button>
          Entrance fee is {(ethers.utils.formatUnits(entranceFee), "ether")} ETH
        </div>
      ) : (
        <div> No Lottery Address detected </div>
      )}
    </div>
  );
}
