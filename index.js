const { chromium } = require('playwright');
const { Script } = require('vm');
const player = require('play-sound')(opts = {});

// Carregue o arquivo de áudio
const audioFile = 'C:\\Users\\felip\\Downloads\\Nova pasta\\Nova requisição Base Laboratórios - FX.mp3';

// Defina uma função para reproduzir o áudio
function playAudio() {
  player.play(audioFile, (err) => {
    if (err) {
      console.error('Erro ao reproduzir o áudio:', err);
    }
  });
}

// Definir a variável qtdRequisicao inicialmente como null
var qtdRequisicao = null;

// Defina a variável reproduzir_audio como false inicialmente
var reproduzir_audio = false;
var ultimo_valor_reproduzido = null;


(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('https://unimedfortaleza.neovero.com/login');
  await page.waitForSelector('input[type="text"]');
  await page.fill('input[type="text"]', 'gestor.unimed');
  await page.fill('input[type="password"]', 'unimed');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(3000);

  await page.waitForSelector('[data-empresaid="4"]', { state: 'visible' });
  await page.click('[data-empresaid="4"]');

  await page.waitForTimeout(10000);

  await page.goto('https://unimedfortaleza.neovero.com/dashboards?id=11&fullscreen=S&mobile=N:237');
  await page.waitForTimeout(5000);

  while (true) {
    const elementos = await page.$$('.dx-flex-card-layout-row-element.dx-carditem-default-color.dx-flex-card-layout-row-element-DataItem1-0_0');

    if (elementos.length > 2) {
      const novoQtdRequisicao = await elementos[2].textContent();

      if (novoQtdRequisicao !== qtdRequisicao) {
        qtdRequisicao = novoQtdRequisicao;

        if (novoQtdRequisicao !== null && (await elementos[2].isVisible())) {
          if (ultimo_valor_reproduzido === null || parseInt(novoQtdRequisicao) > parseInt(ultimo_valor_reproduzido)) {
            reproduzir_audio = true;
            if (reproduzir_audio) {
              playAudio();
            }
          }

          console.log(qtdRequisicao);
        }
      }
    }

    await page.waitForTimeout(3000);

    const divMenu = await page.$('.edge-menu');
    if (divMenu) {
      await divMenu.hover();
    } else {
      console.log("A div 'edge-menu' não foi encontrada.");
    }

    await page.waitForTimeout(3000);

    const elementoAtualizar = await page.$('//*[@id="atualizar"]');
    if (elementoAtualizar) {
      await elementoAtualizar.scrollIntoViewIfNeeded();
      await elementoAtualizar.waitForElementState('visible');
      await elementoAtualizar.click();
      await page.waitForTimeout(20000);
    } else if (!elementos || !(await elementos[2].isVisible())) {
      const elementoAtualizar = await page.$('//*[@id="atualizar"]');
      if (elementoAtualizar) {
        await elementoAtualizar.scrollIntoViewIfNeeded();
        await elementoAtualizar.waitForElementState('visible');
        await elementoAtualizar.click();
        await page.waitForTimeout(20000);
      } else {
        console.log("O elemento 'atualizar' não foi encontrado.");
      }
    } else {
      console.log("O elemento 'atualizar' não foi encontrado.");
    }
  }
})();
