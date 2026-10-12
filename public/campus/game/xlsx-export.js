/* A small dependency-free XLSX writer: UTF-8 ZIP/store + inline-string cells. */
(() => {
  'use strict';
  const encoder = new TextEncoder();
  const crcTable = Array.from({ length: 256 }, (_, value) => {
    for (let bit = 0; bit < 8; bit++) value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
    return value >>> 0;
  });
  const xml = value => String(value ?? '').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[char]);
  function crc32(bytes) {
    let crc = 0xffffffff;
    for (const value of bytes) crc = crcTable[(crc ^ value) & 255] ^ (crc >>> 8);
    return (crc ^ 0xffffffff) >>> 0;
  }
  function concat(parts) {
    const bytes = new Uint8Array(parts.reduce((size, part) => size + part.length, 0));
    let offset = 0;
    for (const part of parts) { bytes.set(part, offset); offset += part.length; }
    return bytes;
  }
  function zip(files) {
    const bodies = [], directory = [];
    let offset = 0;
    for (const [name, text] of files) {
      const filename = encoder.encode(name), content = encoder.encode(text), crc = crc32(content);
      const local = new Uint8Array(30), lv = new DataView(local.buffer);
      lv.setUint32(0, 0x04034b50, true); lv.setUint16(4, 20, true); lv.setUint16(6, 0x0800, true);
      lv.setUint16(12, 0x21, true); lv.setUint32(14, crc, true);
      lv.setUint32(18, content.length, true); lv.setUint32(22, content.length, true); lv.setUint16(26, filename.length, true);
      bodies.push(local, filename, content);
      const central = new Uint8Array(46), cv = new DataView(central.buffer);
      cv.setUint32(0, 0x02014b50, true); cv.setUint16(4, 20, true); cv.setUint16(6, 20, true); cv.setUint16(8, 0x0800, true);
      cv.setUint16(14, 0x21, true); cv.setUint32(16, crc, true);
      cv.setUint32(20, content.length, true); cv.setUint32(24, content.length, true); cv.setUint16(28, filename.length, true); cv.setUint32(42, offset, true);
      directory.push(central, filename);
      offset += local.length + filename.length + content.length;
    }
    const central = concat(directory), end = new Uint8Array(22), ev = new DataView(end.buffer);
    ev.setUint32(0, 0x06054b50, true); ev.setUint16(8, files.length, true); ev.setUint16(10, files.length, true);
    ev.setUint32(12, central.length, true); ev.setUint32(16, offset, true);
    return concat([...bodies, central, end]);
  }
  function column(index) {
    let name = '';
    for (let value = index + 1; value; value = Math.floor((value - 1) / 26)) name = String.fromCharCode(65 + (value - 1) % 26) + name;
    return name;
  }
  function worksheet(rows) {
    const body = rows.map((row, index) => `<row r="${index + 1}">${row.map((value, col) => {
      const ref = column(col) + (index + 1), style = index === 0 ? ' s="1"' : '';
      if (value === null || value === undefined || value === '') return `<c r="${ref}"${style}/>`;
      if (typeof value === 'number' && Number.isFinite(value)) return `<c r="${ref}"${style}><v>${value}</v></c>`;
      return `<c r="${ref}" t="inlineStr"${style}><is><t xml:space="preserve">${xml(value)}</t></is></c>`;
    }).join('')}</row>`).join('');
    const lastColumn = column(Math.max(0, ...rows.map(row => row.length - 1)));
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews><cols><col min="1" max="2" width="14" customWidth="1"/><col min="3" max="3" width="24" customWidth="1"/><col min="4" max="6" width="18" customWidth="1"/></cols><sheetData>${body}</sheetData><autoFilter ref="A1:${lastColumn}${Math.max(1, rows.length)}"/></worksheet>`;
  }
  function buildWorkbook(sheets) {
    if (!Array.isArray(sheets) || !sheets.length || sheets.length > 100) throw new TypeError('Provide 1–100 sheets.');
    const used = new Set();
    const entries = sheets.map((sheet, index) => {
      let base = String(sheet.name || 'Sheet ' + (index + 1)).replace(/[\\/?*\[\]:]/g, ' ').replace(/^'+|'+$/g, '').slice(0, 31) || 'Sheet';
      let name = base, suffix = 1;
      while (used.has(name.toLowerCase())) { const tail = ' (' + suffix++ + ')'; name = base.slice(0, 31 - tail.length) + tail; }
      used.add(name.toLowerCase());
      if (!Array.isArray(sheet.rows) || !sheet.rows.every(Array.isArray)) throw new TypeError('Sheet rows must be arrays.');
      return { name, rows: sheet.rows };
    });
    const main = 'http://schemas.openxmlformats.org/spreadsheetml/2006/main';
    const rel = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships';
    const packageRel = 'http://schemas.openxmlformats.org/package/2006/relationships';
    const files = [
      ['[Content_Types].xml', `<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/><Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/><Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>${entries.map((_, i) => `<Override PartName="/xl/worksheets/sheet${i + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`).join('')}</Types>`],
      ['_rels/.rels', `<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="${packageRel}"><Relationship Id="rId1" Type="${rel}/officeDocument" Target="xl/workbook.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/><Relationship Id="rId3" Type="${rel}/extended-properties" Target="docProps/app.xml"/></Relationships>`],
      ['docProps/core.xml', '<?xml version="1.0" encoding="UTF-8"?><cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:title>Campus learning results</dc:title><dc:creator>我的AI校園生活</dc:creator></cp:coreProperties>'],
      ['docProps/app.xml', '<?xml version="1.0" encoding="UTF-8"?><Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties"><Application>Campus XLSX export</Application></Properties>'],
      ['xl/workbook.xml', `<?xml version="1.0" encoding="UTF-8"?><workbook xmlns="${main}" xmlns:r="${rel}"><sheets>${entries.map((sheet, i) => `<sheet name="${xml(sheet.name)}" sheetId="${i + 1}" r:id="rId${i + 1}"/>`).join('')}</sheets></workbook>`],
      ['xl/_rels/workbook.xml.rels', `<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="${packageRel}">${entries.map((_, i) => `<Relationship Id="rId${i + 1}" Type="${rel}/worksheet" Target="worksheets/sheet${i + 1}.xml"/>`).join('')}<Relationship Id="rId${entries.length + 1}" Type="${rel}/styles" Target="styles.xml"/></Relationships>`],
      ['xl/styles.xml', `<?xml version="1.0" encoding="UTF-8"?><styleSheet xmlns="${main}"><fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><color rgb="FFFFFFFF"/><sz val="11"/><name val="Calibri"/></font></fonts><fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FF276F70"/><bgColor indexed="64"/></patternFill></fill></fills><borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="2"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1"/></cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>`],
      ...entries.map((sheet, i) => [`xl/worksheets/sheet${i + 1}.xml`, worksheet(sheet.rows)]),
    ];
    return zip(files);
  }
  function download(sheets, filename = 'campus-results.xlsx') {
    const blob = new Blob([buildWorkbook(sheets)], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob), link = document.createElement('a');
    link.href = url; link.download = filename.replace(/[^\p{L}\p{N}_. -]/gu, '_');
    document.body.append(link); link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  window.CampusXlsx = { buildWorkbook, download };
})();
