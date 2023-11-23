/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState } from "react";
import { v4 as uuidV4 } from "uuid";
import toast from "react-hot-toast";

const Home = () => {
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");

  const createNewRoom = (e) => {
    e.preventDefault();
    const id = uuidV4();
    setRoomId(id);
    toast.success("Created a new room");
  };
  return (
    <div className="homePageWrapper">
      <div className="formWrapper">
        <img src="./code-sync.png" alt="code-sync-img" />
        <h4 className="mainLabel">Paste Invitation Room ID</h4>
        <div className="inputGroup">
          <input
            type="text"
            className="inputBox"
            placeholder="ROOM ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />
          <input
            type="text"
            className="inputBox"
            placeholder="USERNAME"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button className="btn joinBtn">Join</button>
          <span className="createInfo">
            If you don't have an invite then create &nbsp;
            <a onClick={createNewRoom} href="" className="createNewBtn">
              new room
            </a>
          </span>
        </div>
      </div>
      <footer>
        <h4>
          Built with 💛 &nbsp;by &nbsp;
          <a href="https://github.com/srivastavayushi">Ayushi</a>
        </h4>
      </footer>
    </div>
  );
};

export default Home;
