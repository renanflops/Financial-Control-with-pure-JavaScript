const transactionUl = document.querySelector("#transactions");
const incomeDisplay = document.querySelector("#money-plus");
const expanseDisplay = document.querySelector("#money-minus");
const balanceDisplay = document.querySelector("#balance");
const form = document.querySelector("#form");
const inputTransactionName = document.querySelector("#text");
const inputTransactionAmount = document.querySelector("#amount");


//Existe uma API no browser (WEB STORE API) que permite que sejam armazenadas e persista dados no browser do usuario
const localStorageTransactions = JSON.parse(localStorage
    .getItem('transaction'));
let transactions = localStorage
    .getItem('transaction') !== null ? localStorageTransactions : []; 


const removeTransaction = ID => {
    transactions = transactions
        .filter(transaction => transaction.id !== ID);
        updateLocalStorage();
        init();
}

const addTransactionIntoDOM = transaction => {
    const operator = transaction.amount < 0 ? '-' : '+';
    const CSSClass = transaction.amount < 0 ? 'minus' : 'plus';
    const amountWithoutOperator = Math.abs(transaction.amount);
    const li = document.createElement('li');

    li.classList.add(CSSClass);
    li.innerHTML = `
        ${transaction.name} 
        <span>${operator} R$ ${amountWithoutOperator}</span>
        <button class="delete-btn" onclick="removeTransaction(${transaction.id})">
            x
        </button>
    `;
    
    transactionUl.append(li);
}


//valor das despesas
const getExpanse = transactionAmounts => Math.abs(transactionAmounts
    .filter(value => value < 0)
    .reduce((accumulator, value) => accumulator + value, 0))
    .toFixed(2);


//valor das receitas
const getIncome = transactionAmounts => transactionAmounts
    .filter(values => values > 0)
    .reduce((accumulator, value) => accumulator + value, 0)
    .toFixed(2);


const getTotal = transactionAmounts => transactionAmounts
    .reduce((accumulator, transaction) => accumulator + transaction, 0)
    .toFixed(2);


const updateBalanceValues = () => {
    const transactionAmounts = transactions.map(transaction => transaction.amount);
    const total = getTotal(transactionAmounts);
    const income = getIncome(transactionAmounts); 
    const expanse = getExpanse(transactionAmounts); 
    
    balanceDisplay.textContent = `R$ ${total}`;
    incomeDisplay.textContent = `R$ ${income}`;
    expanseDisplay.textContent = `R$ ${expanse}`;
}


//itera pelos arrays das transacoes, e para cada item desse array ela insere item que é uma transacao no DOM
const init = () => {
    transactionUl.innerHTML = ''; //limpar para nao repetir todo conteudo do objeto
    transactions.forEach(addTransactionIntoDOM);
    updateBalanceValues();
}


init();


//Função que salva no localStorage, no formato chave e valor, similiar a um objeto
const updateLocalStorage = () => {
    localStorage.setItem('transaction', JSON.stringify(transactions));
}


//gera uma propriedade de nummero aleatorio de 1 a 1000
const generateID = () => Math.round(Math.random() * 1000);


//inserir ultimo item do array
const addToTransactionsArray = (transactionName, transactionAmount) => {
    transactions.push({
        id: generateID(), 
        name: transactionName, 
        amount: Number(transactionAmount) //poderiamos colocar o operador +, ficando +transactionAmount, que significa unario que converte string em numero 
    }); 
};


//limpar os inputs
const cleanInputs = () => {
    inputTransactionName.value = '';
    inputTransactionAmount.value = '';
};


const handleFormSubmit = event => {
    event.preventDefault();
    const transactionName = inputTransactionName.value.trim();
    const transactionAmount = inputTransactionAmount.value.trim();
    const isSomeInputEmpty = transactionName === '' || transactionAmount === '';

    if (isSomeInputEmpty) {
        alert('Por favor, preencha tanto o nome quanto o valor da transação');
        return;
    }

    addToTransactionsArray(transactionName, transactionAmount);
    init(); //adicionar item na lista de transacoes e atualizar os valores da receita e despesa
    updateLocalStorage();
    cleanInputs();
};


form.addEventListener("submit", handleFormSubmit)