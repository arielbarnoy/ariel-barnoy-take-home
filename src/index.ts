import * as fs from 'fs';
import * as process from 'process';
import * as path from 'path';

type Order = {
    mains: { [dish: string]: number };
    sides: { [dish: string]: number };
    money: number;
  };

  const findBestOrder = (order: Order) => {
    let bestCost = 0;
    const sides = Object.entries(order.sides);
    
    for (let [mainDish, mainDishCost] of Object.entries(order.mains)) {
      if (mainDishCost <= order.money) {
        bestCost = Math.max(bestCost, mainDishCost);
        
        for (let i = 0; i < sides.length; i++) {
          let [sideDish1, sideDishCost1] = sides[i];
          let totalCost = mainDishCost + sideDishCost1;
          if (totalCost <= order.money) {
            bestCost = Math.max(bestCost, totalCost);
            
            for (let j = i + 1; j < sides.length; j++) {
              let [sideDish2, sideDishCost2] = sides[j];
              totalCost = mainDishCost + sideDishCost1 + sideDishCost2;
              if (totalCost <= order.money) {
                bestCost = Math.max(bestCost, totalCost);
              }
            }
          }
        }
      }
    }
    
    return bestCost;
  };

  const calculateOrders = (inputFileName: string, outputFileName: string) => {
    fs.readFile(inputFileName, 'utf8', (err, data) => {
      if (err) {
        console.error(`Error reading file from disk: ${err}`);
      } else {
        const orders: Order[] = JSON.parse(data);
  
        const bestOrders = orders.map(findBestOrder);
  
        // format output in method requested
        fs.writeFile(outputFileName, '[ ' + bestOrders.join('\n, ') + ' ]', (err) => {
          if (err) {
            console.error(`Error writing file on disk: ${err}`);
          } else {
            console.log(`Successfully wrote to ${outputFileName}`);
          }
        });
      }
    });
  };


// Take the input from command line
let [inputFilePath, outputFilePath] = process.argv.slice(2);

// Check if both file paths are provided. If not, use default.
if (!inputFilePath) {
  inputFilePath = path.join(__dirname, '../input.json');
}
if (!outputFilePath) {
    outputFilePath = path.join(__dirname, '../output/output.json');
}

calculateOrders(inputFilePath, outputFilePath);