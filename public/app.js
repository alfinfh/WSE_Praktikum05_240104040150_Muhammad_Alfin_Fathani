const $ = id => document.getElementById(id);
let books = [];
let currentQuery = '';
const notice = message => { $('notice').textContent = message; $('notice').hidden = !message; };
async function request(url, options = {}) {
  const res = await fetch(url, options);
  const body = res.status === 204 ? null : await res.json();
  if (!res.ok) throw new Error(body?.error?.message || `HTTP ${res.status}`);
  return body;
}
function el(tag, klass, txt) { const node = document.createElement(tag); if (klass) node.className = klass; if (txt !== undefined) node.textContent = txt; return node; }
function render() {
  const filtered = books.filter(b => $('filter').value === 'all' || ($('filter').value === 'available' ? b.tersedia : !b.tersedia));
  $('stat-total').textContent = books.length;
  $('stat-available').textContent = books.filter(b => b.tersedia).length;
  $('stat-unavailable').textContent = books.filter(b => !b.tersedia).length;
  $('catalog-count').textContent = filtered.length + ' buku';
  const grid = $('book-grid'); grid.replaceChildren();
  if (!filtered.length) { grid.append(el('div','empty','Tidak ada buku yang sesuai pencarian.')); return; }
  for (const book of filtered) {
    const card = el('article','book-card'), cover = el('div','cover'), bookGraphic = el('div','cover-book v'+((book.id % 3)+1)); cover.append(bookGraphic);
    const meta = el('div','card-meta'), code = el('span','card-number','#'+String(book.id).padStart(3,'0')), status = el('span','status '+(book.tersedia?'yes':'no'),book.tersedia?'● Tersedia':'● Tidak tersedia');
    meta.append(code,status);
    const title = el('h3','',book.judul), actions = el('div','card-actions');
    const edit = el('button','','✎ Edit buku'), del = el('button','danger','⌫'); del.title = 'Hapus buku';
    edit.addEventListener('click',()=>openEditor(book));
    del.addEventListener('click',async()=>{
      if (!confirm('Hapus buku "'+book.judul+'"?')) return;
      try { await request('/api/buku/'+book.id,{method:'DELETE'}); notice('Buku berhasil dihapus (HTTP 204).'); await load(); }
      catch(e){notice('Gagal menghapus: '+e.message);}
    });
    actions.append(edit,del);card.append(cover,meta,title,actions);grid.append(card);
  }
}
async function load() {
  try {const q = currentQuery ? '?q='+encodeURIComponent(currentQuery) : ''; const response = await request('/api/buku'+q); books = response.data; render();}
  catch(e){notice('Gagal membaca API: '+e.message);}
}
function openEditor(book) { $('book-form').reset(); $('book-id').value = book ? book.id : ''; $('modal-title').textContent = book ? 'Edit Buku' : 'Tambah Buku'; $('book-title').value = book ? book.judul : ''; $('book-status').value = book ? String(book.tersedia) : 'true'; $('editor').showModal(); $('book-title').focus(); }
$('hero-add').onclick = $('add-button').onclick = () => openEditor();
$('close-dialog').onclick = $('cancel').onclick = () => $('editor').close();
$('refresh').onclick=()=>{notice('');load();};
let typing; $('search').oninput = e => { clearTimeout(typing); typing=setTimeout(()=>{currentQuery=e.target.value.trim();load();},250); };
$('filter').onchange=render;
$('book-form').onsubmit=async e=>{
  e.preventDefault(); const id=$('book-id').value;
  const data={judul:$('book-title').value,tersedia:$('book-status').value==='true'};
  try { await request(id?'/api/buku/'+id:'/api/buku',{method:id?'PUT':'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)}); $('editor').close(); notice(id?'Buku berhasil diperbarui (HTTP 200).':'Buku berhasil ditambahkan (HTTP 201).'); await load(); }
  catch(err){notice('Gagal menyimpan: '+err.message);$('editor').close();}
};
load();
