import React from "react";
import { useState, useEffect } from "react";
import styled from "styled-components";

function Calculator() {
  const [calc, setCalc] = useState("");
  const [operCheck, setOperCheck] = useState(true);
  const [pointCheck, setPointCheck] = useState(true);
  // 계산 기록을 저장할 state 추가
  const [history, setHistory] = useState([]);
  // 괄호 상태 관리를 위한 state 추가
  const [bracketOpen, setBracketOpen] = useState(false);

  // HistoryContainer 표시 여부를 제어하는 state
  const [showHistory, setShowHistory] = useState(false);

  // 음성 인식을 위한 state 추가
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onresult = (event) => {
      const speechToText = event.results[0][0].transcript;
      // 음성 인식 결과 처리
      setCalc(speechToText);
      console.log(speechToText);
    };

    // 음성 인식 시작 및 중지 함수
    const toggleListening = () => {
      if (isListening) {
        recognition.stop();
      } else {
        recognition.start();
      }
    };

    // 아이콘 클릭 이벤트에 함수 연결
    const iconElement = document.getElementById("voice-icon");
    iconElement.addEventListener("click", toggleListening);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      iconElement.removeEventListener("click", toggleListening);
    };
  }, [isListening]);

  const toggleHistory = () => {
    setShowHistory(!showHistory);
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

  // 기존 코드
  // const getResult = () => {
  //   let replace_str = calc.replace(/×/gi, "*").replace(/÷/gi, "/");

  //   if (isNaN(eval(replace_str))) {
  //     setCalc("");
  //   } else if (eval(replace_str) == Infinity) {
  //     alert("0으로 나눌수 없습니다.");
  //     setCalc("");
  //     return false;
  //   } else {
  //     setCalc((prev) => eval(replace_str));
  //   }
  // };

  // 소수점 문제 해결!!
  // 문제
  // eval 함수: 문자열을 코드로 실행 -> 문자열 내 숫자가 0으로 시작할 경우 8진수로 해석하려고 시도
  // 그러나 자바스크립트의 strict mode에서는 8진수 리터럴이 허용되지 않음

  // 해결
  // 입력한 값이 0으로 시작하는 경우 10진수로 변환하는 로직 추가

  const getResult = () => {
    let replace_str = calc
      .replace(/×/g, "*")
      .replace(/÷/g, "/")
      .replace(/\b0+(?![.])/g, ""); // 0으로 시작하는 숫자에서 선행 0 제거
    // 0으로 시작하는 숫자가 10진수로 처리되도록

    try {
      let result = Function('"use strict"; return (' + replace_str + ")")();
      if (!isNaN(result) && result !== Infinity) {
        // 계산 결과 업데이트와 동시에 계산 기록 추가
        setCalc(String(result));
        setHistory([...history, `${calc} = ${result}`]); // 계산 수식과 결과를 history에 추가
      }
      // ...기존 오류 처리 로직
    } catch (e) {
      alert("계산 오류: " + e.message);
      setCalc("");
    }
  };

  const delCalc = () => {
    setPointCheck(true);
    setOperCheck(true);
    let str = String(calc).slice(0, -1);
    setCalc((prev) => str);
  };

  const allClear = () => {
    setPointCheck(true);
    setCalc((prev) => "");
  };

  // 기존의 마우스 온클릭에서 키보드 이벤트로 바꾸고 싶었다
  // 키보드 입력 처리 함수
  const handleKeyPress = (event) => {
    const { key } = event;
    if (key >= "0" && key <= "9") {
      getNum({ target: { value: key } });
    } else if (["/", "*", "-", "+", "%"].includes(key)) {
      getOper({ target: { value: key } });
    } else if (key === ".") {
      getPoint({ target: { value: key } });
    } else if (key === "Enter") {
      getResult();
    } else if (key === "Backspace") {
      delCalc();
    } else if (key === "Escape") {
      allClear();
    }
  };

  const handleBracket = () => {
    if (bracketOpen) {
      setCalc((prev) => prev + ")");
      setBracketOpen(false);
    } else {
      setCalc((prev) => prev + "(");
      setBracketOpen(true);
    }
  };

  // 컴포넌트 마운트 시 키보드 이벤트 리스너 추가
  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);

    // 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [calc, operCheck, pointCheck, history]);

  const handleDeleteHistory = (index) => {
    setHistory((currentHistory) =>
      currentHistory.filter((_, i) => i !== index)
    );
  };

  return (
    <MainContainer>
      <InputBar readOnly value={calc} />
      <MenuContainer>
        <Icon onClick={toggleHistory}>⏰</Icon>{" "}
        {/* 시계 아이콘 대신 텍스트로 표시 */}
        <Icon id="voice-icon">{isListening ? "🛑" : "🎤"}</Icon>
      </MenuContainer>
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
      {showHistory && (
        <HistoryContainer>
          {history.map((record, index) => (
            <HistoryEntry key={index}>
              <HistoryItem>{record}</HistoryItem>
              <HistoryButton onClick={() => handleDeleteHistory(index)}>
                삭제
              </HistoryButton>
            </HistoryEntry>
          ))}
        </HistoryContainer>
      )}
    </MainContainer>
  );
}

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

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

const InputBar = styled.input`
  width: 40%;
  max-width: 450px;
  height: 65px;
  margin-bottom: 10px;
  border-radius: 10px;
  font-size: 30px;
  border: 2px solid #4b89dc;
  text-align: right;
  padding-right: 20px;
  &:focus {
    outline: none;
  }
`;

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

const MenuContainer = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 40%;
  max-width: 450px;
  margin-bottom: 20px;
`;

const Icon = styled.div`
  font-size: 2rem;
  cursor: pointer;
`;

export default Calculator;
