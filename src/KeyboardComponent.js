import { useEffect } from "react";

const KeyboardComponent = ({
  calc,
  operCheck,
  setCalc,
  setOperCheck,
  setHistory,
  history,
  delCalc,
  allClear,
  pointCheck,
}) => {
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

  // 컴포넌트 마운트 시 키보드 이벤트 리스너 추가
  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);

    // 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [calc, operCheck, pointCheck, history]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);

  return null; // This component doesn't render anything
};

export default KeyboardComponent;
