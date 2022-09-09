const { network, ethers } = require("hardhat")
const { developmentChain, networkConfig } = require("../helper-hardhat-config")
const {verify} = require("../utils/verify")

const VRF_SUB_FUND_AMOUNT = "1000000000000000000000"
module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
    console.log(`ChainId is: ${chainId}`)
    let vrfCoordinatorV2Address, subscriptionId
    log("--------------------------------------------")
    log("Deploying Raffle and waiting for confirmantions...")
    if (developmentChain.includes(network.name)) {
        const vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock")
        vrfCoordinatorV2Address = vrfCoordinatorV2Mock.address
        const transactionResponse = await vrfCoordinatorV2Mock.createSubscription()
        const transactionReceipt = await transactionResponse.wait(1)
        subscriptionId = transactionReceipt.events[0].args.subId
        //Fund the subcription
        //Usually, you'd need the link token on a real network
        await vrfCoordinatorV2Mock.fundSubscription(subscriptionId, VRF_SUB_FUND_AMOUNT)
    } else {
        vrfCoordinatorV2Address = networkConfig[chainId]["vrfCoordinatorV2"]
        subscriptionId = networkConfig[chainId]["subscriptionId"]
    }
    const interval=networkConfig[chainId]["interval"]
    const entranceFee = networkConfig[chainId]["entranceFee"]
    const gasLane = networkConfig[chainId]["gasLane"]
    const callbackGasLimit=networkConfig[chainId]["callbackGasLimit"]
    const args = [vrfCoordinatorV2Address, entranceFee, gasLane,interval , subscriptionId, callbackGasLimit]
    const raffle = await deploy("Raffle", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    log(`Raffle deployed at ${raffle.address}`)
    if (!developmentChain.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        console.log(`This is API ${process.env.ETHERSCAN_API_KEY}`)
        await verify(raffle.address, args)
    }
}
module.exports.tags=["all", "raffle"]
