import React, { useState } from "react";
import styled from "styled-components";

const ButtonPanel = ({
  calc,
  setCalc,
  operCheck,
  setOperCheck,
  allClear,
  delCalc,
  getResult,
}) => {
  // 괄호 상태 관리를 위한 state 추가
  const [bracketOpen, setBracketOpen] = useState(false);

  const handleBracket = () => {
    if (bracketOpen) {
      setCalc((prev) => prev + ")");
      setBracketOpen(false);
    } else {
      setCalc((prev) => prev + "(");
      setBracketOpen(true);
    }
  };

  const getNum = (e) => {
    setCalc((prev) => prev + e.target.value);
    setOperCheck(true);
  };

  const getOper = (e) => {
    if (operCheck) {
      setCalc((prev) => prev + e.target.value);
      setOperCheck(false);
    }
  };

  // 소수점이 한번만 눌리는 문제 해결
  // 현재 입력 중인 숫자의 끝 부분을 확인하고 만약 마지막 입력이 소수점이 아니라면 새로운 소수점을 추가할 수 있도록 로직 변경

  const getPoint = () => {
    if (calc.length === 0) {
      setCalc("0.");
      return;
    }

    // 가장 최근 연산자의 위치를 찾아 현재 입력 중인 숫자를 확인
    const lastOperIndex = Math.max(
      calc.lastIndexOf("+"),
      calc.lastIndexOf("-"),
      calc.lastIndexOf("*"),
      calc.lastIndexOf("/"),
      calc.lastIndexOf("%")
    );
    const currentNumber = calc.substring(lastOperIndex + 1);

    // 현재 숫자에 소수점이 없으면 소수점 추가
    if (!currentNumber.includes(".")) {
      setCalc(calc + ".");
    }
  };

  return (
    <ButtonContainer>
      <Button onClick={allClear}>AC</Button>
      <Button onClick={delCalc}>DEL</Button>
      <Button onClick={handleBracket}>{bracketOpen ? ")" : "("}</Button>
      <CalButton value="%" onClick={getOper}>
        %
      </CalButton>
      <CalButton value="÷" onClick={getOper}>
        ÷
      </CalButton>
      <Button value={7} onClick={getNum}>
        7
      </Button>
      <Button value={8} onClick={getNum}>
        8
      </Button>
      <Button value={9} onClick={getNum}>
        9
      </Button>
      <CalButton value="×" onClick={getOper}>
        ×
      </CalButton>
      <Button value={4} onClick={getNum}>
        4
      </Button>
      <Button value={5} onClick={getNum}>
        5
      </Button>
      <Button value={6} onClick={getNum}>
        6
      </Button>
      <CalButton value="-" onClick={getOper}>
        -
      </CalButton>
      <Button value={1} onClick={getNum}>
        1
      </Button>
      <Button value={2} onClick={getNum}>
        2
      </Button>
      <Button value={3} onClick={getNum}>
        3
      </Button>
      <CalButton value="+" onClick={getOper}>
        +
      </CalButton>
      <ZeroButton value={0} onClick={getNum}>
        0
      </ZeroButton>
      <Button value="." onClick={getPoint}>
        .
      </Button>
      <CalButton onClick={getResult}>=</CalButton>
    </ButtonContainer>
  );
};

export default ButtonPanel;

// Button과 ButtonContainer 스타일링을 여기에 추가
const ButtonContainer = styled.div`
  display: grid;
  width: 40%;
  max-width: 450px;
  height: 50%;
  grid-template-columns: repeat(4, 1fr);
  grid-column-gap: 10px;
  grid-row-gap: 10px;
`;

const Button = styled.button`
  background-color: #f2f3f5;
  border: none;
  color: black;
  font-size: 1.5rem;
  border-radius: 35px;
  cursor: pointer;
  box-shadow: 3px 3px 3px lightgray;

  &:active {
    margin-left: 2px;
    margin-top: 2px;
    box-shadow: none;
  }
`;

const CalButton = styled(Button)`
  font-size: 2rem;
  color: white;
  background-color: #4b89dc;
`;

const ZeroButton = styled(Button)``;
