// // Hämtar mina HTML-element
const form = document.getElementById("mortgageForm") as HTMLFormElement;
const resultatDiv = document.getElementById("result") as HTMLDivElement;

//Räknar ut allt
function calculate(event: Event) {
  event.preventDefault();

  //Hämtar inputsen från HTML
  const loanAmountInput = document.getElementById(
    "loanAmount"
  ) as HTMLInputElement;
  const annualInterestRateInput = document.getElementById(
    "annualInterestRate"
  ) as HTMLInputElement;
  const loanYearsInput = document.getElementById(
    "loanYears"
  ) as HTMLInputElement;

  //Tar inputen och gör från string => number
  const loanAmount: number = parseFloat(loanAmountInput.value);
  const annualInterestRate: number =
    parseFloat(annualInterestRateInput.value) / 100;
  const loanYears: number = parseFloat(loanYearsInput.value);

  const monthlyInterestRate = annualInterestRate / 12;
  const totalPayments = loanYears * 12;

  // Räknar månadskostnaden
  const monthlyPayment: number =
    (loanAmount * monthlyInterestRate) /
    (1 - Math.pow(1 + monthlyInterestRate, -totalPayments));

  // Räknar totala räntan och total betalning
  const totalAmountPaid = monthlyPayment * totalPayments;
  const totalInterest = totalAmountPaid - loanAmount;

  //Visar första delen
  resultatDiv.innerHTML = `
          <h2 class="yourLoan">DITT LÅN</h2>
          <p class="monthlyPay">Månadskostnad: ${monthlyPayment.toFixed()} kr</p>
          <p class="totalInter">Total räntekostnad över låneperiod: ${totalInterest.toFixed()} kr</p>
          <p class="totalAmount">Totalt betalat: ${totalAmountPaid.toFixed()} kr</p>`;


  interface Amortization {
    period: Number,
    payment: Number,
    interest: Number,
    principal: Number,
    remainingLoan: Number
  }    

  //Array för amorteringen
  const amortizationSchedule: Amortization[] = [];

  let remainingLoanAmount = loanAmount;

  //Räknar ut amorteringsplanen
  for (let i = 0; i < totalPayments; i++) {
    const interestForPeriod: number = remainingLoanAmount * monthlyInterestRate;
    const principalForPeriod: number = monthlyPayment - interestForPeriod;

    amortizationSchedule.push({
      period: i + 1,
      payment: monthlyPayment,
      interest: interestForPeriod,
      principal: principalForPeriod,
      remainingLoan: remainingLoanAmount,
  });

    remainingLoanAmount -= principalForPeriod;
  }

  // Visar amorteringen i tabell
  displayResult(amortizationSchedule);
}

function displayResult(amortizationSchedule: any[]) {
  const amortizationTable = document.createElement("table");
  amortizationTable.innerHTML = `
    <tr>
      <th class="month">Månad</th>
      <th class="monthPay">Månadskostnad</th>
      <th class="interest">Ränta</th>
      <th class="amort">Amortering</th>
      <th class="debt">Återstående skuld</th>
    </tr>
  `;

  amortizationSchedule.forEach((payment) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="monthrow">${payment.period}</td>
      <td class="monthPayrow">${payment.payment.toFixed(2)} kr</td>
      <td class="interestrow">${payment.interest.toFixed(2)} kr</td>
      <td class="amortrow">${payment.principal.toFixed(2)} kr</td>
      <td class="debtrow">${payment.remainingLoan.toFixed(2)} kr</td>
    `;
    amortizationTable.appendChild(row);
  });

  resultatDiv.appendChild(amortizationTable);
}

//Startar beräkning vid submit
form.addEventListener("submit", calculate);
