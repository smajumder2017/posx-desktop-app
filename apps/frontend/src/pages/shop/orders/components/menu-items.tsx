import { Card, CardTitle } from '@/components/ui/card';
import { MenuItemsEntity } from '@/models/menu';
import { Food_Type, Spice_Scale } from '@/utils/enums';
import { BiFoodTag } from 'react-icons/bi';
import { FaPepperHot } from 'react-icons/fa';

export const SpiceLevel: React.FC<
  React.PropsWithChildren<{ level: number; total: number }>
> = (props) => {
  const levels = Array.from(Array(props.total));

  return (
    <div className="flex">
      {levels.map((_item, index) => {
        if (index < props.level) {
          return <FaPepperHot key={index} className={'text-red-400'} />;
        } else {
          return <FaPepperHot key={index} className={'text-gray-300'} />;
        }
      })}
    </div>
  );
};

interface IOrderMenuCategoryProps {
  data: string;
}

export const OrderMenuCategory: React.FC<IOrderMenuCategoryProps> = ({
  data,
}) => {
  return <div className="font-bold text-lg">{data}</div>;
};

interface IOrderMenuItemProps {
  data: MenuItemsEntity;
}

export const OrderMenuItem: React.FC<IOrderMenuItemProps> = ({ data }) => {
  const spiceIndex =
    data.spiceScale === Spice_Scale.None
      ? 0
      : data.spiceScale === Spice_Scale.Mild
        ? 1
        : data.spiceScale === Spice_Scale.Moderate
          ? 2
          : 3;

  const foodTypeColorClass =
    data.foodType === Food_Type.Vegetarian
      ? 'text-green-500'
      : data.foodType === Food_Type.NonVegetarian
        ? 'text-red-500'
        : 'text-blue-500';
  return (
    <Card className="p-0 flex w-auto mr-2 mb-2 hover:cursor-pointer">
      <img
        className="h-[65px] w-[65px] rounded-l-xl"
        src={data.itemImageUrl}
        alt={data.itemName}
      />

      <div className="p-2">
        <CardTitle className="flex gap-2 text-xs">
          {data.itemName}
          <BiFoodTag className={foodTypeColorClass} />
        </CardTitle>
        <div className="mt-2">
          <SpiceLevel total={3} level={spiceIndex} />
        </div>
      </div>
    </Card>
  );
};
