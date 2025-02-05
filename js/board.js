let currentLevel = 1; // 현재 레벨
let boardSize = 8;   // 기본 보드 크기
let mineCount = 2;    // 기본 지뢰 개수
let board = [];       // 보드 배열

// 레벨별 보드 크기 및 지뢰 개수 설정
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
//     console.log(`레벨 ${currentLevel}: ${boardSize}x${boardSize}, 지뢰 ${mineCount}개`);
// }

// 자동으로 보드 크기와 지뢰 개수를 조정
function updateLevelSettings() {
    let levelGroup = Math.floor((currentLevel - 1) / 5); // 5레벨 단위 그룹
    
    boardSize = 8 + levelGroup * 2; // 5레벨마다 보드 크기 증가
    
    let baseMineCount = 4 + levelGroup * 4; // 5레벨마다 4씩 증가(1레벨: 4개, 6레벨: 8개, 11레벨: 12개)
    let levelOffset = (currentLevel - 1) % 5; // 그룹 내에서 몇 번째 레벨인지 (0~4)
    
    mineCount = baseMineCount + levelOffset * 2; // 2씩 증가

    console.log(`🔄 레벨 ${currentLevel}: ${boardSize}x${boardSize}, 지뢰 ${mineCount}개`);
}

function updateGameContainerSize() {
    const gameContainer = document.getElementById("game-container");

    // 기본 보드 크기(8x8)에서 증가하는 칸 수를 계산
    let levelGroup = Math.floor((currentLevel - 1) / 5); // 5레벨마다 크기 증가 그룹
    let extraMargin = levelGroup * 10; // 레벨 그룹마다 추가 마진 (10px씩 증가)

    // 보드 크기 계산 (셀 크기: 30px)
    let newWidth = boardSize * 30 + 40 + extraMargin; // 좌우 마진 반영하여 계산

    gameContainer.style.width = `${newWidth}px`;
    gameContainer.style.margin = "40px auto"; // 중앙 정렬 유지
}

// 보드 초기화 함수 (레벨별 설정 적용)
function initBoard() {
    updateLevelSettings(); // 레벨에 맞게 보드 크기 & 지뢰 개수 변경
    updateGameContainerSize(); // 게임 컨테이너 크기 업데이트

    board = Array.from({ length: boardSize }, () =>
        Array.from({ length: boardSize }, () => ({ mine: false, revealed: false, flag: false }))
    );

    placeMines();
    renderBoard();

    gameActive = true; // 게임 시작 상태 활성화
    startTimer(); //게임 시작 시 타이머 실행
}


// 지뢰 배치 함수
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

// 보드 렌더링 함수 (레벨 & 지뢰 개수 표시)
function renderBoard() {
    const boardElement = document.getElementById("board");
    const levelElement = document.getElementById("level-display"); 
    const mineCountElement = document.getElementById("mine-count"); 

    boardElement.innerHTML = "";
    boardElement.style.gridTemplateColumns = `repeat(${boardSize}, 30px)`;
    boardElement.style.gridTemplateRows = `repeat(${boardSize}, 30px)`;

    levelElement.textContent = `[레벨 ${currentLevel}]`; 
    mineCountElement.textContent = mineCount; // 지뢰 개수 표시 업데이트

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

    // 게임 컨테이너 크기 업데이트
    updateGameContainerSize();

    console.log(`보드 렌더링 완료: ${boardSize}x${boardSize}, 지뢰 ${mineCount}개`);
}