/**
 * scripts/regression/vietnamese-output-completeness.test.ts
 * TDD Test: Kiểm tra tính hoàn thiện của đầu ra Tiếng Việt và form validation
 */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { generateChart } from '../../lib/ziwei/algorithm';
import { detectPatterns } from '../../lib/ziwei/patterns';
import {
  getPatternVi,
  getPatternDescVi,
  getPatternConditionVi,
  getPatternSourceVi,
} from '../../lib/ziwei/vietnamese';
import { generateInterpretStream } from '../../lib/ziwei/interpret-engine';
import { formToBirthInfo } from '../../lib/ziwei/share';
import { STAR_IN_FUQI_GU, SIHUA_IN_FUQI_GU } from '../../lib/ziwei/heming-knowledge';

console.log('--- 1. Kiểm tra kho kiến thức hôn nhân STAR_IN_FUQI_GU & SIHUA_IN_FUQI_GU ---');
for (const [star, info] of Object.entries(STAR_IN_FUQI_GU)) {
  assert.equal(/[\u4e00-\u9fa5]{6,}/.test(info.summary), false, `STAR_IN_FUQI_GU[${star}].summary vẫn còn tiếng Trung: ${info.summary}`);
  assert.equal(/[\u4e00-\u9fa5]{6,}/.test(info.spouse_traits), false, `STAR_IN_FUQI_GU[${star}].spouse_traits vẫn còn tiếng Trung: ${info.spouse_traits}`);
  assert.equal(/[\u4e00-\u9fa5]{6,}/.test(info.good), false, `STAR_IN_FUQI_GU[${star}].good vẫn còn tiếng Trung: ${info.good}`);
  assert.equal(/[\u4e00-\u9fa5]{6,}/.test(info.bad), false, `STAR_IN_FUQI_GU[${star}].bad vẫn còn tiếng Trung: ${info.bad}`);
  assert.equal(/[\u4e00-\u9fa5]{6,}/.test(info.timing), false, `STAR_IN_FUQI_GU[${star}].timing vẫn còn tiếng Trung: ${info.timing}`);
  if (info.ni_quote) {
    assert.equal(/[\u4e00-\u9fa5]{10,}/.test(info.ni_quote), false, `STAR_IN_FUQI_GU[${star}].ni_quote vẫn còn tiếng Trung dài: ${info.ni_quote}`);
  }
}

for (const [hua, text] of Object.entries(SIHUA_IN_FUQI_GU)) {
  assert.equal(/[\u4e00-\u9fa5]{6,}/.test(text), false, `SIHUA_IN_FUQI_GU[${hua}] vẫn còn tiếng Trung: ${text}`);
}

console.log('--- 2. Kiểm tra Luận Giải & Cách Cục trên 15 lá số ngẫu nhiên ---');
const sampleDates = [
  { year: 1985, month: 2, day: 14, hour: 3, gender: 'male' as const },
  { year: 1988, month: 10, day: 8, hour: 7, gender: 'female' as const },
  { year: 1990, month: 5, day: 15, hour: 6, gender: 'male' as const },
  { year: 1993, month: 11, day: 22, hour: 9, gender: 'female' as const },
  { year: 1995, month: 8, day: 20, hour: 7, gender: 'male' as const },
  { year: 1998, month: 3, day: 12, hour: 9, gender: 'female' as const },
  { year: 2000, month: 1, day: 1, hour: 11, gender: 'male' as const },
  { year: 2001, month: 6, day: 30, hour: 0, gender: 'female' as const },
  { year: 2003, month: 9, day: 15, hour: 1, gender: 'male' as const },
  { year: 2005, month: 12, day: 5, hour: 8, gender: 'female' as const },
  { year: 2010, month: 4, day: 28, hour: 4, gender: 'male' as const },
  { year: 2015, month: 7, day: 19, hour: 10, gender: 'female' as const },
  { year: 1975, month: 8, day: 10, hour: 6, gender: 'male' as const },
  { year: 1980, month: 1, day: 25, hour: 4, gender: 'female' as const },
  { year: 2024, month: 2, day: 10, hour: 5, gender: 'male' as const },
];

const topics = ['overview', 'personality', 'love', 'career', 'wealth', 'health'] as const;

for (const d of sampleDates) {
  const chart = generateChart(d);
  for (const topic of topics) {
    const result = generateInterpretStream({ chart, topic });
    assert.equal(result.includes('男命助妻'), false, `Topic ${topic} vẫn còn tiếng Trung: 男命助妻`);
    assert.equal(result.includes('配偶开朗'), false, `Topic ${topic} vẫn còn tiếng Trung: 配偶开朗`);
    assert.equal(result.includes('上不见父'), false, `Topic ${topic} vẫn còn tiếng Trung: 上不见父`);
    assert.equal(result.includes('感情走势'), false, `Topic ${topic} vẫn còn tiếng Trung: 感情走势`);
    assert.equal(/[\u4e00-\u9fa5]{10,}/.test(result), false, `Topic ${topic} có đoạn tiếng Trung dài: ${result.match(/[\u4e00-\u9fa5]{10,}/)?.[0]}`);
  }

  const patterns = detectPatterns(chart);
  for (const p of patterns) {
    const title = getPatternVi(p.name);
    assert.ok(title.includes('Cách ') || title.includes('('), `Cách cục ${p.name} chưa có định dạng Tiếng Việt (Tiếng Trung): ${title}`);
    
    const desc = getPatternDescVi(p.name, p.description);
    assert.equal(/[\u4e00-\u9fa5]{10,}/.test(desc), false, `Mô tả cách cục ${p.name} vẫn còn tiếng Trung dài chưa dịch: ${desc}`);

    if (p.conditions) {
      for (const req of p.conditions.required) {
        const condVi = getPatternConditionVi(req);
        assert.equal(/[\u4e00-\u9fa5]{8,}/.test(condVi), false, `Điều kiện required [${req}] dịch chưa hết: ${condVi}`);
      }
      if (p.conditions.bonus) {
        for (const bon of p.conditions.bonus) {
          const condVi = getPatternConditionVi(bon);
          assert.equal(/[\u4e00-\u9fa5]{8,}/.test(condVi), false, `Điều kiện bonus [${bon}] dịch chưa hết: ${condVi}`);
        }
      }
      if (p.conditions.breaking) {
        for (const brk of p.conditions.breaking) {
          const condVi = getPatternConditionVi(brk);
          assert.equal(/[\u4e00-\u9fa5]{8,}/.test(condVi), false, `Điều kiện breaking [${brk}] dịch chưa hết: ${condVi}`);
        }
      }
    }

    if (p.source) {
      const srcVi = getPatternSourceVi(p.source);
      assert.equal(srcVi.includes('【'), false, `Source vẫn còn ngoặc tiếng Trung: ${srcVi}`);
      assert.equal(srcVi.includes('《紫微斗数全书·'), false, `Source vẫn còn chữ Hán chưa thay thế: ${srcVi}`);
    }
  }
}

console.log('--- 3. Kiểm tra Hero Card badge & Ghi công nguồn mã nguồn mở ---');
const heroSrc = readFileSync(new URL('../../components/home/HeroSection.tsx', import.meta.url), 'utf8');
assert.ok(/luận giải bằng AI|Luận giải bằng AI/i.test(heroSrc), 'HeroSection ô nhỏ phải chứa cụm từ "Luận giải bằng AI"');

console.log('--- 4. Kiểm tra Form Validation Cú Pháp Hợp Lệ ---');
const validForm = {
  name: 'Trần Minh Huy',
  year: '1995',
  month: '8',
  day: '20',
  clockHour: '14',
  clockMinute: '30',
  unknownTime: false,
  province: 'Hà Nội',
  city: 'Hà Nội',
  longitude: 105.85,
  gender: 'male' as const,
};
const info = formToBirthInfo(validForm);
assert.equal(info.year, 1995);
assert.equal(info.month, 8);
assert.equal(info.day, 20);
assert.equal(info.gender, 'male');
assert.equal(info.hour, 7); // Mùi

console.log('✅ ALL VIETNAMESE OUTPUT & REGRESSION TESTS PASSED!');
