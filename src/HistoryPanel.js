import styled from "styled-components";
import Typography from "@mui/material/Typography";

const HistoryPanel = ({ history, setHistory }) => {
  const handleDeleteHistory = (index) => {
    setHistory((currentHistory) =>
      currentHistory.filter((_, i) => i !== index)
    );
  };

  return (
    <HistoryContainer>
      <Typography>계산 기록</Typography>
      {history.map((record, index) => (
        <HistoryEntry key={index}>
          <HistoryItem>{record}</HistoryItem>
          <HistoryButton onClick={() => handleDeleteHistory(index)}>
            삭제
          </HistoryButton>
        </HistoryEntry>
      ))}
    </HistoryContainer>
  );
};

export default HistoryPanel;

// HistoryContainer, HistoryEntry, HistoryItem 스타일링을 여기에 추가
const HistoryContainer = styled.div`
  width: 40%;
  max-width: 450px;
  margin-top: 20px;
  background-color: #f2f3f5;
  border-radius: 10px;
  padding: 10px;
  overflow-y: auto;
`;

const HistoryEntry = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px; // 각 항목 사이의 간격
`;

const HistoryItem = styled.div`
  padding: 5px;
  border-bottom: 1px solid #ddd;
`;

const HistoryButton = styled.button`
  background-color: #ff6b6b;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 5px 10px;
  margin-left: 10px;
  cursor: pointer;
  font-size: 0.8rem;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);

  &:hover {
    background-color: #ff8787;
  }

  &:active {
    background-color: #ff4747;
  }
`;
