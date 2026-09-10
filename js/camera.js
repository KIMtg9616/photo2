import { CONFIG } from "./config.js";


/*
 ============================================================
 카메라 스트림 관리
 ============================================================
*/

let cameraStream = null;


/*
 카메라 실행
*/
export async function startCamera(videoElement) {

  try {

    /*
      이전 카메라 스트림이 있다면 먼저 종료합니다.
      향후 전/후면 카메라 전환 기능에도 사용할 수 있습니다.
    */
    stopCamera();


    /*
      width/height는 ideal 값입니다.
      스마트폰이 정확히 해당 해상도를 지원하지 않아도
      브라우저가 가장 가까운 카메라 모드를 선택합니다.
    */
    const constraints = {

      audio: false,

      video: {

        facingMode: {
          ideal: CONFIG.facingMode
        },

        width: {
          ideal: CONFIG.outputWidth
        },

        height: {
          ideal: CONFIG.outputHeight
        }

      }

    };


    cameraStream =
      await navigator.mediaDevices.getUserMedia(constraints);


    videoElement.srcObject = cameraStream;


    /*
      iOS Safari 안정성을 위해 명시적으로 play()를 호출합니다.
    */
    await videoElement.play();


    return {
      success: true,
      stream: cameraStream
    };

  }

  catch (error) {

    console.error("카메라 실행 오류:", error);

    return {
      success: false,
      error
    };

  }

}


/*
 카메라 종료
*/
export function stopCamera() {

  if (!cameraStream) {
    return;
  }

  cameraStream
    .getTracks()
    .forEach(track => track.stop());

  cameraStream = null;

}


/*
 현재 카메라가 실행 중인지 확인
*/
export function isCameraRunning() {

  return Boolean(
    cameraStream &&
    cameraStream.active
  );

}
