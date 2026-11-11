const fs = require('node:fs');
const path = require('node:path');
const ref = name => ({ $ref: `#/components/schemas/${name}` });
const fields = { judul: { type: 'string', minLength: 1, description: 'Setelah trim, panjang 1-120 unit UTF-16.' }, tersedia: { type: 'boolean' } };
const book = { id: 1, judul: 'Dasar Pemrograman Kotlin', tersedia: true };
const input = { judul: 'Belajar API dengan Express', tersedia: true };
const errors = {
  400: ['INVALID_BOOK', 'Input tidak sesuai kontrak.'],
  404: ['BOOK_NOT_FOUND', 'Buku tidak ditemukan.'],
  413: ['PAYLOAD_TOO_LARGE', 'Body melebihi batas 10kb.'],
  415: ['UNSUPPORTED_MEDIA_TYPE', 'Gunakan Content-Type application/json.'],
  500: ['INTERNAL_ERROR', 'Terjadi kesalahan pada server.']
};
const response = (description, schema, example) => ({ description, content: { 'application/json': { schema: ref(schema), ...(example ? { example } : {}) } } });
const responses = (ok, codes) => ({ ...ok, ...Object.fromEntries(codes.map(code => [code, response(errors[code][1], 'ErrorResponse', { success: false, error: { code: errors[code][0], message: errors[code][1] } })])) });
const body = { required: true, content: { 'application/json': { schema: ref('BukuInput'), example: input } } };
const id = { name: 'id', in: 'path', required: true, description: 'Digit positif tanpa nol di depan, aman sebagai integer JavaScript.', schema: { type: 'string', pattern: '^[1-9][0-9]*$' }, example: '1' };
const created = response('Buku dibuat.', 'BukuResponse', { success: true, data: { id: 3, ...input } });
created.headers = { Location: { description: 'URI buku baru.', schema: { type: 'string' }, example: '/api/buku/3' } };
const spec = {
  openapi: '3.1.0',
  info: { title: 'API Katalog Perpustakaan', version: '1.0.0', description: 'Praktikum 05 WSE. Data memori hilang setelah restart. Tidak ada autentikasi; hanya untuk localhost. POST dan PUT wajib judul (1-120 karakter setelah trim) dan tersedia (boolean); field tambahan dilarang. Contoh error menggambarkan skenario representatif, kode aktual bisa bervariasi menurut penyebab.' },
  servers: [{ url: 'http://127.0.0.1:3200' }], tags: [{ name: 'Buku', description: 'Operasi katalog kampus' }],
  paths: {
    '/api/buku': {
      get: { tags: ['Buku'], summary: 'Membaca daftar buku atau mencari judul', parameters: [{ name: 'q', in: 'query', description: 'Satu teks, maksimal 80 unit UTF-16; kosong menampilkan semua.', schema: { type: 'string' }, example: 'kotlin' }], responses: responses({ 200: response('Array buku, boleh kosong.', 'DaftarResponse', { success: true, data: [book] }) }, [400,500]) },
      post: { tags: ['Buku'], summary: 'Menambah buku', requestBody: body, responses: responses({ 201: created }, [400,413,415,500]) }
    },
    '/api/buku/{id}': {
      parameters: [id],
      get: { tags: ['Buku'], summary: 'Membaca detail buku', responses: responses({ 200: response('Detail buku.', 'BukuResponse', { success: true, data: book }) }, [400,404,500]) },
      put: { tags: ['Buku'], summary: 'Mengganti seluruh field buku', description: 'Target wajib ada; judul dan tersedia wajib diisi.', requestBody: body, responses: responses({ 200: response('Buku diperbarui.', 'BukuResponse') }, [400,404,413,415,500]) },
      delete: { tags: ['Buku'], summary: 'Menghapus satu buku', responses: responses({ 204: { description: 'Berhasil; body kosong.' } }, [400,404,500]) }
    }
  },
  components: { schemas: {
    BukuInput: { type: 'object', additionalProperties: false, required: ['judul','tersedia'], properties: fields },
    Buku: { type: 'object', additionalProperties: false, required: ['id','judul','tersedia'], properties: { id: { type: 'integer', minimum: 1, maximum: 9007199254740991 }, ...fields } },
    BukuResponse: { type: 'object', required: ['success','data'], properties: { success: { const: true }, data: ref('Buku') } },
    DaftarResponse: { type: 'object', required: ['success','data'], properties: { success: { const: true }, data: { type: 'array', items: ref('Buku') } } },
    ErrorResponse: { type: 'object', required: ['success','error'], properties: { success: { const: false }, error: { type: 'object', required: ['code','message'], properties: { code: { type: 'string' }, message: { type: 'string' } } } } }
  } }
};
const target = path.join(__dirname, '..', 'docs', 'openapi.json');
fs.mkdirSync(path.dirname(target), { recursive: true });
fs.writeFileSync(target, JSON.stringify(spec, null, 2) + '\n');
console.log('Dokumen dibuat: docs/openapi.json');
