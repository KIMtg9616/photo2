/*
 ============================================================
 사이트 주요 설정
 ============================================================

 해상도, 카메라 방향, 배경 목록 등을 한 곳에서 관리합니다.
 향후 캐릭터/AR 기능이 추가될 때도 설정 파일을 확장할 수 있습니다.
*/

export const CONFIG = {

  /*
   ----------------------------------------------------------
   최종 저장 사진 해상도
   ----------------------------------------------------------

   4:3 기준
   기본값: 1440 × 1080

   저사양 스마트폰에서 성능이 부족하면
   960 × 720으로 낮출 수 있습니다.
  */

  outputWidth: 1440,
  outputHeight: 1080,


  /*
   "user"        : 전면 카메라
   "environment" : 후면 카메라
  */

  facingMode: "user",


  /*
   true:
   전면 카메라 촬영 결과도 미리보기처럼 좌우 반전하여 저장

   false:
   실제 카메라 원본 방향으로 저장
  */

  mirrorFrontCamera: true,


  /*
   ----------------------------------------------------------
   배경 목록
   ----------------------------------------------------------

   현재 1차 버전에서는 정적인 프레임 이미지를 사용합니다.

   src:
   실제 촬영 결과에 합성할 이미지

   thumbnail:
   하단 선택 메뉴에서 보여줄 이미지

   배경이 많아지면 thumbnail에는 별도의 320×240 파일을
   지정하는 것이 성능상 좋습니다.
  */

  backgrounds: [

    {
      id: "none",
      name: "배경 없음",
      src: null,
      thumbnail: null
    },

    {
      id: "space",
      name: "우주",
      src: "./assets/backgrounds/static/20years.png",
      thumbnail: "./assets/backgrounds/static/bg-space.webp"
    },

    {
      id: "lab",
      name: "과학실",
      src: "./assets/backgrounds/static/bg-lab.webp",
      thumbnail: "./assets/backgrounds/static/bg-lab.webp"
    },

    {
      id: "festival",
      name: "과학축제",
      src: "./assets/backgrounds/static/bg-festival.webp",
      thumbnail: "./assets/backgrounds/static/bg-festival.webp"
    }

  ]

};
