import { useState, useEffect } from "react";
import { ethers } from "ethers";
import './App.css'
import FileUpload from "./components/FileUpload";
import Display from "./components/Display";
import Modal from "./components/Modal";

function App() {
  const [networkChanged, setNetworkChanged] = useState(false);
  const [accountChanged, setAccountChanged] = useState(false);

  useEffect(() => {
    if (networkChanged) {
      setNetworkChanged(false);
    } else if (accountChanged) {
      setAccountChanged(false);
    }
  }, [networkChanged, accountChanged]);


  //0x5DC29e716f61982B9D86A309E05b6BF0B2fB0Eb2
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    //connect to our metamask 

    const loadProvider = async () => {
      if (provider) {

        window.ethereum.on("chainChanged", () => {
          setNetworkChanged(true);
        }
        );
        window.ethereum.on("accountsChanged", () => {
          setAccountChanged(true);
        });

        await provider.send("eth_requestAccounts", []);//open your metamask
        const signer = provider.getSigner();//signer is for change in smart contract 
        const address = await signer.getAddress();
        console.log(address)
        setAccount(address);
        let contractAddress = "0x5DC29e716f61982B9D86A309E05b6BF0B2fB0Eb2";
        let contractAbi = [
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "_user",
                "type": "address"
              },
              {
                "internalType": "string",
                "name": "url",
                "type": "string"
              }
            ],
            "name": "add",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "user",
                "type": "address"
              }
            ],
            "name": "allow",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "user",
                "type": "address"
              }
            ],
            "name": "disallow",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "address",
                "name": "_user",
                "type": "address"
              }
            ],
            "name": "display",
            "outputs": [
              {
                "internalType": "string[]",
                "name": "",
                "type": "string[]"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          },
          {
            "inputs": [],
            "name": "shareAccess",
            "outputs": [
              {
                "components": [
                  {
                    "internalType": "address",
                    "name": "user",
                    "type": "address"
                  },
                  {
                    "internalType": "bool",
                    "name": "access",
                    "type": "bool"
                  }
                ],
                "internalType": "struct Upload.Access[]",
                "name": "",
                "type": "tuple[]"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          }
        ];

        const contract = new ethers.Contract(
          contractAddress,
          contractAbi,
          signer
        );//create instance of our smart contract
        console.log(contract);
        setContract(contract);
        setProvider(provider);
      } else {
        console.error("Metamask is not installed");
      }
    };
    provider && loadProvider();
  }, [networkChanged, accountChanged]);

  //0xAE008568BfA308766CfA7446BD54C056099aB10a
  //0xc9fE022cE2910645F38791311ffaedaBedfDcaEc

  return (
    <>
    {!modalOpen && (
        <button className="share" onClick={() => setModalOpen(true)}>
          Share
        </button>
      )}
      {modalOpen && (
        <Modal setModalOpen={setModalOpen} contract={contract}></Modal>
      )}
      <div className="App">
        <h1 style={{ color: "white" }}>DImages</h1>
        <div class="bg"></div>
        <div class="bg bg2"></div>
        <div class="bg bg3"></div>

        <p style={{ color: "white" }}>
          Account : {account ? account : "Not connected"}
        </p>
        <FileUpload
          account={account}
          provider={provider}
          contract={contract}
        ></FileUpload>
        <Display contract={contract} account={account}></Display>
      </div>
    </>
  )
}

export default App
