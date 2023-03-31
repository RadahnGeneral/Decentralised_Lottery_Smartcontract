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
  const [numPlayer, setNumPlayer] = useState("0");
  const [recentWinner, setRecentWinner] = useState("0");

  const dispatch = useNotification();

  const { runContractFunction: getEntranceFee } = useWeb3Contract({
    abi: abi,
    contractAddress: lotteryAddress, //have to specify id
    functionName: "getEntranceFee",
    params: {},
  });

  const { runContractFunction: getNumberofPlayers } = useWeb3Contract({
    abi: abi,
    contractAddress: lotteryAddress, //have to specify id
    functionName: "getNumberofPlayers",
    params: {},
  });

  const { runContractFunction: getRecentWinner } = useWeb3Contract({
    abi: abi,
    contractAddress: lotteryAddress, //have to specify id
    functionName: "getRecentWinner",
    params: {},
  });

  const {
    runContractFunction: enterLottery,
    isLoading,
    isFetching,
  } = useWeb3Contract({
    abi: abi,
    contractAddress: lotteryAddress, //have to specify id
    functionName: "enterLottery",
    params: {},
    msgValue: entranceFee,
  });

  async function updateUI() {
    const entranceFeeFromCall = (await getEntranceFee()).toString();
    const numPlayersFromCall = (await getNumberofPlayers()).toString();
    const recentWinnerFromCall = (await getRecentWinner()).toString();
    setEntranceFee(entranceFeeFromCall);
    setNumPlayer(numPlayersFromCall);
    setRecentWinner(recentWinnerFromCall);
  }

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI();
    }
  }, [isWeb3Enabled, numPlayer, recentWinner]);

  async function handleSuccess(tx) {
    try {
      await tx.wait(1);
      handleNewNotification(tx);
      updateUI();
    } catch (error) {
      console.log(error);
    }
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
    <div className="p-5">
      {lotteryAddress ? (
        <div>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
            onClick={async () =>
              await enterLottery({
                onSuccess: handleSuccess,
                onError: (error) => console.log(error),
              })
            }
            disabled={isLoading || isFetching}
          >
            {" "}
            {isLoading || isFetching ? (
              <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
            ) : (
              <div>Enter Lottery to win ETH</div>
            )}
          </button>
          <br />
          Entrance fee is {ethers.utils.formatUnits(entranceFee, "ether")} ETH
          <br />
          Current number of players is: {numPlayer}
          <br />
          Previous winner of the lottery is: {recentWinner}
        </div>
      ) : (
        <div>Please connect to a supported chain </div>
      )}
    </div>
  );
}
