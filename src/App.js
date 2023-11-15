import React from "react";
import { useState, useEffect } from "react";
import styled from "styled-components";
import Display from "./Display";
import ButtonPanel from "./ButtonPanel";
import HistoryPanel from "./HistoryPanel";
import SpeechRecognitionComponent from "./SpeechRecognitionComponent";
import KeyboardComponent from "./KeyboardComponent";
import HistoryToggleComponent from "./HistoryToggleComponent";

function Calculator() {
  const [calc, setCalc] = useState("");

  // 계산 기록을 저장할 state 추가
  const [history, setHistory] = useState([]);
  // HistoryContainer 표시 여부를 제어하는 state
  const [showHistory, setShowHistory] = useState(false);

  const [pointCheck, setPointCheck] = useState(true);

  const [operCheck, setOperCheck] = useState(true);

  const allClear = () => {
    setPointCheck(true);
    setCalc((prev) => "");
  };

  const delCalc = () => {
    setPointCheck(true);
    setOperCheck(true);
    let str = String(calc).slice(0, -1);
    setCalc((prev) => str);
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

  return (
    <MainContainer>
      <MenuContainer>
        <SpeechRecognitionComponent
          calc={calc}
          setCalc={setCalc}
          getResult={getResult}
        />
        <HistoryToggleComponent
          showHistory={showHistory}
          setShowHistory={setShowHistory}
        />
      </MenuContainer>
      <KeyboardComponent
        calc={calc}
        operCheck={operCheck}
        setCalc={setCalc}
        setOperCheck={setOperCheck}
        setHistory={setHistory}
        history={history}
        delCalc={delCalc}
        allClear={allClear}
        pointCheck={pointCheck}
        getResult={getResult}
      />
      <Display value={calc} />
      <ButtonPanel
        calc={calc}
        setCalc={setCalc}
        setOperCheck={setOperCheck}
        operCheck={operCheck}
        setHistory={setHistory}
        history={history}
        allClear={allClear}
        delCalc={delCalc}
        getResult={getResult}
      />
      {showHistory && (
        <HistoryPanel history={history} setHistory={setHistory} />
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

const MenuContainer = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 40%;
  max-width: 450px;
  margin-bottom: 20px;
`;

export default Calculator;
