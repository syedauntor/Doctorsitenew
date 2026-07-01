import type { Medicine } from '../data/medicines';

interface Props {
  medicine: Pick<Medicine, 'pricePerUnit' | 'pricePerPack' | 'packSize'>;
  unitSize?: 'sm' | 'md' | 'lg';
}

export default function MedicinePriceDisplay({ medicine, unitSize = 'md' }: Props) {
  const { pricePerUnit, pricePerPack, packSize } = medicine;

  // Extract just the quantity+unit portion of packSize for the bracket label
  // e.g. "10 tablets per strip" → "10 tablets", "3 tablets per pack" → "3 tablets"
  const packLabel = packSize.replace(/\s+per\s+.+$/i, '').trim();

  const unitClasses =
    unitSize === 'lg'
      ? 'text-2xl font-bold text-gray-900'
      : unitSize === 'sm'
      ? 'text-base font-bold text-gray-900'
      : 'text-lg font-bold text-gray-900';

  const packClasses =
    unitSize === 'lg'
      ? 'text-base font-medium text-gray-500'
      : 'text-sm font-medium text-gray-500';

  return (
    <div className="flex items-baseline flex-wrap gap-x-2 gap-y-0.5">
      <span className={unitClasses}>৳{pricePerUnit}</span>
      <span className="text-xs text-gray-400">/ unit</span>

      {pricePerPack != null && (
        <>
          <span className="text-gray-300 text-sm font-light select-none">|</span>
          <span className={packClasses}>৳{pricePerPack}</span>
          <span className="text-xs text-gray-400">
            / pack{packLabel ? ` (${packLabel})` : ''}
          </span>
        </>
      )}
    </div>
  );
}
