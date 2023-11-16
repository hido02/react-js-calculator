import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { evaluate } from "mathjs";

const SpeechRecognitionComponent = ({ calc, setCalc, history, setHistory }) => {
  const [isListening, setIsListening] = useState(false);
  let recognition;

  useEffect(() => {
    if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
      recognition = new (window.SpeechRecognition ||
        window.webkitSpeechRecognition)();

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onresult = (event) => {
        const speechToText = event.results[0][0].transcript;
        setCalc(speechToText);
      };
    }

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, []);

  const getSpeechResult = () => {
    try {
      // 입력 정제
      let expression = calc.trim();
      expression = expression.replace(/equals/g, "="); // 'equals'를 '='로 변환
      expression = expression.replace(/\s/g, ""); // 공백 제거

      console.log("평가할 표현식:", expression); // 로깅

      if (expression.endsWith("=")) {
        expression = expression.slice(0, -1); // '=' 제거
      }

      const result = evaluate(expression);
      setCalc(result.toString());
      setHistory([...history, `${calc} ${result}`]);
    } catch (error) {
      console.error("계산 오류", error);
    }
  };

  useEffect(() => {
    if (calc.endsWith("=")) {
      console.log("=으로 끝남");
      getSpeechResult();
    }
  }, [calc]);

  const toggleListening = () => {
    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
  };

  return (
    <Icon id="voice-icon" onClick={toggleListening}>
      {isListening ? "🛑" : "🎙️"}
    </Icon>
  );
};

const Icon = styled.div`
  font-size: 2rem;
  cursor: pointer;
`;

export default SpeechRecognitionComponent;
