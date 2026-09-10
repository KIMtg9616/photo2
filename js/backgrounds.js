import { CONFIG } from "./config.js";


/*
 ============================================================
 정적 배경 선택 관리
 ============================================================
*/

export class BackgroundManager {

  constructor(listElement, overlayElement) {

    this.listElement = listElement;
    this.overlayElement = overlayElement;

    /*
      기본값은 '배경 없음'입니다.
    */
    this.selectedBackground =
      CONFIG.backgrounds[0];

  }


  /*
   배경 선택 UI를 생성합니다.
  */
  render() {

    this.listElement.innerHTML = "";


    CONFIG.backgrounds.forEach((background, index) => {

      const button =
        document.createElement("button");


      button.type = "button";
      button.className = "background-item";

      button.dataset.backgroundId =
        background.id;

      button.setAttribute(
        "aria-label",
        `${background.name} 선택`
      );


      /*
       첫 번째 항목을 기본 선택 상태로 표시합니다.
      */
      if (index === 0) {

        button.classList.add("selected");

      }


      /*
       배경 없음 버튼
      */
      if (!background.thumbnail) {

        const noneBox =
          document.createElement("div");

        noneBox.className =
          "background-none";

        noneBox.textContent =
          "없음";

        button.appendChild(noneBox);

      }

      /*
       이미지 배경 버튼
      */
      else {

        const image =
          document.createElement("img");

        image.className =
          "background-thumbnail";

        image.src =
          background.thumbnail;

        image.alt =
          background.name;

        image.loading =
          "lazy";

        button.appendChild(image);

      }


      /*
       배경 선택 이벤트
      */
      button.addEventListener(
        "click",
        () => {

          this.select(background, button);

        }
      );


      this.listElement.appendChild(button);

    });

  }


  /*
   실제 배경을 선택하고 카메라 위에 표시합니다.
  */
  select(background, selectedButton) {

    this.selectedBackground =
      background;


    /*
     기존 선택 표시 제거
    */
    const buttons =
      this.listElement.querySelectorAll(
        ".background-item"
      );

    buttons.forEach(button => {

      button.classList.remove("selected");

    });


    selectedButton.classList.add(
      "selected"
    );


    /*
     배경 없음
    */
    if (!background.src) {

      this.overlayElement.removeAttribute(
        "src"
      );

      this.overlayElement.style.display =
        "none";

      return;

    }


    /*
     선택한 배경/프레임 표시
    */
    this.overlayElement.src =
      background.src;

    this.overlayElement.style.display =
      "block";

  }


  /*
   촬영 코드에서 현재 선택된 배경 정보를 가져올 때 사용합니다.
  */
  getSelectedBackground() {

    return this.selectedBackground;

  }

}
