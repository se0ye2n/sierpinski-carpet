"use strict";

var gl;
var points = [];
var bufferId;
var colorLocation;

window.onload = function init() {
    var canvas = document.getElementById("gl-canvas");

    // 1. WebGL 초기화
    gl = WebGLUtils.setupWebGL(canvas);

    if (!gl) {
        alert("WebGL을 사용할 수 없습니다.");
        return;
    }

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    // 2. HTML에 작성한 셰이더 연결
    var program = initShaders(
        gl,
        "vertex-shader",
        "fragment-shader"
    );

    if (program === -1) {
        return;
    }

    gl.useProgram(program);

    // 3. 정점 데이터를 저장할 GPU 버퍼 생성
    bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);

    var vPosition = gl.getAttribLocation(program, "vPosition");

    gl.vertexAttribPointer(
        vPosition,
        2,
        gl.FLOAT,
        false,
        0,
        0
    );

    gl.enableVertexAttribArray(vPosition);

    // 4. 색상 변수의 위치 확인
    colorLocation = gl.getUniformLocation(program, "uColor");

    // 5. 사용자 입력 연결
    document.getElementById("depth").addEventListener(
        "input",
        updateGeometry
    );

    document.getElementById("color").addEventListener(
        "input",
        render
    );

    // 6. 최초 도형 생성 및 출력
    updateGeometry();
};


// 정사각형 하나를 삼각형 두 개로 구성
function square(x, y, size) {
    var a = vec2(x, y);
    var b = vec2(x + size, y);
    var c = vec2(x + size, y + size);
    var d = vec2(x, y + size);

    points.push(a, b, c);
    points.push(a, c, d);
}


// 정사각형을 9등분하고 가운데를 제외하는 재귀 함수
function divideCarpet(x, y, size, count) {
    // 더 나눌 필요가 없으면 정사각형 생성
    if (count === 0) {
        square(x, y, size);
        return;
    }

    var nextSize = size / 3;

    for (var row = 0; row < 3; row++) {
        for (var col = 0; col < 3; col++) {
            // 중앙 칸은 생성하지 않음
            if (row === 1 && col === 1) {
                continue;
            }

            divideCarpet(
                x + col * nextSize,
                y + row * nextSize,
                nextSize,
                count - 1
            );
        }
    }
}


// 분할 횟수가 바뀌면 정점 데이터를 다시 생성
function updateGeometry() {
    var depth = Number(document.getElementById("depth").value);

    document.getElementById("depth-value").textContent = depth;

    // 이전 도형의 정점 제거
    points = [];

    // 왼쪽 아래 (-0.9, -0.9), 한 변 길이 1.8
    divideCarpet(-0.9, -0.9, 1.8, depth);

    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);

    gl.bufferData(
        gl.ARRAY_BUFFER,
        flatten(points),
        gl.STATIC_DRAW
    );

    var squareCount = Math.pow(8, depth);

    document.getElementById("info").textContent =
        "정사각형: " + squareCount +
        "개 / 삼각형: " + (squareCount * 2) +
        "개 / 정점: " + points.length + "개";

    render();
}


// HTML 색상 값(#RRGGBB)을 WebGL 색상 값으로 변환
function getSelectedColor() {
    var hex = document.getElementById("color").value;

    var red = parseInt(hex.substring(1, 3), 16) / 255;
    var green = parseInt(hex.substring(3, 5), 16) / 255;
    var blue = parseInt(hex.substring(5, 7), 16) / 255;

    return [red, green, blue, 1.0];
}


// 현재 색상으로 도형 출력
function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.uniform4fv(colorLocation, getSelectedColor());

    gl.drawArrays(gl.TRIANGLES, 0, points.length);
}