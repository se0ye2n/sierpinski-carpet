# Sierpinski Carpet

WebGL을 사용하여 Sierpinski Carpet을 그리는 과제입니다.

## 기능

- 재귀 분할을 이용한 Sierpinski Carpet 생성
- 분할 횟수 조절: 0~5
- 도형 색상 변경
- 정사각형, 삼각형, 정점 개수 표시

## 실행 방법

1. 저장소 전체를 다운로드합니다.
2. 폴더 구조를 유지한 상태에서 carpet/index.html을
   Chrome 또는 Edge로 엽니다.

## 구현 원리

정사각형을 3×3으로 나눈 뒤 가운데 칸을 제외하고
남은 8칸에 같은 과정을 재귀적으로 적용합니다.

최종 정사각형은 각각 삼각형 두 개로 그립니다.
분할 횟수가 n이면 정사각형은 8^n개입니다.

## 참고 자료

Edward Angel 교재 예제:
https://www.cs.unm.edu/~angel/BOOK/INTERACTIVE_COMPUTER_GRAPHICS/SEVENTH_EDITION/CODE/

Common 폴더의 파일과 gasket1 예제는 교재 제공 코드입니다.
carpet/index.html과 carpet/carpet.js는 과제 구현 파일입니다.

## AI 활용

재귀 분할 알고리즘과 WebGL 색상 제어를 이해하기 위해
AI의 설명 및 코드 예시를 참고하였다.
