/*
 ============================================================
 사이트 주요 설정
 ============================================================

 - 촬영용 고해상도 이미지와
 - 선택 메뉴용 저해상도 썸네일

 을 별도로 관리합니다.
*/

export const CONFIG = {

  /*
   ----------------------------------------------------------
   최종 저장 사진 해상도
   ----------------------------------------------------------
  */

  outputWidth: 1440,
  outputHeight: 1080,


  /*
   기본 카메라

   user        = 전면
   environment = 후면
  */

  facingMode: "user",


  /*
   전면 카메라 촬영 결과를
   미리보기처럼 거울 방향으로 저장
  */

  mirrorFrontCamera: true,


  /*
   ----------------------------------------------------------
   배경 목록
   ----------------------------------------------------------

   src
   = 실제 카메라와 합성되는 고해상도 이미지

   thumbnail
   = 배경 선택 메뉴에서만 사용하는
     저해상도 WebP 이미지

   따라서 사이트에 접속했다고 해서
   모든 고해상도 원본을 한꺼번에 불러오지 않습니다.
  */

  backgrounds: [

    /*
     배경 없음
    */
    {
      id: "none",
      name: "배경 없음",

      src: null,
      thumbnail: null
    },


    /*
     희망의 과학싹잔치 20주년
    */
    {
      id: "20years",

      name: "희망의 과학싹잔치 20주년",

      /*
       실제 촬영용 원본
      */
      src:
        "./assets/backgrounds/static/20years.png",

      /*
       배경 선택용 썸네일
      */
      thumbnail:
        "./assets/backgrounds/thumbnails/thumb-20years.webp"
    },


    /*
     전화기 발명 이야기
    */
    {
      id: "bell",

      name: "전화기 발명 이야기",

      src:
        "./assets/backgrounds/static/bell.png",

      thumbnail:
        "./assets/backgrounds/thumbnails/thumb-bell.webp"
    },


    /*
     과학연극
    */
    {
      id: "drama",

      name: "과학연극",

      src:
        "./assets/backgrounds/static/20ybell.png",

      thumbnail:
        "./assets/backgrounds/thumbnails/thumb-20ybell.webp"
    }

  ]

};
