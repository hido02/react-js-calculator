import styled from "styled-components";

const HistoryToggleComponent = ({ showHistory, setShowHistory }) => {
  const toggleHistory = () => {
    setShowHistory(!showHistory);
  };

  return <Icon onClick={toggleHistory}>⏱</Icon>;
};

const Icon = styled.div`
  font-size: 2rem;
  cursor: pointer;
`;

export default HistoryToggleComponent;
