let PESO = [16.71, 18.52, 10.41, 21.21, 21.71, 22.06, 14.01, 43.61, 12.56];
let QUANTIDADE = [2, 2, 3, 2, 2, 1, 1, 1, 3]
let ITENS = ["Armadura Lobo Lendaria de Grão Mestre", "Armadura de Alabardeiro Redaniana", "Armadura de Grifo Lendaria Superior", "Espada de Prata da vibora", "Espada de Aço da vibora", "Lamina Lunar", "Iris", "Tlareng", "Espada de Aço venenosa de vibora"];

let populationSize = 10;
let initialSolutions = [];
let selectedSolution = [];
let newGeneration = [];
let isToNormalize = true;
let mutationRate = 0.05;

let Incubentes = [];

let masterIncubente = 0;
let activiedQtd = 0;

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function solutionsAreEquals(solution1, solution2) {
    let resultado = [];
    for (let i = 0; i < solution1.length; i++) {
        if (solution1[i] === solution2[i]) {
            resultado.push(1);
        }
    }
    let sum = resultado.reduce((value1, value2) => value1 + value2);
    return sum === solution1.length;
}

function generateSolution() {
    let randonNumber = getRandomInt(0, 1000);
    let arr = [];

    for (let i = 0; i < PESO.length; i++) {
        if (randonNumber % 2 == 0) {
            arr.push(0);
        } else {
            arr.push(1);
        }
        randonNumber = getRandomInt(0, 1000);
    }
    return adaptation(arr);
}

function returnValueOfSolution(solution) {
    let timeSpent = 0;
    for (let xj = 0; xj < solution.length - 2; xj++) {
        if (solution[xj] === 1) {
            timeSpent += PESO[xj];
        }
    }
    return timeSpent;
}

function adaptation(solution) {
    let adptationQuality = 0;
    let valueSolution = returnValueOfSolution(solution);
    let rand = (getRandomInt(1, 5) / 100) * Math.random();

    adptationQuality = valueSolution * rand;
    solution.push(adptationQuality);
    return solution;
}

function createNewSon(pai1, pai2, cutPoint) {
    let son = [];
    for (let i = 0; i < cutPoint; i++) {
        son.push(pai1[i]);
    }

    for (let i = cutPoint + 1; i < pai2.length; i++) {
        son.push(pai2[i]);
    }
    return son;
}

function normalizeSelectedSolution() {
    // Verifica e anula predominancia de uma só solução
    let sum = 0;
    for (let i = 0; i < selectedSolution.length; i++) {
        for (let j = i + 1; j < selectedSolution.length; j++) {
            if (selectedSolution[j] === selectedSolution[i]) {
                sum += 1;
            }
        }
    }
    // Roda de novo a seleção caso haja predominancia
    if (sum >= 2) {
        selectedSolution = [];
        operatorSelection();
        // console.log(` Soma ${sum}`)        
    } else {
        isToNormalize = false;
        // console.log(`Populações escolhidas ${selectedSolution}`);
    }
}

function defineSolutionRecombination() {
    let qtdSelectedSoluction = selectedSolution.length;
    let recombinationArray = [];
    let sortedNumber = [];
    let num;

    function verifyRepeatedSorted(actualSorted) {
        let resp = false;
        sortedNumber.forEach((element) => {
            // console.log(`Actual ${actualSorted}, Element ${element}`)
            if (element === actualSorted) resp = true;
        });
        return resp;
    }

    for (let i = 0; i < qtdSelectedSoluction; i++) {
        num = getRandomInt(0, qtdSelectedSoluction);

        if (sortedNumber.length === 0) {
            sortedNumber.push(num);
        } else {
            while (verifyRepeatedSorted(num)) {
                num = getRandomInt(0, qtdSelectedSoluction);
            }
            sortedNumber.push(num);
        }
        recombinationArray.push(selectedSolution[num]);
    }
    console.log(recombinationArray);
    return recombinationArray;
}

function valueEachSolution(solutions) {
    // Encontrando o valor resultado de cada solução
    let valueSolution = 0;
    let Incubente = [];
    for (let i = 0; i < solutions.length; i++) {
        valueSolution = returnValueOfSolution(solutions[i]);
        console.log(`A solução ${i} tem valor ${valueSolution}`);

        if (Incubente.length == 0) {
            Incubente.push(i);
            Incubente.push(valueSolution);
        } else {
            if (valueSolution > Incubente[1]) {
                Incubente[0] = i;
                Incubente[1] = valueSolution;
            }
        }
    }
    Incubentes.push(Incubente);
    console.log(`Portanto: Solução ${Incubente[0]} --> ${Incubente[1]}`) 
}

function isFactivel(solution) {
    let qtdAti = 0;
    let totalTime = 0;

    for (let i = 0; i < solution.length - 1; i++) {
        qtdAti += solution[i];
        totalTime += (PESO[i] * solution[i]);
    }

    let factivel = (qtdAti >= 5 && totalTime <= 22000);
    return factivel;
}

function getInitialSolutions() {
    // Gerando População de soluções iniciais
    for (let i = 0; i < populationSize; i++) {
        initialSolutions.push(generateSolution());
    }
    // Procurando e eliminando soluções infactíveis
    for (let i = 0; i < populationSize; i++) {
        let isfactivel = isFactivel(initialSolutions[i]);
        if (!isfactivel) {
            initialSolutions[i] = generateSolution();
            i--;
        }
    }
    // Procurando e eliminando individuos idênticos
    for (let i = 0; i < populationSize; i++) {
        for (let j = i + 1; j < populationSize; j++) {
            while (solutionsAreEquals(initialSolutions[i], initialSolutions[j])) {
                console.log("Era igual");
                initialSolutions.splice(j, generateSolution())
            }
        }
    }

    console.log(`Geração Inicial\n`)
    console.log(initialSolutions);
    console.log(`\nValor de Cada solução\n`)

    valueEachSolution(initialSolutions);
    console.log(`\n\n`)
}

function getIncubenteSolution() {
    let incubenteWinner = [];

    for (let k = 0; k < Incubentes.length; k++) {
        for (let l = k + 1; l < Incubentes.length; l++) {
            if (Incubentes[k][1] > Incubentes[l][1]) {
                incubenteWinner.push(Incubentes[k][0]);
                incubenteWinner.push(k);
                incubenteWinner.push(Incubentes[k][1]);
            } else {
                incubenteWinner.push(Incubentes[l][0]);
                incubenteWinner.push(l);
                incubenteWinner.push(Incubentes[l][1]);
            }
        }
    }
    return incubenteWinner;
}

function putAdaptationQualityOnNewGeneration() {
    for (let i = 0; i < newGeneration.length; i++) {
        newGeneration[i] = adaptation(newGeneration[i]);
    }
}
// ------------------------- Operadores Genéticos operações -------------------------------- \\
// Seleção baseada em torneio
function operatorSelection() {
    let tournamentSpin = [];

    function selectBesteOfRound(localSolution) {
        let k = localSolution[0];
        let better = -1;

        for (let i = 1; i < localSolution.length; i++) {
            
            if (better == -1) {
                better = localSolution[i];
            } else {
                if (initialSolutions[localSolution[i - 1]][PESO.length] < initialSolutions[localSolution[i]][PESO.length]) {
                    better = localSolution[i];
                }
            }
        }
        return better;
    }

    for (let game = 0; game < populationSize; game++) {
        let k = getRandomInt(2, 5); /*Gera número aleatório K*/
        // console.log(`Jogo ${game}, K ${k}`)
        tournamentSpin.push(k);
        for (let c = 0; c < k; c++) {
            tournamentSpin.push(getRandomInt(0, populationSize));
        }
    }

    for (let s = 0; s < tournamentSpin.length; s++) {
        let times = tournamentSpin[s];

        let choosenLocalSolution = [];
        choosenLocalSolution.push(times);

        for (let i = 1; i <= times; i++) {
            choosenLocalSolution.push(tournamentSpin[s + i]);
        }

        selectedSolution.push(selectBesteOfRound(choosenLocalSolution));
        s = s + times;
    }
}

function operatorRecombination() {

    while (isToNormalize) {
        normalizeSelectedSolution()
    }

    let arrayCombination = selectedSolution;

    let randomPoint = getRandomInt(1, PESO.length);
    for (let pos = 0; pos < arrayCombination.length; pos = pos + 2) {
        let pai1 = [...initialSolutions[arrayCombination[pos]].slice(0, 11)]
        let pai2 = [...initialSolutions[arrayCombination[pos + 1]].slice(0, 11)]

        pai1.splice(randomPoint, 0, "|")
        pai2.splice(randomPoint, 0, "|")

        let son1 = createNewSon(pai1, pai2, randomPoint);
        let son2 = createNewSon(pai2, pai1, randomPoint);

        newGeneration.push(son1);
        newGeneration.push(son2);
    }
}

function operatorMutation() {
    let rate = Math.random();

    if (rate > mutationRate) {
        let qtdMutation = Math.floor(populationSize * mutationRate * PESO.length);
        let whereMutation = [];
        let positionMutations = [];
        // Escolhendo bit onde será feito a mutação
        for (let i = 0; i < qtdMutation; i++) {
            let num = getRandomInt(1, populationSize * PESO.length);
            whereMutation.push(num);
        }

        whereMutation.forEach((element) => {
            let mutationAt = Math.floor(element / PESO.length);
            let position = element % PESO.length;
        })

        // Mutation        
        for (let j = 0; j < positionMutations.length; j = j + 2) {
            console.log(newGeneration[positionMutations[j]][positionMutations[j + 1]])
            if (newGeneration[positionMutations[j]][positionMutations[j + 1]] == 1) {
                newGeneration[positionMutations[j]][positionMutations[j + 1]] = 0;
            } else {
                newGeneration[positionMutations[j]][positionMutations[j + 1]] = 1;
            }
        }
    }
}

function removeInfactiblity(generation) {    

    for (let i = 0; i < generation.length; i++) {
        if (!isFactivel(generation[i])) {            
            generation[i] = generateSolution();
            i--;
        }
    }
}
// ------------------------- Iniciando operações -------------------------------- \\
// Gera solução inicial
getInitialSolutions();

let times = 0;

while (activiedQtd < 5) {

    // Executa operações genéticas
    operatorSelection();
    operatorRecombination();
    operatorMutation();

    removeInfactiblity(newGeneration);

    // Função que atribui função de adaptação à nova geração
    putAdaptationQualityOnNewGeneration()

    // Mostra nova geração
    console.log(`Nova Geração`)
    console.log(newGeneration);
    console.log(`\nValor de cada solução\n`);
    valueEachSolution(newGeneration);

    // Solução Incubente Rodada X
    let incubente = getIncubenteSolution();
    let solutionOptima = [];
    if (incubente[1] == 0) {
        solutionOptima = initialSolutions[incubente[0]].slice(0, ITENS.length)
        console.log(`\nA melhor Solução é a ${incubente[0]} da geração inicial com valor ${incubente[2]}`);
        console.log(`Sendo assim, a melhor solução é ${solutionOptima}\n`);
    } else {
        solutionOptima = newGeneration[incubente[0]].slice(0, ITENS.length);
        console.log(`\nA melhor Solução é a ${incubente[0]} da ${incubente[1]}º geração com valor ${incubente[2]}`);
        console.log(`Sendo assim, a melhor solução é ${solutionOptima}\n`);
    }

    console.log("Nessa situação, os itens que deverão ser mantidos no inventario são\n")
    for (let i = 0; i < solutionOptima.length; i++) {
        if (solutionOptima[i] == 1) console.log(`${ITENS[i]}  ---> Peso ${PESO[i]} ocupando ${PESO[i]*QUANTIDADE[i]} no inventario`)             
    }  

    activiedQtd = solutionOptima.reduce((val1, val2) => val1 + val2);
    masterIncubente = incubente[2];
    console.log(`Em ${incubente[2]} de capacidade`);
    initialSolutions = newGeneration;

    solutionOptima = [];    
}