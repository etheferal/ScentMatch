// 1. Örnek Veri Tabanı (İstediğin gibi çoğaltabilirsin)
const scentsDB = [
  {
    id: 1,
    name: "Mega Aqua",
    season: "Yaz / İlkbahar",
    desc: "Okyanus esintisi ve tuzlu suyun ferahlatıcı narenciye ile birleşimi.",
    notes: ["Deniz Tuzu", "Bergamot", "Deniz Yosunu", "Sedir Ağacı", "Misk"]
  },
  {
    id: 2,
    name: "Armor Spice",
    season: "Kış / Sonbahar",
    desc: "Soğuk havalar için keskin baharatlar, sıcak kehribar ve odunsu derinlik.",
    notes: ["Karabiber", "Kehribar", "Deri", "Sedir Ağacı", "Vanilya"]
  },
  {
    id: 3,
    name: "Moxie Citrus",
    season: "Yaz / Günlük",
    desc: "Enerjik, parlak ve gün boyu tazelik hissi veren meyveli-ferah profil.",
    notes: ["Bergamot", "Kan Portakalı", "Yeşil Elma", "Lavanta", "Misk"]
  },
  {
    id: 4,
    name: "Velvet Woods",
    season: "Dört Mevsim",
    desc: "Modern, sofistike ve imza niteliğinde kremsi odunsu dokunuşlar.",
    notes: ["Sandal Ağacı", "Vetiver", "Kakule", "Kehribar", "Bergamot"]
  },
  {
    id: 5,
    name: "Noir Breeze",
    season: "Yaz Gece",
    desc: "Akşam esintisine yakışan aromatik otlar ve ferah deniz notaları.",
    notes: ["Deniz Tuzu", "Lavanta", "Karabiber", "Vetiver", "Misk"]
  },
  {
    id: 6,
    name: "Golden Ember",
    season: "Kış",
    desc: "Tatlı vanilya ve tütsülenmiş odunların sıcak, baş döndürücü uyumu.",
    notes: ["Vanilya", "Kehribar", "Sandal Ağacı", "Kakule", "Deri"]
  }
];

// Tüm benzersiz notaları veri tabanından otomatik çıkar
const allNotes = [...new Set(scentsDB.flatMap(item => item.notes))].sort();
let selectedNotes = new Set();

const notesContainer = document.getElementById('notes-container');
const resultsGrid = document.getElementById('results-grid');
const selectedCountEl = document.getElementById('selected-count');
const clearBtn = document.getElementById('clear-btn');

// 2. Nota Butonlarını Ekrana Çiz
function renderNotes() {
  notesContainer.innerHTML = '';
  allNotes.forEach(note => {
    const chip = document.createElement('button');
    chip.className = `note-chip ${selectedNotes.has(note) ? 'active' : ''}`;
    chip.textContent = note;
    chip.addEventListener('click', () => toggleNote(note));
    notesContainer.appendChild(chip);
  });
  selectedCountEl.textContent = `(${selectedNotes.size} seçildi)`;
}

// 3. Nota Seç / Kaldır
function toggleNote(note) {
  if (selectedNotes.has(note)) {
    selectedNotes.delete(note);
  } else {
    selectedNotes.add(note);
  }
  renderNotes();
  renderResults();
}

// 4. Eşleşme Algoritması ve Sonuçları Çizme
function renderResults() {
  resultsGrid.innerHTML = '';

  // Her ürün için eşleşme skoru hesapla
  const scoredScents = scentsDB.map(scent => {
    const matchedNotes = scent.notes.filter(n => selectedNotes.has(n));
    const matchPercentage = selectedNotes.size === 0
      ? 0
      : Math.round((matchedNotes.length / scent.notes.length) * 100);

    return { ...scent, matchedNotes, matchPercentage };
  });

  // Seçim varsa en yüksek eşleşmeye göre sırala
  if (selectedNotes.size > 0) {
    scoredScents.sort((a, b) => b.matchPercentage - a.matchPercentage);
  }

  scoredScents.forEach(scent => {
    // Seçim yapıldıysa ve hiç eşleşme yoksa kartı gizle (İsteğe bağlı)
    if (selectedNotes.size > 0 && scent.matchedNotes.length === 0) return;

    const card = document.createElement('div');
    card.className = `scent-card ${scent.matchPercentage >= 40 ? 'high-match' : ''}`;

    const notesHTML = scent.notes.map(n => {
      const isMatched = selectedNotes.has(n);
      return `<span class="mini-note ${isMatched ? 'matched' : ''}">${n}</span>`;
    }).join('');

    card.innerHTML = `
      <div class="card-top">
        <div class="scent-name">${scent.name}</div>
        <span class="scent-season">${scent.season}</span>
      </div>
      <p class="scent-desc">${scent.desc}</p>
      <div class="card-notes">${notesHTML}</div>
      <div class="match-bar-wrap">
        <div class="match-info">
          <span>Profil Uyumu</span>
          <span class="match-score">%${scent.matchPercentage} (${scent.matchedNotes.length}/${scent.notes.length} nota)</span>
        </div>
        <div class="progress-bg">
          <div class="progress-fill" style="width: ${scent.matchPercentage}%"></div>
        </div>
      </div>
    `;

    resultsGrid.appendChild(card);
  });
}

// 5. Temizle Butonu
clearBtn.addEventListener('click', () => {
  selectedNotes.clear();
  renderNotes();
  renderResults();
});

// Başlangıçta çalıştır
renderNotes();
renderResults();