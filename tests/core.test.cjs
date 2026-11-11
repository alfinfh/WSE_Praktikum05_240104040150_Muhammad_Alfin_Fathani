const test = require('node:test');
const assert = require('node:assert/strict');
const { parseId, validateBuku } = require('../src/errors.cjs');
const service = require('../src/buku.service.cjs');

test('ID valid dan invalid sesuai kontrak', () => {
  assert.equal(parseId('1'), 1);
  for (const bad of ['0','01','1abc','abc','1.5','9007199254740992']) {
    assert.throws(() => parseId(bad), {status:400,code:'INVALID_ID'});
  }
});
test('validasi buku menerima boolean dan memangkas spasi', () => {
  assert.deepEqual(validateBuku({judul:'  Buku API  ', tersedia:true}), {judul:'Buku API',tersedia:true});
  for (const bad of [{judul:' ',tersedia:true},{judul:'Buku',tersedia:'true'},{judul:'Buku',tersedia:true,id:7},{judul:'Buku'}]) {
    assert.throws(() => validateBuku(bad), {status:400,code:'INVALID_BOOK'});
  }
});
test('service daftar, detail, pencarian dan kesalahan', () => {
  assert.equal(service.list().length,2);
  assert.equal(service.detail(2).tersedia,false);
  assert.equal(service.list('KOTLIN')[0].id,1);
  assert.deepEqual(service.list('tidakada'),[]);
  assert.throws(() => service.list(['a','b']), {status:400,code:'INVALID_QUERY'});
  assert.throws(() => service.detail(999), {status:404,code:'BOOK_NOT_FOUND'});
});
test('service CRUD: tambah, ubah, hapus, dan periksa setelah hapus', () => {
  const created=service.create({judul:'Buku Uji',tersedia:true});
  assert.ok(Number.isInteger(created.id));
  assert.equal(service.detail(created.id).judul,'Buku Uji');
  const replaced=service.replace(created.id,{judul:'Buku Diperbarui',tersedia:false});
  assert.equal(replaced.id,created.id);
  assert.equal(service.detail(created.id).tersedia,false);
  service.remove(created.id);
  assert.throws(() => service.detail(created.id),{status:404,code:'BOOK_NOT_FOUND'});
});
