import Avatar from "react-avatar";

const Client = ({ name }) => {
  return (
    <div className="client">
      <Avatar name={name} size={50} round="14px" />
      <span className="userName">{name}</span>
    </div>
  );
};

export default Client;
