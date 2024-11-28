// EDIT THIS FILE TO COMPLETE ASSIGNMENT QUESTION 1
const { chromium } = require("playwright");

async function sortHackerNewsArticles() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto("https://news.ycombinator.com/newest");

  let articles = [];
  while (articles.length < 100) {
    
    const titles = await page.$$eval(".titleline", (elements) => {
      return elements.map((el) => {
        const titleElement = el.querySelector("a");  
        return titleElement ? titleElement.textContent.trim() : null; 
      });
    });

    const ages = await page.$$eval(".age", (elements) => {
      return elements.map((el) => el.getAttribute("title"));
    });
   
    const pages = titles.map((title, index) => ({
      title,
      age: ages[index] || null,
    }));

    articles = articles.concat(pages);

    if (articles.length >= 100) {
      break;
    }

    const moreLink = await page.$("a.morelink");

    await Promise.all([moreLink.click(), page.waitForTimeout(3000)]);
  }

  if (articles.length > 100 ){
    articles = articles.slice(0,100)
  }

  console.log("ARTICLES: ", articles.length)

  let isCorrectlySorted = true
  for (let i = 0; i < articles.length-1; i++){

    if(articles[i].age < articles[i+1].age ){
      isCorrectlySorted=false
      console.error(`The article "${articles[i].title}" with position "${i}" is NOT correctly sorted.`);
      console.error(`"${articles[i+1].age}" is newer than "${articles[i].age}".`);
      break
    }
  }

  if (isCorrectlySorted) {
    console.log("The articles are correctly sorted from newest to oldest.");
    console.log("ARTICLES: ", articles);
  }

  // await browser.close();
}

(async () => {
  await sortHackerNewsArticles();
})();
