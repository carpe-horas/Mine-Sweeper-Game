let currentLevel = 1; // 현재 레벨
let boardSize = 8;   // 기본 보드 크기
let mineCount = 2;    // 기본 지뢰 개수
let board = [];       // 보드 배열

// 🔥 레벨별 보드 크기 및 지뢰 개수 설정
// function updateLevelSettings() {
//     if (currentLevel <= 5) {  // 1~5레벨: 8x8 보드
//         boardSize = 8;
//         mineCount = 2 + (currentLevel - 1) * 2;
//     } else if (currentLevel <= 10) { // 6~10레벨: 10x10 보드
//         boardSize = 10;
//         mineCount = 4 + (currentLevel - 6) * 2;
//     } else if (currentLevel <= 15) { // 11~15레벨: 12x12 보드
//         boardSize = 12;
//         mineCount = 6 + (currentLevel - 11) * 2;
//     } else { // 16~20레벨: 14x14 보드
//         boardSize = 14;
//         mineCount = 8 + (currentLevel - 16) * 2;
//     }
//     console.log(`🔄 레벨 ${currentLevel}: ${boardSize}x${boardSize}, 지뢰 ${mineCount}개`);
// }

// 🔥 자동으로 보드 크기와 지뢰 개수를 조정
function updateLevelSettings() {
    let levelGroup = Math.floor((currentLevel - 1) / 5); // 5레벨 단위 그룹 (0부터 시작)
    
    boardSize = 8 + levelGroup * 2; // 5레벨마다 보드 크기 증가
    let baseMineCount = 2 + levelGroup * 2; // 각 그룹의 지뢰 시작 개수 (2, 4, 6, 8, ...)
    let levelOffset = (currentLevel - 1) % 5; // 그룹 내에서 몇 번째 레벨인지 (0~4)
    
    mineCount = baseMineCount + levelOffset * 2; // 2씩 증가

    console.log(`🔄 레벨 ${currentLevel}: ${boardSize}x${boardSize}, 지뢰 ${mineCount}개`);
}


// 🔄 보드 초기화 함수 (레벨별 설정 적용)
function initBoard() {
    updateLevelSettings(); // 레벨에 맞게 보드 크기 & 지뢰 개수 변경

    board = Array.from({ length: boardSize }, () => 
        Array.from({ length: boardSize }, () => ({ mine: false, revealed: false, flag: false }))
    );

    placeMines();
    renderBoard();
}

// 💣 지뢰 배치 함수
function placeMines() {
    let placedMines = 0;
    while (placedMines < mineCount) {
        let row = getRandomInt(0, boardSize);
        let col = getRandomInt(0, boardSize);
        if (!board[row][col].mine) {
            board[row][col].mine = true;
            placedMines++;
        }
    }
}

// 🔄 보드 렌더링 함수 (레벨 표시 추가)
function renderBoard() {
    const boardElement = document.getElementById("board");
    const levelElement = document.getElementById("level-display"); // 레벨 표시

    boardElement.innerHTML = "";
    boardElement.style.gridTemplateColumns = `repeat(${boardSize}, 30px)`;

    levelElement.textContent = `레벨 ${currentLevel}`; // 화면에 레벨 표시

    board.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            const cellElement = document.createElement("div");
            cellElement.classList.add("cell");
            cellElement.dataset.row = rowIndex;
            cellElement.dataset.col = colIndex;
            cellElement.addEventListener("click", handleCellClick);
            cellElement.addEventListener("contextmenu", handleRightClick);
            boardElement.appendChild(cellElement);
        });
    });

    console.log(`🟢 보드 렌더링 완료: ${boardSize}x${boardSize}, 지뢰 ${mineCount}개`);
}
