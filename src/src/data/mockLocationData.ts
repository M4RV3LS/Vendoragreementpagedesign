// src/data/mockLocationData.ts

export type District = string;
export type City = {
  name: string;
  districts: District[];
};
export type Province = {
  name: string;
  cities: City[];
};

export const INDONESIA_LOCATIONS: Province[] = [
  {
    name: 'DKI Jakarta',
    cities: [
      {
        name: 'Jakarta Selatan',
        districts: ['Kebayoran Baru', 'Kebayoran Lama', 'Tebet', 'Setiabudi', 'Cilandak'],
      },
      {
        name: 'Jakarta Pusat',
        districts: ['Menteng', 'Gambir', 'Tanah Abang', 'Senen'],
      },
    ],
  },
  {
    name: 'Jawa Barat',
    cities: [
      {
        name: 'Bandung',
        districts: ['Cicendo', 'Andir', 'Coblong', 'Gedebage'],
      },
      {
        name: 'Bogor',
        districts: ['Bogor Tengah', 'Bogor Selatan', 'Bogor Utara'],
      },
    ],
  },
  {
    name: 'Bali',
    cities: [
      {
        name: 'Denpasar',
        districts: ['Denpasar Selatan', 'Denpasar Barat', 'Denpasar Timur'],
      },
      {
        name: 'Badung',
        districts: ['Kuta', 'Kuta Utara', 'Mengwi'],
      },
    ],
  },
];
