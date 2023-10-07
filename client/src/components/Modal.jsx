import { useEffect, useState } from "react";
import "./Modal.css";
const Modal = ({ setModalOpen, contract }) => {
  const [options, setOptions] = useState([]);
  const [address, setAddress] = useState("");
  const [share, setShare] = useState(false);
  const sharing = async () => {
    await contract.allow(address);
    setModalOpen(false);
    setShare(true)
  };
  useEffect(() => {
    const accessList = async () => {
      const addressList = await contract.shareAccess();
      //let select = document.querySelector("#selectNumber");
      setOptions(addressList);

      console.log(options)
    };
    contract && accessList();
    setShare(false)
  }, [contract,share]);
  return (
    <>
      <div className="modalBackground">
        <div className="modalContainer">
          <div className="title">Share with</div>
          <div className="body">
            <input
              type="text"
              className="address"
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter Address"
            ></input>
          </div>
          <form id="myForm">
            <select id="selectNumber">
              <option className="address">People With Access</option>
              {options.map((item, index) => (
                <option className="address" key={index}>{item}</option>
              ))}
            </select>
          </form>
          <div className="footer">
            <button
              onClick={() => {
                setModalOpen(false);
              }}
              id="cancelBtn"
            >
              Cancel
            </button>
            <button onClick={() => sharing()}>Share</button>
          </div>
        </div>
      </div>
    </>
  );
};
export default Modal;