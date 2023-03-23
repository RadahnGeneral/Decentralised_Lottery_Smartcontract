const { assert, expect } = require("chai")
const { getNamedAccounts, deployments, ethers, network } = require("hardhat")

const { developmentChains, networkConfig } = require("../../../helper-hardhat-config")

developmentChains.includes(network.name)
    ? describe.skip
    : describe("Lottery Staging Tests", function () {
          let lottery, lotteryEntranceFee, deployer

          beforeEach(async function () {
              deployer = (await getNamedAccounts()).deployer
              lottery = await ethers.getContract("Lottery", deployer)
              lotteryEntranceFee = await lottery.getEntranceFee()
          })

          describe("fulfilRandomWords", function () {
              it("works with live Chainlink Keepers and Chainlink VRF, we got a random winner"),
                  async function () {
                      const startingTimeStamp = lottery.getLatestTimestamp()
                      const accounts = await ethers.getSigners()

                      //setup listenter before entering the lottery
                      await new Promise(async (resolve, reject) => {
                          lottery.once("WinnerPicked", async () => {
                              console.log("WinnerPicked Event found!")

                              try {
                                  const recentWinner = await lottery.getRecentWinner()
                                  const lotteryState = await lottery.getLotteryState()
                                  const winnerEnding Balance = await accounts[0].getBalance()
                                  const endingTimeStamp = lottery.getLatestTimestamp()

                                  await expect(lottery.getPlayers(0)).to.be.reverted

                                  assert.equal(recentWinner, accounts[0])

                                  assert.equal(lotteryState, 0)

                                  assert.equal(
                                      winnerEndingBalance.toString(),
                                      winnerStartingBalance.add(lotteryEntranceFee).toString()
                                  )
                                  assert(endingTimeStamp > startingTimeStamp)
                                  resolve()
                              } catch (err) {
                                  console.log(err)
                                  reject(e)
                              }
                          })

                          await lottery.enterLottery({ value: lotteryEntranceFee })
                          const winnerStartingBalance = await accounts[0].getBalance()
                      })
                  }
          })
      })
