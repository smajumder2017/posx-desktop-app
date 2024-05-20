import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { OrderMenuCategory, OrderMenuItem } from '../components/menu-items';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MenuEntity } from '@/models/menu';
import { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export interface IMenuProps {
  data: MenuEntity[];
  onItemSelect?: (itemId: string) => void;
}

const Menu: React.FC<IMenuProps> = ({ data, onItemSelect }) => {
  const [menuState, setMenuState] = useState<string[]>(
    data.map((item) => item.categoryName),
  );

  const handleMenuColapsToogle = (categoryNames: string[]) => {
    setMenuState(categoryNames);
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
          <ScrollArea style={{ height: 'calc(100vh - 235px)' }}>
            <Accordion
              type="multiple"
              collapsible
              className="w-full"
              value={menuState}
              onValueChange={handleMenuColapsToogle}
            >
              {data
                .sort((a, b) => a.displayIndex - b.displayIndex)
                .map((category, index) => {
                  if (category.menuItems.length === 0) {
                    return null;
                  }
                  const items = category.menuItems;
                  return (
                    <AccordionItem
                      value={category.categoryName}
                      key={category.id}
                      className={`${index > 0 ? 'mt-4' : ''}`}
                    >
                      <AccordionTrigger className="p-1">
                        <OrderMenuCategory data={category.categoryName} />
                      </AccordionTrigger>
                      <AccordionContent>
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
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
            </Accordion>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
};

export default Menu;
