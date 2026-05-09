export const units = [
  {
    id: "unit-1",
    title: "The Magic of Compound Interest",
    description: "Learn how money grows over time",
    color: "from-emerald-400 to-emerald-600",
    lessons: [
      {
        id: "1-1",
        title: "What is Interest?",
        studyBrief: "Interest is the cost of borrowing money — or the reward for saving it. Simple interest is calculated only on the original amount you deposited (called the 'principal'). Compound interest, however, is calculated on both the principal AND any interest already earned. This means your money grows faster and faster over time. Albert Einstein reportedly called compound interest the 'eighth wonder of the world' because of this powerful snowball effect.",
        questions: [
          {
            type: "multiple_choice",
            question: "What is simple interest?",
            options: [
              "Interest earned only on the original principal",
              "Interest earned on interest",
              "A type of bank fee",
              "Money you owe the government"
            ],
            correct: 0,
            explanation: "Simple interest is calculated only on the original amount (principal) you deposited or borrowed."
          },
          {
            type: "true_false",
            question: "Compound interest earns interest on previously earned interest.",
            correct: true,
            explanation: "That's exactly what makes compound interest so powerful — your interest earns interest!"
          },
          {
            type: "multiple_choice",
            question: "If you invest $100 at 10% simple interest, how much do you have after 1 year?",
            options: ["$110", "$100", "$120", "$90"],
            correct: 0,
            explanation: "$100 × 10% = $10 interest. $100 + $10 = $110."
          },
          {
            type: "word_bank",
            question: "Compound interest makes your money grow ___ over time because you earn interest on ___.",
            blanks: ["faster", "interest"],
            options: ["faster", "slower", "interest", "taxes", "debt"],
            explanation: "Compound interest accelerates growth because you earn interest on your accumulated interest."
          },
          {
            type: "true_false",
            question: "Albert Einstein reportedly called compound interest the 'eighth wonder of the world.'",
            correct: true,
            explanation: "This famous quote highlights how powerful compound interest can be for building wealth."
          }
        ]
      },
      {
        id: "1-2",
        title: "The Rule of 72",
        studyBrief: "The Rule of 72 is a simple mental math shortcut that tells you approximately how long it takes to double your money at a given interest rate. You just divide 72 by your annual interest rate. For example, at 8% annual return, your money doubles in about 9 years (72 ÷ 8 = 9). At 12%, it doubles in just 6 years. This rule is useful because it lets investors quickly compare investment options without a calculator.",
        questions: [
          {
            type: "multiple_choice",
            question: "The Rule of 72 helps you estimate how long it takes to:",
            options: [
              "Double your money",
              "Triple your money",
              "Lose your money",
              "Pay off debt"
            ],
            correct: 0,
            explanation: "Divide 72 by your interest rate to estimate how many years it takes to double your investment."
          },
          {
            type: "multiple_choice",
            question: "At 8% annual return, approximately how many years to double your money?",
            options: ["9 years", "12 years", "6 years", "15 years"],
            correct: 0,
            explanation: "72 ÷ 8 = 9 years. The Rule of 72 gives a quick approximation."
          },
          {
            type: "true_false",
            question: "At 12% interest, your money doubles in approximately 6 years.",
            correct: true,
            explanation: "72 ÷ 12 = 6. Correct!"
          },
          {
            type: "word_bank",
            question: "To use the Rule of 72, divide ___ by the ___ rate.",
            blanks: ["72", "interest"],
            options: ["72", "100", "interest", "inflation", "tax"],
            explanation: "72 ÷ interest rate = approximate years to double your investment."
          },
          {
            type: "multiple_choice",
            question: "Why is the Rule of 72 useful for investors?",
            options: [
              "It provides a quick mental estimate",
              "It's required by law",
              "Banks use it to set rates",
              "It guarantees returns"
            ],
            correct: 0,
            explanation: "It's a handy mental shortcut — no calculator needed!"
          }
        ]
      },
      {
        id: "1-3",
        title: "Time Value of Money",
        studyBrief: "The Time Value of Money (TVM) is one of the most important ideas in finance: a dollar today is worth MORE than a dollar in the future. Why? Because money you have now can be invested to earn interest and grow. Three key factors affect TVM: the interest rate (how fast money grows), inflation (which erodes purchasing power over time), and the time period involved. This concept explains why people prefer to receive money sooner rather than later.",
        questions: [
          {
            type: "multiple_choice",
            question: "What does 'time value of money' mean?",
            options: [
              "A dollar today is worth more than a dollar tomorrow",
              "Time is money",
              "Money loses value over centuries",
              "Banks charge for your time"
            ],
            correct: 0,
            explanation: "Because money can earn interest, $1 today is worth more than $1 in the future."
          },
          {
            type: "true_false",
            question: "Receiving $1,000 today is better than receiving $1,000 in 5 years (assuming you can invest it).",
            correct: true,
            explanation: "If you invest $1,000 today, it will grow to more than $1,000 in 5 years."
          },
          {
            type: "word_bank",
            question: "A dollar today is worth ___ than a dollar ___ because of earning potential.",
            blanks: ["more", "tomorrow"],
            options: ["more", "less", "tomorrow", "yesterday", "equally"],
            explanation: "The time value of money: today's dollar can be invested to grow."
          },
          {
            type: "multiple_choice",
            question: "Which factor does NOT affect the time value of money?",
            options: [
              "The color of your wallet",
              "Interest rates",
              "Inflation",
              "Time period"
            ],
            correct: 0,
            explanation: "Interest rates, inflation, and time all affect TVM. Your wallet color? Not so much!"
          },
          {
            type: "true_false",
            question: "Inflation reduces the purchasing power of money over time.",
            correct: true,
            explanation: "Inflation means prices rise, so each dollar buys less in the future."
          }
        ]
      }
    ]
  },
  {
    id: "unit-2",
    title: "Supply, Demand & Markets",
    description: "Understand how prices are set",
    color: "from-blue-400 to-blue-600",
    lessons: [
      {
        id: "2-1",
        title: "What is Supply?",
        studyBrief: "Supply refers to the total quantity of a product or service that producers are willing and able to sell at various prices. The Law of Supply states that as prices rise, suppliers want to produce and sell more — because higher prices mean higher profits. Supply can also shift due to changes in production costs: if it becomes cheaper to produce something, more will be supplied at every price level. On a graph, this 'supply shift' moves the supply curve to the right.",
        questions: [
          {
            type: "multiple_choice",
            question: "Supply refers to:",
            options: [
              "The amount of a product sellers are willing to offer at various prices",
              "The amount consumers want to buy",
              "The total money in an economy",
              "Government-produced goods"
            ],
            correct: 0,
            explanation: "Supply is the quantity of goods that producers are willing and able to sell at different price levels."
          },
          {
            type: "true_false",
            question: "As prices increase, suppliers generally want to produce more.",
            correct: true,
            explanation: "Higher prices mean more profit, so suppliers are incentivized to produce more."
          },
          {
            type: "word_bank",
            question: "When supply goes ___ and demand stays the same, prices tend to go ___.",
            blanks: ["up", "down"],
            options: ["up", "down", "sideways", "nowhere", "crazy"],
            explanation: "More supply with the same demand pushes prices lower."
          },
          {
            type: "multiple_choice",
            question: "What is the law of supply?",
            options: [
              "Higher prices lead to higher quantity supplied",
              "Higher prices lead to lower quantity supplied",
              "Prices don't affect supply",
              "Supply is always constant"
            ],
            correct: 0,
            explanation: "The law of supply states there's a positive relationship between price and quantity supplied."
          },
          {
            type: "true_false",
            question: "A decrease in production costs will shift the supply curve to the right.",
            correct: true,
            explanation: "Lower costs mean producers can supply more at every price level, shifting supply right."
          }
        ]
      },
      {
        id: "2-2",
        title: "What is Demand?",
        studyBrief: "Demand is the quantity of a good or service that consumers are willing and able to buy at various prices. The Law of Demand states that as prices fall, people buy more — there is an inverse (opposite) relationship between price and quantity demanded. Demand can shift due to external factors like weather, trends, or income changes. For example, a rainy season forecast increases demand for umbrellas even before the price changes. 'Demand' is the whole relationship; 'quantity demanded' is the specific amount at one price.",
        questions: [
          {
            type: "multiple_choice",
            question: "Demand represents:",
            options: [
              "How much consumers are willing to buy at various prices",
              "How much is produced",
              "The government's needs",
              "Total imports"
            ],
            correct: 0,
            explanation: "Demand is the quantity of goods consumers want and can afford at different prices."
          },
          {
            type: "true_false",
            question: "When the price of a product decreases, demand for it typically increases.",
            correct: true,
            explanation: "Lower prices make products more affordable, so people buy more — the law of demand."
          },
          {
            type: "multiple_choice",
            question: "Which would increase demand for umbrellas?",
            options: [
              "A rainy season forecast",
              "A drought",
              "A sale on sunglasses",
              "Lower umbrella production"
            ],
            correct: 0,
            explanation: "Rainy weather increases the desire for umbrellas, shifting demand right."
          },
          {
            type: "word_bank",
            question: "The law of demand says that as prices rise, the quantity demanded ___.",
            blanks: ["decreases"],
            options: ["decreases", "increases", "stays", "doubles", "vanishes"],
            explanation: "There's an inverse relationship between price and quantity demanded."
          },
          {
            type: "true_false",
            question: "Demand and quantity demanded mean exactly the same thing.",
            correct: false,
            explanation: "Demand is the entire relationship, while quantity demanded is a specific amount at a specific price."
          }
        ]
      },
      {
        id: "2-3",
        title: "Market Equilibrium",
        studyBrief: "Market equilibrium is the point where the quantity of goods supplied exactly equals the quantity demanded — it's the 'sweet spot' of the market. At equilibrium, there is no surplus (excess supply) and no shortage (unmet demand). When prices are set below equilibrium, a shortage occurs because demand exceeds supply. When prices are above equilibrium, a surplus occurs. Markets naturally tend to move toward equilibrium as prices adjust up or down in response to these imbalances.",
        questions: [
          {
            type: "multiple_choice",
            question: "Market equilibrium occurs when:",
            options: [
              "Quantity supplied equals quantity demanded",
              "Prices are at their highest",
              "The government sets the price",
              "There is no competition"
            ],
            correct: 0,
            explanation: "Equilibrium is the sweet spot where buyers and sellers agree on both price and quantity."
          },
          {
            type: "true_false",
            question: "A surplus occurs when supply exceeds demand at the current price.",
            correct: true,
            explanation: "When there's more supply than demand, unsold goods pile up — that's a surplus."
          },
          {
            type: "word_bank",
            question: "At equilibrium, there is no ___ and no ___.",
            blanks: ["surplus", "shortage"],
            options: ["surplus", "shortage", "profit", "loss", "demand"],
            explanation: "Equilibrium means the market clears — no excess supply (surplus) or unmet demand (shortage)."
          },
          {
            type: "multiple_choice",
            question: "If a product's price is below equilibrium, what happens?",
            options: [
              "A shortage occurs",
              "A surplus occurs",
              "Nothing changes",
              "Supply increases"
            ],
            correct: 0,
            explanation: "Below-equilibrium prices mean high demand but low supply, creating a shortage."
          },
          {
            type: "true_false",
            question: "Markets naturally tend to move toward equilibrium over time.",
            correct: true,
            explanation: "Market forces (price adjustments) push toward equilibrium where supply meets demand."
          }
        ]
      }
    ]
  },
  {
    id: "unit-3",
    title: "Personal Budgeting",
    description: "Master your monthly finances",
    color: "from-purple-400 to-purple-600",
    lessons: [
      {
        id: "3-1",
        title: "Income vs Expenses",
        studyBrief: "Income is the money you receive (from a job, investments, etc.), while expenses are the money you spend. Your 'gross income' is your total pay before deductions; your 'net income' (take-home pay) is what remains after taxes. Expenses fall into two types: fixed expenses (like rent or car payments) that stay the same each month, and variable expenses (like groceries or entertainment) that change. The popular 50/30/20 budgeting rule suggests spending 50% on needs, 30% on wants, and saving 20%.",
        questions: [
          {
            type: "multiple_choice",
            question: "What is net income?",
            options: [
              "Income after taxes and deductions",
              "Total income before anything is taken out",
              "Money from side jobs only",
              "Investment returns"
            ],
            correct: 0,
            explanation: "Net income (take-home pay) is what you actually receive after taxes and deductions."
          },
          {
            type: "true_false",
            question: "Fixed expenses change from month to month.",
            correct: false,
            explanation: "Fixed expenses like rent stay the same each month. Variable expenses are the ones that change."
          },
          {
            type: "word_bank",
            question: "A budget helps you track your ___ and ___.",
            blanks: ["income", "expenses"],
            options: ["income", "expenses", "friends", "weather", "hobbies"],
            explanation: "Budgeting is about understanding where your money comes from and where it goes."
          },
          {
            type: "multiple_choice",
            question: "Which is a variable expense?",
            options: ["Groceries", "Rent", "Car payment", "Insurance premium"],
            correct: 0,
            explanation: "Groceries vary month to month. Rent, car payments, and insurance are typically fixed."
          },
          {
            type: "true_false",
            question: "The 50/30/20 rule suggests 50% of income for needs, 30% for wants, and 20% for savings.",
            correct: true,
            explanation: "This popular budgeting guideline provides a simple framework for allocating your income."
          }
        ]
      },
      {
        id: "3-2",
        title: "Emergency Funds",
        studyBrief: "An emergency fund is money set aside specifically for unexpected financial crises — job loss, medical bills, or urgent car repairs. Financial experts recommend saving 3 to 6 months' worth of living expenses. The key is that this money must be easily accessible (liquid), so a high-yield savings account is ideal — NOT a long-term investment account. An emergency fund is distinct from regular savings; it should only be used for true emergencies, not wants like new gadgets or vacations.",
        questions: [
          {
            type: "multiple_choice",
            question: "How many months of expenses should an emergency fund cover?",
            options: ["3-6 months", "1 month", "12 months", "1 week"],
            correct: 0,
            explanation: "Financial experts recommend 3-6 months of expenses as a safety net."
          },
          {
            type: "true_false",
            question: "An emergency fund should be kept in a hard-to-access investment account.",
            correct: false,
            explanation: "Emergency funds should be easily accessible — a high-yield savings account is ideal."
          },
          {
            type: "word_bank",
            question: "An emergency fund provides a financial ___ for unexpected ___.",
            blanks: ["cushion", "expenses"],
            options: ["cushion", "burden", "expenses", "profits", "gifts"],
            explanation: "It's your financial safety net for life's surprises."
          },
          {
            type: "multiple_choice",
            question: "Which is NOT a good reason to use your emergency fund?",
            options: [
              "Buying the latest smartphone",
              "Unexpected medical bills",
              "Car repairs",
              "Job loss"
            ],
            correct: 0,
            explanation: "Emergency funds are for true emergencies, not wants. New phones can wait!"
          },
          {
            type: "true_false",
            question: "You should start building an emergency fund even if you can only save small amounts.",
            correct: true,
            explanation: "Every dollar counts! Small consistent contributions add up over time."
          }
        ]
      }
    ]
  },
  {
    id: "unit-4",
    title: "Investing Basics",
    description: "Start your investment journey",
    color: "from-amber-400 to-amber-600",
    lessons: [
      {
        id: "4-1",
        title: "Stocks & Bonds",
        studyBrief: "When you buy a stock, you are purchasing a small ownership stake in a company — you become a 'shareholder.' If the company does well, your shares rise in value and you may receive dividends (a share of profits). Bonds are different: buying a bond means you are lending money to a company or government, and they pay you back with interest. Bonds are generally less risky but offer lower returns than stocks. Spreading investments across both stocks and bonds is called diversification.",
        questions: [
          {
            type: "multiple_choice",
            question: "What does buying a stock represent?",
            options: [
              "Owning a small piece of a company",
              "Lending money to a company",
              "Buying a company's products",
              "Getting a guaranteed return"
            ],
            correct: 0,
            explanation: "When you buy stock, you become a partial owner (shareholder) of that company."
          },
          {
            type: "true_false",
            question: "Bonds are generally considered less risky than stocks.",
            correct: true,
            explanation: "Bonds are debt instruments with fixed returns, making them typically less volatile than stocks."
          },
          {
            type: "word_bank",
            question: "Stocks offer ___ returns but with ___ risk compared to bonds.",
            blanks: ["higher", "higher"],
            options: ["higher", "lower", "zero", "guaranteed", "negative"],
            explanation: "The risk-return tradeoff: stocks can earn more but are less predictable than bonds."
          },
          {
            type: "multiple_choice",
            question: "What is a dividend?",
            options: [
              "A share of company profits paid to stockholders",
              "A type of tax",
              "A bank fee",
              "Interest on a bond"
            ],
            correct: 0,
            explanation: "Dividends are portions of profits that companies distribute to their shareholders."
          },
          {
            type: "true_false",
            question: "Diversification means putting all your money in one stock.",
            correct: false,
            explanation: "Diversification is the opposite — spreading investments across many assets to reduce risk."
          }
        ]
      },
      {
        id: "4-2",
        title: "Risk & Return",
        studyBrief: "The Risk-Return Tradeoff is a core investing principle: investments with higher potential returns always carry higher risk. 'Risk tolerance' is your personal comfort level with the possibility of losing money. Young investors can typically afford higher risk because they have more time to recover from market downturns. Diversification — spreading investments across different asset types — is the main tool for managing risk. Government bonds offer the lowest risk, while individual stocks, crypto, and startups carry the highest.",
        questions: [
          {
            type: "multiple_choice",
            question: "What does 'risk tolerance' mean?",
            options: [
              "How much financial risk you're comfortable with",
              "The maximum money you can lose",
              "A type of insurance",
              "Government risk regulations"
            ],
            correct: 0,
            explanation: "Risk tolerance is your personal comfort level with the possibility of losing money."
          },
          {
            type: "true_false",
            question: "Higher potential returns always come with higher risk.",
            correct: true,
            explanation: "This is a fundamental principle of investing — the risk-return tradeoff."
          },
          {
            type: "word_bank",
            question: "Diversification helps ___ risk by spreading investments across different ___.",
            blanks: ["reduce", "assets"],
            options: ["reduce", "increase", "assets", "banks", "countries"],
            explanation: "Don't put all your eggs in one basket — diversify across asset types."
          },
          {
            type: "multiple_choice",
            question: "Which investment typically has the lowest risk?",
            options: [
              "Government bonds",
              "Cryptocurrency",
              "Individual stocks",
              "Startup investments"
            ],
            correct: 0,
            explanation: "Government bonds are backed by the government, making them among the safest investments."
          },
          {
            type: "true_false",
            question: "Young investors can generally afford to take more risk because they have more time to recover from losses.",
            correct: true,
            explanation: "A longer time horizon means more time to ride out market ups and downs."
          }
        ]
      }
    ]
  }
];

export function getAllLessons() {
  const lessons = [];
  units.forEach(unit => {
    unit.lessons.forEach(lesson => {
      lessons.push({ ...lesson, unitId: unit.id, unitTitle: unit.title, unitColor: unit.color });
    });
  });
  return lessons;
}

export function getLessonById(id) {
  for (const unit of units) {
    const lesson = unit.lessons.find(l => l.id === id);
    if (lesson) return { ...lesson, unitId: unit.id, unitTitle: unit.title, unitColor: unit.color };
  }
  return null;
}

export function getNextLessonId(completedLessons) {
  const allLessons = getAllLessons();
  for (const lesson of allLessons) {
    if (!completedLessons?.includes(lesson.id)) return lesson.id;
  }
  return null;
}