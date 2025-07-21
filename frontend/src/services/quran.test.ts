import { describe, test, expect, beforeEach, vi } from 'vitest';
import QuranService from './quran';

// Mock fetch for testing
global.fetch = vi.fn();

describe('QuranService with Local JSON', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('getSurahs should return list of surahs from local JSON', async () => {
    const mockSurahsData = [
      {
        name: 'Al-Fatiha',
        name_translations: {
          ar: 'الفاتحة',
          en: 'The Opening',
          id: 'Pembukaan'
        },
        number_of_ayah: 7,
        number_of_surah: 1,
        place: 'Mecca',
        type: 'Makkiyah'
      }
    ];

    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockSurahsData
    });

    const surahs = await QuranService.getSurahs();
    
    expect(fetch).toHaveBeenCalledWith('/data/quran/quran.json');
    expect(surahs).toHaveLength(1);
    expect(surahs[0]).toEqual({
      number: 1,
      name: 'Al-Fatiha',
      english_name: 'The Opening',
      arabic_name: 'الفاتحة',
      verses_count: 7,
      revelation_place: 'makkah'
    });
  });

  test('getSurah should return surah with verses from local JSON', async () => {
    const mockSurahData = {
      name: 'Al-Fatiha',
      name_translations: {
        ar: 'الفاتحة',
        en: 'The Opening',
        id: 'Pembukaan'
      },
      number_of_ayah: 7,
      number_of_surah: 1,
      place: 'Mecca',
      type: 'Makkiyah',
      verses: [
        {
          number: 1,
          text: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ',
          translation_en: 'In the name of Allah, the Entirely Merciful, the Especially Merciful.',
          translation_id: 'Dengan menyebut nama Allah Yang Maha Pemurah lagi Maha Penyayang.'
        }
      ]
    };

    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockSurahData
    });

    const surah = await QuranService.getSurah(1);
    
    expect(fetch).toHaveBeenCalledWith('/data/quran/surah/1.json');
    expect(surah).not.toBeNull();
    expect(surah?.name).toBe('Al-Fatiha');
    expect(surah?.verses).toHaveLength(1);
    expect(surah?.verses[0].arabic).toBe('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ');
    expect(surah?.verses[0].translation).toBe('Dengan menyebut nama Allah Yang Maha Pemurah lagi Maha Penyayang.');
  });

  test('should fallback to cache when fetch fails', async () => {
    // First, let's make sure OfflineService returns null for cache
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);
    
    (fetch as any).mockRejectedValueOnce(new Error('Network error'));

    const surahs = await QuranService.getSurahs();
    
    // Should return empty array when both fetch and cache fail
    expect(surahs).toEqual([]);
  });
});