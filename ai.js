






const gridSize = 8;
let CellArray = [];

// skapa en visuell grid med start samt end // creating a grid
function createGrid() {
    const gridContainer = document.getElementById('grid-container');
    gridContainer.style.gridTemplateColumns = `repeat(${gridSize}, 80px)`;
    gridContainer.style.gridTemplateRows = `repeat(${gridSize}, 80px)`;
    for (let row = 0; row < gridSize; row++) {
        const UiBoxContainer = [];
        for (let col = 0; col < gridSize; col++) {
            const div = document.createElement('div');
            div.className = 'grid-item';
            div.dataset.row = row;
            div.dataset.col = col;
            div.addEventListener('click', () => toggleWall(row, col, div));
            gridContainer.appendChild(div);
            UiBoxContainer.push(false); 
        }
        CellArray.push(UiBoxContainer);
    }
}

// skapa väggar // create walls
function setMaze() {
    // Example maze --=>  vertical wall
    // for (let i = 0; i < 9; i++) {
    //     myArrayState[i][10] = true;
    // }


    // Set start and end points
    CellArray[0][0] = 'start'; // Top left corner
    CellArray[gridSize - 1][gridSize - 1] = 'end'; // Bottom right corner

    updateGrid(); // Visualize the maze
}
// Function to update the grid based on myArrayState
function updateGrid() {
    const gridItems = document.querySelectorAll('.grid-item');
    gridItems.forEach(item => {
        const row = parseInt(item.dataset.row);
        const col = parseInt(item.dataset.col);

        if (CellArray[row][col] === true) {
            item.classList.add('wall');
        } else if (CellArray[row][col] === 'start') {
            item.classList.add('start');
            item.classList.remove('wall');
        } else if (CellArray[row][col] === 'end') {
            item.classList.add('end');
            item.classList.remove('wall');
        } else if (CellArray[row][col] === 'path') {
            item.classList.add('path');
        } else {
            // item.classList.remove('wall', 'start', 'end', 'path');
        }
    });
}



async function FindClosestRoute() {
    let start = findStartAndEndPos('start');
    let end = findStartAndEndPos('end');

    if (!start || !end) {
        console.error("Start or End point not set.");
        return;
    }

    const [startRow, startCol] = start;
    const [endRow, endCol] = end;

    const queue = [[startRow, startCol]];
    const cameFrom = {}; 
    const visited = new Set();
    cameFrom[`${startRow}-${startCol}`] = null; 
    visited.add(`${startRow}-${startCol}`);
    let isFound = false;
    while (queue.length > 0) {
        const [currentRow, currentCol] = queue.shift();

        // Check if it is the end
        if (currentRow ===  gridSize - 1 && currentCol === gridSize - 1 ) {
            console.log("Found the end at:", currentRow, currentCol);
            isFound = true;
            break;
        }
        const t = document.getElementById("test");
        const p = document.createElement('div');
        p.classList = "dataRowCols"
        p.innerHTML += ` row ${currentRow}, col ${currentCol}`
        t.appendChild(p);
        // Explore neighbors
        for (const [nextRow, nextCol] of CheckSurroundings(currentRow, currentCol)) {
            if (!visited.has(`${nextRow}-${nextCol}`) && !CellArray[nextRow][nextCol] || CellArray[nextRow][nextCol] == "end") {
                queue.push([nextRow, nextCol]);
                visited.add(`${nextRow}-${nextCol}`);
                cameFrom[`${nextRow}-${nextCol}`] = [currentRow, currentCol];
            }
             
        }
    }

    if(isFound){
        console.log("Found path");
    }
    PaintLogPath(visited);

        setTimeout(() => {
            let current = [endRow, endCol];
        const path = [];
        
        while (current !== null) {
          path.push(current);  // Add current cell to the path
  
          const currentKey = `${current[0]}-${current[1]}`;
          current = cameFrom[currentKey];  // Move to the parent cell
            
          // Debug log to see the transition
          console.log(`Current: ${currentKey}, Next: ${current ? `${current[0]}-${current[1]}` : 'null'}`);
          if(current !== null){
              const t = document.getElementById("test2");
              const p = document.createElement('div');

              p.classList = "dataRowCols"
              p.innerHTML += ` row ${current[0]}, col ${current}`
              t.appendChild(p);
          }
      }
        // Reverse the path (so it goes from start to end)
        path.reverse();
  
        // Visualize the path
        for (let i = 0; i < path.length; i++) {
            const [row, col] = path[i];
            setTimeout(() => {
                const gridItem = document.querySelector(`.grid-item[data-row="${row}"][data-col="${col}"]`);
                
                if (!gridItem.classList.contains('start') && !gridItem.classList.contains('end')) {
                    gridItem.classList.add('path2');
                }
            }, i * 50);  // Delay each step for a better visual effect
        }
        console.log(path + "Reverse path");
        }, 4000);
        
      // Backtrack from the end to the start
      
}
// Hitta A och B punkten
function findStartAndEndPos(ruta){
   
    for (let rad = 0; rad < gridSize; rad++) {
        for (let col = 0; col < gridSize; col++) {
            if (CellArray[rad][col] === ruta) {
                return [rad, col];
            }
        }
    }
    return null;
}
function toggleWall(row, col, div) {
    if (CellArray[row][col] === false) {
        CellArray[row][col] = true; // Set as wall
        div.classList.add('wall');
    } else if (CellArray[row][col] === true) {
        CellArray[row][col] = false; // Set as open space
        div.classList.remove('wall');
    }
}
function CheckSurroundings(rad,column){

    let samlingAvGranar = [];

    let kordinater = [
        [1,0], // ner
        [0,1], // höger
        [0,-1], // left
        [-1,0] // up
    ]

    for(const [kordRad, kordCol] of kordinater){
        let nyRad = rad + kordRad;
        let nyCol = column + kordCol;

        if(nyRad >= 0 && nyRad < gridSize && nyCol >= 0 && nyCol < gridSize){
            samlingAvGranar.push([nyRad,nyCol]);
        }
    }
    return samlingAvGranar;
}

 function PaintLogPath(visited){
    let t = [...visited];
    console.log(t[1].toString());
    for(let i = 0; i < t.length; i++){
       setTimeout(() => {
            let [row, col] = t[i].split('-').map(Number);
            console.log("visited " + row, col);
    
            const gridItem = document.querySelector(`.grid-item[data-row="${row}"][data-col="${col}"]`);
    
            if (!gridItem.classList.contains('start') && !gridItem.classList.contains('end')) {
                gridItem.classList.add('path');
            }
        }, i * 50); // Delay each step by 5000ms (5 seconds)
    }

}
// Initialize the grid and set the maze
function StartMaze(){
    FindClosestRoute();
}



createGrid();
setMaze();

