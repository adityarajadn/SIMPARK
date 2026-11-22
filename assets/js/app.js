import { initLiveDate, getQueryParam } from './modules/utils.js';
import { initExploreFilters } from './modules/explore.js';
import { initZoneDetail } from './modules/zone-detail.js';
import { initDynamicQRCode, initTicketCountdown } from './modules/ticket.js';
import { initActiveParkingTimer, initActiveParkingActions } from './modules/active-parking.js';
import { initHistoryDataTable } from './modules/history.js';

// Re-export helpers if needed by other components
export {
  getQueryParam,
  initLiveDate,
  initExploreFilters,
  initZoneDetail,
  initDynamicQRCode,
  initTicketCountdown,
  initActiveParkingTimer,
  initActiveParkingActions,
  initHistoryDataTable
};

document.addEventListener('DOMContentLoaded', function () {
  initLiveDate();
  initExploreFilters();
  initZoneDetail();
  initTicketCountdown();
  initDynamicQRCode();
  initActiveParkingTimer();
  initActiveParkingActions();
  initHistoryDataTable();
});
