export function initExploreFilters() {
  const filterChips = document.querySelectorAll('#explore-filter-chips .chip-simpark');
  const simparkMapEl = document.querySelector('simpark-map');
  const searchInputEl = document.querySelector('#explore-search-input input');
  const sortComponent = document.querySelector('#explore-sort-input');
  const zoneCards = document.querySelectorAll('simpark-zone-card');
  const countEl = document.getElementById('explore-zone-count');

  if (!filterChips.length && !zoneCards.length) return;

  let currentFilter = 'all';
  let currentKeyword = '';
  let currentSort = 'Waktu tercepat';

  function applyFilterAndSearch() {
    let visibleCount = 0;
    const cardsArray = Array.from(zoneCards);

    // Sorting kartu berdasarkan pilihan dropdown
    cardsArray.sort(function (a, b) {
      if (currentSort === 'Waktu tercepat') {
        const timeA = parseInt(a.getAttribute('estimate') || '0', 10);
        const timeB = parseInt(b.getAttribute('estimate') || '0', 10);
        return timeA - timeB;
      } else if (currentSort === 'Slot terbanyak') {
        const slotsA = parseInt((a.getAttribute('slots') || '0').split('/')[0], 10);
        const slotsB = parseInt((b.getAttribute('slots') || '0').split('/')[0], 10);
        return slotsB - slotsA;
      } else if (currentSort === 'Jarak terdekat') {
        const keyA = a.getAttribute('zone-key') || '';
        const keyB = b.getAttribute('zone-key') || '';
        return keyA.localeCompare(keyB);
      }
      return 0;
    });

    const parentList = document.getElementById('explore-zone-list');
    cardsArray.forEach(function (card) {
      const tone = card.getAttribute('status-tone') || '';
      const name = (card.getAttribute('name') || '').toLowerCase();
      const zoneKey = (card.getAttribute('zone-key') || '').toLowerCase();

      const matchesTone = currentFilter === 'all' || tone === currentFilter;
      const matchesSearch = !currentKeyword || name.includes(currentKeyword) || zoneKey.includes(currentKeyword);

      if (matchesTone && matchesSearch) {
        card.style.display = 'block';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }

      if (parentList) {
        parentList.appendChild(card);
      }
    });

    if (countEl) {
      countEl.textContent = `${visibleCount} zona ditemukan · urut ${currentSort.toLowerCase()}`;
    }
  }

  if (filterChips.length) {
    filterChips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        filterChips.forEach(function (c) {
          c.classList.remove('active');
        });
        chip.classList.add('active');
        currentFilter = chip.getAttribute('data-filter') || 'all';
        applyFilterAndSearch();
      });
    });
  }

  if (searchInputEl) {
    searchInputEl.addEventListener('input', function (e) {
      currentKeyword = e.target.value.trim().toLowerCase();
      applyFilterAndSearch();
    });
  }

  if (sortComponent) {
    sortComponent.addEventListener('change', function (e) {
      if (e.detail && e.detail.value) {
        currentSort = e.detail.value;
        applyFilterAndSearch();
      }
    });
  }

  // Interaktivitas kartu zona di explore.html untuk preview posisi peta
  if (zoneCards.length && simparkMapEl) {
    zoneCards.forEach(function (cardWrapper) {
      const anchor = cardWrapper.querySelector('a.explore-zone-card');
      const zoneKey = cardWrapper.getAttribute('zone-key');

      if (anchor) {
        anchor.addEventListener('mouseenter', function () {
          if (simparkMapEl.showZone) {
            simparkMapEl.showZone(zoneKey);
          }
        });
      }
    });
  }
}
