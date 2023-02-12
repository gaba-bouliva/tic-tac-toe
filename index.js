/**
  TIC TAC TOE

 */

function updateDomWithPlayerMark (div, player) {
  /**
   * Mark div cell selected by player with current player's mark('X' or 'O') on UI page
   */
  const divElement = document.querySelector(`#${div.id}`) 
  divElement.innerText = player.mark
}

function verifyWinner (gameboard) {
  /**
   * There is a winner if
   * all values in a row are the same
   * all value in a column are the same
   * all values diagonally are the same
   */

  let horizontalWin = false
  let verticalWin = false
  let diagonalWin = false

  const getColumnValues = (colIndex, gameboard) => {
    const colValues = []
    for (let row = 0; row < gameboard.length; row++) {
      colValues.push(gameboard[row][colIndex])
    }
    return colValues
  }

  const getRightLeftDiagonalValues = (gameboard) => {
    const diagonalValuesRightLeft = []
    for (let row = 0; row < gameboard.length; row++) {
      diagonalValuesRightLeft.push(gameboard[row][(gameboard.length - 1) - row])
    }

    return diagonalValuesRightLeft
  }

  const getLeftRightDiagonalValues = (gameboard) => {
    const diagonalValuesLeftRight = []
    for (let row = 0; row < gameboard.length; row++) {
      diagonalValuesLeftRight.push(gameboard[row][row])
    }

    return diagonalValuesLeftRight
  }

  // check if all values in a row are the same
  for (let row = 0; row < gameboard.length; row++) {
    /**
     * make sure we do not reach last element in gameboard array
     * so we stop at 2nd to last to compare to last element in array
     * if not at some point col+1 would result to undefined
     */

    for (let col = 0; col < gameboard.length - 1; col++) {
      if (gameboard[row][col] !== gameboard[row][col + 1]) {
        break
      } else {
        if (col === gameboard.length - 2 && gameboard[row][col] !== '') {
          horizontalWin = true
        }
      }
    }
  }

  // check if a player has aligned three marks vertically

  for (let col = 0; col < gameboard.length; col++) {
    const result = getColumnValues(col, gameboard)

    const allEqual = result.every(val => val === result[0] && val !== '')

    if (allEqual) verticalWin = true
  }

  const leftRightDiagonalMarks = getLeftRightDiagonalValues(gameboard)
  const diagonalLeftRightAllEqual = leftRightDiagonalMarks.every(val => val === leftRightDiagonalMarks[0] &&
                                                                val !== '')
  if (diagonalLeftRightAllEqual) diagonalWin = true

  for (let i = 0; i < gameboard.length; i++) {
    /**
     * make sure i do not reach last element in gameboard array
     */

    // check if a user has aligned his marks diagonally from left to right
    if (i < gameboard.length - 1) {
      if (gameboard[i][i] !== gameboard[i + 1][i + 1]) {
        break
      } else {
        if (i === gameboard.length - 2 && gameboard[i][i] !== '') {
          diagonalWin = true
        }
      }
    }
  }

  const rightLeftDiagonalMarks = getRightLeftDiagonalValues(gameboard)
  const diagonalRightLeftAllEqual = rightLeftDiagonalMarks.every(val => val === rightLeftDiagonalMarks[0] && val !== '')
  if (diagonalRightLeftAllEqual) diagonalWin = true

  if (horizontalWin || verticalWin || diagonalWin) {
    return true
  }
  return false
}


function Player (name, mark) {
  let nbrPlays = 0

  const markGameboard = (row, col, gameboard) => {
    /**
     * Update the array representing the gameboard
     *
     */
    const rowIndex = parseInt(row)
    const colIndex = parseInt(col)

    if ((gameboard[row][col] !== 'O') && (gameboard[row][col]) !== 'X') {
      gameboard[rowIndex][colIndex] = mark
      nbrPlays += 1
    }
    return gameboard
  }

  const getNbrPlays = () => nbrPlays

  return {
    name,
    mark,
    getNbrPlays,
    markGameboard
  }
}

function play () {
  /**
   * Initalize 2D array gameboard to track each player's mark positioned on UI gameboard
   */

  const gameboard = [] // initial gameboard state
  let oldGameBoard = [] // tracks the previous gameboard state

  for (let i = 0; i < 3; i++) {
    gameboard[i] = ['', '', ''] 
    oldGameBoard[i] = ['', '', '']
  }

 
  const player1 = Player('player1', 'X')
  const player2 = Player('player2', 'O')
  let totalNbrPlays = 0

  let currentPlayer = player1

  const listDivs = document.querySelectorAll('.cell')
  listDivs.forEach(div => {
    div.addEventListener('click', (event) => {
      const row = event.target.dataset.pos[0]
      const col = event.target.dataset.pos[1]

      let updatedGameBoard = currentPlayer.markGameboard(row, col, gameboard)

      if (updatedGameBoard[row][col] === oldGameBoard[row][col]) {
        console.log('Please choose an empty spot!')
        updatedGameBoard = currentPlayer.markGameboard(row, col, gameboard)
      } else {
        updateDomWithPlayerMark(event.target, currentPlayer)
        oldGameBoard = updatedGameBoard.map(arr => [...arr])

        totalNbrPlays = player1.getNbrPlays() + player2.getNbrPlays()
        const fullGameboard = gameboard.length * gameboard.length
        if (totalNbrPlays >= fullGameboard) {
          console.log('Draw Game!')
          const gameResultDiv = document.querySelector('.game-result')
          const resultMsgDiv = document.querySelector('.outcome-msg')
          const winnerDiv = document.querySelector('.winner')
          const gameBoard = document.querySelector('.gameboard')
          winnerDiv.innerText = ''
          resultMsgDiv.innerText = 'Draw Game!'
          gameBoard.style.display = 'none'
          gameResultDiv.style.display = 'flex'
        }

        if (currentPlayer.name === 'player2') {
          if (player2.getNbrPlays() >= 3) {
            const result = verifyWinner(gameboard)
            if (result) {
              const gameResultDiv = document.querySelector('.game-result')
              const resultMsgDiv = document.querySelector('.outcome-msg')
              const winnerDiv = document.querySelector('.winner')
              const gameBoard = document.querySelector('.gameboard')
              winnerDiv.innerText = currentPlayer.mark
              resultMsgDiv.innerText = 'Winner!'
              gameBoard.style.display = 'none'
              gameResultDiv.style.display = 'flex'
              console.log(`${currentPlayer.name} with ${currentPlayer.mark} mark has Won!`)
            }
          }

          currentPlayer = player1
        } else {
          if (player1.getNbrPlays() >= 3) {
            const result = verifyWinner(gameboard)
            if (result) {
              const gameResultDiv = document.querySelector('.game-result')
              const resultMsgDiv = document.querySelector('.outcome-msg')
              const winnerDiv = document.querySelector('.winner')
              const gameBoard = document.querySelector('.gameboard')

              winnerDiv.innerText = currentPlayer.mark
              resultMsgDiv.innerText = 'Winner!'
              gameBoard.style.display = 'none'
              gameResultDiv.style.display = 'flex'
              console.log(`${player1.name} with ${player1.mark} mark has Won!`)
            }
          }
          currentPlayer = player2
        }
      }
    })
  })
}

play()

function restartGame(){
  
}