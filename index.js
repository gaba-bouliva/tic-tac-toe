/**
  TODO
  display the gameboard
  create a player object factory
  create a board module
  create a gameplay module (which initalizes data inot the gameboard on html dom)
  set player one mark ( X )
  set player two mark ( O )
  player 1 clicks on area on gameboard
  if area is not occupied position player1's mark on area
  else do nothing
  repeat line 4 and to 6 for player 2
  repeat line 5 to 8 untill a player wins or the gameboard gets filled with their marks
  A player wins if the player has 3 of his marks aligned vertically, horizontally or diagonally

 */

function updateDomWithPlayerMark (div, player) {
  /**
   * Mark div cell selected by player with current player's mark('X' or 'O') UI page
   */
  const divElement = document.querySelector(`#${div.id}`) // get the latest dom div element
  divElement.innerText = player.mark
}

function verifyWinner(gameboard){
  /**
   * There is a winner if
   * all values in a row are the same
   * all value in a column are the same
   * all values diagonally are the same
   */

  let horizontalWin = false;
  let verticalWin = false;
  let diagonalWin = false;

  let getColumnValues = (colIndex, gameboard) => {
    let colValues = [];
    for (let row = 0; row < gameboard.length; row++) {
      colValues.push(gameboard[row][colIndex])
    }
    return colValues;
  }

  let getRightLeftDiagonalValues = (gameboard) =>{
    let diagonalValuesRightLeft = []
    for (let row = 0; row < gameboard.length; row++) {
      diagonalValuesRightLeft.push(gameboard[row][(gameboard.length - 1)-row]) 
    }

    return diagonalValuesRightLeft;
  }

  let getLeftRightDiagonalValues = (gameboard) =>{
    let diagonalValuesLeftRight = []
    for (let row = 0; row < gameboard.length; row++) {
      diagonalValuesLeftRight.push(gameboard[row][row]) 
    }

    return diagonalValuesLeftRight;
  }

  // check if all values in a row are the same
  for (let row = 0; row < gameboard.length; row++) {
    /**
     * make sure we do not reach last element in gameboard array 
     * so we stop at 2nd to last to compare to last element in array
     * if not at some point i+1 would result to undefined
     */

    for (let col = 0; col < gameboard.length -1 ; col++) {
      
      if (gameboard[row][col] !== gameboard[row][col+1]){
        break;
      }else{
        
        if(col === gameboard.length -2 && gameboard[row][col] !== ''){
          horizontalWin = true;
        }
      }
      
    }
    
  }


  // check if a player has aligned three marks vertically 
  
  for (let col = 0; col < gameboard.length; col++) {
    
    const result = getColumnValues(col, gameboard);

    const allEqual =  result.every(val => val === result[0] && val !== '');
    
    if (allEqual) verticalWin = true

}

const leftRightDiagonalMarks =  getLeftRightDiagonalValues(gameboard);
const diagonalLeftRightAllEqual =  leftRightDiagonalMarks.every(val => val === leftRightDiagonalMarks[0] && val !== '');
if (diagonalLeftRightAllEqual) diagonalWin = true

  for (let i = 0; i < gameboard.length; i++) {
    
    /**
     * make sure i do not reach last element in gameboard array 
     */

    // check if a user has aligned his marks diagonally from left to right 
    if(i < gameboard.length - 1){ 
      
      if (gameboard[i][i] !== gameboard[i+1][i+1] ){
        break;
      }else{
        if (i === gameboard.length - 2 && gameboard[i][i] !== ''){
          diagonalWin = true;
        }
      }

    }

  }

  const rightLeftDiagonalMarks =  getRightLeftDiagonalValues(gameboard);
  const diagonalRightLeftAllEqual =  rightLeftDiagonalMarks.every(val => val === rightLeftDiagonalMarks[0] && val !== '');
  if (diagonalRightLeftAllEqual) diagonalWin = true

      // check if a user has aligned his marks diagonally from right to left
    // for (let i = 0; i < gameboard.length; i++){
      
    //   console.log(gameboard[i][(gameboard.length - 1) - i], gameboard[i+1][(gameboard.length - 1) - i+1] );
    //   if((gameboard.length - i) > 0){ 
        
    //     if (gameboard[i][(gameboard.length - 1) - i] !== gameboard[i+1][(gameboard.length - 1) - i+1] ){
    //       break;
    //     }else{
    //       if ((gameboard.length - i) === 1 &&  gameboard[i][(gameboard.length - 1) - i] !==''){
    //         diagonalWin = true;
    //       }
    //     }
    //   }
  
      
    // }
  

  if (horizontalWin || verticalWin || diagonalWin){
    return true;
  }
  return false;
}


function Player (name, mark) {

  let nbrPlays = 0;

  const markGameboard = (row, col, gameboard) => {
    /**
     * Update the array representing the gameboard 
     * 
     */
    const rowIndex = parseInt(row)
    const colIndex = parseInt(col)

    const oldGameBoard = gameboard.map(arr => [...arr])

    if ((gameboard[row][col] !== 'O') && (gameboard[row][col]) !== 'X') {
      gameboard[rowIndex][colIndex] = mark;
      nbrPlays += 1;
    }
    return gameboard
  }

  let getNbrPlays = () => nbrPlays;

  return {
    name,
    mark,
    getNbrPlays,
    markGameboard
  }
}

function play () {
  /**
   * link each div cell on gameboard in the dom to a position in a 3D array
   * Add click event listener on every div cell on gameboard
   * When ever each div cell is clicked
   * if the cell is empty place player's mark in the
   * Mark the div cell selected with current player's mark on html dom
   * set the corresponding position of the div cell on the js 3D array with the current player's mark also
   */

  const gameboard = [] // initial gameboard state 
  let oldGameBoard = [] // tracks the previous gameboard state

  for (let i = 0; i < 3; i++) {
    gameboard[i] = ['', '', '']
    oldGameBoard[i] = ['','',''];
  }

  gameboard.forEach(arr => {
    console.log(arr);
  })
  const player1 = Player('player1', 'X')
  const player2 = Player('player2', 'O')
  let totalNbrPlays = 0;

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

        totalNbrPlays = player1.getNbrPlays() + player2.getNbrPlays();
        let fullGameboard = gameboard.length * gameboard.length;
        if(totalNbrPlays >= fullGameboard){
          console.log('Draw Game!');
          
        }
        
        if (currentPlayer.name === 'player2') {
          if(player2.getNbrPlays() >= 3){
            const result = verifyWinner(gameboard);
             if (result){
            
                console.log(`${currentPlayer.name} with ${currentPlayer.mark} mark has Won!`);
                
             }
             
          }
            
            currentPlayer = player1
      
        }else {
          if(player1.getNbrPlays() >= 3){
            const result = verifyWinner(gameboard);
              if (result){
              
                console.log(`${player1.name} with ${player1.mark} mark has Won!`);
                

              }
              
              
          }
          currentPlayer = player2
          
        }
        
        

      }
    })
  })


}

play()
