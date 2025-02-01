const fs = require('fs');
const ejs = require('ejs');

let levels = [{ name: '紅海', point: 0 }, { name: '銀海', point: 1600 }, { name: '金海', point: 6000 }, { name: '黑海', point: 10000 }];
let logs = JSON.parse(fs.readFileSync('./data/logs.json', 'utf8'));
logs.sort((a, b) => new Date(b.day) - new Date(a.day));

let totalPoint = 0;
logs = logs.reduceRight((acc, log) => {
    log.pay = log.point * 5;
    if(totalPoint >= 150) { // 消費滿 $750，多送 150 點
        log.point += 150;
    }
    totalPoint += log.point;
    acc.unshift({ ...log, totalPoint });
    return acc;
}, []);

const target = Math.max(...levels.map(level => level.point));
levels.forEach((level, index) => {
	level.addPoint = index === 0 ? 0 : level.point - levels[index - 1].point;
});
levels = levels.slice(1);

const template = fs.readFileSync('./index.ejs', 'utf8');

const output = ejs.render(template, { logs, levels, totalPoint, target });

fs.writeFileSync('./index.html', output);
console.log('generate success!');
