import React, { useEffect, useState } from "react";
import styled from "styled-components";

const SpeechRecognitionComponent = ({ calc, setCalc, getResult }) => {
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

    // 콘솔엔 음성 인식 결과가 잘 찍히는데
    // 문제 발생
    // setCalc(speechToText)를 호출한 직후에 getResult()를 호출하면
    // getResult() 함수가 실행될 때 calc 상태가 아직 업데이트되지 않았을 수 있음
    // -> useEffect로 calc 상태가 변경될 때마다 getResult를 호출!!
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

  useEffect(() => {
    if (calc !== "") {
      getResult();
    }
  }, [calc]);

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
