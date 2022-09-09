require("@nomiclabs/hardhat-waffle")
require("@nomiclabs/hardhat-etherscan")
require("hardhat-deploy")
require("solidity-coverage")
require("hardhat-gas-reporter")
require("hardhat-contract-sizer")
require("dotenv").config()

const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY || ""
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || ""
const RINKEBY_RPC_URL = process.env.RINKEBY_RPC_URL
const PRIVATE_KEY = process.env.PRIVATE_KEY

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
    solidity: "0.8.8",
    defaultNetwork:"hardhat",
  namedAccounts: {
        deployer: {
            default: 0,
        }
      },
      player: {
          default: 1,
        },
        networks: {
            hardhat: {
                chainId: 31337,
                blockConfirmation: 1,
            },
            rinkeby: {
                chainId: 4,
                blockConfirmation: 6,
                url: RINKEBY_RPC_URL,
                accounts: [PRIVATE_KEY],
            },
        },
    etherscan:{
        apiKey:ETHERSCAN_API_KEY,
    },
    gasReporter: {
        enabled: false,
        currency: "USD",
        outputFile: "gas-report.txt",
        noColors: true,
        //coinmarketcap: COINMARKETCAP_API_KEY,
    },
    mocha:{
        timeout:500000 //200 seconds max
    }
  }


