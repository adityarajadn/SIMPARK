export function initActiveParkingTimer() {
  const durationTile = document.getElementById('active-parking-duration');
  if (!durationTile) return;

  // Mulai durasi dari 1 jam 12 menit 00 detik (4320 detik)
  let totalSeconds = (1 * 3600) + (12 * 60);

  setInterval(function () {
    totalSeconds++;
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    durationTile.setAttribute('value', `${hours} j ${minutes} m ${seconds} d`);
  }, 1000);
}

export function initActiveParkingActions() {
  const saveBtn = document.getElementById('btn-save-location');
  if (saveBtn) {
    saveBtn.addEventListener('click', function () {
      if (typeof Swal !== 'undefined') {
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Catatan lokasi berhasil disimpan',
          showConfirmButton: false,
          timer: 2500,
          timerProgressBar: true,
          background: '#ffffff',
          color: '#1A1C1E',
          iconColor: '#237A49'
        });
      }
    });
  }
}
