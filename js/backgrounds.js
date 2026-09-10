import { CONFIG } from "./config.js";


/*
 ============================================================
 정적 배경 선택 관리
 ============================================================
*/

export class BackgroundManager {

  constructor(
    listElement,
    overlayElement
  ) {

    this.listElement =
      listElement;


    this.overlayElement =
      overlayElement;


    /*
      기본값:
      config.js의 첫 번째 배경
    */

    this.selectedBackground =
      CONFIG.backgrounds[0];


    /*
      배경 선택 Toast
    */

    this.toastElement =
      document.getElementById(
        "backgroundToast"
      );


    /*
      Toast 타이머
    */

    this.toastTimer =
      null;

  }



  /*
 ============================================================
 배경 선택 UI 생성
 ============================================================
 */

  render() {


    /*
      기존 목록 초기화
    */

    this.listElement.innerHTML =
      "";



    /*
      config.js에 등록된 모든 배경 생성
    */

    CONFIG.backgrounds.forEach(
      (
        background,
        index
      ) => {


        /*
         ========================================================
         배경 버튼
         ========================================================
        */

        const button =
          document.createElement(
            "button"
          );


        button.type =
          "button";


        button.className =
          "background-item";


        button.dataset.backgroundId =
          background.id;


        /*
          화면에는 제목을 표시하지 않지만
          스크린리더에서는 배경 이름을 알 수 있습니다.
        */

        button.setAttribute(
          "aria-label",
          `${background.name} 선택`
        );



        /*
          첫 번째 배경 기본 선택
        */

        if (index === 0) {


          button.classList.add(
            "selected"
          );


          button.setAttribute(
            "aria-pressed",
            "true"
          );

        }

        else {


          button.setAttribute(
            "aria-pressed",
            "false"
          );

        }



        /*
         ========================================================
         배경 없음
         ========================================================
        */

        if (!background.thumbnail) {


          const noneBox =
            document.createElement(
              "div"
            );


          noneBox.className =
            "background-none";


          noneBox.textContent =
            "없음";


          button.appendChild(
            noneBox
          );

        }



        /*
         ========================================================
         이미지가 있는 배경
         ========================================================
        */

        else {


          const image =
            document.createElement(
              "img"
            );


          image.className =
            "background-thumbnail";


          /*
            원본 이미지를 그대로 사용합니다.

            예:
            1448×1086 PNG

            하지만 CSS에서 화면 표시 크기를
            104×78px로 제한합니다.
          */

          image.src =
            background.thumbnail;


          image.alt =
            "";


          /*
            화면 밖에 있는 이미지는 필요할 때 로딩합니다.
          */

          image.loading =
            "lazy";


          /*
            이미지 디코딩을 비동기로 처리합니다.

            큰 PNG 이미지 때문에
            메인 UI가 잠깐 멈추는 현상을 줄이는 데 도움이 됩니다.
          */

          image.decoding =
            "async";


          /*
            썸네일은 우선순위를 낮춥니다.

            카메라 실행 등 핵심 기능을 먼저 처리할 수 있게 합니다.
          */

          try {

            image.fetchPriority =
              "low";

          }

          catch (error) {

            /*
              일부 구형 브라우저에서는
              fetchPriority를 지원하지 않아도 문제가 없습니다.
            */

          }


          /*
            레이아웃 계산 전에 브라우저가
            썸네일 비율을 알 수 있도록 힌트 제공

            CSS 실제 표시 크기는
            104×78px입니다.
          */

          image.width =
            104;


          image.height =
            78;


          /*
            이미지 드래그 방지
          */

          image.draggable =
            false;



          /*
            이미지 로딩 실패 시
            버튼 자체는 남겨두고 깨진 이미지 아이콘은 숨깁니다.
          */

          image.addEventListener(
            "error",
            () => {


              image.style.display =
                "none";


              button.classList.add(
                "image-load-error"
              );


            }
          );



          button.appendChild(
            image
          );

        }



        /*
         ========================================================
         클릭
         ========================================================
        */

        button.addEventListener(

          "click",

          () => {


            this.select(
              background,
              button
            );


          }

        );



        /*
          목록에 추가
        */

        this.listElement.appendChild(
          button
        );


      }
    );

  }



  /*
 ============================================================
 실제 배경 선택
 ============================================================
 */

  select(
    background,
    selectedButton
  ) {


    /*
      현재 선택 배경 저장
    */

    this.selectedBackground =
      background;



    /*
      기존 선택 상태 제거
    */

    const buttons =
      this.listElement.querySelectorAll(
        ".background-item"
      );


    buttons.forEach(
      button => {


        button.classList.remove(
          "selected"
        );


        button.setAttribute(
          "aria-pressed",
          "false"
        );


      }
    );



    /*
      새 선택 상태
    */

    selectedButton.classList.add(
      "selected"
    );


    selectedButton.setAttribute(
      "aria-pressed",
      "true"
    );



    /*
     ============================================================
     배경 없음
     ============================================================
    */

    if (!background.src) {


      this.overlayElement.removeAttribute(
        "src"
      );


      this.overlayElement.style.display =
        "none";


      /*
        하단 알림
      */

      this.showToast(
        "배경을 사용하지 않습니다."
      );


      return;

    }



    /*
     ============================================================
     선택된 원본 배경 표시
     ============================================================

     썸네일은 104×78px로 작게 표시하지만,
     실제 카메라에는 원본 이미지를 그대로 사용합니다.

     따라서 최종 촬영 품질은 낮아지지 않습니다.
    */

    this.overlayElement.src =
      background.src;


    this.overlayElement.style.display =
      "block";



    /*
     ============================================================
     배경 선택 알림
     ============================================================
    */

    this.showToast(
      `${background.name} 배경을 선택했습니다.`
    );

  }



  /*
 ============================================================
 하단 Toast 알림
 ============================================================
 */

  showToast(message) {


    /*
      Toast HTML이 없다면 종료
    */

    if (!this.toastElement) {

      return;

    }



    /*
      이전 Toast 타이머 초기화
    */

    if (this.toastTimer) {


      clearTimeout(
        this.toastTimer
      );


      this.toastTimer =
        null;

    }



    /*
      기존 표시 상태 초기화
    */

    this.toastElement.classList.remove(
      "show"
    );



    /*
      새 메시지
    */

    this.toastElement.textContent =
      message;



    /*
      같은 애니메이션을 반복하기 위한 reflow
    */

    void this.toastElement.offsetWidth;



    /*
      Toast 표시
    */

    this.toastElement.classList.add(
      "show"
    );



    /*
      1.5초 후 자동으로 숨김
    */

    this.toastTimer =
      window.setTimeout(

        () => {


          this.toastElement.classList.remove(
            "show"
          );


          this.toastTimer =
            null;


        },

        1500

      );

  }



  /*
 ============================================================
 현재 선택된 배경 반환
 ============================================================
 */

  getSelectedBackground() {


    return this.selectedBackground;

  }

}
