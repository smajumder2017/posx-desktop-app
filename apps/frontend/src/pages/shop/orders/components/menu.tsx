import { Card, CardContent } from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '@radix-ui/react-collapsible';
import { Input } from '@/components/ui/input';
import { OrderMenuCategory, OrderMenuItem } from '../components/menu-items';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MenuEntity } from '@/models/menu';
import { useState } from 'react';

export interface IMenuProps {
  data: MenuEntity[];
  onItemSelect?: (itemId: string) => void;
}

const Menu: React.FC<IMenuProps> = ({ data, onItemSelect }) => {
  const [menuState, setMenuState] = useState<{ [key: string]: boolean }>(
    data.reduce((acc: { [key: string]: boolean }, curr) => {
      acc[curr.categoryName] = true;
      return acc;
    }, {}),
  );

  const handleMenuColapsToogle = (categoryName: string) => {
    setMenuState({
      ...menuState,
      [categoryName]: !menuState[categoryName],
    });
  };

  const handleItemSelect = (id: string) => {
    onItemSelect && onItemSelect(id);
  };

  return (
    <Card className="overflow-hidden h-full">
      <CardContent className="p-0">
        <div className="p-2 flex space-x-2">
          <Input placeholder="Search item" />
          <Input placeholder="Enter short code" />
        </div>

        <div className="p-4 text-sm border-t">
          <ScrollArea style={{ height: 'calc(100vh - 250px)' }}>
            {data
              .sort((a, b) => a.displayIndex - b.displayIndex)
              .map((category, index) => {
                if (category.menuItems.length === 0) {
                  return null;
                }
                const items = category.menuItems;
                return (
                  <Collapsible
                    open={menuState[category.categoryName]}
                    onOpenChange={() =>
                      handleMenuColapsToogle(category.categoryName)
                    }
                    key={category.id}
                    className={`${index > 0 ? 'mt-4' : ''}`}
                  >
                    <CollapsibleTrigger>
                      <OrderMenuCategory data={category.categoryName} />
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="flex flex-wrap mt-2">
                        {items.map((item) => {
                          return (
                            <div
                              key={item.id}
                              onClick={() => handleItemSelect(item.id)}
                            >
                              <OrderMenuItem data={item} />
                            </div>
                          );
                        })}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                );
              })}
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
};

export default Menu;
