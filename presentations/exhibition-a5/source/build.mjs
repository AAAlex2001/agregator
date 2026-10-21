import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const runtime = 'C:/Users/alex/.cache/codex-runtimes/codex-primary-runtime/dependencies';
const skill = 'C:/Users/alex/.codex/plugins/cache/openai-primary-runtime/presentations/26.1017.22136/skills/presentations';
const { Presentation, PresentationFile } = await import(pathToFileURL(`${runtime}/node/node_modules/@oai/artifact-tool/dist/artifact_tool.mjs`));
const require = createRequire(`${runtime}/node/package.json`);
const sharp = require('sharp');
const { finalizePresentation } = await import(pathToFileURL(`${skill}/container_tools/artifact_tool_utils.mjs`));
const W = 148 / 25.4 * 96;
const H = 210 / 25.4 * 96;
const ink = '#182B3A';
const muted = '#536371';
const orange = '#CB6500';
const pages = [[], []];

function text(page, value, x, y, w, h, size = 14, bold = false, color = ink, align = 'left') {
  pages[page].push({kind:'text', value, x, y, w, h, size, bold, color, align});
}
function image(page, name, x, y, w, h) {
  pages[page].push({kind:'image', name, x, y, w, h});
}
for (let page = 0; page < 2; page++) {
  image(page, 'nedra.png', 34, 24, 80, 49);
  image(page, 'resurs.png', 306, 40, 218, 30.58);
}

text(0, 'ПАРТНЁРСКОЕ ПРЕДЛОЖЕНИЕ ДЛЯ ПРЕДПРИЯТИЙ', 35, 95, 490, 18, 10.8, true, muted);
text(0, 'Экспертиза\nи безопасность ОПО', 33, 121, 493, 94, 35, true);
image(0, 'opo-anime.png', 34, 231, 491.37, 204.7);
text(0, 'УСЛУГИ НПИ «НЕДРА» НА СПЕЦИАЛЬНЫХ УСЛОВИЯХ', 35, 457, 490, 19, 11, true, muted);
text(0, 'Экспертиза проектов технического\nперевооружения, консервации\nи ликвидации', 35, 489, 340, 64, 15);
text(0, '10 000 ₽', 383, 491, 142, 37, 27, true, orange, 'right');
text(0, 'Разработка обоснований\nбезопасности', 35, 566, 330, 43, 15);
text(0, '100 000 ₽', 370, 565, 155, 37, 27, true, orange, 'right');
text(0, 'Экспертиза обоснований\nбезопасности', 35, 630, 330, 43, 15);
text(0, '100 000 ₽', 370, 629, 155, 37, 27, true, orange, 'right');
text(0, 'Условие бартера', 35, 703, 490, 23, 16, true);
text(0, 'Ваше предприятие размещает закупки на Ресурс-Плюс.\nРазмещение для заказчика бесплатно.', 35, 731, 490, 39, 13.2);

text(1, 'Закупки на Ресурс-Плюс', 34, 98, 492, 44, 28, true);
text(1, 'В обмен на специальные условия НПИ «Недра»\nпредприятие размещает свои закупки на нашей площадке,\nв том числе дублирует их с других тендерных площадок.', 35, 148, 490, 63, 13.3);
image(1, 'design-anime.png', 34, 224, 491.37, 125);
text(1, 'Какие закупки можно разместить', 35, 369, 490, 28, 18, true);

const services = [
  ['01', 'Проектирование промышленных и гражданских объектов', 409],
  ['02', 'Экспертиза промышленной безопасности проектов,\nтехнических устройств, зданий и сооружений,\nдеклараций и обоснований безопасности', 439],
  ['03', 'Инженерные изыскания', 501],
  ['04', 'Строительный контроль', 528],
  ['05', 'Аудит', 555],
  ['06', 'Экологическое сопровождение предприятий', 582],
  ['07', 'НИР и лабораторные исследования', 609],
  ['08', 'Техническое освидетельствование и диагностирование', 636],
];
for (const [number, label, y] of services) {
  text(1, number, 35, y, 25, 20, 11.5, true, orange);
  text(1, label, 68, y - 1, 457, number === '02' ? 58 : 23, 12.6);
}
image(1, 'qr-nedra.png', 31, 680, 88, 88);
text(1, 'НПИ «Недра»', 129, 694, 135, 22, 14, true);
text(1, 'nedra-npi.ru', 129, 724, 140, 20, 12, false, muted);
image(1, 'qr-resurs.png', 286, 680, 88, 88);
text(1, 'Ресурс-Плюс', 385, 694, 140, 22, 14, true);
text(1, 'plus-resurs.com', 385, 724, 140, 20, 12, false, muted);

for (const name of ['nedra', 'resurs']) {
  await sharp(path.join(root, 'assets', `${name}.svg`), {density:600})
    .png().toFile(path.join(root, 'assets', `${name}.png`));
}
await fs.writeFile(path.join(root, 'source', 'layout.json'), JSON.stringify({width:W,height:H,font:'Segoe UI',pages}, null, 2));
const presentation = Presentation.create({slideSize:{width:W,height:H}});
for (const [pageIndex, elements] of pages.entries()) {
  const slide = presentation.slides.add();
  slide.background.fill = '#FFFFFF';
  for (const item of elements) {
    const position = {left:item.x, top:item.y, width:item.w, height:item.h};
    if (item.kind === 'image') {
      slide.images.add({blob:await fs.readFile(path.join(root,'assets',item.name)),contentType:'image/png',position,fit:item.name.includes('anime')?'cover':'contain',alt:item.name});
      continue;
    }
    const shape = slide.shapes.add({geometry:'textbox',name:item.value.slice(0,50),position,fill:'none',line:{fill:'none',width:0}});
    shape.text = item.value;
    shape.text.style = {fontSize:item.size,typeface:'Segoe UI',bold:item.bold,color:item.color,alignment:item.align,verticalAlignment:'top',insets:0,autoFit:'none'};
  }
  slide.speakerNotes.text = 'Источник содержания: предоставленный заказчиком скриншот таблицы для предприятий. Суммы сохранены из исходника; перед печатью подтвердить, что это стоимость услуг, а не величина скидки. Иллюстрации созданы с помощью image_gen и изображают условные объекты, не реальные проекты НПИ «Недра». Оригинальные логотипы взяты из репозиториев компаний. QR: https://nedra-npi.ru и https://plus-resurs.com. Формат А5 148 × 210 мм, сторона ' + (pageIndex + 1) + ' из 2.';
}
const candidatePath = path.join(root,'.build','opo-draft.pptx');
await (await PresentationFile.exportPptx(presentation)).save(candidatePath);
const result = await finalizePresentation({
  workspaceDir:root,
  candidatePath,
  finalPath:path.join(root,'output','OPO-A5-review.pptx'),
  pythonExecutable:`${runtime}/python/python.exe`,
  integrityValidatorPath:`${skill}/container_tools/inspect_presentation_package_integrity.py`,
  layoutValidatorPath:`${skill}/container_tools/inspect_presentation_layout_geometry.py`,
  layoutArgs:['--expected-slide-size-emu','5328000,7560000','--validate-heading-fit'],
  explicitTotalSlideCount:2,
  requiredNativeTableOwnerSlides:[],
  requiredNativeChartOwnerSlides:[],
  fontPolicy:{basis:'design',families:['Segoe UI']},
  verifyArtifactToolImport:true,
  receiptPath:path.join(root,'.build','validation.json'),
});
console.log(result);
for (const [index, slide] of presentation.slides.items.entries()) {
  try {
    const png = await presentation.export({slide,format:'png',scale:2});
    await fs.writeFile(path.join(root,'.build',`pptx-page-${index+1}.png`),new Uint8Array(await png.arrayBuffer()));
  } catch (error) {
    console.error('Ошибка визуализации PowerPoint:',error.message);
  }
}
