import {
  startCamera
} from "./camera.js";


import {
  BackgroundManager
} from "./backgrounds.js";


import {
  capturePhoto,
  downloadPhoto
} from "./capture.js";


/*
 ============================================================
 DOM 요소
 ============================================================
*/

const videoElement =
  document.getElementById(
    "cameraVideo"
  );


const cameraMessage =
  document.getElementById(
    "cameraMessage"
  );


const backgroundOverlay =
  document.getElementById(
    "backgroundOverlay"
  );


const backgroundList =
  document.getElementById(
    "backgroundList"
  );


const captureButton =
  document.getElementById(
    "captureButton"
  );


const captureCanvas =
  document.getElementById(
    "captureCanvas"
  );


const cameraFlash =
  document.getElementById(
    "cameraFlash"
  );


const resultSection =
  document.getElementById(
    "resultSection"
  );


const resultImage =
  document.getElementById(
    "resultImage"
  );


const retryButton =
  document.getElementById(
    "retryButton"
  );


const downloadButton =
  document.getElementById(
    "downloadButton"
  );


/*
 ============================================================
 배경 관리자
 ============================================================
*/

const backgroundManager =
  new BackgroundManager(
    backgroundList,
    backgroundOverlay
  );


/*
 ============================================================
 현재 촬영 결과 데이터
 ============================================================
*/

let currentPhotoBlob = null;

let currentPhotoUrl = null;


/*
 ============================================================
 초기 실행
 ============================================================
*/

async function initialize() {

  /*
   배경 선택 UI 생성
  */
  backgroundManager.render();


  /*
   브라우저의 카메라 API 지원 여부 확인
  */
  if (
    !navigator.mediaDevices ||
    !navigator.mediaDevices.getUserMedia
  ) {

    cameraMessage.textContent =
      "이 브라우저에서는 카메라 기능을 사용할 수 없습니다.";

    return;

  }


  cameraMessage.textContent =
    "카메라 권한을 허용해 주세요.";


  /*
   카메라 실행
  */
  const cameraResult =
    await startCamera(
      videoElement
    );


  if (!cameraResult.success) {

    handleCameraError(
      cameraResult.error
    );

    return;

  }


  /*
   카메라 영상 데이터가 실제로 준비될 때까지 대기
  */
  await waitForVideoReady();


  cameraMessage.classList.add(
    "hidden"
  );


  captureButton.disabled =
    false;

}


/*
 ============================================================
 카메라 영상 준비 대기
 ============================================================
*/

function waitForVideoReady() {

  return new Promise(resolve => {

    /*
     이미 영상이 준비된 경우
    */
    if (
      videoElement.readyState >= 2 &&
      videoElement.videoWidth > 0
    ) {

      resolve();

      return;

    }


    videoElement.addEventListener(
      "loadeddata",
      () => {

        resolve();

      },
      {
        once: true
      }
    );

  });

}


/*
 ============================================================
 카메라 오류 처리
 ============================================================
*/

function handleCameraError(error) {

  console.error(error);


  let message =
    "카메라를 실행할 수 없습니다.";


  /*
   카메라 권한 거부
  */
  if (
    error.name === "NotAllowedError" ||
    error.name === "PermissionDeniedError"
  ) {

    message =
      "카메라 권한이 허용되지 않았습니다.\n" +
      "브라우저 설정에서 카메라 권한을 허용해 주세요.";

  }


  /*
   카메라 장치 없음
  */
  else if (
    error.name === "NotFoundError" ||
    error.name === "DevicesNotFoundError"
  ) {

    message =
      "사용 가능한 카메라를 찾을 수 없습니다.";

  }


  /*
   다른 앱 또는 시스템에서 카메라를 사용 중인 경우
  */
  else if (
    error.name === "NotReadableError"
  ) {

    message =
      "카메라를 사용할 수 없습니다.\n" +
      "다른 앱에서 카메라를 사용 중인지 확인해 주세요.";

  }


  cameraMessage.innerText =
    message;

}


/*
 ============================================================
 촬영 플래시
 ============================================================
*/

function playFlash() {

  cameraFlash.classList.remove(
    "active"
  );


  /*
   같은 애니메이션을 반복 실행하기 위한 reflow
  */
  void cameraFlash.offsetWidth;


  cameraFlash.classList.add(
    "active"
  );

}


/*
 ============================================================
 촬영 버튼
 ============================================================
*/

captureButton.addEventListener(
  "click",
  async () => {

    /*
     촬영 중 연속 입력 방지
    */
    captureButton.disabled =
      true;


    try {

      playFlash();


      const selectedBackground =
        backgroundManager
          .getSelectedBackground();


      /*
       카메라 + 선택된 정적 배경을 합성하여 PNG Blob 생성
      */
      const photoBlob =
        await capturePhoto(
          videoElement,
          captureCanvas,
          selectedBackground
        );


      /*
       이전 촬영 결과 URL이 있다면 메모리 해제
      */
      if (currentPhotoUrl) {

        URL.revokeObjectURL(
          currentPhotoUrl
        );

      }


      currentPhotoBlob =
        photoBlob;


      currentPhotoUrl =
        URL.createObjectURL(
          photoBlob
        );


      resultImage.src =
        currentPhotoUrl;


      resultSection.classList.remove(
        "hidden"
      );


      /*
       촬영 결과 위치로 부드럽게 이동
      */
      resultSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

    }

    catch (error) {

      console.error(
        "촬영 오류:",
        error
      );


      alert(
        "사진 촬영 중 오류가 발생했습니다.\n" +
        error.message
      );

    }

    finally {

      captureButton.disabled =
        false;

    }

  }
);


/*
 ============================================================
 다시 찍기
 ============================================================
*/

retryButton.addEventListener(
  "click",
  () => {

    resultSection.classList.add(
      "hidden"
    );


    if (currentPhotoUrl) {

      URL.revokeObjectURL(
        currentPhotoUrl
      );

      currentPhotoUrl = null;

    }


    currentPhotoBlob =
      null;


    resultImage.removeAttribute(
      "src"
    );


    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  }
);


/*
 ============================================================
 PNG 저장
 ============================================================
*/

downloadButton.addEventListener(
  "click",
  () => {

    if (!currentPhotoBlob) {

      alert(
        "저장할 사진이 없습니다."
      );

      return;

    }


    downloadPhoto(
      currentPhotoBlob
    );

  }
);


/*
 ============================================================
 페이지 초기화
 ============================================================
*/

initialize();
