import './warning.css';

const Warning = ({ text }) => {
  return (
    <div className="warning-container">
      <p className="warning-text">{text}</p>
    </div>
  );
};

export default Warning;
