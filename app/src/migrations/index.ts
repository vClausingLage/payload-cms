import * as migration_20260320_132332 from './20260320_132332';
import * as migration_20260320_135941 from './20260320_135941';

export const migrations = [
  {
    up: migration_20260320_132332.up,
    down: migration_20260320_132332.down,
    name: '20260320_132332',
  },
  {
    up: migration_20260320_135941.up,
    down: migration_20260320_135941.down,
    name: '20260320_135941'
  },
];
