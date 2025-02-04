let isLeftMouseDown = false;
let isRightMouseDown = false;
let hintTimeout = null;  // 마우스 동시 클릭 감지를 위한 타이머

// 마우스 버튼 상태 감지 (누를 때)
document.addEventListener("mousedown", (event) => {
    if (event.button === 0) isLeftMouseDown = true;  // 왼쪽 버튼
    if (event.button === 2) isRightMouseDown = true; // 오른쪽 버튼

    // 왼쪽+오른쪽 클릭을 동시에 감지하면 힌트 기능 실행
    if (isLeftMouseDown && isRightMouseDown) {
        let target = event.target;
        let row = parseInt(target.dataset.row);
        let col = parseInt(target.dataset.col);
        if (!isNaN(row) && !isNaN(col)) {
            clearTimeout(hintTimeout);  // 중복 실행 방지
            hintTimeout = setTimeout(() => {
                handleHintReveal(row, col);
            }, 100);  // 100ms 후 실행 (더블 클릭 방지)
        }
    }
});

// 마우스 버튼 상태 감지 (뗄 때)
document.addEventListener("mouseup", (event) => {
    if (event.button === 0) isLeftMouseDown = false;
    if (event.button === 2) isRightMouseDown = false;
});

// 💡 **힌트 기능**: 왼쪽+오른쪽 클릭 시, 숫자와 깃발 개수가 같다면 안전한 칸 자동 공개
function handleHintReveal(row, col) {
    let cell = board[row][col];

    if (!cell.revealed) return;  // 열린 칸에서만 실행 가능

    let adjacentFlags = countAdjacentFlags(row, col);
    let mineCount = countAdjacentMines(row, col);

    // 깃발 개수 == 숫자일 때, 주변 안전한 칸 자동 오픈
    if (adjacentFlags === mineCount) {
        revealAdjacentCells(row, col);
    }
}

// 주변 깃발 개수 계산
function countAdjacentFlags(row, col) {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            let newRow = row + i, newCol = col + j;
            if (newRow >= 0 && newRow < boardSize && newCol >= 0 && newCol < boardSize) {
                if (board[newRow][newCol].flag) count++;
            }
        }
    }
    return count;
}

// 주변 지뢰 개수 계산
function countAdjacentMines(row, col) {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            let newRow = row + i, newCol = col + j;
            if (newRow >= 0 && newRow < boardSize && newCol >= 0 && newCol < boardSize) {
                if (board[newRow][newCol].mine) count++;
            }
        }
    }
    return count;
}

// 셀 클릭 이벤트 핸들러 (일반 클릭)
function handleCellClick(event) {
    let row = parseInt(event.target.dataset.row);
    let col = parseInt(event.target.dataset.col);

    let cell = board[row][col];

    // 지뢰를 밟은 경우
    if (cell.mine) {
        revealAllCells();
        alert("💥 지뢰를 밟았습니다! 당신은 가루가 되었습니다.");
        return;
    } else {
        revealCell(row, col);
        checkWinCondition();
    }
}

// 오른쪽 클릭 이벤트 핸들러 (깃발)
function handleRightClick(event) {
    event.preventDefault();
    let row = parseInt(event.target.dataset.row);
    let col = parseInt(event.target.dataset.col);

    let cell = board[row][col];
    if (!cell.revealed) {
        cell.flag = !cell.flag;
        event.target.textContent = cell.flag ? "🚩" : "";
    }
}

// 셀 공개 함수 (숫자 & 빈 칸 처리)
function revealCell(row, col) {
    let cell = board[row][col];
    if (cell.revealed || cell.flag) return;

    cell.revealed = true;
    let cellElement = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    cellElement.classList.add("revealed");

    let mineCount = countAdjacentMines(row, col);
    cellElement.textContent = mineCount > 0 ? mineCount : "";

    if (mineCount === 0) {
        revealAdjacentCells(row, col);
    }
}

// 인접한 빈 칸 자동 공개
function revealAdjacentCells(row, col) {
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            let newRow = row + i, newCol = col + j;
            if (newRow >= 0 && newRow < boardSize && newCol >= 0 && newCol < boardSize) {
                if (!board[newRow][newCol].revealed && !board[newRow][newCol].mine) {
                    revealCell(newRow, newCol);
                }
            }
        }
    }
}

// 승리 조건 체크 (모든 안전한 칸을 열면 다음 레벨로)
function checkWinCondition() {
    let unrevealedCells = board.flat().filter(cell => !cell.revealed);
    if (unrevealedCells.length === mineCount) {
        alert(`🎉 레벨 ${currentLevel} 클리어! 다음 레벨로 이동합니다.`);
        nextLevel();
    }
}

// 다음 레벨로 이동
function nextLevel() {
    if (currentLevel < 20) {
        currentLevel++;
    } else {
        alert("🎊 축하합니다! 모든 레벨을 클리어했습니다!");
        currentLevel = 1; // 처음부터 다시 시작
    }
    resetGame();
}

// 게임 오버 시 모든 보드 공개
function revealAllCells() {
    board.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            let cellElement = document.querySelector(`[data-row="${rowIndex}"][data-col="${colIndex}"]`);
            cellElement.classList.add("revealed");

            if (cell.mine) {
                cellElement.textContent = "💣";
                cellElement.classList.add("mine");
            } else {
                let mineCount = countAdjacentMines(rowIndex, colIndex);
                cellElement.textContent = mineCount > 0 ? mineCount : "";
            }
        });
    });
}

// 게임 초기화
function resetGame() {
    initBoard();
}

// 초기 실행
document.getElementById("reset-btn").addEventListener("click", resetGame);
initBoard();
