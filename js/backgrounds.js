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
      기본 배경
    */

    this.selectedBackground =
      CONFIG.backgrounds[0];


    /*
      배경 선택 Toast 알림
    */

    this.toastElement =
      document.getElementById(
        "backgroundToast"
      );


    /*
      기존 Toast 타이머 저장

      빠르게 여러 배경을 선택했을 때
      이전 타이머와 충돌하지 않도록 사용합니다.
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


    this.listElement.innerHTML =
      "";


    CONFIG.backgrounds.forEach(
      (
        background,
        index
      ) => {


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
          화면에는 배경명을 별도로 출력하지 않지만
          접근성을 위해 버튼 설명은 유지합니다.
        */

        button.setAttribute(
          "aria-label",
          `${background.name} 선택`
        );



        /*
          첫 번째 항목:
          배경 없음
        */

        if (index === 0) {

          button.classList.add(
            "selected"
          );

        }



        /*
         ========================================================
         배경 없음 버튼
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

         중요:
         여기에서는 SPACE / LAB / FESTIVAL 등의
         텍스트를 별도로 생성하지 않습니다.

         썸네일 이미지만 표시합니다.
        */

        else {


          const image =
            document.createElement(
              "img"
            );


          image.className =
            "background-thumbnail";


          image.src =
            background.thumbnail;


          image.alt =
            background.name;


          image.loading =
            "lazy";


          image.draggable =
            false;


          button.appendChild(
            image
          );

        }



        /*
         ========================================================
         배경 선택
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


    this.selectedBackground =
      background;



    /*
      모든 버튼의 선택 표시 제거
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


      }
    );



    /*
      현재 선택 버튼 표시
    */

    selectedButton.classList.add(
      "selected"
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
        선택 알림
      */

      this.showToast(
        "배경을 사용하지 않습니다."
      );


      return;

    }



    /*
     ============================================================
     선택한 배경 표시
     ============================================================
    */

    this.overlayElement.src =
      background.src;


    this.overlayElement.style.display =
      "block";



    /*
     ============================================================
     작은 선택 알림 표시

     config.js의 name 값을 사용합니다.

     예:
     우주 → "우주 배경을 선택했습니다."
     과학실 → "과학실 배경을 선택했습니다."
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

 화면 하단에 약 1.5초 동안 표시된 후
 자동으로 사라집니다.
 ============================================================
 */

  showToast(message) {


    /*
      Toast 요소가 없으면 실행하지 않습니다.
    */

    if (!this.toastElement) {

      return;

    }



    /*
      기존 타이머가 있다면 제거

      사용자가 빠르게 여러 배경을 클릭해도
      마지막 선택 기준으로 시간이 다시 시작됩니다.
    */

    if (this.toastTimer) {


      clearTimeout(
        this.toastTimer
      );


      this.toastTimer =
        null;

    }



    /*
      이전 애니메이션 초기화
    */

    this.toastElement.classList.remove(
      "show"
    );



    /*
      알림 문구 설정
    */

    this.toastElement.textContent =
      message;



    /*
      같은 요소에서 애니메이션을
      반복 실행하기 위한 reflow
    */

    void this.toastElement.offsetWidth;



    /*
      Toast 표시
    */

    this.toastElement.classList.add(
      "show"
    );



    /*
      1.5초 후 사라지기
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
