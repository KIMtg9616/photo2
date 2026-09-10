/* ============================================================
   app.js
   ------------------------------------------------------------
   전체 웹사이트 기능을 연결하는 메인 JavaScript 파일

   주요 기능
   1. 카메라 실행
   2. 배경 선택
   3. 사진 촬영
   4. 촬영 결과 표시
   5. PNG 저장
   6. 다시 찍기
   7. 전면 ↔ 후면 카메라 전환
   ============================================================ */


/* ============================================================
   카메라 기능 불러오기
   ============================================================ */

import {

  startCamera,

  switchCamera,

  getCurrentFacingMode

} from "./camera.js";



/* ============================================================
   배경 선택 기능 불러오기
   ============================================================ */

import {

  BackgroundManager

} from "./backgrounds.js";



/* ============================================================
   촬영 및 저장 기능 불러오기
   ============================================================ */

import {

  capturePhoto,

  downloadPhoto

} from "./capture.js";



/* ============================================================
   HTML 요소 가져오기
   ============================================================ */


/* 실시간 카메라 video */

const videoElement =
  document.getElementById(
    "cameraVideo"
  );



/* 카메라 상태 메시지 */

const cameraMessage =
  document.getElementById(
    "cameraMessage"
  );



/* 선택한 배경 이미지 */

const backgroundOverlay =
  document.getElementById(
    "backgroundOverlay"
  );



/* 배경 선택 목록 */

const backgroundList =
  document.getElementById(
    "backgroundList"
  );



/* 촬영 버튼 */

const captureButton =
  document.getElementById(
    "captureButton"
  );



/* ============================================================
   새로 추가된 카메라 전환 버튼

   index.html의

   id="switchCameraButton"

   과 연결됩니다.
   ============================================================ */

const switchCameraButton =
  document.getElementById(
    "switchCameraButton"
  );



/* 실제 PNG 생성용 Canvas */

const captureCanvas =
  document.getElementById(
    "captureCanvas"
  );



/* 촬영 플래시 */

const cameraFlash =
  document.getElementById(
    "cameraFlash"
  );



/* 촬영 결과 영역 */

const resultSection =
  document.getElementById(
    "resultSection"
  );



/* 촬영 결과 이미지 */

const resultImage =
  document.getElementById(
    "resultImage"
  );



/* 다시 찍기 버튼 */

const retryButton =
  document.getElementById(
    "retryButton"
  );



/* PNG 저장 버튼 */

const downloadButton =
  document.getElementById(
    "downloadButton"
  );



/* ============================================================
   배경 관리자 생성
   ============================================================ */

const backgroundManager =
  new BackgroundManager(

    backgroundList,

    backgroundOverlay

  );



/* ============================================================
   현재 촬영된 사진 데이터
   ============================================================ */

let currentPhotoBlob =
  null;


let currentPhotoUrl =
  null;



/* ============================================================
   웹페이지 초기화
   ============================================================ */

async function initialize() {


  /* ----------------------------------------------------------
     1. 배경 선택 UI 생성
     ---------------------------------------------------------- */

  backgroundManager.render();



  /* ----------------------------------------------------------
     2. 브라우저 카메라 API 지원 확인
     ---------------------------------------------------------- */

  if (

    !navigator.mediaDevices ||

    !navigator.mediaDevices.getUserMedia

  ) {


    cameraMessage.textContent =
      "이 브라우저에서는 카메라 기능을 사용할 수 없습니다.";


    return;

  }



  /* ----------------------------------------------------------
     3. 사용자에게 카메라 권한 안내
     ---------------------------------------------------------- */

  cameraMessage.textContent =
    "카메라 권한을 허용해 주세요.";



  /* ----------------------------------------------------------
     4. 카메라 실행

     기본값은 config.js의 facingMode를 사용합니다.

     현재 설정:
     user = 전면 카메라
     ---------------------------------------------------------- */

  const cameraResult =
    await startCamera(
      videoElement
    );



  /* 카메라 실행 실패 */

  if (!cameraResult.success) {


    handleCameraError(
      cameraResult.error
    );


    return;

  }



  /* ----------------------------------------------------------
     5. 실제 영상 데이터 준비 대기
     ---------------------------------------------------------- */

  await waitForVideoReady();



  /* ----------------------------------------------------------
     6. 현재 카메라 방향에 맞게
        미리보기 좌우 반전 상태 설정
     ---------------------------------------------------------- */

  updateCameraPreviewDirection();



  /* ----------------------------------------------------------
     7. 카메라 준비 메시지 숨김
     ---------------------------------------------------------- */

  cameraMessage.classList.add(
    "hidden"
  );



  /* ----------------------------------------------------------
     8. 촬영 버튼 활성화
     ---------------------------------------------------------- */

  captureButton.disabled =
    false;



  /* ----------------------------------------------------------
     9. 카메라 전환 버튼 활성화
     ---------------------------------------------------------- */

  if (switchCameraButton) {

    switchCameraButton.disabled =
      false;

  }

}



/* ============================================================
   카메라 영상 준비 대기
   ============================================================ */

function waitForVideoReady() {


  return new Promise(
    resolve => {


      /* --------------------------------------------------------
         이미 카메라 영상이 준비되어 있다면
         바로 다음 단계로 이동
         -------------------------------------------------------- */

      if (

        videoElement.readyState >= 2 &&

        videoElement.videoWidth > 0 &&

        videoElement.videoHeight > 0

      ) {


        resolve();


        return;

      }



      /* --------------------------------------------------------
         아직 준비되지 않았다면
         loadeddata 이벤트가 발생할 때까지 대기
         -------------------------------------------------------- */

      videoElement.addEventListener(

        "loadeddata",

        () => {


          resolve();

        },

        {

          once: true

        }

      );

    }
  );

}



/* ============================================================
   카메라 미리보기 방향 조절
   ============================================================

   전면 카메라:
   일반 셀카처럼 거울 모드

   후면 카메라:
   좌우 반전 없음

   style.css의

   #cameraVideo.rear-camera

   와 연결됩니다.
   ============================================================ */

function updateCameraPreviewDirection() {


  const facingMode =
    getCurrentFacingMode();



  /* ----------------------------------------------------------
     후면 카메라이면 rear-camera 클래스 추가

     전면 카메라이면 rear-camera 클래스 제거
     ---------------------------------------------------------- */

  videoElement.classList.toggle(

    "rear-camera",

    facingMode === "environment"

  );

}



/* ============================================================
   카메라 오류 처리
   ============================================================ */

function handleCameraError(error) {


  console.error(
    "카메라 오류:",
    error
  );



  let message =
    "카메라를 실행할 수 없습니다.";



  /* ----------------------------------------------------------
     카메라 권한 거부
     ---------------------------------------------------------- */

  if (

    error.name === "NotAllowedError" ||

    error.name === "PermissionDeniedError"

  ) {


    message =
      "카메라 권한이 허용되지 않았습니다.\n" +
      "브라우저 설정에서 카메라 권한을 허용해 주세요.";

  }



  /* ----------------------------------------------------------
     사용 가능한 카메라 없음
     ---------------------------------------------------------- */

  else if (

    error.name === "NotFoundError" ||

    error.name === "DevicesNotFoundError"

  ) {


    message =
      "사용 가능한 카메라를 찾을 수 없습니다.";

  }



  /* ----------------------------------------------------------
     다른 앱에서 카메라를 사용하고 있는 경우
     ---------------------------------------------------------- */

  else if (

    error.name === "NotReadableError"

  ) {


    message =
      "카메라를 사용할 수 없습니다.\n" +
      "다른 앱에서 카메라를 사용 중인지 확인해 주세요.";

  }



  /* ----------------------------------------------------------
     카메라 제약 조건 문제
     ---------------------------------------------------------- */

  else if (

    error.name === "OverconstrainedError"

  ) {


    message =
      "현재 기기에서 요청한 카메라 설정을 사용할 수 없습니다.";

  }



  cameraMessage.innerText =
    message;



  cameraMessage.classList.remove(
    "hidden"
  );

}



/* ============================================================
   촬영 플래시 효과
   ============================================================ */

function playFlash() {


  /* 기존 애니메이션 제거 */

  cameraFlash.classList.remove(
    "active"
  );



  /* ----------------------------------------------------------
     같은 CSS 애니메이션을 반복 실행하기 위해
     브라우저 reflow를 강제로 발생시킵니다.
     ---------------------------------------------------------- */

  void cameraFlash.offsetWidth;



  /* 플래시 실행 */

  cameraFlash.classList.add(
    "active"
  );

}



/* ============================================================
   카메라 전환 버튼

   전면 → 후면
   후면 → 전면

   순서로 전환됩니다.
   ============================================================ */

if (switchCameraButton) {


  switchCameraButton.addEventListener(

    "click",

    async () => {


      /* --------------------------------------------------------
         카메라를 바꾸는 동안

         - 촬영 버튼
         - 전환 버튼

         을 비활성화하여 중복 입력을 막습니다.
         -------------------------------------------------------- */

      captureButton.disabled =
        true;


      switchCameraButton.disabled =
        true;



      /* --------------------------------------------------------
         사용자에게 전환 중임을 표시
         -------------------------------------------------------- */

      cameraMessage.textContent =
        "카메라를 전환하고 있습니다.";


      cameraMessage.classList.remove(
        "hidden"
      );



      try {


        /* ------------------------------------------------------
           실제 전면 ↔ 후면 카메라 전환
           ------------------------------------------------------ */

        const result =
          await switchCamera(
            videoElement
          );



        /* 전환 실패 */

        if (!result.success) {


          throw (
            result.error ||
            new Error(
              "카메라를 전환할 수 없습니다."
            )
          );

        }



        /* ------------------------------------------------------
           새 카메라 영상 준비 대기
           ------------------------------------------------------ */

        await waitForVideoReady();



        /* ------------------------------------------------------
           전면 / 후면에 맞게
           화면 좌우 반전 상태 변경
           ------------------------------------------------------ */

        updateCameraPreviewDirection();



        /* ------------------------------------------------------
           상태 메시지 숨기기
           ------------------------------------------------------ */

        cameraMessage.classList.add(
          "hidden"
        );

      }


      catch (error) {


        console.error(
          "카메라 전환 오류:",
          error
        );



        /* ------------------------------------------------------
           카메라 전환이 불가능한 경우
           ------------------------------------------------------ */

        cameraMessage.textContent =
          "다른 카메라로 전환할 수 없습니다.";



        /* ------------------------------------------------------
           약 1.5초 후 메시지 제거
           ------------------------------------------------------ */

        window.setTimeout(

          () => {


            cameraMessage.classList.add(
              "hidden"
            );

          },

          1500

        );

      }


      finally {


        /* ------------------------------------------------------
           버튼 다시 활성화
           ------------------------------------------------------ */

        captureButton.disabled =
          false;


        switchCameraButton.disabled =
          false;

      }

    }

  );

}



/* ============================================================
   촬영 버튼
   ============================================================ */

captureButton.addEventListener(

  "click",

  async () => {


    /* ----------------------------------------------------------
       촬영 중 연속 클릭 방지
       ---------------------------------------------------------- */

    captureButton.disabled =
      true;



    /*
      촬영하는 순간에는
      카메라 전환도 잠시 막습니다.
    */

    if (switchCameraButton) {

      switchCameraButton.disabled =
        true;

    }



    try {


      /* 촬영 플래시 */

      playFlash();



      /* --------------------------------------------------------
         현재 선택된 배경 가져오기
         -------------------------------------------------------- */

      const selectedBackground =
        backgroundManager
          .getSelectedBackground();



      /* --------------------------------------------------------
         실제 사진 생성

         camera + background
         → Canvas
         → PNG Blob
         -------------------------------------------------------- */

      const photoBlob =
        await capturePhoto(

          videoElement,

          captureCanvas,

          selectedBackground

        );



      /* --------------------------------------------------------
         이전 촬영 결과 URL이 있다면 메모리 해제
         -------------------------------------------------------- */

      if (currentPhotoUrl) {


        URL.revokeObjectURL(
          currentPhotoUrl
        );

      }



      /* 새 촬영 데이터 저장 */

      currentPhotoBlob =
        photoBlob;



      /* --------------------------------------------------------
         Blob을 화면에 표시할 임시 URL로 변환
         -------------------------------------------------------- */

      currentPhotoUrl =
        URL.createObjectURL(
          photoBlob
        );



      /* 결과 이미지 표시 */

      resultImage.src =
        currentPhotoUrl;



      /* 결과 영역 표시 */

      resultSection.classList.remove(
        "hidden"
      );



      /* --------------------------------------------------------
         촬영 결과 영역으로 부드럽게 이동
         -------------------------------------------------------- */

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

        (
          error.message ||
          "다시 시도해 주세요."
        )

      );

    }


    finally {


      /* 촬영 버튼 다시 활성화 */

      captureButton.disabled =
        false;



      /* 카메라 전환 버튼 다시 활성화 */

      if (switchCameraButton) {

        switchCameraButton.disabled =
          false;

      }

    }

  }

);



/* ============================================================
   다시 찍기
   ============================================================ */

retryButton.addEventListener(

  "click",

  () => {


    /* ----------------------------------------------------------
       촬영 결과 화면 숨김
       ---------------------------------------------------------- */

    resultSection.classList.add(
      "hidden"
    );



    /* ----------------------------------------------------------
       이전 Object URL 메모리 해제
       ---------------------------------------------------------- */

    if (currentPhotoUrl) {


      URL.revokeObjectURL(
        currentPhotoUrl
      );


      currentPhotoUrl =
        null;

    }



    /* 촬영 Blob 초기화 */

    currentPhotoBlob =
      null;



    /* 결과 이미지 제거 */

    resultImage.removeAttribute(
      "src"
    );



    /* ----------------------------------------------------------
       다시 카메라 상단으로 이동
       ---------------------------------------------------------- */

    window.scrollTo({

      top: 0,

      behavior: "smooth"

    });

  }

);



/* ============================================================
   PNG 저장 버튼
   ============================================================ */

downloadButton.addEventListener(

  "click",

  () => {


    /* ----------------------------------------------------------
       촬영된 사진이 없는 경우
       ---------------------------------------------------------- */

    if (!currentPhotoBlob) {


      alert(
        "저장할 사진이 없습니다."
      );


      return;

    }



    /* ----------------------------------------------------------
       capture.js의 다운로드 기능 실행
       ---------------------------------------------------------- */

    downloadPhoto(
      currentPhotoBlob
    );

  }

);



/* ============================================================
   페이지 실행
   ============================================================ */

initialize();
