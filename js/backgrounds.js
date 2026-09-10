import { CONFIG } from "./config.js";


/*
 ============================================================
 배경 선택 관리
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
      기본 배경
    */

    this.selectedBackground =
      CONFIG.backgrounds[0];


    /*
      하단 선택 알림
    */

    this.toastElement =
      document.getElementById(
        "backgroundToast"
      );


    this.toastTimer =
      null;

  }



  /*
 ============================================================
 배경 선택 메뉴 생성
 ============================================================
 */

  render() {


    this.listElement.innerHTML =
      "";



    CONFIG.backgrounds.forEach(
      (
        background,
        index
      ) => {


        /*
         --------------------------------------------------------
         배경 선택 버튼
         --------------------------------------------------------
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
          화면에는 제목을 쓰지 않지만
          스크린리더는 배경명을 읽을 수 있습니다.
        */

        button.setAttribute(
          "aria-label",
          `${background.name} 선택`
        );


        button.setAttribute(
          "aria-pressed",
          index === 0
            ? "true"
            : "false"
        );



        /*
          기본 선택 표시
        */

        if (index === 0) {


          button.classList.add(
            "selected"
          );

        }



        /*
         --------------------------------------------------------
         배경 없음
         --------------------------------------------------------
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
         --------------------------------------------------------
         썸네일 이미지
         --------------------------------------------------------

         이곳에서는 고해상도 src가 아니라
         저해상도 thumbnail 파일만 불러옵니다.
        */

        else {


          const image =
            document.createElement(
              "img"
            );


          image.className =
            "background-thumbnail";


          /*
            320×240 정도의 작은 WebP
          */

          image.src =
            background.thumbnail;


          /*
            버튼에 aria-label이 있으므로
            이미지 alt는 빈 값으로 둡니다.
          */

          image.alt =
            "";


          /*
            화면에 가까워졌을 때만 로딩
          */

          image.loading =
            "lazy";


          /*
            이미지 디코딩을 비동기로 수행하여
            UI 멈춤을 줄입니다.
          */

          image.decoding =
            "async";


          /*
            썸네일의 논리적 화면 비율
          */

          image.width =
            320;


          image.height =
            240;


          /*
            이미지 드래그 방지
          */

          image.draggable =
            false;



          /*
            이미지 로딩 실패 처리
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
         --------------------------------------------------------
         배경 선택
         --------------------------------------------------------
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



        this.listElement.appendChild(
          button
        );


      }
    );

  }



  /*
 ============================================================
 배경 선택
 ============================================================
 */

  select(
    background,
    selectedButton
  ) {


    this.selectedBackground =
      background;



    /*
      기존 선택 상태 초기화
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


      this.showToast(
        "배경을 사용하지 않습니다."
      );


      return;

    }



    /*
     ============================================================
     실제 고해상도 원본 로딩

     ★ 중요

     여기에서야 비로소
     static 폴더의 고해상도 이미지를 불러옵니다.

     사이트 처음 접속 시에는
     이 이미지가 다운로드되지 않습니다.
     ============================================================
    */

    this.overlayElement.src =
      background.src;


    this.overlayElement.style.display =
      "block";



    /*
      선택 이름 안내
    */

    this.showToast(
      `${background.name} 배경을 선택했습니다.`
    );

  }



  /*
 ============================================================
 배경 선택 Toast
 ============================================================
 */

  showToast(message) {


    if (!this.toastElement) {

      return;

    }



    /*
      기존 알림 타이머 제거
    */

    if (this.toastTimer) {


      clearTimeout(
        this.toastTimer
      );


      this.toastTimer =
        null;

    }



    /*
      기존 표시 초기화
    */

    this.toastElement.classList.remove(
      "show"
    );


    /*
      문구 입력
    */

    this.toastElement.textContent =
      message;


    /*
      애니메이션 재실행을 위한 reflow
    */

    void this.toastElement.offsetWidth;


    /*
      표시
    */

    this.toastElement.classList.add(
      "show"
    );



    /*
      1.5초 후 사라짐
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
 현재 선택된 배경 정보
 ============================================================
 */

  getSelectedBackground() {


    return this.selectedBackground;

  }

}
