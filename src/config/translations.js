const translations = {
    errors: {
        INVALID_DATE: {
            en: 'Date must be in YYYY-MM-DD format',
            id: 'Format tanggal harus YYYY-MM-DD'
        },
        INVALID_YEAR: {
        en: 'Year must be between 2000 and 2100',
        id: 'Tahun harus antara 2000 dan 2100'
        },
        INVALID_MAX_LEAVE: {
        en: 'max_leave_days must be between 1 and 15',
        id: 'max_leave_days harus antara 1 dan 15'
        },
        INTERNAL_ERROR: {
            en: 'Internal Server Error',
            id: 'Kesalahan Server Internal'
        },
        NOT_FOUND: {
            en: 'Route not found',
            id: 'Rute tidak ditemukan'
        },
        INVALID_JSON: {
            en: 'Invalid JSON format',
            id: 'Format JSON tidak valid'
        },
        LOAD_ERROR: {
            en: 'Failed to load holiday data',
            id: 'Gagal memuat data liburan'
        },
        TOO_MANY_REQUESTS: {
            en: 'Too many requests, please try again later',
            id: 'Terlalu banyak permintaan, silakan coba lagi nanti'
        }
    },

    messages: {
      NO_HOLIDAYS_FOUND: {
        en: 'No upcoming holidays found',
        id: 'Tidak ada hari libur yang akan datang'
      },
      HOLIDAY_FOUND: {
        en: 'Holiday found',
        id: 'Hari Libur Ditemukan'
      },
      NO_HOLIDAY_FOR_DATE: {
        en: 'No holiday found for this date',
        id: 'Tidak ada hari libur pada tanggal ini'
      }
    },

    suggestions: {
      thursday_before_weekend: {
        en: "Holiday is on Thursday, take Friday off for a 4-day weekend",
        id: "Hari libur jatuh pada Kamis, ambil cuti Jumat untuk liburan 4 hari"
      },
      friday_before_weekend: {
        en: "Holiday is on Friday, take Monday off for a 4-day weekend",
        id: "Hari libur jatuh pada Jumat, ambil cuti Senin untuk liburan 4 hari"
      },
      tuesday_after_weekend: {
        en: "Holiday is on Tuesday, take Monday off for a 3-day weekend",
        id: "Hari libur jatuh pada Selasa, ambil cuti Senin untuk liburan 3 hari"
      },
      wednesday_after_weekend: {
        en: "Holiday is on Wednesday, take Monday and Tuesday off for a 5-day weekend",
        id: "Hari libur jatuh pada Rabu, ambil cuti Senin dan Selasa untuk liburan 5 hari"
      },
      bridge_between_holidays: {
        en: "Take {days} day(s) off to bridge between {holiday1} and {holiday2} for a {total}-day break",
        id: "Ambil cuti {days} hari di antara {holiday1} dan {holiday2} untuk liburan {total} hari"
      }
    }
};

module.exports = translations;
