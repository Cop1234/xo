import React from "react";

const Historty = ({ history }) => {
  const historyList = () => {
    const historyListResult = [];
    history.forEach((item) =>
      historyListResult.push(<div className="item">{item}</div>)
    );
    return historyListResult;
  };
  return <div>{historyList()}</div>;
};

export default Historty;
