import React, { useEffect, useState } from "react";
import styled from "styled-components";

const SpeechRecognitionComponent = ({ setCalc, getResult }) => {
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
      getResult();
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

  return isListening ? (
    <Icon id="voice-icon">🛑</Icon>
  ) : (
    <Icon id="voice-icon">🎙️</Icon>
  );
};

const Icon = styled.div`
  font-size: 2rem;
  cursor: pointer;
`;

export default SpeechRecognitionComponent;
