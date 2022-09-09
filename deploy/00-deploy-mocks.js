const {network}=require("hardhat")


const GAS_PRICE_LINK=1e9
const BASE_FEE=ethers.utils.parseEther("0.25")
const {developmentChain} = require("../helper-hardhat-config")
module.exports=async function ({getNamedAccounts, deployments}){
    const {deploy, log}=deployments
    const {deployer} =await getNamedAccounts()
    const chainId=network.chainId
    const args=[BASE_FEE, GAS_PRICE_LINK]
    if (developmentChain.includes(network.name)){
        log("Local network detected! Deploying mocks...")
        //deploy a mock vrfCoordinator
        await deploy ("VRFCoordinatorV2Mock",{
            from:deployer,
            log:true,
            args:args
        }) 
        log("Mocks Deplyed!")
        log("-----------------------------------------")

    }

}

module.exports.tags=["all", "mocks"]