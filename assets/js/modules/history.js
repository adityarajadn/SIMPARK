export function initHistoryDataTable() {
  const table = document.getElementById('simpark-history-datatable');
  if (!table || typeof $ === 'undefined' || !$.fn.DataTable) return;

  $('#simpark-history-datatable').DataTable({
    pageLength: 5,
    lengthMenu: [5, 10, 25],
    language: {
      search: "_INPUT_",
      searchPlaceholder: "Cari riwayat atau zona...",
      lengthMenu: "Tampilkan _MENU_ baris",
      info: "Menampilkan _START_ sampai _END_ dari _TOTAL_ riwayat",
      paginate: {
        previous: '<i class="bi bi-chevron-left"></i>',
        next: '<i class="bi bi-chevron-right"></i>'
      },
      zeroRecords: "Tidak ada data riwayat yang cocok"
    }
  });
}
