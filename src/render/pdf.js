import { jsPDF } from 'jspdf';
import { svg2pdf } from 'svg2pdf.js';
import { drawPage, paginate, pageHeight, PAGE_WIDTH } from './score.js';

const PAGE_MARGIN = 20;
const TITLE_SPACE = 40;

// Writes the score as an A4 PDF, one score page per PDF page. Returns the jsPDF document.
export async function buildScorePdf(measures, title) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth() - 2 * PAGE_MARGIN;
  const scale = pageWidth / PAGE_WIDTH;
  const host = document.createElement('div');
  host.style.position = 'fixed';
  host.style.left = '-10000px';
  document.body.appendChild(host);

  try {
    const pages = paginate(measures);
    for (let i = 0; i < pages.length; i++) {
      if (i > 0) doc.addPage();
      const top = i === 0 && title ? PAGE_MARGIN + TITLE_SPACE : PAGE_MARGIN;
      if (i === 0 && title) {
        doc.setFontSize(16);
        doc.text(title, PAGE_MARGIN, PAGE_MARGIN + 16);
      }
      drawPage(host, pages[i]);
      await svg2pdf(host.querySelector('svg'), doc, {
        x: PAGE_MARGIN,
        y: top,
        width: pageWidth,
        height: pageHeight(pages[i].length) * scale,
      });
    }
  } finally {
    host.remove();
  }
  return doc;
}
